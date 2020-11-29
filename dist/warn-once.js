"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const alreadyWarned = {};
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
function warnOnce(condition, message) {
    if (!condition && !alreadyWarned[message]) {
        alreadyWarned[message] = true;
        console.warn(message);
    }
}
exports.default = warnOnce;
