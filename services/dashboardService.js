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
exports.dashboardService = exports.DashboardService = void 0;
const sequelize_1 = require("sequelize");
const dateUtil_1 = require("../utils/dateUtil");
const userModel_1 = __importDefault(require("../model/userModel"));
const log_1 = __importDefault(require("../model/log"));
const departmentModel_1 = __importDefault(require("../model/departmentModel"));
const mysql_1 = __importDefault(require("../db/mysql"));
class DashboardService {
    /**
     * 获取总览数据
     */
    getOverview() {
        return __awaiter(this, void 0, void 0, function* () {
            const now = new Date();
            const todayStart = new Date(now.setHours(0, 0, 0, 0));
            const todayEnd = new Date(now.setHours(23, 59, 59, 999));
            // 用户总数
            const totalUsers = yield userModel_1.default.count();
            // 今日新增用户
            const newUsers = yield userModel_1.default.count({
                where: {
                    created_at: {
                        [sequelize_1.Op.between]: [todayStart, todayEnd]
                    }
                }
            });
            // 部门总数
            const totalDepartments = yield departmentModel_1.default.count();
            // 今日操作日志数
            const todayLogs = yield log_1.default.count({
                where: {
                    created_at: {
                        [sequelize_1.Op.between]: [todayStart, todayEnd]
                    }
                }
            });
            return {
                totalUsers,
                newUsers,
                totalDepartments,
                todayLogs
            };
        });
    }
    /**
     * 获取趋势数据
     */
    getTrend(_a) {
        return __awaiter(this, arguments, void 0, function* ({ type = 'week', startTime, endTime }) {
            let dateFormat;
            let groupBy;
            switch (type) {
                case 'year':
                    dateFormat = '%Y-%m';
                    groupBy = 'month';
                    break;
                case 'month':
                    dateFormat = '%Y-%m-%d';
                    groupBy = 'day';
                    break;
                default:
                    dateFormat = '%Y-%m-%d';
                    groupBy = 'day';
            }
            // 用户增长趋势
            const userTrend = yield userModel_1.default.findAll({
                attributes: [
                    [
                        mysql_1.default.fn('DATE_FORMAT', mysql_1.default.col('created_at'), dateFormat),
                        'date'
                    ],
                    [mysql_1.default.fn('COUNT', mysql_1.default.col('id')), 'count']
                ],
                where: {
                    created_at: {
                        [sequelize_1.Op.between]: [
                            startTime || dateUtil_1.DateUtil.getLastDays(30),
                            endTime || new Date()
                        ]
                    }
                },
                group: [
                    mysql_1.default.fn('DATE_FORMAT', mysql_1.default.col('created_at'), dateFormat)
                ],
                order: [[mysql_1.default.col('date'), 'ASC']]
            });
            // 操作日志趋势
            const logTrend = yield log_1.default.findAll({
                attributes: [
                    [
                        mysql_1.default.fn('DATE_FORMAT', mysql_1.default.col('created_at'), dateFormat),
                        'date'
                    ],
                    [mysql_1.default.fn('COUNT', mysql_1.default.col('id')), 'count']
                ],
                where: {
                    created_at: {
                        [sequelize_1.Op.between]: [
                            startTime || dateUtil_1.DateUtil.getLastDays(30),
                            endTime || new Date()
                        ]
                    }
                },
                group: [
                    mysql_1.default.fn('DATE_FORMAT', mysql_1.default.col('created_at'), dateFormat)
                ],
                order: [[mysql_1.default.col('date'), 'ASC']]
            });
            return {
                userTrend,
                logTrend
            };
        });
    }
    /**
     * 获取操作日志统计
     */
    getLogStats() {
        return __awaiter(this, arguments, void 0, function* (days = 7) {
            // 操作类型分布
            const typeStats = yield log_1.default.findAll({
                attributes: [
                    'content',
                    [mysql_1.default.fn('COUNT', mysql_1.default.col('id')), 'count']
                ],
                where: {
                    created_at: {
                        [sequelize_1.Op.gte]: dateUtil_1.DateUtil.getLastDays(days)
                    }
                },
                group: ['content']
            });
            // 操作状态分布
            const statusStats = yield log_1.default.findAll({
                attributes: [
                    'status',
                    [mysql_1.default.fn('COUNT', mysql_1.default.col('id')), 'count']
                ],
                where: {
                    created_at: {
                        [sequelize_1.Op.gte]: dateUtil_1.DateUtil.getLastDays(days)
                    }
                },
                group: ['status']
            });
            return {
                typeStats,
                statusStats
            };
        });
    }
    /**
     * 获取用户统计数据
     */
    getUserStats() {
        return __awaiter(this, void 0, void 0, function* () {
            // 部门用户分布
            const departmentStats = yield userModel_1.default.findAll({
                attributes: [
                    'department_id',
                    [mysql_1.default.fn('COUNT', mysql_1.default.col('id')), 'count']
                ],
                include: [
                    {
                        model: departmentModel_1.default,
                        attributes: ['name']
                    }
                ],
                group: ['department_id']
            });
            // 用户状态分布
            const statusStats = yield userModel_1.default.findAll({
                attributes: [
                    'status',
                    [mysql_1.default.fn('COUNT', mysql_1.default.col('id')), 'count']
                ],
                group: ['status']
            });
            return {
                departmentStats,
                statusStats
            };
        });
    }
}
exports.DashboardService = DashboardService;
exports.dashboardService = new DashboardService();
