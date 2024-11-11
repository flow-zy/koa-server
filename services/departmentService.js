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
exports.departmentService = exports.DepartmentService = void 0;
const baseDao_1 = require("../dao/baseDao");
const departmentModel_1 = __importDefault(require("../model/departmentModel"));
const userModel_1 = __importDefault(require("../model/userModel"));
const sequelize_1 = require("sequelize");
const businessError_1 = require("../utils/businessError");
const user_1 = require("../enums/user");
class DepartmentService {
    /**
     * 获取部门列表
     */
    getList(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const { keyword, status } = params, restParams = __rest(params, ["keyword", "status"]);
            const queryParams = Object.assign(Object.assign({}, restParams), { where: Object.assign(Object.assign({}, (keyword && {
                    [sequelize_1.Op.or]: [
                        { name: { [sequelize_1.Op.like]: `%${keyword}%` } },
                        { code: { [sequelize_1.Op.like]: `%${keyword}%` } }
                    ]
                })), (status !== undefined && { status })), include: [
                    {
                        association: 'users',
                        attributes: ['id', 'username', 'nickname']
                    }
                ] });
            const result = yield baseDao_1.BaseDao.findByPage(departmentModel_1.default, queryParams);
            // 将列表数据转换为树形结构
            const treeData = this.buildDepartmentTree(result.list);
            return Object.assign(Object.assign({}, result), { list: treeData });
        });
    }
    /**
     * 构建部门树
     */
    buildDepartmentTree(deptList, parentId = null) {
        return deptList
            .filter((dept) => dept.parentid === parentId)
            .map((dept) => (Object.assign(Object.assign({}, dept), { children: this.buildDepartmentTree(deptList, dept.id) })))
            .sort((a, b) => a.sort - b.sort);
    }
    /**
     * 创建部门
     */
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            // 检查部门编码是否存在
            const exists = yield baseDao_1.BaseDao.findOne(departmentModel_1.default, {
                where: { code: data.code }
            });
            if (exists) {
                throw new businessError_1.BusinessError(user_1.UserMessage.DEPARTMENT_CODE_EXISTS);
            }
            // 如果有父级ID，检查父级是否存在
            if (data.parentid) {
                const parent = yield baseDao_1.BaseDao.findById(departmentModel_1.default, data.parentid);
                if (!parent) {
                    throw new businessError_1.BusinessError(user_1.UserMessage.PARENT_DEPARTMENT_NOT_FOUND);
                }
            }
            return yield baseDao_1.BaseDao.create(departmentModel_1.default, Object.assign(Object.assign({}, data), { status: (_a = data.status) !== null && _a !== void 0 ? _a : 1, sort: (_b = data.sort) !== null && _b !== void 0 ? _b : 1 }));
        });
    }
    /**
     * 更新部门
     */
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const dept = yield baseDao_1.BaseDao.findById(departmentModel_1.default, id);
            if (!dept) {
                throw new businessError_1.BusinessError(user_1.UserMessage.DEPARTMENT_NOT_FOUND);
            }
            // 检查部门编码是否与其他部门冲突
            if (data.code) {
                const exists = yield baseDao_1.BaseDao.findOne(departmentModel_1.default, {
                    where: {
                        code: data.code,
                        id: { [sequelize_1.Op.ne]: id }
                    }
                });
                if (exists) {
                    throw new businessError_1.BusinessError(user_1.UserMessage.DEPARTMENT_CODE_EXISTS);
                }
            }
            // 检查父级部门
            if (data.parentid) {
                if (data.parentid === id) {
                    throw new businessError_1.BusinessError(user_1.UserMessage.CANNOT_SET_SELF_AS_PARENT);
                }
                const parent = yield baseDao_1.BaseDao.findById(departmentModel_1.default, data.parentid);
                if (!parent) {
                    throw new businessError_1.BusinessError(user_1.UserMessage.PARENT_DEPARTMENT_NOT_FOUND);
                }
                // 检查是否设置为自己的子部门
                const children = yield this.getChildrenIds(id);
                if (children.includes(data.parentid)) {
                    throw new businessError_1.BusinessError(user_1.UserMessage.CANNOT_SET_CHILD_AS_PARENT);
                }
            }
            return yield baseDao_1.BaseDao.update(departmentModel_1.default, data, { id });
        });
    }
    /**
     * 获取所有子部门ID
     */
    getChildrenIds(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const allDepts = yield baseDao_1.BaseDao.findAll(departmentModel_1.default, {});
            const result = [];
            const findChildren = (parentId) => {
                const children = allDepts.list.filter((dept) => dept.parentid === parentId);
                children.forEach((child) => {
                    result.push(child.id);
                    findChildren(child.id);
                });
            };
            findChildren(id);
            return result;
        });
    }
    /**
     * 删除部门
     */
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            // 检查是否存在子部门
            const children = yield baseDao_1.BaseDao.findOne(departmentModel_1.default, {
                where: { parentid: id }
            });
            if (children) {
                throw new businessError_1.BusinessError(user_1.UserMessage.DEPARTMENT_HAS_CHILDREN);
            }
            // 检查是否有关联用户
            const users = yield baseDao_1.BaseDao.findOne(departmentModel_1.default, {
                where: { id },
                include: ['users']
            });
            if (users && ((_a = users.users) === null || _a === void 0 ? void 0 : _a.length) > 0) {
                throw new businessError_1.BusinessError(user_1.UserMessage.DEPARTMENT_HAS_USERS);
            }
            return yield baseDao_1.BaseDao.delete(departmentModel_1.default, { id });
        });
    }
    /**
     * 更新部门状态
     */
    updateStatus(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const dept = yield baseDao_1.BaseDao.findById(departmentModel_1.default, id);
            if (!dept) {
                throw new businessError_1.BusinessError(user_1.UserMessage.DEPARTMENT_NOT_FOUND);
            }
            const status = dept.status === 1 ? 0 : 1;
            return yield baseDao_1.BaseDao.update(departmentModel_1.default, { status }, { id });
        });
    }
    /**
     * 获取部门详情
     */
    getDetail(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const department = yield baseDao_1.BaseDao.findById(departmentModel_1.default, id, {
                include: [
                    {
                        model: userModel_1.default,
                        attributes: ['id', 'username', 'nickname', 'email', 'phone']
                    }
                ]
            });
            if (!department) {
                throw new businessError_1.BusinessError(user_1.UserMessage.DEPARTMENT_NOT_FOUND);
            }
            return department;
        });
    }
    /**
     * 获取部门下的用户
     */
    getDepartmentUsers(id, params) {
        return __awaiter(this, void 0, void 0, function* () {
            // 先检查部门是否存在
            const department = yield baseDao_1.BaseDao.findById(departmentModel_1.default, id);
            if (!department) {
                throw new businessError_1.BusinessError(user_1.UserMessage.DEPARTMENT_NOT_FOUND);
            }
            // 查询该部门下的用户
            return yield baseDao_1.BaseDao.findByPage(userModel_1.default, Object.assign(Object.assign({}, params), { where: { department_id: id }, attributes: [
                    'id',
                    'username',
                    'nickname',
                    'email',
                    'phone',
                    'status',
                    'created_at'
                ], order: [['created_at', 'DESC']] }));
        });
    }
}
exports.DepartmentService = DepartmentService;
exports.departmentService = new DepartmentService();
