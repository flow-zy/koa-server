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
exports.redis = void 0;
exports.initRedis = initRedis;
exports.checkRedisHealth = checkRedisHealth;
const redis_1 = require("redis");
const log4js_1 = require("./log4js");
// Redis 配置
const config = {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD,
    db: parseInt(process.env.REDIS_DB || '0'),
    prefix: 'app:'
};
// 创建 Redis 客户端
const client = (0, redis_1.createClient)({
    url: `redis://${config.host}:${config.port}`,
    password: config.password,
    database: config.db
});
// 连接错误处理
client.on('error', (err) => {
    log4js_1.logger.error('Redis Client Error:', err);
});
// 连接成功日志
client.on('connect', () => {
    log4js_1.logger.info('Redis Client Connected');
});
// 重连日志
client.on('reconnecting', () => {
    log4js_1.logger.info('Redis Client Reconnecting');
});
// 包装常用的 Redis 操作
exports.redis = {
    // 设置键值对
    set: (key, value, expireSeconds) => __awaiter(void 0, void 0, void 0, function* () {
        const fullKey = `${config.prefix}${key}`;
        try {
            const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
            if (expireSeconds) {
                yield client.set(fullKey, stringValue, {
                    EX: expireSeconds
                });
            }
            else {
                yield client.set(fullKey, stringValue);
            }
            return true;
        }
        catch (error) {
            log4js_1.logger.error('Redis Set Error:', { key: fullKey, error });
            return false;
        }
    }),
    // 获取值
    get: (key) => __awaiter(void 0, void 0, void 0, function* () {
        const fullKey = `${config.prefix}${key}`;
        try {
            const value = yield client.get(fullKey);
            if (!value)
                return null;
            try {
                return JSON.parse(value);
            }
            catch (_a) {
                return value;
            }
        }
        catch (error) {
            log4js_1.logger.error('Redis Get Error:', { key: fullKey, error });
            return null;
        }
    }),
    // 删除键
    del: (key) => __awaiter(void 0, void 0, void 0, function* () {
        const fullKey = `${config.prefix}${key}`;
        try {
            yield client.del(fullKey);
            return true;
        }
        catch (error) {
            log4js_1.logger.error('Redis Del Error:', { key: fullKey, error });
            return false;
        }
    }),
    // 设置过期时间
    expire: (key, seconds) => __awaiter(void 0, void 0, void 0, function* () {
        const fullKey = `${config.prefix}${key}`;
        try {
            yield client.expire(fullKey, seconds);
            return true;
        }
        catch (error) {
            log4js_1.logger.error('Redis Expire Error:', { key: fullKey, error });
            return false;
        }
    }),
    // 检查键是否存在
    exists: (key) => __awaiter(void 0, void 0, void 0, function* () {
        const fullKey = `${config.prefix}${key}`;
        try {
            return (yield client.exists(fullKey)) === 1;
        }
        catch (error) {
            log4js_1.logger.error('Redis Exists Error:', { key: fullKey, error });
            return false;
        }
    }),
    // 获取所有匹配的键
    keys: (pattern) => __awaiter(void 0, void 0, void 0, function* () {
        const fullPattern = `${config.prefix}${pattern}`;
        try {
            return yield client.keys(fullPattern);
        }
        catch (error) {
            log4js_1.logger.error('Redis Keys Error:', {
                pattern: fullPattern,
                error
            });
            return [];
        }
    }),
    // 清除所有数据
    flushAll: () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield client.flushAll();
            return true;
        }
        catch (error) {
            log4js_1.logger.error('Redis FlushAll Error:', error);
            return false;
        }
    }),
    // 获取原始客户端
    getClient: () => client
};
// 初始化 Redis 连接
function initRedis() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield client.connect();
            log4js_1.logger.info('Redis initialized successfully');
        }
        catch (error) {
            log4js_1.logger.error('Redis initialization failed:', error);
            process.exit(1);
        }
    });
}
// 添加健康检查方法
function checkRedisHealth() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield exports.redis.set('health-check', '1', 10);
            const result = yield exports.redis.get('health-check');
            return result === '1';
        }
        catch (error) {
            log4js_1.logger.error('Redis health check failed:', error);
            return false;
        }
    });
}
