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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_swagger_decorator_1 = require("koa-swagger-decorator");
const roleService_1 = __importDefault(require("../services/roleService"));
const role_1 = require("../enums/role");
const enums_1 = require("../enums");
class RoleController {
    static getRoleList(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const params = ctx.request.query;
                const res = yield roleService_1.default.getRoleList(params);
                if (!res)
                    return ctx.send(role_1.RoleMessage.ROLE_LIST_ERROR, 201);
                return ctx.send(role_1.RoleMessage.ROLE_LIST_SUCCESS, 200, res);
            }
            catch (error) {
                return ctx.send(enums_1.HttpError.HTTP, 500);
            }
        });
    }
    // 获取全部的角色没有分
    static getAllRole(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield roleService_1.default.getAllRole();
                if (!res)
                    return ctx.send(role_1.RoleMessage.ROLE_LIST_ERROR, 201);
                return ctx.send(role_1.RoleMessage.ROLE_LIST_SUCCESS, 200, res);
            }
            catch (error) {
                return ctx.send(enums_1.HttpError.HTTP, 500);
            }
        });
    }
    static addRole(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const params = ctx.request.body;
                const res = yield roleService_1.default.addRole(params);
                if (!res)
                    return ctx.send(role_1.RoleMessage.ROLE_ADD_ERROR, 201);
                return ctx.send(role_1.RoleMessage.ROLE_ADD_SUCCESS, 200);
            }
            catch (error) {
                return ctx.send(enums_1.HttpError.HTTP, 500);
            }
        });
    }
    static deleteRole(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(ctx.params.id);
                if (!id)
                    return ctx.send(role_1.RoleMessage.ROLE_DELETE_ERROR, 201);
                const res = yield roleService_1.default.deleteRole(id);
                if (!res)
                    return ctx.send(role_1.RoleMessage.ROLE_DELETE_ERROR, 201);
                return ctx.send(role_1.RoleMessage.ROLE_DELETE_SUCCESS, 200);
            }
            catch (error) {
                return ctx.send(enums_1.HttpError.HTTP, 500);
            }
        });
    }
    static updateRole(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(ctx.params.id);
                const params = ctx.request.body;
                if (!id)
                    return ctx.send(role_1.RoleMessage.ROLE_UPDATE_ERROR, 201);
                const res = yield roleService_1.default.updateRole(id, params);
                if (!res)
                    return ctx.send(role_1.RoleMessage.ROLE_UPDATE_ERROR, 201);
                return ctx.send(role_1.RoleMessage.ROLE_UPDATE_SUCCESS, 200);
            }
            catch (error) {
                return ctx.send(enums_1.HttpError.HTTP, 500);
            }
        });
    }
    static changeStatus(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(ctx.params.id);
                if (!id)
                    return ctx.send(role_1.RoleMessage.ROLE_PARAMS_ERROR, 201);
                const res = yield roleService_1.default.changeStatus(id);
                if (!res)
                    return ctx.send(role_1.RoleMessage.ROLE_STATUS_ERROR, 201);
                return ctx.send(role_1.RoleMessage.ROLE_STATUS_SUCCESS, 200);
            }
            catch (error) {
                return ctx.send(enums_1.HttpError.HTTP, 500);
            }
        });
    }
    static getRoleDetail(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = ctx.params;
                // 参数验证
                if (!id) {
                    return ctx.error(role_1.RoleMessage.ROLE_ID_REQUIRED);
                }
                // 获取角色详情
                const roleDetail = yield roleService_1.default.getRoleDetail(Number(id));
                if (!roleDetail) {
                    return ctx.error(role_1.RoleMessage.ROLE_NOT_EXIST);
                }
                return ctx.success(roleDetail, role_1.RoleMessage.GET_ROLE_DETAIL_SUCCESS);
            }
            catch (error) {
                console.error('获取角色详情错误:', error);
                return ctx.error(role_1.RoleMessage.SYSTEM_ERROR, 500);
            }
        });
    }
}
exports.default = RoleController;
__decorate([
    (0, koa_swagger_decorator_1.request)('get', '/role/list'),
    (0, koa_swagger_decorator_1.tags)(['角色管理']),
    (0, koa_swagger_decorator_1.summary)(['获取角色列表']),
    (0, koa_swagger_decorator_1.query)({
        pagesize: { type: 'number', require: true, description: '每页条数' },
        pagenumber: { type: 'number', require: true, description: '页码' },
        name: { type: 'string', require: false },
        startTime: { type: 'string', require: false },
        endTime: { type: 'date', require: false }
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RoleController, "getRoleList", null);
__decorate([
    (0, koa_swagger_decorator_1.request)('get', '/role/all'),
    (0, koa_swagger_decorator_1.tags)(['角色管理']),
    (0, koa_swagger_decorator_1.summary)(['获取全部的角色']),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RoleController, "getAllRole", null);
__decorate([
    (0, koa_swagger_decorator_1.request)('post', '/role/add'),
    (0, koa_swagger_decorator_1.tags)(['角色管理']),
    (0, koa_swagger_decorator_1.summary)(['添加角色']),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RoleController, "addRole", null);
__decorate([
    (0, koa_swagger_decorator_1.request)('delete', '/role/delete/{id}'),
    (0, koa_swagger_decorator_1.tags)(['角色管理']),
    (0, koa_swagger_decorator_1.summary)(['删除角色']),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RoleController, "deleteRole", null);
__decorate([
    (0, koa_swagger_decorator_1.request)('put', '/role/update/{id}'),
    (0, koa_swagger_decorator_1.tags)(['角色管理']),
    (0, koa_swagger_decorator_1.summary)(['修改角色']),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RoleController, "updateRole", null);
__decorate([
    (0, koa_swagger_decorator_1.request)('put', '/role/status/{id}'),
    (0, koa_swagger_decorator_1.tags)(['角色管理']),
    (0, koa_swagger_decorator_1.summary)('切换角色状态'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RoleController, "changeStatus", null);
__decorate([
    (0, koa_swagger_decorator_1.request)('get', '/role/detail/{id}'),
    (0, koa_swagger_decorator_1.tags)(['角色管理']),
    (0, koa_swagger_decorator_1.summary)(['获取角色详情']),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RoleController, "getRoleDetail", null);
