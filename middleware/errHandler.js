"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForbiddenError = exports.AuthError = exports.ParamError = exports.BusinessError = exports.AppError = void 0;
exports.default = errorHandler;
const log4js_1 = require("../config/log4js");
const response_1 = require("../types/response");
// 自定义错误类
class AppError extends Error {
    constructor(message, status = 500, code, data) {
        super(message);
        Object.defineProperty(this, "status", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "code", {
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
        this.name = this.constructor.name;
        this.status = status;
        this.code = code || status;
        this.data = data;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
// 业务错误类
class BusinessError extends AppError {
    constructor(message, code = response_1.StatusCode.ERROR, data) {
        super(message, 200, code, data);
    }
}
exports.BusinessError = BusinessError;
// 参数错误类
class ParamError extends AppError {
    constructor(message = '参数错误', data) {
        super(message, 200, response_1.StatusCode.PARAMS_ERROR, data);
    }
}
exports.ParamError = ParamError;
// 认证错误类
class AuthError extends AppError {
    constructor(message = '认证失败', data) {
        super(message, 401, response_1.StatusCode.AUTH_ERROR, data);
    }
}
exports.AuthError = AuthError;
// 权限错误类
class ForbiddenError extends AppError {
    constructor(message = '无权访问', data) {
        super(message, 403, response_1.StatusCode.FORBIDDEN, data);
    }
}
exports.ForbiddenError = ForbiddenError;
// 全局错误处理中间件
function errorHandler() {
    return (ctx, next) => __awaiter(this, void 0, void 0, function* () {
        try {
            yield next();
            // 处理 404
            if (ctx.status === 404 && !ctx.body) {
                ctx.status = 404;
                ctx.body = {
                    code: response_1.StatusCode.NOT_FOUND,
                    message: '接口不存在',
                    timestamp: Date.now()
                };
            }
        }
        catch (err) {
            const error = err;
            // 记录错误日志
            log4js_1.logger.error('Unhandled Error:', {
                url: ctx.url,
                method: ctx.method,
                headers: ctx.headers,
                query: ctx.query,
                body: ctx.request.body,
                error: {
                    name: error.name,
                    message: error.message,
                    stack: error.stack,
                    code: error.code
                }
            });
            // 开发环境下打印错误堆栈
            if (process.env.NODE_ENV === 'development') {
                log4js_1.logger.error('Error Stack:', error.stack);
            }
            // 处理不同类型的错误
            if (error instanceof AppError) {
                // 自定义错误
                ctx.status = error.status;
                ctx.body = {
                    code: error.code,
                    message: error.message,
                    data: error.data,
                    timestamp: Date.now()
                };
            }
            else if (error.name === 'ValidationError') {
                // 参数验证错误
                ctx.status = 200;
                ctx.body = {
                    code: response_1.StatusCode.PARAMS_ERROR,
                    message: '参数验证失败',
                    data: error.details,
                    timestamp: Date.now()
                };
            }
            else if (error.name === 'UnauthorizedError') {
                // JWT 认证错误
                ctx.status = 401;
                ctx.body = {
                    code: response_1.StatusCode.AUTH_ERROR,
                    message: '认证失败',
                    timestamp: Date.now()
                };
            }
            else {
                // 未知错误
                ctx.status = 500;
                ctx.body = {
                    code: response_1.StatusCode.INTERNAL_ERROR,
                    message: process.env.NODE_ENV === 'production'
                        ? '服务器内部错误'
                        : error.message,
                    timestamp: Date.now()
                };
            }
            // 触发错误事件，方便做一些额外处理
            ctx.app.emit('error', error, ctx);
        }
    });
}
