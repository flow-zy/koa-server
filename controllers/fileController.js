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
const fileService_1 = require("../services/fileService");
const log4js_1 = require("../config/log4js");
const file_1 = require("../enums/file");
class FileController {
    static getList(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield fileService_1.fileService.getList(ctx.query);
                ctx.success(result);
            }
            catch (error) {
                log4js_1.logger.error('获取文件列表失败:', error);
                ctx.error(file_1.FileMessage.LIST_ERROR);
            }
        });
    }
    static upload(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const file = (_a = ctx.request.files) === null || _a === void 0 ? void 0 : _a.file;
                if (!file) {
                    return ctx.error(file_1.FileMessage.FILE_REQUIRED);
                }
                const result = yield fileService_1.fileService.upload(file, ctx.state.user.userId, ctx.state.user.username);
                ctx.success(result, file_1.FileMessage.UPLOAD_SUCCESS);
            }
            catch (error) {
                log4js_1.logger.error('上传文件失败:', error);
                ctx.error(error instanceof Error
                    ? error.message
                    : file_1.FileMessage.UPLOAD_ERROR);
            }
        });
    }
    static delete(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = ctx.params;
                yield fileService_1.fileService.delete(Number(id));
                ctx.success(null, file_1.FileMessage.DELETE_SUCCESS);
            }
            catch (error) {
                log4js_1.logger.error('删除文件失败:', error);
                ctx.error(error instanceof Error
                    ? error.message
                    : file_1.FileMessage.DELETE_ERROR);
            }
        });
    }
    static updateStatus(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = ctx.params;
                yield fileService_1.fileService.updateStatus(Number(id));
                ctx.success(null, file_1.FileMessage.STATUS_SUCCESS);
            }
            catch (error) {
                log4js_1.logger.error('更新文件状态失败:', error);
                ctx.error(error instanceof Error
                    ? error.message
                    : file_1.FileMessage.STATUS_ERROR);
            }
        });
    }
    static getDetail(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = ctx.params;
                const result = yield fileService_1.fileService.getDetail(Number(id));
                ctx.success(result);
            }
            catch (error) {
                log4js_1.logger.error('获取文件详情失败:', error);
                ctx.error(error instanceof Error
                    ? error.message
                    : file_1.FileMessage.DETAIL_ERROR);
            }
        });
    }
}
exports.default = FileController;
__decorate([
    (0, koa_swagger_decorator_1.request)('get', '/file/list'),
    (0, koa_swagger_decorator_1.tags)(['文件管理']),
    (0, koa_swagger_decorator_1.summary)('获取文件列表'),
    (0, koa_swagger_decorator_1.query)({
        pagenumber: { type: 'number', required: false, default: 1 },
        pagesize: { type: 'number', required: false, default: 10 },
        keyword: { type: 'string', required: false },
        category: { type: 'number', required: false },
        storage: { type: 'number', required: false },
        status: { type: 'number', required: false },
        startTime: { type: 'string', required: false },
        endTime: { type: 'string', required: false }
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FileController, "getList", null);
__decorate([
    (0, koa_swagger_decorator_1.request)('post', '/file/upload'),
    (0, koa_swagger_decorator_1.tags)(['文件管理']),
    (0, koa_swagger_decorator_1.summary)('上传文件'),
    (0, koa_swagger_decorator_1.formData)({
        file: { type: 'file', required: true }
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FileController, "upload", null);
__decorate([
    (0, koa_swagger_decorator_1.request)('delete', '/file/delete/{id}'),
    (0, koa_swagger_decorator_1.tags)(['文件管理']),
    (0, koa_swagger_decorator_1.summary)('删除文件'),
    (0, koa_swagger_decorator_1.path)({
        id: { type: 'number', required: true }
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FileController, "delete", null);
__decorate([
    (0, koa_swagger_decorator_1.request)('put', '/file/status/{id}'),
    (0, koa_swagger_decorator_1.tags)(['文件管理']),
    (0, koa_swagger_decorator_1.summary)('更新文件状态'),
    (0, koa_swagger_decorator_1.path)({
        id: { type: 'number', required: true }
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FileController, "updateStatus", null);
__decorate([
    (0, koa_swagger_decorator_1.request)('get', '/file/detail/{id}'),
    (0, koa_swagger_decorator_1.tags)(['文件管理']),
    (0, koa_swagger_decorator_1.summary)('获取文件详情'),
    (0, koa_swagger_decorator_1.path)({
        id: { type: 'number', required: true }
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FileController, "getDetail", null);
