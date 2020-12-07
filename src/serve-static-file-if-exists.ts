import type {
  APIGatewayProxyEventV2,
  APIGatewayProxyStructuredResultV2,
} from 'aws-lambda';
import { RemixConfig } from '@remix-run/core';

const fs = require('fs');
const path = require('path');
const util = require('util');

const mimetypes = require('mime-types');

const readFileAsync = util.promisify(fs.readFile);

// TODO: Improve Caching headers
async function serveStaticFileIfExists(
  event: APIGatewayProxyEventV2,
  remixConfig: RemixConfig,
): Promise<APIGatewayProxyStructuredResultV2> {
  // QUESTION: Is there a cleaner way to get this path?
  const publicDirectory = remixConfig.browserBuildDirectory.replace(
    remixConfig.publicPath.replace(/\/$/, ''), // Remove any trailing / from publicPath
    '', // remove publicPath from browserBuildDirectory
  );

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

export default serveStaticFileIfExists;
