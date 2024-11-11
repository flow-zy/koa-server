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
exports.dateFormatMiddleware = void 0;
const dateUtil_1 = require("../utils/dateUtil");
// 需要格式化的时间字段
const DATE_FIELDS = [
    'created_at',
    'updated_at',
    'deleted_at',
    'last_login',
    'expire_time',
    'start_time',
    'end_time',
    'birth_date'
];
const dateFormatMiddleware = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield next();
    // 只处理响应数据
    if (ctx.body && typeof ctx.body === 'object') {
        ctx.body = formatDates(ctx.body);
    }
});
exports.dateFormatMiddleware = dateFormatMiddleware;
function formatDates(data) {
    if (Array.isArray(data)) {
        return data.map((item) => formatDates(item));
    }
    if (data && typeof data === 'object') {
        const formatted = {};
        for (const [key, value] of Object.entries(data)) {
            if (DATE_FIELDS.includes(key) && dateUtil_1.DateUtil.isValidDate(value)) {
                formatted[key] = dateUtil_1.DateUtil.formatDateTime(value);
            }
            else if (Array.isArray(value)) {
                formatted[key] = value.map((item) => formatDates(item));
            }
            else if (value && typeof value === 'object') {
                formatted[key] = formatDates(value);
            }
            else {
                formatted[key] = value;
            }
        }
        return formatted;
    }
    return data;
}
