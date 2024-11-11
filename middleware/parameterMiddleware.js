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
exports.parameterMiddleware = exports.createParameterMiddleware = void 0;
const log4js_1 = require("../config/log4js");
const DEFAULT_OPTIONS = {
    removeEmpty: true,
    trimStrings: true,
    removeUndefined: true,
    removeNull: true,
    customFilters: ['_t']
};
const createParameterMiddleware = (options = {}) => {
    const finalOptions = Object.assign(Object.assign({}, DEFAULT_OPTIONS), options);
    return (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // 处理 query 参数
            if (ctx.query) {
                const filteredQuery = {};
                Object.entries(ctx.query).forEach(([key, value]) => {
                    if (!finalOptions.customFilters.includes(key) &&
                        value !== undefined &&
                        value !== null &&
                        value !== '') {
                        filteredQuery[key] = value;
                    }
                });
                ctx.query = filteredQuery;
            }
            // 处理 request body
            if (ctx.request.body) {
                const filteredBody = {};
                Object.entries(ctx.request.body).forEach(([key, value]) => {
                    if (!finalOptions.customFilters.includes(key)) {
                        if (Array.isArray(value)) {
                            if (value.length > 0) {
                                filteredBody[key] = value;
                            }
                        }
                        else if (value && typeof value === 'object') {
                            if (Object.keys(value).length > 0) {
                                filteredBody[key] = value;
                            }
                        }
                        else if (value !== undefined &&
                            value !== null &&
                            value !== '') {
                            filteredBody[key] = value;
                        }
                    }
                });
                ctx.request.body = filteredBody;
            }
            // 开发环境下记录处理后的参数
            if (process.env.NODE_ENV !== 'production') {
                log4js_1.logger.debug('处理后的请求参数:', {
                    method: ctx.method,
                    url: ctx.url,
                    query: ctx.query,
                    body: ctx.request.body
                });
            }
            yield next();
        }
        catch (error) {
            log4js_1.logger.error('参数处理中间件错误:', {
                error: error instanceof Error ? error.message : '未知错误',
                stack: error instanceof Error ? error.stack : '',
                url: ctx.url,
                method: ctx.method
            });
            // 返回错误响应
            ctx.status = 500;
            ctx.body = {
                code: 500,
                message: '请求参数处理错误',
                error: process.env.NODE_ENV === 'development'
                    ? error instanceof Error
                        ? error.message
                        : '未知错误'
                    : '服务器内部错误'
            };
        }
    });
};
exports.createParameterMiddleware = createParameterMiddleware;
// 创建默认中间件实例
exports.parameterMiddleware = (0, exports.createParameterMiddleware)();
