import { Headers } from '@remix-run/core';
declare function createPojoHeaders(headers: Headers): Record<string, string>;
export default createPojoHeaders;
