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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loggerMiddleware = void 0;
const dateUtil_1 = require("../utils/dateUtil");
const log4js_1 = require("../config/log4js");
const log_1 = __importDefault(require("../model/log"));
const apiPaths_1 = require("../enums/apiPaths");
const loggerMiddleware = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g;
    const startTime = Date.now();
    const requestId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    // 记录请求信息
    const requestLog = {
        requestId,
        timestamp: dateUtil_1.DateUtil.getCurrentDateTime(),
        method: ctx.method,
        url: ctx.url,
        query: ctx.query,
        body: ctx.request.body,
        headers: {
            'user-agent': ctx.headers['user-agent'],
            authorization: ctx.headers['authorization'] ? '******' : undefined,
            'content-type': ctx.headers['content-type']
        },
        ip: ctx.ip,
        userId: (_a = ctx.state.user) === null || _a === void 0 ? void 0 : _a.id,
        username: ((_b = ctx.state.user) === null || _b === void 0 ? void 0 : _b.username) || 'guest'
    };
    log4js_1.logger.info('API Request:', requestLog);
    let apipath = ctx.url;
    const arr = ctx.url.split('?')[0].split('/');
    if (arr.length > 2) {
        apipath = arr.slice(0, 3).join('/');
    }
    else {
        apipath = arr.join('/');
    }
    try {
        // 执行后续中间件
        yield next();
        // 计算响应时间
        const responseTime = Date.now() - startTime;
        // 记录响应信息
        const responseLog = {
            requestId,
            timestamp: dateUtil_1.DateUtil.getCurrentDateTime(),
            method: ctx.method,
            url: ctx.url,
            status: ctx.status,
            responseTime: `${responseTime}ms`,
            response: ctx.body,
            userId: (_c = ctx.state.user) === null || _c === void 0 ? void 0 : _c.id,
            username: ((_d = ctx.state.user) === null || _d === void 0 ? void 0 : _d.username) || 'guest'
        };
        log4js_1.logger.info('API Response:', responseLog);
        // if(ctx.url)
        console.log(apiPaths_1.ApiActions[apipath], '防水等级flak京东方');
        yield log_1.default.create({
            username: (_e = ctx.state.user) === null || _e === void 0 ? void 0 : _e.username,
            ip: ctx.ip,
            method: ctx.method,
            url: ctx.url,
            content: apiPaths_1.ApiActions[apipath],
            status: 1 // 成功
        });
    }
    catch (err) {
        const error = err;
        // 记录错误信息
        const errorLog = {
            requestId,
            timestamp: dateUtil_1.DateUtil.getCurrentDateTime(),
            method: ctx.method,
            url: ctx.url,
            error: {
                name: error.name,
                message: error.message,
                stack: error.stack
            },
            userId: (_f = ctx.state.user) === null || _f === void 0 ? void 0 : _f.id
        };
        log4js_1.logger.error('API Error:', errorLog);
        yield log_1.default.create({
            username: (_g = ctx.state.user) === null || _g === void 0 ? void 0 : _g.username,
            ip: ctx.ip,
            method: ctx.method,
            url: ctx.url,
            content: apiPaths_1.ApiActions[apipath],
            status: 2 // 失败
        });
        throw error;
    }
});
exports.loggerMiddleware = loggerMiddleware;
