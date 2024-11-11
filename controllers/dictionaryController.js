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
const dictionaryService_1 = require("../services/dictionaryService");
const log4js_1 = require("../config/log4js");
const dictionary_1 = require("../enums/dictionary");
class DictionaryController {
    static getList(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield dictionaryService_1.dictionaryService.getList(ctx.query);
                ctx.success(result);
            }
            catch (error) {
                log4js_1.logger.error('获取字典列表失败:', error);
                ctx.error('获取字典列表失败');
            }
        });
    }
    static getAll(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield dictionaryService_1.dictionaryService.getAll();
                ctx.success(result);
            }
            catch (error) {
                log4js_1.logger.error('获取所有字典失败:', error);
                ctx.error('获取所有字典失败');
            }
        });
    }
    static create(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield dictionaryService_1.dictionaryService.create(ctx.request.body);
                ctx.success(result, dictionary_1.DictionaryMessage.DICT_ADD_SUCCESS);
            }
            catch (error) {
                log4js_1.logger.error('添加字典失败:', error);
                ctx.error(error instanceof Error
                    ? error.message
                    : dictionary_1.DictionaryMessage.DICT_OPERATION_ERROR);
            }
        });
    }
    static update(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = ctx.params;
                const result = yield dictionaryService_1.dictionaryService.update(Number(id), ctx.request.body);
                ctx.success(result, dictionary_1.DictionaryMessage.DICT_UPDATE_SUCCESS);
            }
            catch (error) {
                log4js_1.logger.error('更新字典失败:', error);
                ctx.error(error instanceof Error
                    ? error.message
                    : dictionary_1.DictionaryMessage.DICT_OPERATION_ERROR);
            }
        });
    }
    static delete(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = ctx.params;
                yield dictionaryService_1.dictionaryService.delete(Number(id));
                ctx.success(null, dictionary_1.DictionaryMessage.DICT_DELETE_SUCCESS);
            }
            catch (error) {
                log4js_1.logger.error('删除字典失败:', error);
                ctx.error(error instanceof Error
                    ? error.message
                    : dictionary_1.DictionaryMessage.DICT_OPERATION_ERROR);
            }
        });
    }
    static getDetail(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = ctx.params;
                const result = yield dictionaryService_1.dictionaryService.getDetail(Number(id));
                ctx.success(result);
            }
            catch (error) {
                log4js_1.logger.error('获取字典详情失败:', error);
                ctx.error(error instanceof Error
                    ? error.message
                    : dictionary_1.DictionaryMessage.DICT_OPERATION_ERROR);
            }
        });
    }
    static updateStatus(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = ctx.params;
                yield dictionaryService_1.dictionaryService.updateStatus(Number(id));
                ctx.success(null, dictionary_1.DictionaryMessage.DICT_STATUS_SUCCESS);
            }
            catch (error) {
                log4js_1.logger.error('更新字典状态失败:', error);
                ctx.error(error instanceof Error
                    ? error.message
                    : dictionary_1.DictionaryMessage.DICT_OPERATION_ERROR);
            }
        });
    }
    static getByCode(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { code } = ctx.params;
                const result = yield dictionaryService_1.dictionaryService.getByCode(code);
                ctx.success(result, dictionary_1.DictionaryMessage.DICT_GET_SUCCESS);
            }
            catch (error) {
                log4js_1.logger.error('获取字典失败:', error);
                ctx.error(error instanceof Error
                    ? error.message
                    : dictionary_1.DictionaryMessage.DICT_OPERATION_ERROR);
            }
        });
    }
}
exports.default = DictionaryController;
__decorate([
    (0, koa_swagger_decorator_1.request)('get', '/dictionary/list'),
    (0, koa_swagger_decorator_1.tags)(['字典管理']),
    (0, koa_swagger_decorator_1.summary)('获取字典列表'),
    (0, koa_swagger_decorator_1.query)({
        pagenumber: { type: 'number', required: false, default: 1 },
        pagesize: { type: 'number', required: false, default: 10 },
        keyword: { type: 'string', required: false },
        status: { type: 'number', required: false },
        startTime: { type: 'string', required: false },
        endTime: { type: 'string', required: false }
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DictionaryController, "getList", null);
__decorate([
    (0, koa_swagger_decorator_1.request)('get', '/dictionary/all'),
    (0, koa_swagger_decorator_1.tags)(['字典管理']),
    (0, koa_swagger_decorator_1.summary)('获取所有字典'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DictionaryController, "getAll", null);
__decorate([
    (0, koa_swagger_decorator_1.request)('post', '/dictionary/add'),
    (0, koa_swagger_decorator_1.tags)(['字典管理']),
    (0, koa_swagger_decorator_1.summary)('添加字典'),
    (0, koa_swagger_decorator_1.body)({
        dictname: { type: 'string', required: true },
        dictcode: { type: 'string', required: true },
        sort: { type: 'number', required: false },
        status: { type: 'number', required: false },
        remark: { type: 'string', required: false }
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DictionaryController, "create", null);
__decorate([
    (0, koa_swagger_decorator_1.request)('put', '/dictionary/update/{id}'),
    (0, koa_swagger_decorator_1.tags)(['字典管理']),
    (0, koa_swagger_decorator_1.summary)('更新字典'),
    (0, koa_swagger_decorator_1.path)({
        id: { type: 'number', required: true }
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DictionaryController, "update", null);
__decorate([
    (0, koa_swagger_decorator_1.request)('delete', '/dictionary/delete/{id}'),
    (0, koa_swagger_decorator_1.tags)(['字典管理']),
    (0, koa_swagger_decorator_1.summary)('删除字典'),
    (0, koa_swagger_decorator_1.path)({
        id: { type: 'number', required: true }
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DictionaryController, "delete", null);
__decorate([
    (0, koa_swagger_decorator_1.request)('get', '/dictionary/detail/{id}'),
    (0, koa_swagger_decorator_1.tags)(['字典管理']),
    (0, koa_swagger_decorator_1.summary)('获取字典详情'),
    (0, koa_swagger_decorator_1.path)({
        id: { type: 'number', required: true }
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DictionaryController, "getDetail", null);
__decorate([
    (0, koa_swagger_decorator_1.request)('put', '/dictionary/status/{id}'),
    (0, koa_swagger_decorator_1.tags)(['字典管理']),
    (0, koa_swagger_decorator_1.summary)('更新字典状态'),
    (0, koa_swagger_decorator_1.path)({
        id: { type: 'number', required: true }
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DictionaryController, "updateStatus", null);
__decorate([
    (0, koa_swagger_decorator_1.request)('get', '/dictionary/code/{code}'),
    (0, koa_swagger_decorator_1.tags)(['字典管理']),
    (0, koa_swagger_decorator_1.summary)('根据编码获取字典'),
    (0, koa_swagger_decorator_1.path)({
        code: { type: 'string', required: true }
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DictionaryController, "getByCode", null);
