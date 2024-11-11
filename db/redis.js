"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ioredis_1 = __importDefault(require("ioredis"));
const config_default_1 = __importDefault(require("../config/config.default"));
const redis = new ioredis_1.default({
    host: config_default_1.default.REDIS_HOST,
    port: Number(config_default_1.default.REDIS_PORT),
    password: config_default_1.default.REDIS_PWD,
});
// 测试是否连接成功
redis.ping((err, result) => {
    if (err) {
        console.error('redis连接失败, 错误信息: ', err);
    }
    else {
        console.log(`redis连接成功, 端口号: ${config_default_1.default.REDIS_PORT}`, result);
    }
});
exports.default = redis;
