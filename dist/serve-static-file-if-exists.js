"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require('fs');
const path = require('path');
const util = require('util');
const mimetypes = require('mime-types');
const readFileAsync = util.promisify(fs.readFile);
// TODO: Improve Caching headers
async function serveStaticFileIfExists(event, remixConfig) {
    // QUESTION: Is there a cleaner way to get this path?
    const publicDirectory = remixConfig.browserBuildDirectory.replace(remixConfig.publicPath.replace(/\/$/, ''), // Remove any trailing / from publicPath
    '');
    const filePath = path.join(publicDirectory, event.rawPath);
    const fileContents = await readFileAsync(filePath);
    const mimeType = mimetypes.lookup(filePath) || 'application/octet-stream';
    return {
        body: fileContents.toString(),
        headers: {
            'Content-Type': mimeType,
        },
        statusCode: 200,
    };
}
exports.default = serveStaticFileIfExists;
