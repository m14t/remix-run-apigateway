import {
  createSession,
  createSessionFacade,
  Session,
  SessionMutableData,
} from '@remix-run/core';
import type { APIGatewayProxyEventV2 } from 'aws-lambda';

function createRemixSession(
  event: APIGatewayProxyEventV2,
  getSessionData?: (event: APIGatewayProxyEventV2) => SessionMutableData,
  destroySessionData?: () => Promise<void>,
): Session {
  if (!getSessionData || !destroySessionData) {
    return createSessionFacade(
      'You are trying to use sessions but did not configure a ' +
        '`getSessionData` method, so this functionality is not available. ' +
        'Please pass a `getSessionData` function to `createRequestHandler` ' +
        'with a signature of `(event: APIGatewayProxyEventV2) => SessionMutableData`.',
    );
  }
  const sessionData = getSessionData(event);

  return createSession(sessionData, destroySessionData);
}

export default createRemixSession;
