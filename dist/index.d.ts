import type { APIGatewayProxyEventV2, APIGatewayProxyHandlerV2, Context } from 'aws-lambda';
import type { AppLoadContext } from '@remix-run/core';
import { SessionHandler } from './session-handler';
export { jwtCookieSessionHandlerFactory } from './session-handler';
export interface GetLoadContext {
    (event: APIGatewayProxyEventV2, context: Context): AppLoadContext;
}
interface createRequestHandlerArg {
    getLoadContext?: GetLoadContext;
    sessionHandler?: SessionHandler;
    root?: string;
}
export declare function createRequestHandler({ getLoadContext, root: remixRoot, sessionHandler, }: createRequestHandlerArg): APIGatewayProxyHandlerV2;
