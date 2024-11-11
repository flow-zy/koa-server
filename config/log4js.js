"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const log4js_1 = __importDefault(require("log4js"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const dateUtil_1 = require("../utils/dateUtil");
// 日志根目录
const LOG_ROOT = path_1.default.join(process.cwd(), 'logs');
// 获取当前日期作为子目录
const getCurrentDateDir = () => {
    return dateUtil_1.DateUtil.formatDate(new Date()).replace(/-/g, '');
};
// 创建日志目录
const LOG_DIR = path_1.default.join(LOG_ROOT, getCurrentDateDir());
if (!fs_1.default.existsSync(LOG_DIR)) {
    fs_1.default.mkdirSync(LOG_DIR, { recursive: true });
}
// 日志文件名格式
const getLogFileName = (type) => {
    return `${type}.log`;
};
// 配置 log4js
log4js_1.default.configure({
    appenders: {
        console: {
            type: 'console'
        },
        // 应用日志
        app: {
            type: 'file',
            filename: path_1.default.join(LOG_DIR, getLogFileName('app')),
            layout: {
                type: 'pattern',
                pattern: '[%d{yyyy-MM-dd hh:mm:ss.SSS}] [%p] %c - %m'
            }
        },
        // 错误日志
        error: {
            type: 'file',
            filename: path_1.default.join(LOG_DIR, getLogFileName('error')),
            layout: {
                type: 'pattern',
                pattern: '[%d{yyyy-MM-dd hh:mm:ss.SSS}] [%p] %c - %m'
            }
        },
        // API 访问日志
        api: {
            type: 'file',
            filename: path_1.default.join(LOG_DIR, getLogFileName('api')),
            layout: {
                type: 'pattern',
                pattern: '[%d{yyyy-MM-dd hh:mm:ss.SSS}] [%p] %c - %m'
            }
        },
        // SQL 日志
        sql: {
            type: 'file',
            filename: path_1.default.join(LOG_DIR, getLogFileName('sql')),
            layout: {
                type: 'pattern',
                pattern: '[%d{yyyy-MM-dd hh:mm:ss.SSS}] [%p] %c - %m'
            }
        }
    },
    categories: {
        default: {
            appenders: ['console', 'app'],
            level: process.env.NODE_ENV === 'production' ? 'info' : 'debug'
        },
        error: {
            appenders: ['console', 'error'],
            level: 'error'
        },
        api: {
            appenders: ['console', 'api'],
            level: 'info'
        },
        sql: {
            appenders: ['console', 'sql'],
            level: 'info'
        }
    }
});
// 创建日志记录器
const defaultLogger = log4js_1.default.getLogger();
const errorLogger = log4js_1.default.getLogger('error');
const apiLogger = log4js_1.default.getLogger('api');
const sqlLogger = log4js_1.default.getLogger('sql');
exports.logger = {
    info: (message, ...args) => {
        apiLogger.info(message, ...args);
    },
    error: (message, ...args) => {
        errorLogger.error(message, ...args);
    },
    debug: (message, ...args) => {
        defaultLogger.debug(message, ...args);
    },
    warn: (message, ...args) => {
        defaultLogger.warn(message, ...args);
    },
    sql: (data) => {
        sqlLogger.info('Database Operation:', Object.assign(Object.assign({}, data), { timestamp: data.timestamp || dateUtil_1.DateUtil.getCurrentDateTime() }));
    }
};
