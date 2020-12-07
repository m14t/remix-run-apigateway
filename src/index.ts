import type {
  APIGatewayProxyEventV2,
  APIGatewayProxyHandlerV2,
  APIGatewayProxyStructuredResultV2,
  Context,
} from 'aws-lambda';

import type { AppLoadContext } from '@remix-run/core';

import type { default as RemixCore } from '@remix-run/core';
const core: typeof RemixCore = require('@remix-run/core');

require('./fetch-globals');
import { SessionHandler, nullSessionHandler } from './session-handler';
import createPojoHeaders from './create-pojo-headers';
import createRemixRequest from './create-remix-request';
import serveStaticFileIfExists from './serve-static-file-if-exists';

export { jwtCookieSessionHandlerFactory } from './session-handler';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function handleConfigError(error: any) {
  console.error(`There was an error reading the Remix config`);
  console.error(error);
  process.exit(1);
}

export interface GetLoadContext {
  (event: APIGatewayProxyEventV2, context: Context): AppLoadContext;
}

interface createRequestHandlerArg {
  getLoadContext?: GetLoadContext;
  sessionHandler?: SessionHandler;
  root?: string;
}

export function createRequestHandler({
  getLoadContext,
  root: remixRoot,
  sessionHandler = nullSessionHandler,
}: createRequestHandlerArg): APIGatewayProxyHandlerV2 {
  let handleRequest: RemixCore.RequestHandler;
  let remixConfig: RemixCore.RemixConfig;

  const remixConfigPromise: Promise<RemixCore.RemixConfig> = core.readConfig(
    remixRoot,
    process.env.NODE_ENV,
  );
  // If there is a config error, catch it early and exit. But keep this function
  // sync in case they don't have top-level await (unflagged in node v14.8.0).
  remixConfigPromise.catch(handleConfigError);

  return async (
    event: APIGatewayProxyEventV2,
    context: Context,
  ): Promise<APIGatewayProxyStructuredResultV2> => {
    if (!remixConfig) {
      try {
        remixConfig = await remixConfigPromise;
      } catch (error) {
        handleConfigError(error);
      }

      handleRequest = core.createRequestHandler(remixConfig);
    }

    // If the file exists, return it right away
    try {
      return await serveStaticFileIfExists(event, remixConfig);
    } catch (error) {
      // no-op
    }

    let loadContext;

    if (getLoadContext) {
      try {
        loadContext = await getLoadContext(event, context);
      } catch (error) {
        console.error(error);
        return {
          body: '',
          statusCode: 500,
        };
      }
    }

    const remixReq: RemixCore.Request = createRemixRequest(event);
    const sessionData = (await sessionHandler.getSessionData(event)) || {};
    const session: RemixCore.Session = core.createSession(
      sessionData,
      async () => {
        if (sessionHandler.destroySessionData) {
          await sessionHandler.destroySessionData(sessionData);
        }
      },
    );

    try {
      const remixRes = await handleRequest(remixReq, session, loadContext);

      const result: APIGatewayProxyStructuredResultV2 = await sessionHandler.serializeSessionData(
        sessionData,
        {
          // QUESTION: Do we need to support streams? remixRes.body.pipe(res);
          body: remixRes.body?.toString() || '',
          // TODO: convert the remix Cookie header to a AWS Response cookie here
          headers: createPojoHeaders(remixRes.headers),
          statusCode: remixRes.status,
        },
      );

      return result;
    } catch (error) {
      // This is probably an error in one of the loaders.
      console.error(error);
      return {
        body: '',
        statusCode: 500,
      };
    }
  };
}
