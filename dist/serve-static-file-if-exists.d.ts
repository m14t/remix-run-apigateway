import type { APIGatewayProxyEventV2, APIGatewayProxyStructuredResultV2 } from 'aws-lambda';
import { RemixConfig } from '@remix-run/core';
declare function serveStaticFileIfExists(event: APIGatewayProxyEventV2, remixConfig: RemixConfig): Promise<APIGatewayProxyStructuredResultV2>;
export default serveStaticFileIfExists;
