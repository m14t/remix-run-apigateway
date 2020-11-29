// FIXME: These types are a lie!
//
// minipass-fetch doesn't export it's own types, and @types/minipass-fetch
// do not exist.
//
// minipass-fetch is an implementation of window.fetch in Node.js using Minipass
// streams, so this should be close enough for our immediate needs but isn't
// technically "correct".
declare module 'minipass-fetch' {
  export class Headers extends globalThis.Headers {
    entries(): [string, string][];
  }
  export class Request extends globalThis.Request {}
  export class Response extends globalThis.Response {
    headers: Headers;
  }
}
