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
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const dayjs_1 = __importDefault(require("dayjs"));
const LOG_ROOT = path_1.default.join(process.cwd(), 'logs');
const DAYS_TO_KEEP = 30; // 保留最近30天的日志
function cleanOldLogs() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // 获取所有日期目录
            const dates = yield fs_1.default.promises.readdir(LOG_ROOT);
            const now = (0, dayjs_1.default)();
            for (const date of dates) {
                const datePath = path_1.default.join(LOG_ROOT, date);
                const stats = yield fs_1.default.promises.stat(datePath);
                // 如果是目录才处理
                if (stats.isDirectory()) {
                    const folderDate = (0, dayjs_1.default)(date, 'YYYYMMDD');
                    // 如果目录名是有效的日期且超过保留期限
                    if (folderDate.isValid() &&
                        now.diff(folderDate, 'day') > DAYS_TO_KEEP) {
                        // 删除整个日期目录
                        yield fs_1.default.promises.rm(datePath, { recursive: true });
                        console.log(`Deleted old log directory: ${date}`);
                    }
                }
            }
        }
        catch (error) {
            console.error('Error cleaning logs:', error);
        }
    });
}
// 执行清理
cleanOldLogs();
