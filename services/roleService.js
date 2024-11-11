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
const roleModel_1 = __importDefault(require("../model/roleModel"));
const util_1 = require("../utils/util");
const rolePermissionModel_1 = __importDefault(require("../model/rolePermissionModel"));
const permissionModel_1 = __importDefault(require("../model/permissionModel"));
class RoleService {
    constructor() {
        Object.defineProperty(this, "getRoleList", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (params) => __awaiter(this, void 0, void 0, function* () {
                const { pagesize, pagenumber, startTime, endTime, name } = params, _params = __rest(params, ["pagesize", "pagenumber", "startTime", "endTime", "name"]);
                const { limit, offset } = (0, util_1.getLimitAndOffset)(pagesize, pagenumber);
                const options = { limit, offset };
                const where = Object.assign(Object.assign({}, _params), { status: 1 });
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
                if (name) {
                    where.name = { [sequelize_1.Op.like]: `%${name}%` }; // 模糊查询
                }
                if (Object.keys(_params).length > 0)
                    options.where = where;
                const { count, rows } = yield roleModel_1.default.findAndCountAll(Object.assign(Object.assign({}, options), { order: [['sort', 'DESC']], attributes: {
                        exclude: ['deleted_at', 'updated_at']
                    } }));
                return {
                    total: count,
                    pagesize: params.pagesize,
                    pagenumber: params.pagenumber,
                    list: rows
                };
            })
        });
        Object.defineProperty(this, "getAllRole", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: () => __awaiter(this, void 0, void 0, function* () {
                return yield roleModel_1.default.findAll({
                    order: [['sort', 'DESC']],
                    attributes: {
                        exclude: ['deleted_at', 'updated_at']
                    }
                });
            })
        });
        Object.defineProperty(this, "addRole", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (params) => __awaiter(this, void 0, void 0, function* () {
                const existRole = yield roleModel_1.default.findOne({
                    where: {
                        name: params.name
                    }
                });
                if (existRole)
                    return false;
                const transaction = yield roleModel_1.default.sequelize.transaction();
                try {
                    const role = yield roleModel_1.default.create(params, { transaction });
                    if (params.permissions && params.permissions.length > 0) {
                        yield rolePermissionModel_1.default.bulkCreate(params.permissions.map((permissionId) => ({
                            role_id: role.id,
                            permission_id: permissionId
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
        Object.defineProperty(this, "deleteRole", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (id) => __awaiter(this, void 0, void 0, function* () {
                const transaction = yield roleModel_1.default.sequelize.transaction();
                try {
                    const roleResult = yield roleModel_1.default.destroy({
                        where: { id },
                        transaction
                    });
                    yield rolePermissionModel_1.default.destroy({
                        where: { role_id: id },
                        transaction
                    });
                    yield transaction.commit();
                    return roleResult;
                }
                catch (error) {
                    yield transaction.rollback();
                    return false;
                }
            })
        });
        Object.defineProperty(this, "updateRole", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (id, params) => __awaiter(this, void 0, void 0, function* () {
                if (params.name) {
                    const existRole = yield roleModel_1.default.findOne({
                        where: {
                            name: params.name,
                            id: { [sequelize_1.Op.ne]: id }
                        }
                    });
                    if (existRole)
                        return false;
                }
                const transaction = yield roleModel_1.default.sequelize.transaction();
                try {
                    const result = yield roleModel_1.default.update(params, {
                        where: { id },
                        transaction
                    });
                    if (params.permissions) {
                        yield rolePermissionModel_1.default.destroy({
                            where: { role_id: id },
                            transaction
                        });
                        if (params.permissions.length > 0) {
                            yield rolePermissionModel_1.default.bulkCreate(params.permissions.map((permissionId) => ({
                                role_id: id,
                                permission_id: permissionId
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
        Object.defineProperty(this, "changeStatus", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (id) => __awaiter(this, void 0, void 0, function* () {
                const role = yield roleModel_1.default.findByPk(id);
                if (!role)
                    return false;
                const newStatus = role.status === 1 ? 0 : 1;
                console.log(newStatus);
                const result = yield roleModel_1.default.update({ status: newStatus }, { where: { id } });
                return result[0] > 0;
            })
        });
    }
    getRoleDetail(id) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const role = yield roleModel_1.default.findOne({
                    where: { id },
                    include: [
                        {
                            model: permissionModel_1.default,
                            as: 'permissions',
                            through: { attributes: [] },
                            attributes: ['id', 'name', 'code', 'description']
                        }
                    ],
                    attributes: [
                        'id',
                        'name',
                        'nickname',
                        'status',
                        'sort',
                        'description',
                        'created_at',
                        'updated_at'
                    ]
                });
                if (!role)
                    return null;
                // 正确处理 Sequelize 模型实例
                const roleData = role instanceof roleModel_1.default ? role.toJSON() : role;
                // 格式化数据
                return Object.assign(Object.assign({}, roleData), { permissions: roleData.permissions || [], permissionIds: ((_a = roleData.permissions) === null || _a === void 0 ? void 0 : _a.map((p) => p.id)) || [] });
            }
            catch (error) {
                console.error('获取角色详情服务错误:', error);
                throw error;
            }
        });
    }
}
exports.default = new RoleService();
