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
const roleModel_1 = __importDefault(require("../model/roleModel"));
const userModel_1 = __importDefault(require("../model/userModel"));
const auth_1 = require("../utils/auth");
const userModel_2 = __importDefault(require("../model/userModel"));
const util_1 = require("../utils/util");
const roleUserModel_1 = __importDefault(require("../model/roleUserModel"));
const sequelize_1 = require("sequelize");
const dataUtil_1 = require("../utils/dataUtil");
class UserService {
    constructor() {
        // 查找用户用户名查找用户
        Object.defineProperty(this, "findByUsername", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (username) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const user = yield userModel_2.default.findOne({
                        where: { username },
                        include: [
                            {
                                model: roleModel_1.default,
                                as: 'roles',
                                through: { attributes: [] },
                                attributes: ['id', 'name']
                            }
                        ]
                    });
                    return user ? dataUtil_1.DataUtil.toJSON(user) : null;
                }
                catch (error) {
                    console.error('通过用户名查询用户错误:', error);
                    throw error;
                }
            })
        });
        // 通过用户名id查找用户
        Object.defineProperty(this, "findById", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (id) => __awaiter(this, void 0, void 0, function* () {
                const userInfo = yield userModel_1.default.findOne({
                    where: { id },
                    attributes: {
                        exclude: ['password', 'deleted_at']
                    }
                });
                return userInfo === null || userInfo === void 0 ? void 0 : userInfo.dataValues;
            })
        });
        // 修改用户状态
        Object.defineProperty(this, "updStatus", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (id) => __awaiter(this, void 0, void 0, function* () {
                const user = yield userModel_1.default.findOne({ where: { id } });
                if (!user)
                    return false;
                const status = user.dataValues.status === 1 ? 0 : 1;
                return yield userModel_1.default.update({ status }, {
                    where: { id }
                });
            })
        });
        // 查找全部用户列表
        Object.defineProperty(this, "getAllUser", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (params) => __awaiter(this, void 0, void 0, function* () {
                const { pagesize, pagenumber, startTime, endTime, username } = params, _params = __rest(params, ["pagesize", "pagenumber", "startTime", "endTime", "username"]);
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
                if (username)
                    where.username = { [sequelize_1.Op.like]: `%${username}%` }; // 模糊查询
                if (Object.keys(_params).length > 0)
                    options.where = where;
                const { count, rows } = yield userModel_1.default.findAndCountAll(Object.assign(Object.assign({}, options), { order: [['sort', 'DESC']], attributes: {
                        exclude: ['password', 'deleted_at']
                    }, include: [
                        {
                            model: roleModel_1.default,
                            attributes: ['id', 'name'],
                            through: { attributes: [] }
                        }
                    ] }));
                const list = rows.map((item) => {
                    var _a;
                    item = item.toJSON();
                    // @ts-ignore
                    item.avatar = ((_a = item.avatar) === null || _a === void 0 ? void 0 : _a.split(',')) || [];
                    if (item.roles &&
                        Array.isArray(item.roles) &&
                        item.roles.length === 0) {
                        // @ts-ignore
                        item.roles = null;
                    }
                    return item;
                });
                return {
                    total: count,
                    pagesize: params.pagesize,
                    pagenumber: params.pagenumber,
                    list: list
                };
            })
        });
        Object.defineProperty(this, "updUserInfo", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (params) => __awaiter(this, void 0, void 0, function* () {
                const { id, roles, avatar } = params, option = __rest(params, ["id", "roles", "avatar"]);
                const user = yield userModel_1.default.findByPk(id);
                if (!user)
                    return false;
                // @ts-ignore
                yield user.addRoles(roles);
                return yield user.update(Object.assign(Object.assign({}, option), { avatar: avatar.toString() }), { where: { id } });
            })
        });
        // 批量删除
        Object.defineProperty(this, "batchDelete", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (ids) => __awaiter(this, void 0, void 0, function* () {
                return yield userModel_2.default.destroy({
                    where: {
                        id: { [sequelize_1.Op.in]: ids }
                    }
                });
            })
        });
        // 给用户添加角色
        Object.defineProperty(this, "updUserRole", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (id, roles) => __awaiter(this, void 0, void 0, function* () {
                const options = roles.map((roleId) => ({
                    user_id: id,
                    role_id: roleId
                }));
                return yield roleUserModel_1.default.bulkCreate(options);
            })
        });
        // 修改密码
        Object.defineProperty(this, "updPassword", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (params) => __awaiter(this, void 0, void 0, function* () {
                params.password = (0, auth_1.encrypt)(params.password);
                return yield userModel_1.default.update({ password: params.password }, { where: { id: params.id } });
            })
        });
        // 修改用户头像
        Object.defineProperty(this, "updAvatar", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (id, avatar) => __awaiter(this, void 0, void 0, function* () {
                return yield userModel_1.default.update({ avatar }, { where: { id } });
            })
        });
        Object.defineProperty(this, "addUser", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (data) => __awaiter(this, void 0, void 0, function* () {
                var _a;
                try {
                    // 设置默认密码
                    data.password = (0, auth_1.encrypt)('123456');
                    const { roles } = data, userInfo = __rest(data, ["roles"]);
                    const users = yield userModel_1.default.create(Object.assign(Object.assign({}, userInfo), { avatar: (_a = userInfo.avatar) === null || _a === void 0 ? void 0 : _a.toString() }));
                    // @ts-ignore
                    yield users.setRoles(roles);
                    users.save();
                    return users;
                }
                catch (error) {
                    console.log(error);
                    return false;
                }
            })
        });
    }
    getUserInfo(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield userModel_2.default.findOne({
                    where: { id },
                    include: [
                        {
                            model: roleModel_1.default,
                            as: 'roles',
                            through: { attributes: [] },
                            attributes: ['id', 'name']
                        }
                    ],
                    attributes: {
                        exclude: ['password', 'deleted_at'] // 排除密码字段
                    }
                });
                if (!user)
                    return null;
                // 使用 DataUtil 处理数据
                const userData = dataUtil_1.DataUtil.toJSON(user);
                return Object.assign(Object.assign({}, userData), { roles: userData.roles || [] });
            }
            catch (error) {
                console.error('获取用户信息错误:', error);
                throw error;
            }
        });
    }
}
exports.default = new UserService();
