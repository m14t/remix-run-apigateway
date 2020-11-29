"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@remix-run/core");
function createRemixSession(event, getSessionData, destroySessionData) {
    if (!getSessionData || !destroySessionData) {
        return core_1.createSessionFacade('You are trying to use sessions but did not configure a ' +
            '`getSessionData` method, so this functionality is not available. ' +
            'Please pass a `getSessionData` function to `createRequestHandler` ' +
            'with a signature of `(event: APIGatewayProxyEventV2) => SessionMutableData`.');
    }
    const sessionData = getSessionData(event);
    return core_1.createSession(sessionData, destroySessionData);
}
exports.default = createRemixSession;
