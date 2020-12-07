"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRequestHandler = exports.jwtCookieSessionHandlerFactory = void 0;
const core = require('@remix-run/core');
require('./fetch-globals');
const session_handler_1 = require("./session-handler");
const create_pojo_headers_1 = __importDefault(require("./create-pojo-headers"));
const create_remix_request_1 = __importDefault(require("./create-remix-request"));
const serve_static_file_if_exists_1 = __importDefault(require("./serve-static-file-if-exists"));
var session_handler_2 = require("./session-handler");
Object.defineProperty(exports, "jwtCookieSessionHandlerFactory", { enumerable: true, get: function () { return session_handler_2.jwtCookieSessionHandlerFactory; } });
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function handleConfigError(error) {
    console.error(`There was an error reading the Remix config`);
    console.error(error);
    process.exit(1);
}
function createRequestHandler({ getLoadContext, root: remixRoot, sessionHandler = session_handler_1.nullSessionHandler, }) {
    let handleRequest;
    let remixConfig;
    const remixConfigPromise = core.readConfig(remixRoot, process.env.NODE_ENV);
    // If there is a config error, catch it early and exit. But keep this function
    // sync in case they don't have top-level await (unflagged in node v14.8.0).
    remixConfigPromise.catch(handleConfigError);
    return async (event, context) => {
        var _a;
        if (!remixConfig) {
            try {
                remixConfig = await remixConfigPromise;
            }
            catch (error) {
                handleConfigError(error);
            }
            handleRequest = core.createRequestHandler(remixConfig);
        }
        // If the file exists, return it right away
        try {
            return await serve_static_file_if_exists_1.default(event, remixConfig);
        }
        catch (error) {
            // no-op
        }
        let loadContext;
        if (getLoadContext) {
            try {
                loadContext = await getLoadContext(event, context);
            }
            catch (error) {
                console.error(error);
                return {
                    body: '',
                    statusCode: 500,
                };
            }
        }
        const remixReq = create_remix_request_1.default(event);
        const sessionData = (await sessionHandler.getSessionData(event)) || {};
        const session = core.createSession(sessionData, async () => {
            if (sessionHandler.destroySessionData) {
                await sessionHandler.destroySessionData(sessionData);
            }
        });
        try {
            const remixRes = await handleRequest(remixReq, session, loadContext);
            const result = await sessionHandler.serializeSessionData(sessionData, {
                // QUESTION: Do we need to support streams? remixRes.body.pipe(res);
                body: ((_a = remixRes.body) === null || _a === void 0 ? void 0 : _a.toString()) || '',
                // TODO: convert the remix Cookie header to a AWS Response cookie here
                headers: create_pojo_headers_1.default(remixRes.headers),
                statusCode: remixRes.status,
            });
            return result;
        }
        catch (error) {
            // This is probably an error in one of the loaders.
            console.error(error);
            return {
                body: '',
                statusCode: 500,
            };
        }
    };
}
exports.createRequestHandler = createRequestHandler;
