"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BusinessError = void 0;
class BusinessError extends Error {
    constructor(message) {
        super(message);
        this.name = 'BusinessError';
    }
}
exports.BusinessError = BusinessError;
