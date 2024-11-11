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
exports.default = corsHandler;
const log4js_1 = require("../config/log4js");
const defaultOptions = {
    origins: ['http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowHeaders: [
        'Content-Type',
        'Authorization',
        'X-Requested-With',
        'Accept',
        'Origin',
        'X-Token'
    ],
    credentials: true,
    maxAge: 86400, // 24小时
    exposeHeaders: ['X-Total-Count', 'X-Request-Id'],
    security: true,
    logging: true
};
function corsHandler(options = {}) {
    const finalOptions = Object.assign(Object.assign({}, defaultOptions), options);
    return (ctx, next) => __awaiter(this, void 0, void 0, function* () {
        const origin = ctx.get('Origin');
        // 检查请求来源是否在允许列表中
        const allowOrigin = finalOptions.origins.includes('*')
            ? origin
            : finalOptions.origins.includes(origin)
                ? origin
                : finalOptions.origins[0];
        // 设置 CORS 响应头
        ctx.set({
            'Access-Control-Allow-Origin': allowOrigin,
            'Access-Control-Allow-Methods': finalOptions.methods.join(', '),
            'Access-Control-Allow-Headers': finalOptions.allowHeaders.join(', '),
            'Access-Control-Max-Age': finalOptions.maxAge.toString(),
            'Access-Control-Expose-Headers': finalOptions.exposeHeaders.join(', '),
            'Access-Control-Allow-Credentials': finalOptions.credentials.toString()
        });
        // 启用安全策略
        if (finalOptions.security) {
            ctx.set({
                'X-Content-Type-Options': 'nosniff',
                'X-Frame-Options': 'DENY',
                'X-XSS-Protection': '1; mode=block',
                'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
            });
        }
        // 记录 CORS 请求日志
        if (finalOptions.logging) {
            log4js_1.logger.info('CORS Request:', {
                origin,
                method: ctx.method,
                url: ctx.url,
                headers: ctx.headers
            });
        }
        // 处理预检请求
        if (ctx.method === 'OPTIONS') {
            ctx.status = 204;
            return;
        }
        try {
            yield next();
        }
        catch (err) {
            const error = err;
            // 处理 CORS 相关错误
            if (error.message.includes('CORS')) {
                log4js_1.logger.error('CORS Error:', {
                    origin,
                    method: ctx.method,
                    url: ctx.url,
                    error: error.message
                });
                ctx.status = 403;
                ctx.body = {
                    code: 403,
                    message: 'CORS policy violation'
                };
                return;
            }
            throw error;
        }
    });
}
