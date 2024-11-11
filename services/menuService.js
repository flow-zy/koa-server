"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const menuModel_1 = __importDefault(require("../model/menuModel"));
const roleMenuModel_1 = __importDefault(require("../model/roleMenuModel"));
const util_1 = require("../utils/util");
class MenuService {
    constructor() {
        // 将扁平数组转换为树状结构
        Object.defineProperty(this, "buildMenuTree", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (menus, parentId = null) => {
                const tree = [];
                menus.forEach((menu) => {
                    if (menu.parentid === parentId) {
                        const node = menu.toJSON();
                        const children = this.buildMenuTree(menus, menu.id);
                        // @ts-ignore
                        node.created_at = DateUtil.formatDateTime(node.created_at);
                        if (children.length) {
                            node.children = children;
                        }
                        tree.push(node);
                    }
                });
                return tree;
            }
        });
        Object.defineProperty(this, "getMenuList", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (params) => __awaiter(this, void 0, void 0, function* () {
                const { pagesize, pagenumber, startTime, endTime } = params, _params = __rest(params, ["pagesize", "pagenumber", "startTime", "endTime"]);
                const { limit, offset } = (0, util_1.getLimitAndOffset)(pagesize, pagenumber);
                const options = { limit, offset };
                const where = Object.assign({}, _params);
                // 添加时间范围过滤
                if (startTime && endTime) {
                    where.created_at = {
                        [sequelize_1.Op.between]: [new Date(startTime), new Date(endTime)]
                    };
                }
                else if (startTime) {
                    where.created_at = {
                        [sequelize_1.Op.gte]: new Date(startTime)
                    };
                }
                else if (endTime) {
                    where.created_at = {
                        [sequelize_1.Op.lte]: new Date(endTime)
                    };
                }
                if (Object.keys(_params).length > 0)
                    options.where = where;
                const { count, rows } = yield menuModel_1.default.findAndCountAll(Object.assign(Object.assign({}, options), { order: [['sort', 'DESC']], attributes: {
                        exclude: ['deleted_at', 'updated_at']
                    } }));
                // 将结果转换为树状结构
                const menuTree = this.buildMenuTree(rows);
                return {
                    total: count,
                    pagesize: params.pagesize,
                    pagenumber: params.pagenumber,
                    list: menuTree
                };
            })
        });
        Object.defineProperty(this, "getAllMenu", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: () => __awaiter(this, void 0, void 0, function* () {
                const menus = yield menuModel_1.default.findAll({
                    order: [['sort', 'DESC']],
                    attributes: {
                        exclude: ['deleted_at', 'updated_at']
                    }
                });
                // 返回树状结构
                return this.buildMenuTree(menus);
            })
        });
        Object.defineProperty(this, "addMenu", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (params) => __awaiter(this, void 0, void 0, function* () {
                // 如果有父级ID，检查父级菜单是否存在
                if (params.parentid) {
                    const parentMenu = yield menuModel_1.default.findOne({
                        where: {
                            id: params.parentid
                        }
                    });
                    if (!parentMenu)
                        return false;
                }
                // 检查同级菜单名是否重复
                const existMenu = yield menuModel_1.default.findOne({
                    where: {
                        name: params.name,
                        parentid: params.parentid || null
                    }
                });
                if (existMenu)
                    return false;
                const transaction = yield menuModel_1.default.sequelize.transaction();
                try {
                    const menu = yield menuModel_1.default.create(params, { transaction });
                    if (params.roles && params.roles.length > 0) {
                        yield roleMenuModel_1.default.bulkCreate(params.roles.map((roleId) => ({
                            menu_id: menu.id,
                            role_id: roleId
                        })), { transaction });
                    }
                    yield transaction.commit();
                    return true;
                }
                catch (error) {
                    yield transaction.rollback();
                    return false;
                }
            })
        });
        Object.defineProperty(this, "updateMenu", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (id, params) => __awaiter(this, void 0, void 0, function* () {
                // 检查是否修改了父级ID
                if (params.parentid !== undefined) {
                    // 不能将菜单设置为自己的子菜单
                    if (params.parentid === id)
                        return false;
                    // 检查新的父级菜单是否存在
                    if (params.parentid) {
                        const parentMenu = yield menuModel_1.default.findOne({
                            where: {
                                id: params.parentid
                            }
                        });
                        if (!parentMenu)
                            return false;
                    }
                }
                // 检查同级菜单名是否重复
                if (params.name) {
                    const existMenu = yield menuModel_1.default.findOne({
                        where: {
                            name: params.name,
                            parentid: params.parentid || null,
                            id: { [sequelize_1.Op.ne]: id }
                        }
                    });
                    if (existMenu)
                        return false;
                }
                const transaction = yield menuModel_1.default.sequelize.transaction();
                try {
                    const result = yield menuModel_1.default.update(params, {
                        where: { id },
                        transaction
                    });
                    if (params.roles) {
                        yield roleMenuModel_1.default.destroy({
                            where: { menu_id: id },
                            transaction
                        });
                        if (params.roles.length > 0) {
                            yield roleMenuModel_1.default.bulkCreate(params.roles.map((roleId) => ({
                                menu_id: id,
                                role_id: roleId
                            })), { transaction });
                        }
                    }
                    yield transaction.commit();
                    return result[0] > 0;
                }
                catch (error) {
                    yield transaction.rollback();
                    return false;
                }
            })
        });
        Object.defineProperty(this, "deleteMenu", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (id) => __awaiter(this, void 0, void 0, function* () {
                const transaction = yield menuModel_1.default.sequelize.transaction();
                try {
                    const result = yield menuModel_1.default.update({ status: 0 }, {
                        where: { id },
                        transaction
                    });
                    yield roleMenuModel_1.default.destroy({
                        where: { menu_id: id },
                        transaction
                    });
                    yield transaction.commit();
                    return result[0] > 0;
                }
                catch (error) {
                    yield transaction.rollback();
                    return false;
                }
            })
        });
        Object.defineProperty(this, "changeStatus", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (id) => __awaiter(this, void 0, void 0, function* () {
                // 先查询当前状态
                const menu = yield menuModel_1.default.findByPk(id);
                if (!menu)
                    return false;
                // 切换状态
                const newStatus = menu.dataValues.status === 1 ? 0 : 1;
                const result = yield menuModel_1.default.update({ status: newStatus }, { where: { id } });
                return result[0] > 0;
            })
        });
        // 判断有没有子级
        Object.defineProperty(this, "hasChildren", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (id) => __awaiter(this, void 0, void 0, function* () {
                const hasChildren = yield menuModel_1.default.findOne({
                    where: { parentid: id, status: 1 }
                });
                return hasChildren;
            })
        });
    }
}
exports.default = new MenuService();
