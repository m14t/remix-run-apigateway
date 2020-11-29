"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function createPojoHeaders(headers) {
    const headerKeyValues = Array.from(headers.entries());
    return headerKeyValues.reduce((memo, [key, value]) => {
        memo[key] = value;
        return memo;
    }, {});
}
exports.default = createPojoHeaders;
