"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@remix-run/core");
const url_1 = require("url");
function createRemixRequest(event) {
    const protocol = event.headers['x-forwarded-proto'];
    const host = event.headers.host;
    const path = event.rawPath;
    const method = event.requestContext.http.method;
    const queryString = new URLSearchParams(event.rawQueryString);
    const origin = `${protocol}://${host}`;
    const url = new url_1.URL(`${path}?${queryString.toString()}`, origin);
    const init = {
        headers: new core_1.Headers(event.headers),
        method: method,
    };
    if (method !== 'GET' && method !== 'HEAD') {
        init.body = event.body;
    }
    return new core_1.Request(url.toString(), init);
}
exports.default = createRemixRequest;
