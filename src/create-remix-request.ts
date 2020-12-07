import {
  Headers as RemixHeaders,
  Request as RemixRequest,
} from '@remix-run/core';
import { URL } from 'url';
import type { APIGatewayProxyEventV2 } from 'aws-lambda';

function createRemixRequest(event: APIGatewayProxyEventV2): RemixRequest {
  const protocol = event.headers['x-forwarded-proto'];
  const host = event.headers.host;
  const path = event.rawPath;
  const method = event.requestContext.http.method;

  const queryString = new URLSearchParams(event.rawQueryString);
  const origin = `${protocol}://${host}`;
  const url = new URL(`${path}?${queryString.toString()}`, origin);
  const init: globalThis.RequestInit = {
    headers: new RemixHeaders(event.headers),
    method: method,
  };

  if (method !== 'GET' && method !== 'HEAD') {
    if (event.isBase64Encoded && event.body) {
      let buff = Buffer.from(event.body, 'base64');
      init.body = buff.toString('ascii');
    } else {
      init.body = event.body;
    }
  }

  return new RemixRequest(url.toString(), init);
}

export default createRemixRequest;
