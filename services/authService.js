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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userModel_1 = __importDefault(require("../model/userModel"));
const roleModel_1 = __importDefault(require("../model/roleModel"));
const menuModel_1 = __importDefault(require("../model/menuModel"));
const permissionModel_1 = __importDefault(require("../model/permissionModel"));
const dataUtil_1 = require("../utils/dataUtil");
class AuthService {
    findByUsername(username) {
        return __awaiter(this, void 0, void 0, function* () {
            return userModel_1.default.findOne({
                where: { username }
            });
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return userModel_1.default.findByPk(id);
        });
    }
    userLogin(username) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield userModel_1.default.findOne({
                where: { username },
                include: [
                    {
                        model: roleModel_1.default,
                        include: [
                            {
                                model: menuModel_1.default,
                                through: { attributes: [] },
                                attributes: {
                                    exclude: ['deleted_at', 'updated_at']
                                },
                                where: { status: 1 },
                                required: false
                            },
                            {
                                model: permissionModel_1.default,
                                through: { attributes: [] },
                                attributes: ['id', 'name', 'code'],
                                where: { status: 1 },
                                required: false
                            }
                        ]
                    }
                ]
            });
            if (!user)
                return null;
            const userData = dataUtil_1.DataUtil.toJSON(user);
            const roles = userData.roles || [];
            const menusSet = new Set();
            const menus = roles.reduce((acc, role) => {
                var _a;
                (_a = role.menus) === null || _a === void 0 ? void 0 : _a.forEach((menu) => {
                    if (!menusSet.has(menu.id)) {
                        menusSet.add(menu.id);
                        acc.push(menu);
                    }
                });
                return acc;
            }, []);
            const permissionsSet = new Set();
            const permissions = roles.reduce((acc, role) => {
                var _a;
                (_a = role.permissions) === null || _a === void 0 ? void 0 : _a.forEach((permission) => {
                    if (!permissionsSet.has(permission.id)) {
                        permissionsSet.add(permission.id);
                        acc.push(permission);
                    }
                });
                return acc;
            }, []);
            const menuTree = this.buildMenuTree(menus);
            return {
                id: userData.id,
                username: userData.username,
                nickname: userData.nickname,
                email: userData.email,
                phone: userData.phone,
                avatar: userData.avatar,
                roles: roles.map((role) => ({
                    id: role.id,
                    name: role.name,
                    nickname: role.nickname
                })),
                menus: menuTree,
                permissions: permissions.map((p) => p.code)
            };
        });
    }
    buildMenuTree(menus, parentId = null) {
        return menus
            .filter((menu) => menu.parentid === parentId)
            .map((menu) => (Object.assign(Object.assign({}, menu), { children: this.buildMenuTree(menus, menu.id) })))
            .sort((a, b) => a.sort - b.sort);
    }
    create(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            return userModel_1.default.create(userData);
        });
    }
}
exports.default = new AuthService();
