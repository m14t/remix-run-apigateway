"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const create_pojo_headers_1 = __importDefault(require("../create-pojo-headers"));
const core_1 = require("@remix-run/core");
describe('createPojoHeaders', () => {
    it('converts a Remix Headers object to a plain old javascript object', () => {
        const headers = new core_1.Headers();
        headers.append('Cache-Control', 'max-age=3600');
        headers.append('cache-control', 'must-revalidate');
        headers.append('ETag', '3e86-410-3596fbbc');
        const expected = {
            'cache-control': 'max-age=3600, must-revalidate',
            etag: '3e86-410-3596fbbc',
        };
        expect(create_pojo_headers_1.default(headers)).toStrictEqual(expected);
    });
});
