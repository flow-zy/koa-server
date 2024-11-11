"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorUtil = void 0;
const errHandler_1 = require("../middleware/errHandler");
class ErrorUtil {
    // 抛出业务错误
    static throw(message, code, data) {
        throw new errHandler_1.BusinessError(message, code, data);
    }
    // 抛出参数错误
    static throwParam(message, data) {
        throw new errHandler_1.ParamError(message, data);
    }
    // 抛出认证错误
    static throwAuth(message, data) {
        throw new errHandler_1.AuthError(message, data);
    }
    // 抛出权限错误
    static throwForbidden(message, data) {
        throw new errHandler_1.ForbiddenError(message, data);
    }
    // 断言
    static assert(condition, message, code) {
        if (!condition) {
            this.throw(message, code);
        }
    }
    // 参数断言
    static assertParam(condition, message) {
        if (!condition) {
            this.throwParam(message);
        }
    }
}
exports.ErrorUtil = ErrorUtil;
