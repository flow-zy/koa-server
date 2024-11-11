"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DateUtil = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
class DateUtil {
    // 格式化为 YYYY-MM-DD HH:mm:ss
    static formatDateTime(date) {
        return (0, dayjs_1.default)(date).format('YYYY-MM-DD HH:mm:ss');
    }
    // 格式化为 YYYY-MM-DD
    static formatDate(date) {
        return (0, dayjs_1.default)(date).format('YYYY-MM-DD');
    }
    // 格式化为 HH:mm:ss
    static formatTime(date) {
        return (0, dayjs_1.default)(date).format('HH:mm:ss');
    }
    // 检查是否为有效日期
    static isValidDate(date) {
        return (0, dayjs_1.default)(date).isValid();
    }
    // 获取当前时间的格式化字符串
    static getCurrentDateTime() {
        return this.formatDateTime(new Date());
    }
    /**
     * 获取前N天的日期
     * @param days 天数
     * @returns Date 对象
     */
    static getLastDays(days) {
        return (0, dayjs_1.default)().subtract(days, 'day').toDate();
    }
    /**
     * 获取日期范围的开始时间（当天 00:00:00）
     */
    static getStartOfDay(date) {
        return (0, dayjs_1.default)(date).startOf('day').toDate();
    }
    /**
     * 获取日期范围的结束时间（当天 23:59:59）
     */
    static getEndOfDay(date) {
        return (0, dayjs_1.default)(date).endOf('day').toDate();
    }
    /**
     * 获取本周开始时间
     */
    static getStartOfWeek() {
        return (0, dayjs_1.default)().startOf('week').toDate();
    }
    /**
     * 获取本周结束时间
     */
    static getEndOfWeek() {
        return (0, dayjs_1.default)().endOf('week').toDate();
    }
    /**
     * 获取本月开始时间
     */
    static getStartOfMonth() {
        return (0, dayjs_1.default)().startOf('month').toDate();
    }
    /**
     * 获取本月结束时间
     */
    static getEndOfMonth() {
        return (0, dayjs_1.default)().endOf('month').toDate();
    }
    /**
     * 计算两个日期之间的天数
     */
    static getDaysBetween(startDate, endDate) {
        return (0, dayjs_1.default)(endDate).diff((0, dayjs_1.default)(startDate), 'day');
    }
}
exports.DateUtil = DateUtil;
