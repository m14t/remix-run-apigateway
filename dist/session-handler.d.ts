import type { APIGatewayProxyEventV2, APIGatewayProxyStructuredResultV2 } from 'aws-lambda';
import type { SessionMutableData } from '@remix-run/core';
declare type MaybePromise<T> = T | Promise<T>;
export interface SessionHandler {
    getSessionData: (event: APIGatewayProxyEventV2) => MaybePromise<SessionMutableData>;
    destroySessionData?: (sessionData: SessionMutableData) => MaybePromise<void>;
    serializeSessionData: (sessionData: SessionMutableData, result: APIGatewayProxyStructuredResultV2) => MaybePromise<APIGatewayProxyStructuredResultV2>;
}
export declare const nullSessionHandler: SessionHandler;
interface JwtCookieSessionHandlerFactoryOptions {
    cookieName: string;
    secret: string;
}
export declare const jwtCookieSessionHandlerFactory: ({ cookieName, secret, }: JwtCookieSessionHandlerFactoryOptions) => SessionHandler;
export {};
