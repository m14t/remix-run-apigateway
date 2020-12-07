import { Request as RemixRequest } from '@remix-run/core';
import type { APIGatewayProxyEventV2 } from 'aws-lambda';
declare function createRemixRequest(event: APIGatewayProxyEventV2): RemixRequest;
export default createRemixRequest;
