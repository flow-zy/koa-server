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
const logService_1 = require("../services/logService");
class LogController {
    static getList(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const { page = 1, pageSize = 10, username, startTime, endTime, status } = ctx.query;
            const result = yield logService_1.LogService.getList({
                page: Number(page),
                pageSize: Number(pageSize),
                username: username,
                startTime: startTime,
                endTime: endTime,
                status: status ? Number(status) : undefined
            });
            ctx.success(result);
        });
    }
    static getDetail(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = ctx.params;
            const log = yield logService_1.LogService.getDetail(Number(id));
            if (!log) {
                return ctx.error('日志不存在');
            }
            ctx.success(log);
        });
    }
}
exports.default = LogController;
__decorate([
    (0, koa_swagger_decorator_1.request)('get', '/log/list'),
    (0, koa_swagger_decorator_1.tags)(['日志管理']),
    (0, koa_swagger_decorator_1.summary)('获取日志列表'),
    (0, koa_swagger_decorator_1.query)({
        page: {
            type: 'number',
            required: false,
            default: 1,
            description: '页码'
        },
        pageSize: {
            type: 'number',
            required: false,
            default: 10,
            description: '每页条数'
        },
        username: { type: 'string', required: false, description: '用户名' },
        startTime: { type: 'string', required: false, description: '开始时间' },
        endTime: { type: 'string', required: false, description: '结束时间' },
        status: {
            type: 'number',
            required: false,
            description: '状态：1成功 2失败'
        }
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LogController, "getList", null);
__decorate([
    (0, koa_swagger_decorator_1.request)('get', '/log/detail/:id'),
    (0, koa_swagger_decorator_1.tags)(['日志管理']),
    (0, koa_swagger_decorator_1.summary)('获取日志详情'),
    (0, koa_swagger_decorator_1.path)({
        id: { type: 'number', required: true, description: '日志ID' }
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LogController, "getDetail", null);
