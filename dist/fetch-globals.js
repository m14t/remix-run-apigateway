"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core = require('@remix-run/core');
global.Headers = core.Headers;
global.Request = core.Request;
global.Response = core.Response;
global.fetch = core.fetch.defaults({
    // Do not decode responses by default. This lets people return `fetch()`
    // directly from a loader w/out changing the Content-Encoding of the
    // response, which is nice.
    compress: false,
});
