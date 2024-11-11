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
const noticeService_1 = require("../services/noticeService");
const log4js_1 = require("../config/log4js");
const notice_1 = require("../enums/notice");
class NoticeController {
    static getList(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield noticeService_1.noticeService.getList(ctx.query);
                ctx.success(result);
            }
            catch (error) {
                log4js_1.logger.error('获取通知公告列表失败:', error);
                ctx.error(notice_1.NoticeMessage.LIST_ERROR);
            }
        });
    }
    static create(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = Object.assign(Object.assign({}, ctx.request.body), { publisher_id: ctx.state.user.userId, publisher: ctx.state.user.username });
                const result = yield noticeService_1.noticeService.create(data);
                ctx.success(result, notice_1.NoticeMessage.CREATE_SUCCESS);
            }
            catch (error) {
                log4js_1.logger.error('添加通知公告失败:', error);
                ctx.error(error instanceof Error
                    ? error.message
                    : notice_1.NoticeMessage.CREATE_ERROR);
            }
        });
    }
    static update(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = ctx.params;
                const result = yield noticeService_1.noticeService.update(Number(id), ctx.request.body);
                ctx.success(result, notice_1.NoticeMessage.UPDATE_SUCCESS);
            }
            catch (error) {
                log4js_1.logger.error('更新通知公告失败:', error);
                ctx.error(error instanceof Error
                    ? error.message
                    : notice_1.NoticeMessage.UPDATE_ERROR);
            }
        });
    }
    static delete(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = ctx.params;
                yield noticeService_1.noticeService.delete(Number(id));
                ctx.success(null, notice_1.NoticeMessage.DELETE_SUCCESS);
            }
            catch (error) {
                log4js_1.logger.error('删除通知公告失败:', error);
                ctx.error(notice_1.NoticeMessage.DELETE_ERROR);
            }
        });
    }
    static getDetail(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = ctx.params;
                const result = yield noticeService_1.noticeService.getDetail(Number(id));
                ctx.success(result);
            }
            catch (error) {
                log4js_1.logger.error('获取通知公告详情失败:', error);
                ctx.error(notice_1.NoticeMessage.DETAIL_ERROR);
            }
        });
    }
    static publish(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = ctx.params;
                yield noticeService_1.noticeService.publish(Number(id));
                ctx.success(null, notice_1.NoticeMessage.PUBLISH_SUCCESS);
            }
            catch (error) {
                log4js_1.logger.error('发布通知公告失败:', error);
                ctx.error(notice_1.NoticeMessage.PUBLISH_ERROR);
            }
        });
    }
    static revoke(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = ctx.params;
                yield noticeService_1.noticeService.revoke(Number(id));
                ctx.success(null, notice_1.NoticeMessage.REVOKE_SUCCESS);
            }
            catch (error) {
                log4js_1.logger.error('撤回通知公告失败:', error);
                ctx.error(notice_1.NoticeMessage.REVOKE_ERROR);
            }
        });
    }
    static toggleTop(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = ctx.params;
                yield noticeService_1.noticeService.toggleTop(Number(id));
                ctx.success(null, notice_1.NoticeMessage.TOP_SUCCESS);
            }
            catch (error) {
                log4js_1.logger.error('置顶/取消置顶通知公告失败:', error);
                ctx.error(notice_1.NoticeMessage.TOP_ERROR);
            }
        });
    }
}
exports.default = NoticeController;
__decorate([
    (0, koa_swagger_decorator_1.request)('get', '/notice/list'),
    (0, koa_swagger_decorator_1.tags)(['通知公告']),
    (0, koa_swagger_decorator_1.summary)('获取通知公告列表'),
    (0, koa_swagger_decorator_1.query)({
        pagenumber: { type: 'number', required: false, default: 1 },
        pagesize: { type: 'number', required: false, default: 10 },
        keyword: { type: 'string', required: false },
        type: { type: 'number', required: false },
        status: { type: 'number', required: false },
        startTime: { type: 'string', required: false },
        endTime: { type: 'string', required: false }
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NoticeController, "getList", null);
__decorate([
    (0, koa_swagger_decorator_1.request)('post', '/notice/add'),
    (0, koa_swagger_decorator_1.tags)(['通知公告']),
    (0, koa_swagger_decorator_1.summary)('添加通知公告'),
    (0, koa_swagger_decorator_1.body)({
        title: { type: 'string', required: true },
        content: { type: 'string', required: true },
        type: { type: 'number', required: true },
        status: { type: 'number', required: false },
        istop: { type: 'number', required: false },
        sort: { type: 'number', required: false },
        remark: { type: 'string', required: false }
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NoticeController, "create", null);
__decorate([
    (0, koa_swagger_decorator_1.request)('put', '/notice/update/{id}'),
    (0, koa_swagger_decorator_1.tags)(['通知公告']),
    (0, koa_swagger_decorator_1.summary)('更新通知公告'),
    (0, koa_swagger_decorator_1.path)({
        id: { type: 'number', required: true }
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NoticeController, "update", null);
__decorate([
    (0, koa_swagger_decorator_1.request)('delete', '/notice/delete/{id}'),
    (0, koa_swagger_decorator_1.tags)(['通知公告']),
    (0, koa_swagger_decorator_1.summary)('删除通知公告'),
    (0, koa_swagger_decorator_1.path)({
        id: { type: 'number', required: true }
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NoticeController, "delete", null);
__decorate([
    (0, koa_swagger_decorator_1.request)('get', '/notice/detail/{id}'),
    (0, koa_swagger_decorator_1.tags)(['通知公告']),
    (0, koa_swagger_decorator_1.summary)('获取通知公告详情'),
    (0, koa_swagger_decorator_1.path)({
        id: { type: 'number', required: true }
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NoticeController, "getDetail", null);
__decorate([
    (0, koa_swagger_decorator_1.request)('put', '/notice/publish/{id}'),
    (0, koa_swagger_decorator_1.tags)(['通知公告']),
    (0, koa_swagger_decorator_1.summary)('发布通知公告'),
    (0, koa_swagger_decorator_1.path)({
        id: { type: 'number', required: true }
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NoticeController, "publish", null);
__decorate([
    (0, koa_swagger_decorator_1.request)('put', '/notice/revoke/{id}'),
    (0, koa_swagger_decorator_1.tags)(['通知公告']),
    (0, koa_swagger_decorator_1.summary)('撤回通知公告'),
    (0, koa_swagger_decorator_1.path)({
        id: { type: 'number', required: true }
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NoticeController, "revoke", null);
__decorate([
    (0, koa_swagger_decorator_1.request)('put', '/notice/top/{id}'),
    (0, koa_swagger_decorator_1.tags)(['通知公告']),
    (0, koa_swagger_decorator_1.summary)('置顶/取消置顶通知公告'),
    (0, koa_swagger_decorator_1.path)({
        id: { type: 'number', required: true }
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NoticeController, "toggleTop", null);
