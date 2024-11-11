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
exports.LogService = void 0;
const log_1 = __importDefault(require("../model/log"));
const sequelize_1 = require("sequelize");
class LogService {
    /**
     * 获取日志列表
     */
    static getList(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const { page, pageSize, username, startTime, endTime, status } = params;
            const where = {};
            if (username) {
                where.username = {
                    [sequelize_1.Op.like]: `%${username}%`
                };
            }
            // 添加时间范围过滤
            if (startTime && endTime) {
                where.created_at = {
                    [sequelize_1.Op.between]: [new Date(startTime), new Date(endTime)]
                };
            }
            else if (startTime) {
                where.created_at = {
                    [sequelize_1.Op.gte]: new Date(startTime)
                };
            }
            else if (endTime) {
                where.created_at = {
                    [sequelize_1.Op.lte]: new Date(endTime)
                };
            }
            if (status) {
                where.status = status;
            }
            const { count, rows } = yield log_1.default.findAndCountAll({
                where,
                order: [['created_at', 'DESC']],
                offset: (page - 1) * pageSize,
                limit: pageSize
            });
            return {
                list: rows,
                total: count,
                page,
                pageSize
            };
        });
    }
    /**
     * 获取日志详情
     */
    static getDetail(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield log_1.default.findByPk(id);
        });
    }
}
exports.LogService = LogService;
