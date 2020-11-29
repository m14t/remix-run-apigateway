import createPojoHeaders from '../create-pojo-headers';
import { Headers } from '@remix-run/core';

describe('createPojoHeaders', () => {
  it('converts a Remix Headers object to a plain old javascript object', () => {
    const headers = new Headers();
    headers.append('Cache-Control', 'max-age=3600');
    headers.append('cache-control', 'must-revalidate');
    headers.append('ETag', '3e86-410-3596fbbc');

    const expected = {
      'cache-control': 'max-age=3600, must-revalidate',
      etag: '3e86-410-3596fbbc',
    };
    expect(createPojoHeaders(headers)).toStrictEqual(expected);
  });
});
