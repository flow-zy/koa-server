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
exports.monitorService = exports.MonitorService = void 0;
const baseDao_1 = require("../dao/baseDao");
const monitorModel_1 = __importDefault(require("../model/monitorModel"));
const businessError_1 = require("../utils/businessError");
const monitor_1 = require("../enums/monitor");
const os_1 = __importDefault(require("os"));
const child_process_1 = require("child_process");
const util_1 = require("util");
const redis_1 = require("../config/redis");
const execAsync = (0, util_1.promisify)(child_process_1.exec);
class MonitorService {
    /**
     * 获取系统监控数据
     */
    getSystemInfo() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // CPU信息
                const cpuUsage = yield this.getCPUUsage();
                // 内存信息
                const totalMem = os_1.default.totalmem();
                const freeMem = os_1.default.freemem();
                const memoryUsage = ((totalMem - freeMem) / totalMem) * 100;
                // 磁盘信息
                const diskUsage = yield this.getDiskUsage();
                // 系统负载
                const loadavg = os_1.default.loadavg();
                const systemLoad = loadavg.map((load) => load.toFixed(2)).join(', ');
                // 网络IO
                const networkIO = yield this.getNetworkIO();
                // 在线用户数（从Redis获取）
                const onlineUsers = yield this.getOnlineUsers();
                // 系统运行时间
                const uptime = os_1.default.uptime();
                // 保存监控数据
                const monitorData = {
                    cpu_usage: cpuUsage,
                    memory_usage: memoryUsage,
                    disk_usage: diskUsage,
                    system_load: systemLoad,
                    network_io: networkIO,
                    online_users: onlineUsers,
                    uptime
                };
                yield baseDao_1.BaseDao.create(monitorModel_1.default, monitorData);
                return Object.assign(Object.assign({}, monitorData), { os_type: os_1.default.type(), os_platform: os_1.default.platform(), os_arch: os_1.default.arch(), os_release: os_1.default.release(), hostname: os_1.default.hostname() });
            }
            catch (error) {
                throw new businessError_1.BusinessError(monitor_1.MonitorMessage.GET_ERROR);
            }
        });
    }
    /**
     * 获取历史监控数据
     */
    getHistory(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield baseDao_1.BaseDao.findByPage(monitorModel_1.default, Object.assign(Object.assign({}, params), { order: [['created_at', 'DESC']] }));
        });
    }
    /**
     * 获取CPU使用率
     */
    getCPUUsage() {
        return __awaiter(this, void 0, void 0, function* () {
            const cpus = os_1.default.cpus();
            const totalIdle = cpus.reduce((acc, cpu) => acc + cpu.times.idle, 0);
            const totalTick = cpus.reduce((acc, cpu) => acc +
                cpu.times.idle +
                cpu.times.user +
                cpu.times.sys +
                cpu.times.nice, 0);
            const usage = ((totalTick - totalIdle) / totalTick) * 100;
            return Number(usage.toFixed(2));
        });
    }
    /**
     * 获取磁盘使用率
     */
    getDiskUsage() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { stdout } = yield execAsync("df -h / | tail -1 | awk '{print $5}'");
                return Number(stdout.trim().replace('%', ''));
            }
            catch (error) {
                return 0;
            }
        });
    }
    /**
     * 获取网络IO
     */
    getNetworkIO() {
        return __awaiter(this, void 0, void 0, function* () {
            const networkInterfaces = os_1.default.networkInterfaces();
            let totalRx = 0;
            let totalTx = 0;
            Object.values(networkInterfaces).forEach((interfaces) => {
                interfaces === null || interfaces === void 0 ? void 0 : interfaces.forEach((interface_) => {
                    if (!interface_.internal) {
                        // 这里只是示例，实际需要通过其他方式获取实时网络IO
                        totalRx += Math.random() * 1000;
                        totalTx += Math.random() * 1000;
                    }
                });
            });
            return `↓${(totalRx / 1024).toFixed(2)}KB/s ↑${(totalTx / 1024).toFixed(2)}KB/s`;
        });
    }
    /**
     * 获取在线用户数
     */
    getOnlineUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const onlineUsers = yield redis_1.redis.keys('online:*');
                return onlineUsers.length;
            }
            catch (error) {
                return 0;
            }
        });
    }
}
exports.MonitorService = MonitorService;
exports.monitorService = new MonitorService();
