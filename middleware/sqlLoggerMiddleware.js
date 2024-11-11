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
exports.wrapModelMethods = wrapModelMethods;
const log4js_1 = require("../config/log4js");
const dateUtil_1 = require("../utils/dateUtil");
// 需要监控的数据库操作方法
const MONITORED_METHODS = [
    'findOne',
    'findAll',
    'create',
    'update',
    'destroy',
    'count',
    'findAndCountAll',
    'bulkCreate',
    'increment',
    'decrement'
];
/**
 * 包装 Sequelize 模型方法以记录 SQL 操作
 * @param model Sequelize 模型
 */
function wrapModelMethods(model) {
    MONITORED_METHODS.forEach((methodName) => {
        // @ts-ignore
        const originalMethod = model[methodName];
        if (typeof originalMethod === 'function') {
            // @ts-ignore
            model[methodName] = function (...args) {
                return __awaiter(this, void 0, void 0, function* () {
                    const startTime = Date.now();
                    const methodInfo = {
                        model: model.name,
                        method: methodName,
                        params: args[0] || {},
                        timestamp: dateUtil_1.DateUtil.getCurrentDateTime()
                    };
                    try {
                        // 执行原始方法
                        const result = yield originalMethod.apply(this, args);
                        // 计算执行时间
                        const executionTime = Date.now() - startTime;
                        // 记录成功的操作
                        log4js_1.logger.sql(Object.assign(Object.assign({}, methodInfo), { status: 'success', executionTime: `${executionTime}ms`, resultCount: Array.isArray(result)
                                ? result.length
                                : (result === null || result === void 0 ? void 0 : result.count)
                                    ? result.count
                                    : result
                                        ? 1
                                        : 0 }));
                        return result;
                    }
                    catch (err) {
                        const error = err;
                        // 记录失败的操作
                        log4js_1.logger.sql(Object.assign(Object.assign({}, methodInfo), { status: 'error', error: error.message, stack: error.stack }));
                        throw error;
                    }
                });
            };
        }
    });
}
