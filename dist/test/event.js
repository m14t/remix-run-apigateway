"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const event = {
    version: '2.0',
    routeKey: '$default',
    rawPath: '/',
    rawQueryString: 'a=1&b=2,3&c[]=4&c[]=5',
    headers: {
        'content-length': '0',
        host: 'abcdef1234.execute-api.us-east-1.amazonaws.com',
        'user-agent': 'Mocked Agent Name',
        'x-forwarded-for': '1.2.3.4, 5.6.7.8',
        'x-forwarded-port': '443',
        'x-forwarded-proto': 'https',
    },
    queryStringParameters: {
        a: '1',
        b: '2,3',
        'c[]': '4,5',
    },
    requestContext: {
        accountId: '123456789012',
        apiId: 'abcdef1234',
        domainName: 'abcdef1234.execute-api.us-east-1.amazonaws.com',
        domainPrefix: 'abcdef1234',
        http: {
            method: 'GET',
            path: '/',
            protocol: 'HTTP/1.1',
            sourceIp: ' 1.2.3.4',
            userAgent: 'Mocked Agent Name',
        },
        requestId: 'WvcqDhBpoAMEP0w=',
        routeKey: '$default',
        stage: '$default',
        time: '28/Nov/2020:23:19:41 +0000',
        timeEpoch: 1606605581015,
    },
    isBase64Encoded: false,
};
exports.default = event;
