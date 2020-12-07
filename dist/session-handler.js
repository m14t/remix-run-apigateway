"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtCookieSessionHandlerFactory = exports.nullSessionHandler = void 0;
const tough_cookie_1 = __importDefault(require("tough-cookie"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.nullSessionHandler = {
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
const destroyKey = '__@m14t/remix-run-apigateway_destroy_key';
const jwtCookieSessionHandlerFactory = ({ cookieName, secret, }) => ({
    getSessionData(event) {
        const defaultValue = {};
        try {
            const cookies = (event.cookies || []).map((cookieStr) => tough_cookie_1.default.parse(cookieStr));
            const remixCookie = cookies.find((cookie) => (cookie === null || cookie === void 0 ? void 0 : cookie.key) === cookieName);
            if (remixCookie) {
                return jsonwebtoken_1.default.verify(remixCookie.value, secret);
            }
            return defaultValue;
        }
        catch (e) {
            // invalid JWT -- return an empty object
            console.log('error in getSessionData', e);
            return defaultValue;
        }
    },
    async destroySessionData(sessionData) {
        console.log('destroySessionData', sessionData);
        sessionData[destroyKey] = destroyKey;
    },
    async serializeSessionData(sessionData, result) {
        let cookie;
        if (sessionData[destroyKey] === destroyKey) {
            cookie = new tough_cookie_1.default.Cookie({
                expires: new Date(0),
                path: '/',
                secure: true,
                httpOnly: true,
            });
        }
        else {
            const token = jsonwebtoken_1.default.sign(sessionData, secret, {
                noTimestamp: true,
            });
            cookie = new tough_cookie_1.default.Cookie({
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
exports.jwtCookieSessionHandlerFactory = jwtCookieSessionHandlerFactory;
