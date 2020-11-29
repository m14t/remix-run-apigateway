# remix-run-apigateway

## Description

`remix-run-apigateway` is an request handler that allows you to run
[Remix](http://remix.run/) on AWS API Gateway v2 & Lambda.

This is the AWS Lambda equivalent of `@remix-run/express` when using Remix with
Express. This could be used in any project deploying to AWS Lambda, regardless
of the deployment method (CDK, Amplify, etc).

## Installation

To install this project you can run the following command to pull the latest version directly from GitHub:

```bash
npm install m14t/remix-run-apigateway
```

## Example usage

```typescript
const { createRequestHandler } = require('@m14t/remix-run-apigateway');

exports.handler = createRequestHandler({
  getLoadContext() {
    // Whatever you return here will be passed as `context` to your loaders.
  },
});
```

## Demo project

A demo project using this adapter is available at: https://github.com/m14t/starter-aws-cdk.

## Known limitations

- AWS API Gateway has a [known limitation][api-gateway-known-issues]:

  > Path segments can only contain alphanumeric characters, hyphens, periods, commas, and curly braces.

  This means that it can not serve URLs that include the `@` symbol, which is required to serve scoped NPM packages.

  The work-around for this is to serve static files from the `public/build` directory from another source. This can be done by configuring a AWS CloudFront CDN distribution with a behavior to serve these files from an S3 bucket, with a fall-back default behavior that serves all other requests from the Lambda. An example of this can be found in [m14t/starter-aws-cdk's CDN configuration][cdn-example].

[api-gateway-known-issues]: https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-known-issues.html#api-gateway-known-issues-rest-apis
[cdn-example]: https://github.com/m14t/starter-aws-cdk/blob/6186fc434cbd8dbec8bbda75846e4efdfd471787/cdk/lib/cdn.ts#L48-L69
