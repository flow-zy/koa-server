"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Result {
    constructor(code, message, data) {
        Object.defineProperty(this, "code", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "message", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "data", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "exprieTime", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.data = data;
        this.code = code;
        this.message = message;
        this.exprieTime = new Date().getTime();
    }
}
exports.default = Result;
