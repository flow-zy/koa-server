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
const useServices_1 = __importDefault(require("../services/useServices"));
const enums_1 = require("../enums");
const auth_1 = require("../utils/auth");
const log4js_1 = require("../config/log4js");
const roleUserModel_1 = __importDefault(require("../model/roleUserModel"));
const cryptoUtil_1 = require("../utils/cryptoUtil");
class UserController {
    static getInfo(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = ctx.params;
            try {
                let res = yield useServices_1.default.getUserInfo(params.id);
                if (Object.keys(res).length <= 0)
                    return ctx.error(enums_1.UserMessage.USER_NOT_EXIST);
                return ctx.success(res, enums_1.UserMessage.USER_INFO_SUCCESS);
            }
            catch (error) {
                throw ctx.error(enums_1.HttpError.HTTP);
            }
        });
    }
    static updateStatus(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = ctx.request.body;
            try {
                const res = yield useServices_1.default.updStatus(params.id);
                if (!res)
                    return ctx.error(enums_1.UserMessage.USER_STATUS_ERROR);
                return ctx.success(null, enums_1.UserMessage.USER_STATUS_SUCCESS);
            }
            catch (error) {
                throw ctx.error(enums_1.HttpError.HTTP);
            }
        });
    }
    static getAllUser(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = ctx.request.query;
            try {
                const res = yield useServices_1.default.getAllUser((0, auth_1.filterObject)(params));
                if (res)
                    return ctx.success(res, enums_1.UserMessage.USER_LIST_SUCCESS);
                return ctx.error(enums_1.UserMessage.USER_LIST_ERROR);
            }
            catch (error) {
                throw ctx.error(enums_1.HttpError.HTTP);
            }
        });
    }
    static updUserInfo(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = ctx.request.body;
            const existUser = yield useServices_1.default.findByUsername(params.username);
            if (!existUser) {
                return ctx.error(enums_1.UserMessage.USER_NOT_EXIST);
            }
            try {
                const res = yield useServices_1.default.updUserInfo(params);
                if (!res)
                    return ctx.error(enums_1.UserMessage.USER_UPD_INFO_ERROR);
                return ctx.success(null, enums_1.UserMessage.USER_UPD_INFO_SUCCESS);
            }
            catch (error) {
                throw ctx.error(enums_1.HttpError.HTTP);
            }
        });
    }
    // 批量删除用户
    static batchDelete(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = ctx.params;
            try {
                const ids = params.ids.split(',').map(Number);
                const res = yield useServices_1.default.batchDelete(ids);
                if (!res)
                    return ctx.error(enums_1.UserMessage.USER_BATCH_USER_ERROR);
                return ctx.success(null, enums_1.UserMessage.USER_BATCH_USER_SUCCESS);
            }
            catch (error) {
                throw ctx.error(enums_1.HttpError.HTTP);
            }
        });
    }
    // 给用户增加角色
    static updUserRole(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = ctx.request.body;
            try {
                const id = ctx.params.id;
                const res = yield useServices_1.default.updUserRole(id, params.roles);
                if (res)
                    return ctx.error(enums_1.UserMessage.USER_ROLE_ERROR);
                return ctx.success(null, enums_1.UserMessage.USER_ROLE_SUCCESS);
            }
            catch (error) {
                throw ctx.error(enums_1.HttpError.HTTP);
            }
        });
    }
    // 重置密码
    static updPassword(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id = 1 } = ctx.params;
            const { password = '' } = ctx.request.body;
            try {
                const res = yield useServices_1.default.updPassword({ id, password });
                if (!res)
                    return ctx.error(enums_1.UserMessage.USER_PASSWORD_ERROR);
                return ctx.success(null, enums_1.UserMessage.USER_PASSWORD_SUCCESS);
            }
            catch (error) {
                throw ctx.error(enums_1.HttpError.HTTP);
            }
        });
    }
    // 修改用户头像
    static updAvatar(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { id } = ctx.params;
            try {
                const res = yield useServices_1.default.updAvatar(id, (_a = ctx.request.body) === null || _a === void 0 ? void 0 : _a.avatar);
                if (!res)
                    return ctx.error(enums_1.UserMessage.USER_AVATAR_ERROR);
                return ctx.success(null, enums_1.UserMessage.USER_AVATAR_SUCCESS);
            }
            catch (err) {
                throw ctx.error(enums_1.HttpError.HTTP);
            }
        });
    }
    // 添加用户
    static addUser(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const requestBody = ctx.request.body;
            // 参数验证
            if (!((_a = requestBody.username) === null || _a === void 0 ? void 0 : _a.trim())) {
                return ctx.error(enums_1.UserMessage.USERNAME_REQUIRED);
            }
            // 检查用户名是否存在
            const existUser = yield useServices_1.default.findByUsername(requestBody.username);
            if (existUser) {
                return ctx.error(enums_1.UserMessage.USER_EXIST);
            }
            // 查询超级管理员是否存在
            const hasSuper = (yield roleUserModel_1.default.findAll()).some((item) => {
                return item.role_id === 1;
            });
            // @ts-ignore
            if (hasSuper && ((_b = requestBody.roles) === null || _b === void 0 ? void 0 : _b.includes(1)))
                return ctx.error(enums_1.UserMessage.SUPER_EXIT);
            try {
                const res = yield useServices_1.default.addUser(requestBody);
                if (!res)
                    return ctx.error(enums_1.UserMessage.USER_ADD_ERROR);
                log4js_1.logger.info(`用户${requestBody.username}添加成功`, {
                    username: requestBody.username,
                    ip: ctx.ip,
                    userAgent: ctx.get('user-agent')
                });
                return ctx.success(null, enums_1.UserMessage.USER_ADD_SUCCESS);
            }
            catch (err) {
                const error = err;
                log4js_1.logger.error(error.message);
                throw ctx.send(enums_1.HttpError.HTTP, 500);
            }
        });
    }
    static getProfile(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = ctx.state.user;
                const user = yield useServices_1.default.findById(userId);
                if (!user) {
                    return ctx.error(enums_1.UserMessage.USER_NOT_EXIST);
                }
                const result = {
                    id: user.id,
                    username: user.username,
                    nickname: user.nickname,
                    email: user.email,
                    phone: user.phone,
                    avatar: user.avatar,
                    gender: user.gender,
                    department: user.department,
                    roles: user.roles
                };
                return ctx.success(result, enums_1.UserMessage.USER_INFO_SUCCESS);
            }
            catch (error) {
                log4js_1.logger.error('获取个人信息失败:', error);
                return ctx.error(enums_1.UserMessage.USER_INFO_ERROR);
            }
        });
    }
    static updateProfile(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = ctx.state.user;
                const updateData = ctx.request.body;
                // 邮箱格式验证
                if (updateData.email &&
                    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(updateData.email)) {
                    return ctx.error(enums_1.UserMessage.EMAIL_FORMAT_ERROR);
                }
                // 手机号格式验证
                if (updateData.phone && !/^1[3-9]\d{9}$/.test(updateData.phone)) {
                    return ctx.error(enums_1.UserMessage.PHONE_FORMAT_ERROR);
                }
                const result = yield useServices_1.default.updUserInfo(Object.assign({ id: userId }, updateData));
                if (!result) {
                    return ctx.error(enums_1.UserMessage.USER_UPD_INFO_ERROR);
                }
                return ctx.success(null, enums_1.UserMessage.USER_UPD_INFO_SUCCESS);
            }
            catch (error) {
                log4js_1.logger.error('更新个人信息失败:', error);
                return ctx.error(enums_1.UserMessage.USER_UPD_INFO_ERROR);
            }
        });
    }
    static updatePassword(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = ctx.state.user;
                const { oldPassword, newPassword, confirmPassword } = ctx.request.body;
                // 参数验证
                if (!(oldPassword === null || oldPassword === void 0 ? void 0 : oldPassword.trim()) ||
                    !(newPassword === null || newPassword === void 0 ? void 0 : newPassword.trim()) ||
                    !(confirmPassword === null || confirmPassword === void 0 ? void 0 : confirmPassword.trim())) {
                    return ctx.error(enums_1.UserMessage.PASSWORD_REQUIRED);
                }
                // 新密码与确认密码是否一致
                if (newPassword !== confirmPassword) {
                    return ctx.error(enums_1.UserMessage.PASSWORD_NOT_MATCH);
                }
                // 密码格式验证（至少6位，包含数字和字母）
                if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,20}$/.test(newPassword)) {
                    return ctx.error(enums_1.UserMessage.PASSWORD_FORMAT_ERROR);
                }
                // 解密密码
                const decryptedOldPassword = cryptoUtil_1.CryptoUtil.aesDecrypt(oldPassword);
                const decryptedNewPassword = cryptoUtil_1.CryptoUtil.aesDecrypt(newPassword);
                // 验证旧密码
                const user = yield useServices_1.default.findById(userId);
                if (!user) {
                    return ctx.error(enums_1.UserMessage.USER_NOT_EXIST);
                }
                const isValidOldPassword = yield user.validatePassword(decryptedOldPassword);
                if (!isValidOldPassword) {
                    return ctx.error(enums_1.UserMessage.OLD_PASSWORD_ERROR);
                }
                // 更新密码
                const result = yield useServices_1.default.updPassword({
                    id: userId,
                    password: decryptedNewPassword
                });
                if (!result) {
                    return ctx.error(enums_1.UserMessage.USER_PASSWORD_ERROR);
                }
                return ctx.success(null, enums_1.UserMessage.USER_PASSWORD_SUCCESS);
            }
            catch (error) {
                log4js_1.logger.error('修改密码失败:', error);
                return ctx.error(enums_1.UserMessage.USER_PASSWORD_ERROR);
            }
        });
    }
    static updateAvatar(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { userId } = ctx.state.user;
                const file = (_a = ctx.request.files) === null || _a === void 0 ? void 0 : _a.avatar;
                if (!file) {
                    return ctx.error(enums_1.UserMessage.AVATAR_UPLOAD_ERROR);
                }
                // 验证文件类型
                const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
                // @ts-ignore
                if (!allowedTypes.includes(file.mimetype)) {
                    return ctx.error(enums_1.UserMessage.AVATAR_TYPE_ERROR);
                }
                // 验证文件大小（2MB）
                // @ts-ignore
                if (file.size > 2 * 1024 * 1024) {
                    return ctx.error(enums_1.UserMessage.AVATAR_SIZE_ERROR);
                }
                // 获取文件路径
                // @ts-ignore
                const filePath = Array.isArray(file)
                    ? file[0].filepath
                    : file.filepath;
                // 直接使用 updAvatar 方法
                const result = yield useServices_1.default.updAvatar(userId, filePath);
                if (!result) {
                    return ctx.error(enums_1.UserMessage.USER_AVATAR_ERROR);
                }
                return ctx.success({ avatarUrl: result }, enums_1.UserMessage.USER_AVATAR_SUCCESS);
            }
            catch (error) {
                log4js_1.logger.error('更新头像失败:', error);
                return ctx.error(enums_1.UserMessage.USER_AVATAR_ERROR);
            }
        });
    }
}
exports.default = UserController;
__decorate([
    (0, koa_swagger_decorator_1.request)('get', '/user/info/{id}'),
    (0, koa_swagger_decorator_1.summary)(['用户信息']),
    (0, koa_swagger_decorator_1.tags)(['用户管理']),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController, "getInfo", null);
__decorate([
    (0, koa_swagger_decorator_1.request)('put', '/user/status'),
    (0, koa_swagger_decorator_1.summary)(['用户状态']),
    (0, koa_swagger_decorator_1.tags)(['用户管理']),
    (0, koa_swagger_decorator_1.query)({
        id: { type: 'number', require: true, description: '用户id' }
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController, "updateStatus", null);
__decorate([
    (0, koa_swagger_decorator_1.request)('get', '/user/list'),
    (0, koa_swagger_decorator_1.summary)(['用户列表']),
    (0, koa_swagger_decorator_1.tags)(['用户管理']),
    (0, koa_swagger_decorator_1.query)({
        pagesize: { type: 'number', require: true, description: '每页条数' },
        pagenumber: { type: 'number', require: true, description: '页码' },
        username: { type: 'string', require: false },
        startTime: { type: 'string', require: false },
        endTime: { type: 'date', require: false }
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController, "getAllUser", null);
__decorate([
    (0, koa_swagger_decorator_1.summary)(['修改用户信息']),
    (0, koa_swagger_decorator_1.request)('put', '/user/upd/info'),
    (0, koa_swagger_decorator_1.tags)(['用户管理']),
    (0, koa_swagger_decorator_1.body)({
        id: { type: 'number', required: true, description: '用户id' },
        username: { type: 'string', required: true, description: '用户名' },
        gender: { type: 'number', required: false, description: '性别' },
        roles: { type: 'array<number>', required: false, description: '角色' }
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController, "updUserInfo", null);
__decorate([
    (0, koa_swagger_decorator_1.request)('delete', '/user/batch/delete/{ids}'),
    (0, koa_swagger_decorator_1.summary)(['批量删除用户']),
    (0, koa_swagger_decorator_1.tags)(['用户管理']),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController, "batchDelete", null);
__decorate([
    (0, koa_swagger_decorator_1.request)('put', '/user/role/{id}'),
    (0, koa_swagger_decorator_1.summary)(['用户角色设置']),
    (0, koa_swagger_decorator_1.tags)(['用户管理']),
    (0, koa_swagger_decorator_1.query)({
        roles: {
            type: 'array<number>',
            required: true,
            description: '角色id'
        }
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController, "updUserRole", null);
__decorate([
    (0, koa_swagger_decorator_1.request)('put', '/user/updpwd/{id}'),
    (0, koa_swagger_decorator_1.body)({
        password: { type: 'string', required: true, description: '用户密码' }
    }),
    (0, koa_swagger_decorator_1.tags)(['用户管理']),
    (0, koa_swagger_decorator_1.summary)(['重置密码']),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController, "updPassword", null);
__decorate([
    (0, koa_swagger_decorator_1.request)('put', '/user/avatar/{id}'),
    (0, koa_swagger_decorator_1.body)({
        avatar: { type: 'string', required: true, description: '头像' }
    }),
    (0, koa_swagger_decorator_1.tags)(['用户管理']),
    (0, koa_swagger_decorator_1.summary)(['修改用户头像']),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController, "updAvatar", null);
__decorate([
    (0, koa_swagger_decorator_1.request)('post', '/user/add'),
    (0, koa_swagger_decorator_1.summary)(['添加用户']),
    (0, koa_swagger_decorator_1.tags)(['用户管理']),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController, "addUser", null);
__decorate([
    (0, koa_swagger_decorator_1.request)('get', '/user/profile'),
    (0, koa_swagger_decorator_1.tags)(['个人中心']),
    (0, koa_swagger_decorator_1.summary)('获取个人信息'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController, "getProfile", null);
__decorate([
    (0, koa_swagger_decorator_1.request)('put', '/user/profile'),
    (0, koa_swagger_decorator_1.tags)(['个人中心']),
    (0, koa_swagger_decorator_1.summary)('更新个人信息'),
    (0, koa_swagger_decorator_1.body)({
        nickname: { type: 'string', required: false },
        email: { type: 'string', required: false },
        phone: { type: 'string', required: false },
        avatar: { type: 'string', required: false },
        gender: { type: 'number', required: false }
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController, "updateProfile", null);
__decorate([
    (0, koa_swagger_decorator_1.request)('put', '/user/password'),
    (0, koa_swagger_decorator_1.tags)(['个人中心']),
    (0, koa_swagger_decorator_1.summary)('修改密码'),
    (0, koa_swagger_decorator_1.body)({
        oldPassword: { type: 'string', required: true },
        newPassword: { type: 'string', required: true },
        confirmPassword: { type: 'string', required: true }
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController, "updatePassword", null);
__decorate([
    (0, koa_swagger_decorator_1.request)('post', '/user/avatar'),
    (0, koa_swagger_decorator_1.tags)(['个人中心']),
    (0, koa_swagger_decorator_1.summary)('更新头像'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController, "updateAvatar", null);
