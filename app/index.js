"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const node_path_1 = __importDefault(require("node:path"));
// Koa业务
const koa_1 = __importDefault(require("koa"));
const koa_body_1 = require("koa-body");
// import parameter from 'koa-parameter';
// import koaStatic from 'koa-static';
const koa_jwt_1 = __importDefault(require("koa-jwt"));
// @ts-ignore
const koa_parameter_1 = __importDefault(require("koa-parameter"));
const koa_static_1 = __importDefault(require("koa-static"));
const koa_logger_1 = __importDefault(require("koa-logger"));
const index_1 = __importDefault(require("../router/index"));
const cors_1 = __importDefault(require("../middleware/cors"));
const Schedule_1 = require("../utils/Schedule");
const config_default_1 = __importStar(require("../config/config.default"));
const init_1 = require("../utils/init");
const log4js_1 = require("../config/log4js");
const auth_1 = __importDefault(require("../middleware/auth"));
const parameterMiddleware_1 = require("../middleware/parameterMiddleware");
// import sequelize from '../db/index';
// @ts-ignore
const send_1 = __importDefault(require("../middleware/send"));
// 引入数据库
const mysql_1 = require("../db/mysql");
const errHandler_1 = __importDefault(require("../middleware/errHandler"));
const loggerMiddleware_1 = require("../middleware/loggerMiddleware");
function start() {
    return __awaiter(this, void 0, void 0, function* () {
        (0, init_1.initApp)();
        (0, Schedule_1.staticInit)();
        (0, mysql_1.db)();
        // await initRedis()
        const app = new koa_1.default();
        // 使用自定义配置
        const parameterMiddleware = (0, parameterMiddleware_1.createParameterMiddleware)({
            customFilters: ['_t', 'timestamp', 'debug'],
            trimStrings: true,
            removeEmpty: true
        });
        // 注册全局错误处理中间件（需要放在最前面）
        app.use((0, errHandler_1.default)());
        app.use(loggerMiddleware_1.loggerMiddleware);
        // 日志
        app.use((0, koa_logger_1.default)());
        // 添加日志中间件
        app.use((ctx, next) => __awaiter(this, void 0, void 0, function* () {
            const start = Date.now();
            try {
                yield next();
                const ms = Date.now() - start;
                log4js_1.logger.info(`${ctx.method} ${ctx.url} ${ctx.status} - ${ms}ms`);
            }
            catch (error) {
                const ms = Date.now() - start;
                log4js_1.logger.error(
                // @ts-ignore
                `${ctx.method} ${ctx.url} ${ctx.status} - ${ms}ms - Error: ${error.message}`);
                throw error;
            }
        }));
        app.use((0, koa_body_1.koaBody)({
            multipart: true,
            formidable: {
                uploadDir: node_path_1.default.resolve(__dirname, '../static/uploads'),
                keepExtensions: true,
                maxFileSize: 200 * 1024 * 1024 // 200MB
            }
        }));
        // 可以通过路径访问静态资源
        app.use((0, koa_static_1.default)(node_path_1.default.resolve(__dirname, '../static')));
        app.use((0, send_1.default)());
        app.use((0, koa_jwt_1.default)({
            secret: config_default_1.default.JWT_SECRET
        }).unless({
            path: config_default_1.white_list
        }));
        // 注册参数处理中间件（要在路由中间件之前）
        app.use(parameterMiddleware);
        app.use((0, auth_1.default)());
        app.use(index_1.default.routes());
        app.use(index_1.default.allowedMethods());
        // 跨域
        app.use((0, cors_1.default)({
            origins: ['*'],
            methods: ['GET', 'POST', 'PUT', 'DELETE'],
            allowHeaders: ['Content-Type', 'Authorization', 'X-Token'],
            security: true,
            logging: process.env.NODE_ENV !== 'production'
        }));
        (0, koa_parameter_1.default)(app);
        // 执行定时任务
        (0, Schedule_1.deleteStatic)();
        // 错误事件监听
        app.on('error', (err, ctx) => {
            log4js_1.logger.error('Application Error:', {
                error: err,
                url: ctx.url,
                method: ctx.method
            });
        });
        app.listen(config_default_1.default.APP_PORT, () => {
            console.log(`服务已经启动, 环境:${config_default_1.default.NODE_ENV}，端口号:http://localhost:${config_default_1.default.APP_PORT}`);
        });
        return app;
    });
}
exports.default = start;
