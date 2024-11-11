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
const menuService_1 = __importDefault(require("../services/menuService"));
const menu_1 = require("../enums/menu");
const enums_1 = require("../enums");
const log4js_1 = require("../config/log4js");
class MenuController {
    static getMenuList(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const params = ctx.request.query;
                const res = yield menuService_1.default.getMenuList(params);
                if (!res)
                    return ctx.error(menu_1.MenuMessage.MENU_LIST_ERROR);
                return ctx.success(res, menu_1.MenuMessage.MENU_LIST_SUCCESS);
            }
            catch (error) {
                return ctx.error(enums_1.HttpError.HTTP);
            }
        });
    }
    static getAllMenu(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield menuService_1.default.getAllMenu();
                if (!res)
                    return ctx.error(menu_1.MenuMessage.MENU_LIST_ERROR);
                return ctx.success(res, menu_1.MenuMessage.MENU_LIST_SUCCESS);
            }
            catch (error) {
                const err = error;
                log4js_1.logger.error(`获取所有菜单错误: ${err.message}`);
                return ctx.error(enums_1.HttpError.HTTP);
            }
        });
    }
    static addMenu(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const params = ctx.request.body;
                const res = yield menuService_1.default.addMenu(params);
                if (!res)
                    return ctx.error(menu_1.MenuMessage.MENU_ADD_ERROR);
                return ctx.success(null, menu_1.MenuMessage.MENU_ADD_SUCCESS);
            }
            catch (error) {
                return ctx.error(enums_1.HttpError.HTTP);
            }
        });
    }
    static updateMenu(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(ctx.params.id);
                const params = ctx.request.body;
                if (!id)
                    return ctx.error(menu_1.MenuMessage.MENU_UPDATE_ERROR);
                const res = yield menuService_1.default.updateMenu(id, params);
                if (!res)
                    return ctx.error(menu_1.MenuMessage.MENU_UPDATE_ERROR);
                return ctx.success(null, menu_1.MenuMessage.MENU_UPDATE_SUCCESS);
            }
            catch (error) {
                return ctx.error(enums_1.HttpError.HTTP);
            }
        });
    }
    static deleteMenu(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(ctx.params.id);
                const hasChildren = yield menuService_1.default.hasChildren(id);
                if (hasChildren)
                    return ctx.error(menu_1.MenuMessage.MENU_HAS_CHILDREN);
                if (!id)
                    return ctx.error(menu_1.MenuMessage.MENU_DELETE_ERROR);
                const res = yield menuService_1.default.deleteMenu(id);
                if (!res)
                    return ctx.error(menu_1.MenuMessage.MENU_DELETE_ERROR);
                return ctx.success(null, menu_1.MenuMessage.MENU_DELETE_SUCCESS);
            }
            catch (error) {
                return ctx.error(enums_1.HttpError.HTTP);
            }
        });
    }
    static changeStatus(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(ctx.params.id);
                if (!id)
                    return ctx.error(menu_1.MenuMessage.MENU_PARAMS_ERROR);
                const res = yield menuService_1.default.changeStatus(id);
                if (!res)
                    return ctx.error(menu_1.MenuMessage.MENU_STATUS_ERROR);
                return ctx.success(null, menu_1.MenuMessage.MENU_STATUS_SUCCESS);
            }
            catch (error) {
                return ctx.error(enums_1.HttpError.HTTP);
            }
        });
    }
}
exports.default = MenuController;
__decorate([
    (0, koa_swagger_decorator_1.request)('get', '/menu/list'),
    (0, koa_swagger_decorator_1.tags)(['Menu']),
    (0, koa_swagger_decorator_1.summary)('获取菜单列表'),
    (0, koa_swagger_decorator_1.query)({
        pagesize: { type: 'number', required: true, description: '每页条数' },
        pagenumber: { type: 'number', required: true, description: '页码' },
        name: { type: 'string', required: false },
        startTime: { type: 'string', required: false },
        endTime: { type: 'string', required: false }
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MenuController, "getMenuList", null);
__decorate([
    (0, koa_swagger_decorator_1.request)('get', '/menu/all'),
    (0, koa_swagger_decorator_1.tags)(['Menu']),
    (0, koa_swagger_decorator_1.summary)('获取所有菜单'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MenuController, "getAllMenu", null);
__decorate([
    (0, koa_swagger_decorator_1.request)('post', '/menu/add'),
    (0, koa_swagger_decorator_1.tags)(['Menu']),
    (0, koa_swagger_decorator_1.summary)('添加菜单'),
    (0, koa_swagger_decorator_1.body)({
        name: { type: 'string', required: true, description: '菜单名称' },
        path: { type: 'string', required: true, description: '菜单路径' },
        parentid: { type: 'number', required: false, description: '父菜单ID' },
        icon: { type: 'string', required: false, description: '图标' },
        sort: { type: 'number', required: false, description: '排序' }
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MenuController, "addMenu", null);
__decorate([
    (0, koa_swagger_decorator_1.request)('put', '/menu/update/{id}'),
    (0, koa_swagger_decorator_1.tags)(['Menu']),
    (0, koa_swagger_decorator_1.summary)('修改菜单'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MenuController, "updateMenu", null);
__decorate([
    (0, koa_swagger_decorator_1.request)('delete', '/menu/delete/{id}'),
    (0, koa_swagger_decorator_1.tags)(['Menu']),
    (0, koa_swagger_decorator_1.summary)('删除菜单'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MenuController, "deleteMenu", null);
__decorate([
    (0, koa_swagger_decorator_1.request)('put', '/menu/status/{id}'),
    (0, koa_swagger_decorator_1.tags)(['Menu']),
    (0, koa_swagger_decorator_1.summary)('切换菜单状态'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MenuController, "changeStatus", null);
