"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
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
const koa_swagger_decorator_1 = require("koa-swagger-decorator");
const monitorService_1 = require("../services/monitorService");
const log4js_1 = require("../config/log4js");
const monitor_1 = require("../enums/monitor");
class MonitorController {
    static getSystemInfo(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield monitorService_1.monitorService.getSystemInfo();
                ctx.success(result);
            }
            catch (error) {
                log4js_1.logger.error('获取系统监控数据失败:', error);
                ctx.error(monitor_1.MonitorMessage.GET_ERROR);
            }
        });
    }
    static getHistory(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield monitorService_1.monitorService.getHistory(ctx.query);
                ctx.success(result);
            }
            catch (error) {
                log4js_1.logger.error('获取历史监控数据失败:', error);
                ctx.error(monitor_1.MonitorMessage.HISTORY_ERROR);
            }
        });
    }
}
exports.default = MonitorController;
__decorate([
    (0, koa_swagger_decorator_1.request)('get', '/monitor/system'),
    (0, koa_swagger_decorator_1.tags)(['系统监控']),
    (0, koa_swagger_decorator_1.summary)('获取系统监控数据'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MonitorController, "getSystemInfo", null);
__decorate([
    (0, koa_swagger_decorator_1.request)('get', '/monitor/history'),
    (0, koa_swagger_decorator_1.tags)(['系统监控']),
    (0, koa_swagger_decorator_1.summary)('获取历史监控数据'),
    (0, koa_swagger_decorator_1.query)({
        pagenumber: { type: 'number', required: false, default: 1 },
        pagesize: { type: 'number', required: false, default: 10 },
        startTime: { type: 'string', required: false },
        endTime: { type: 'string', required: false }
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MonitorController, "getHistory", null);
