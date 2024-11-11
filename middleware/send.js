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
exports.default = send;
const log4js_1 = require("../config/log4js");
const response_1 = require("../types/response");
// 生成请求ID
const generateRequestId = () => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};
// 格式化响应数据
const formatResponse = (message, code = response_1.StatusCode.SUCCESS, data, extraOptions = {}) => {
    return Object.assign({ code,
        message,
        data, timestamp: Date.now(), requestId: generateRequestId() }, extraOptions);
};
// 中间件
function send() {
    return (ctx, next) => __awaiter(this, void 0, void 0, function* () {
        // 基础响应方法
        ctx.send = (message, code = response_1.StatusCode.SUCCESS, data, extraOptions) => {
            const response = formatResponse(message, code, data, extraOptions);
            // 记录响应日志
            if (code >= 400) {
                log4js_1.logger.error('Response Error:', {
                    url: ctx.url,
                    method: ctx.method,
                    requestBody: ctx.request.body,
                    query: ctx.request.query,
                    response
                });
            }
            else {
                log4js_1.logger.info('Response:', {
                    url: ctx.url,
                    method: ctx.method,
                    code,
                    message
                });
            }
            ctx.body = response;
        };
        // 成功响应的快捷方法
        ctx.success = (data, message = 'Success') => {
            ctx.send(message, response_1.StatusCode.SUCCESS, data);
        };
        // 错误响应的快捷方法
        ctx.error = (message, code = response_1.StatusCode.ERROR) => {
            ctx.send(message, code);
        };
        try {
            yield next();
            // 处理 404
            if (ctx.status === 404 && !ctx.body) {
                ctx.error('Not Found', response_1.StatusCode.NOT_FOUND);
            }
        }
        catch (err) {
            // 统一错误处理
            const error = err;
            const status = error.status || response_1.StatusCode.INTERNAL_ERROR;
            const message = error.message || 'Internal Server Error';
            // 记录错误日志
            log4js_1.logger.error('Server Error:', {
                url: ctx.url,
                method: ctx.method,
                error: error.message,
                stack: error.stack
            });
            ctx.error(message, status);
        }
    });
}
