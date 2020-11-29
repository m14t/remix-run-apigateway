"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRequestHandler = void 0;
const core = require('@remix-run/core');
require('./fetch-globals');
const create_pojo_headers_1 = __importDefault(require("./create-pojo-headers"));
const create_remix_request_1 = __importDefault(require("./create-remix-request"));
const create_remix_session_1 = __importDefault(require("./create-remix-session"));
const serve_static_file_if_exists_1 = __importDefault(require("./serve-static-file-if-exists"));
const warn_once_1 = __importDefault(require("./warn-once"));
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function handleConfigError(error) {
    console.error(`There was an error reading the Remix config`);
    console.error(error);
    process.exit(1);
}
function createRequestHandler({ getLoadContext, root: remixRoot, enableSessions = true, } = {
    enableSessions: true,
}) {
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
        warn_once_1.default(enableSessions, "You've enabled sessions but these aren't supported yet, so you won't " +
            'be able to use sessions in your Remix data loaders and actions. ' +
            'Use `createRequestHandler({ enableSessions: false })` to silence this ' +
            'warning.');
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
        const session = create_remix_session_1.default(event);
        try {
            const remixRes = await handleRequest(remixReq, session, loadContext);
            const result = {
                // QUESTION: Do we need to support streams? remixRes.body.pipe(res);
                body: ((_a = remixRes.body) === null || _a === void 0 ? void 0 : _a.toString()) || '',
                headers: create_pojo_headers_1.default(remixRes.headers),
                statusCode: remixRes.status,
            };
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
