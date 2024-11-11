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
const dashboardService_1 = require("../services/dashboardService");
const log4js_1 = require("../config/log4js");
const dashboardService = new dashboardService_1.DashboardService();
class DashboardController {
    static getOverview(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield dashboardService.getOverview();
                ctx.success(result);
            }
            catch (error) {
                log4js_1.logger.error('获取总览数据失败:', error);
                ctx.error('获取总览数据失败');
            }
        });
    }
    static getTrend(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield dashboardService.getTrend(ctx.query);
                ctx.success(result);
            }
            catch (error) {
                log4js_1.logger.error('获取趋势数据失败:', error);
                ctx.error('获取趋势数据失败');
            }
        });
    }
    static getLogStats(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { days } = ctx.query;
                const result = yield dashboardService.getLogStats(Number(days));
                ctx.success(result);
            }
            catch (error) {
                log4js_1.logger.error('获取日志统计失败:', error);
                ctx.error('获取日志统计失败');
            }
        });
    }
    static getUserStats(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield dashboardService.getUserStats();
                ctx.success(result);
            }
            catch (error) {
                log4js_1.logger.error('获取用户统计失败:', error);
                ctx.error('获取用户统计失败');
            }
        });
    }
}
exports.default = DashboardController;
__decorate([
    (0, koa_swagger_decorator_1.request)('get', '/dashboard/overview'),
    (0, koa_swagger_decorator_1.tags)(['数据统计']),
    (0, koa_swagger_decorator_1.summary)('获取总览数据'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DashboardController, "getOverview", null);
__decorate([
    (0, koa_swagger_decorator_1.request)('get', '/dashboard/trend'),
    (0, koa_swagger_decorator_1.tags)(['数据统计']),
    (0, koa_swagger_decorator_1.summary)('获取趋势数据'),
    (0, koa_swagger_decorator_1.query)({
        type: { type: 'string', required: false, default: 'week' }, // week/month/year
        startTime: { type: 'string', required: false },
        endTime: { type: 'string', required: false }
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DashboardController, "getTrend", null);
__decorate([
    (0, koa_swagger_decorator_1.request)('get', '/dashboard/logs'),
    (0, koa_swagger_decorator_1.tags)(['数据统计']),
    (0, koa_swagger_decorator_1.summary)('获取操作日志统计'),
    (0, koa_swagger_decorator_1.query)({
        days: { type: 'number', required: false, default: 7 }
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DashboardController, "getLogStats", null);
__decorate([
    (0, koa_swagger_decorator_1.request)('get', '/dashboard/users'),
    (0, koa_swagger_decorator_1.tags)(['数据统计']),
    (0, koa_swagger_decorator_1.summary)('获取用户统计数据'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DashboardController, "getUserStats", null);
