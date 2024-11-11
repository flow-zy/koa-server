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
const departmentService_1 = require("../services/departmentService");
const log4js_1 = require("../config/log4js");
const user_1 = require("../enums/user");
class DepartmentController {
    static getList(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield departmentService_1.departmentService.getList(ctx.query);
                ctx.success(result);
            }
            catch (error) {
                log4js_1.logger.error('获取部门列表失败:', error);
                ctx.error(user_1.UserMessage.GET_DEPARTMENT_LIST_ERROR);
            }
        });
    }
    static create(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield departmentService_1.departmentService.create(ctx.request.body);
                ctx.success(result, user_1.UserMessage.CREATE_DEPARTMENT_SUCCESS);
            }
            catch (error) {
                log4js_1.logger.error('添加部门失败:', error);
                ctx.error(error instanceof Error
                    ? error.message
                    : user_1.UserMessage.CREATE_DEPARTMENT_ERROR);
            }
        });
    }
    static update(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = ctx.params;
                const result = yield departmentService_1.departmentService.update(Number(id), ctx.request.body);
                ctx.success(result, user_1.UserMessage.UPDATE_DEPARTMENT_SUCCESS);
            }
            catch (error) {
                log4js_1.logger.error('更新部门失败:', error);
                ctx.error(error instanceof Error
                    ? error.message
                    : user_1.UserMessage.UPDATE_DEPARTMENT_ERROR);
            }
        });
    }
    static delete(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = ctx.params;
                yield departmentService_1.departmentService.delete(Number(id));
                ctx.success(null, user_1.UserMessage.DELETE_DEPARTMENT_SUCCESS);
            }
            catch (error) {
                log4js_1.logger.error('删除部门失败:', error);
                ctx.error(error instanceof Error
                    ? error.message
                    : user_1.UserMessage.DELETE_DEPARTMENT_ERROR);
            }
        });
    }
    static getDetail(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = ctx.params;
                const result = yield departmentService_1.departmentService.getDetail(Number(id));
                if (!result) {
                    return ctx.error(user_1.UserMessage.DEPARTMENT_NOT_FOUND);
                }
                ctx.success(result);
            }
            catch (error) {
                log4js_1.logger.error('获取部门详情失败:', error);
                ctx.error(user_1.UserMessage.DEPARTMENT_NOT_FOUND);
            }
        });
    }
    static updateStatus(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = ctx.params;
                yield departmentService_1.departmentService.updateStatus(Number(id));
                ctx.success(null, user_1.UserMessage.UPDATE_DEPARTMENT_STATUS_SUCCESS);
            }
            catch (error) {
                log4js_1.logger.error('更新部门状态失败:', error);
                ctx.error(error instanceof Error
                    ? error.message
                    : user_1.UserMessage.UPDATE_DEPARTMENT_STATUS_ERROR);
            }
        });
    }
    static getTree(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield departmentService_1.departmentService.getList({
                    pagesize: 999999, // 获取所有数据
                    status: 1 // 只获取启用的部门
                });
                ctx.success(result.list); // 返回树形结构数据
            }
            catch (error) {
                log4js_1.logger.error('获取部门树失败:', error);
                ctx.error(user_1.UserMessage.GET_DEPARTMENT_LIST_ERROR);
            }
        });
    }
    static getDepartmentUsers(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = ctx.params;
                const { pagenumber, pagesize } = ctx.query;
                const result = yield departmentService_1.departmentService.getDepartmentUsers(Number(id), {
                    pagenumber: Number(pagenumber),
                    pagesize: Number(pagesize)
                });
                ctx.success(result);
            }
            catch (error) {
                log4js_1.logger.error('获取部门用户失败:', error);
                ctx.error('获取部门用户失败');
            }
        });
    }
}
exports.default = DepartmentController;
__decorate([
    (0, koa_swagger_decorator_1.request)('get', '/department/list'),
    (0, koa_swagger_decorator_1.tags)(['部门管理']),
    (0, koa_swagger_decorator_1.summary)('获取部门列表'),
    (0, koa_swagger_decorator_1.query)({
        pagenumber: { type: 'number', required: false, default: 1 },
        pagesize: { type: 'number', required: false, default: 10 },
        keyword: { type: 'string', required: false },
        status: { type: 'number', required: false }
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DepartmentController, "getList", null);
__decorate([
    (0, koa_swagger_decorator_1.request)('post', '/department/add'),
    (0, koa_swagger_decorator_1.tags)(['部门管理']),
    (0, koa_swagger_decorator_1.summary)('添加部门'),
    (0, koa_swagger_decorator_1.body)({
        name: { type: 'string', required: true },
        code: { type: 'string', required: true },
        parentid: { type: 'number', required: false },
        leader_id: { type: 'number', required: false },
        leader: { type: 'string', required: false },
        phone: { type: 'string', required: false },
        email: { type: 'string', required: false },
        sort: { type: 'number', required: false },
        status: { type: 'number', required: false },
        remark: { type: 'string', required: false }
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DepartmentController, "create", null);
__decorate([
    (0, koa_swagger_decorator_1.request)('put', '/department/update/{id}'),
    (0, koa_swagger_decorator_1.tags)(['部门管理']),
    (0, koa_swagger_decorator_1.summary)('更新部门'),
    (0, koa_swagger_decorator_1.path)({
        id: { type: 'number', required: true }
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DepartmentController, "update", null);
__decorate([
    (0, koa_swagger_decorator_1.request)('delete', '/department/delete/{id}'),
    (0, koa_swagger_decorator_1.tags)(['部门管理']),
    (0, koa_swagger_decorator_1.summary)('删除部门'),
    (0, koa_swagger_decorator_1.path)({
        id: { type: 'number', required: true }
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DepartmentController, "delete", null);
__decorate([
    (0, koa_swagger_decorator_1.request)('get', '/department/detail/{id}'),
    (0, koa_swagger_decorator_1.tags)(['部门管理']),
    (0, koa_swagger_decorator_1.summary)('获取部门详情'),
    (0, koa_swagger_decorator_1.path)({
        id: { type: 'number', required: true }
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DepartmentController, "getDetail", null);
__decorate([
    (0, koa_swagger_decorator_1.request)('put', '/department/status/{id}'),
    (0, koa_swagger_decorator_1.tags)(['部门管理']),
    (0, koa_swagger_decorator_1.summary)('更新部门状态'),
    (0, koa_swagger_decorator_1.path)({
        id: { type: 'number', required: true }
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DepartmentController, "updateStatus", null);
__decorate([
    (0, koa_swagger_decorator_1.request)('get', '/department/tree'),
    (0, koa_swagger_decorator_1.tags)(['部门管理']),
    (0, koa_swagger_decorator_1.summary)('获取部门树结构'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DepartmentController, "getTree", null);
__decorate([
    (0, koa_swagger_decorator_1.request)('get', '/department/users/{id}'),
    (0, koa_swagger_decorator_1.tags)(['部门管理']),
    (0, koa_swagger_decorator_1.summary)('获取部门下的用户'),
    (0, koa_swagger_decorator_1.path)({
        id: { type: 'number', required: true }
    }),
    (0, koa_swagger_decorator_1.query)({
        pagenumber: { type: 'number', required: false, default: 1 },
        pagesize: { type: 'number', required: false, default: 10 }
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DepartmentController, "getDepartmentUsers", null);
