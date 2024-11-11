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
const permissionService_1 = require("../services/permissionService");
const permissionMessage_1 = require("../enums/permissionMessage");
const businessError_1 = require("../utils/businessError");
const log4js_1 = require("../config/log4js");
const koa_swagger_decorator_1 = require("koa-swagger-decorator");
class PermissionController {
    static create(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = ctx.request.body;
                const result = yield permissionService_1.permissionService.create(data);
                return ctx.success(result, permissionMessage_1.PermissionMessage.CREATE_SUCCESS);
            }
            catch (error) {
                log4js_1.logger.error('创建权限错误:', error);
                if (error instanceof businessError_1.BusinessError) {
                    return ctx.error(error.message);
                }
                return ctx.error(permissionMessage_1.PermissionMessage.CREATE_ERROR);
            }
        });
    }
    /**
     * 更新权限
     */
    static update(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = ctx.params;
                const data = ctx.request.body;
                const result = yield permissionService_1.permissionService.update(Number(id), data);
                return ctx.success(result, permissionMessage_1.PermissionMessage.UPDATE_SUCCESS);
            }
            catch (error) {
                log4js_1.logger.error('更新权限错误:', error);
                if (error instanceof businessError_1.BusinessError) {
                    return ctx.error(error.message);
                }
                return ctx.error(permissionMessage_1.PermissionMessage.UPDATE_ERROR);
            }
        });
    }
    /**
     * 删除权限
     */
    static delete(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = ctx.params;
                yield permissionService_1.permissionService.delete(Number(id));
                return ctx.success(null, permissionMessage_1.PermissionMessage.DELETE_SUCCESS);
            }
            catch (error) {
                console.error('删除权限错误:', error);
                return ctx.error(permissionMessage_1.PermissionMessage.DELETE_ERROR);
            }
        });
    }
    /**
     * 获取权限详情
     */
    static getDetail(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = ctx.params;
                const result = yield permissionService_1.permissionService.getDetail(Number(id));
                if (!result) {
                    return ctx.error(permissionMessage_1.PermissionMessage.NOT_EXIST);
                }
                return ctx.success(result, permissionMessage_1.PermissionMessage.GET_DETAIL_SUCCESS);
            }
            catch (error) {
                console.error('获取权限详情错误:', error);
                return ctx.error(permissionMessage_1.PermissionMessage.GET_DETAIL_ERROR);
            }
        });
    }
    /**
     * 获取权限列表
     */
    static getList(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const params = ctx.query;
                const result = yield permissionService_1.permissionService.getList(params);
                return ctx.success(result, permissionMessage_1.PermissionMessage.GET_LIST_SUCCESS);
            }
            catch (error) {
                console.error('获取权限列表错误:', error);
                return ctx.error(permissionMessage_1.PermissionMessage.GET_LIST_ERROR);
            }
        });
    }
    // 全部权限
    static getAll(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield permissionService_1.permissionService.getAll();
                return ctx.success(result, permissionMessage_1.PermissionMessage.GET_ALL_SUCCESS);
            }
            catch (error) {
                console.error('获取全部权限错误:', error);
                return ctx.error(permissionMessage_1.PermissionMessage.GET_ALL_ERROR);
            }
        });
    }
    static updateStatus(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = ctx.params;
            try {
                // 检查权限是否存在
                const permission = yield permissionService_1.permissionService.findById(Number(id));
                if (!permission) {
                    return ctx.error(permissionMessage_1.PermissionMessage.NOT_EXIST);
                }
                // 更新状态
                yield permissionService_1.permissionService.updateStatus(Number(id));
                ctx.success(null, permissionMessage_1.PermissionMessage.UPDATE_STATUS_SUCCESS);
            }
            catch (error) {
                ctx.error(permissionMessage_1.PermissionMessage.UPDATE_STATUS_ERROR);
            }
        });
    }
}
exports.default = PermissionController;
__decorate([
    (0, koa_swagger_decorator_1.request)('post', '/permission/add'),
    (0, koa_swagger_decorator_1.tags)(['权限管理']),
    (0, koa_swagger_decorator_1.summary)('增加权限'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PermissionController, "create", null);
__decorate([
    (0, koa_swagger_decorator_1.request)('put', '/permission/update/{id}'),
    (0, koa_swagger_decorator_1.tags)(['权限管理']),
    (0, koa_swagger_decorator_1.summary)('更新权限'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PermissionController, "update", null);
__decorate([
    (0, koa_swagger_decorator_1.request)('delete', '/permission/delete/{id}'),
    (0, koa_swagger_decorator_1.tags)(['权限管理']),
    (0, koa_swagger_decorator_1.summary)('删除权限'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PermissionController, "delete", null);
__decorate([
    (0, koa_swagger_decorator_1.request)('get', '/permission/detail/{id}'),
    (0, koa_swagger_decorator_1.tags)(['权限管理']),
    (0, koa_swagger_decorator_1.summary)('获取权限详情'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PermissionController, "getDetail", null);
__decorate([
    (0, koa_swagger_decorator_1.request)('get', '/permission/list'),
    (0, koa_swagger_decorator_1.tags)(['权限管理']),
    (0, koa_swagger_decorator_1.summary)('获取权限列表'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PermissionController, "getList", null);
__decorate([
    (0, koa_swagger_decorator_1.request)('get', '/permission/all'),
    (0, koa_swagger_decorator_1.tags)(['权限管理']),
    (0, koa_swagger_decorator_1.summary)('获取全部权限'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PermissionController, "getAll", null);
__decorate([
    (0, koa_swagger_decorator_1.request)('put', '/permission/status/{id}'),
    (0, koa_swagger_decorator_1.tags)(['权限管理']),
    (0, koa_swagger_decorator_1.summary)('修改权限状态'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PermissionController, "updateStatus", null);
