import type {
  APIGatewayProxyEventV2,
  APIGatewayProxyStructuredResultV2,
} from 'aws-lambda';
import type { SessionMutableData } from '@remix-run/core';

import toughCookie from 'tough-cookie';
import jsonwebtoken from 'jsonwebtoken';

type MaybePromise<T> = T | Promise<T>;

export interface SessionHandler {
  getSessionData: (
    event: APIGatewayProxyEventV2,
  ) => MaybePromise<SessionMutableData>;
  destroySessionData?: (sessionData: SessionMutableData) => MaybePromise<void>;
  serializeSessionData: (
    sessionData: SessionMutableData,
    result: APIGatewayProxyStructuredResultV2,
  ) => MaybePromise<APIGatewayProxyStructuredResultV2>;
}

export const nullSessionHandler: SessionHandler = {
  getSessionData: () => {
    // Always return an empty object
    return {};
  },
  destroySessionData: () => {
    return;
  },
  serializeSessionData: (sessionData, result) => {
    // return an unmodified result
    return result;
  },
};

interface JwtCookieSessionHandlerFactoryOptions {
  cookieName: string;
  secret: string;
}

const destroyKey = '__@m14t/remix-run-apigateway_destroy_key';

export const jwtCookieSessionHandlerFactory = ({
  cookieName,
  secret,
}: JwtCookieSessionHandlerFactoryOptions): SessionHandler => ({
  getSessionData(event: APIGatewayProxyEventV2) {
    const defaultValue: SessionMutableData = {};

    try {
      const cookies = (event.cookies || []).map((cookieStr) =>
        toughCookie.parse(cookieStr),
      );
      const remixCookie = cookies.find((cookie) => cookie?.key === cookieName);
      if (remixCookie) {
        return jsonwebtoken.verify(
          remixCookie.value,
          secret,
        ) as SessionMutableData;
      }
      return defaultValue;
    } catch (e) {
      // invalid JWT -- return an empty object
      console.log('error in getSessionData', e);
      return defaultValue;
    }
  },
  async destroySessionData(sessionData: SessionMutableData) {
    console.log('destroySessionData', sessionData);
    sessionData[destroyKey] = destroyKey;
  },
  async serializeSessionData(
    sessionData: SessionMutableData,
    result: APIGatewayProxyStructuredResultV2,
  ) {
    let cookie;
    if (sessionData[destroyKey] === destroyKey) {
      cookie = new toughCookie.Cookie({
        expires: new Date(0),
        path: '/',
        secure: true,
        httpOnly: true,
      });
    } else {
      const token = jsonwebtoken.sign(sessionData, secret, {
        noTimestamp: true,
      });

      cookie = new toughCookie.Cookie({
        key: cookieName,
        value: token,
        path: '/',
        secure: true,
        httpOnly: true,
      });
    }

    return {
      ...result,
      cookies: [...(result.cookies || []), cookie.toString()],
    };
  },
});
