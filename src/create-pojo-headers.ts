import { Headers } from '@remix-run/core';

function createPojoHeaders(headers: Headers): Record<string, string> {
  const headerKeyValues: [string, string][] = Array.from(headers.entries());
  return headerKeyValues.reduce<Record<string, string>>(
    (memo, [key, value]) => {
      memo[key] = value;
      return memo;
    },
    {},
  );
}

export default createPojoHeaders;
