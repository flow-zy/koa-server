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
const koa_swagger_decorator_1 = require("koa-swagger-decorator");
const errorUtil_1 = require("../utils/errorUtil");
const auth_1 = require("../enums/auth");
const authService_1 = __importDefault(require("../services/authService"));
const auth_2 = require("../middleware/auth");
const log4js_1 = require("../config/log4js");
const enums_1 = require("../enums");
const cryptoUtil_1 = require("../utils/cryptoUtil");
class AdminController {
    static login(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const { username, password } = ctx.request
                .query;
            try {
                // 参数验证
                errorUtil_1.ErrorUtil.assertParam(!!(username === null || username === void 0 ? void 0 : username.trim()), auth_1.AuthMessage.USERNAME_REQUIRED);
                errorUtil_1.ErrorUtil.assertParam(!!(password === null || password === void 0 ? void 0 : password.trim()), auth_1.AuthMessage.PASSWORD_REQUIRED);
                // 解密前端传来的密码
                const decryptedPassword = cryptoUtil_1.CryptoUtil.aesDecrypt(password);
                // 查找用户
                const user = yield authService_1.default.findByUsername(username);
                if (!user) {
                    errorUtil_1.ErrorUtil.throw(auth_1.AuthMessage.USER_NOT_FOUND);
                }
                // 验证密码 - 使用解密后的密码进行验证
                const isValid = yield (user === null || user === void 0 ? void 0 : user.validatePassword(decryptedPassword));
                if (!isValid) {
                    errorUtil_1.ErrorUtil.throw(auth_1.AuthMessage.PASSWORD_ERROR);
                }
                // 生成 token
                const token = (0, auth_2.generateToken)({
                    payload: {
                        ip: ctx.ip,
                        userId: user.id,
                        username: user.username
                    }
                }, auth_2.defaultOptions);
                const userInfo = yield authService_1.default.userLogin(user.username);
                const result = {
                    token: `Bearer ${token}`,
                    userInfo
                };
                log4js_1.logger.info('管理员登录成功', {
                    username,
                    ip: ctx.ip,
                    userAgent: ctx.get('user-agent')
                });
                return ctx.success(result, auth_1.AuthMessage.LOGIN_SUCCESS);
            }
            catch (err) {
                const error = err;
                log4js_1.logger.warn('管理员登录失败', {
                    username,
                    ip: ctx.ip,
                    error: error.message
                });
                throw error;
            }
        });
    }
    static register(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            const params = ctx.request.body;
            try {
                // 基本参数验证
                errorUtil_1.ErrorUtil.assertParam(!!((_a = params.username) === null || _a === void 0 ? void 0 : _a.trim()), auth_1.AuthMessage.USERNAME_REQUIRED);
                errorUtil_1.ErrorUtil.assertParam(!!((_b = params.password) === null || _b === void 0 ? void 0 : _b.trim()), auth_1.AuthMessage.PASSWORD_REQUIRED);
                errorUtil_1.ErrorUtil.assertParam(!!((_c = params.confirmPassword) === null || _c === void 0 ? void 0 : _c.trim()), auth_1.AuthMessage.CONFIRM_PASSWORD_REQUIRED);
                errorUtil_1.ErrorUtil.assertParam(params.password === params.confirmPassword, auth_1.AuthMessage.PASSWORD_NOT_MATCH);
                // 用户名格式验证
                errorUtil_1.ErrorUtil.assertParam(/^[a-zA-Z0-9_]{4,20}$/.test(params.username), auth_1.AuthMessage.USERNAME_FORMAT_ERROR);
                // 密码强度验证
                errorUtil_1.ErrorUtil.assertParam(/^[a-zA-Z0-9]{6,20}$/.test(params.password), auth_1.AuthMessage.PASSWORD_FORMAT_ERROR);
                // 邮箱格式验证（如果提供）
                if (params.email) {
                    errorUtil_1.ErrorUtil.assertParam(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(params.email), auth_1.AuthMessage.EMAIL_FORMAT_ERROR);
                }
                // 手机号格式验证（如果提供）
                if (params.phone) {
                    errorUtil_1.ErrorUtil.assertParam(/^1[3-9]\d{9}$/.test(params.phone), auth_1.AuthMessage.PHONE_FORMAT_ERROR);
                }
                // 检查用户名是否已存在
                const existingUser = yield authService_1.default.findByUsername(params.username);
                if (existingUser) {
                    errorUtil_1.ErrorUtil.throw(auth_1.AuthMessage.USER_EXISTS);
                }
                const { confirmPassword } = params, userInfo = __rest(params
                // 创建用户
                , ["confirmPassword"]);
                // 创建用户
                const user = yield authService_1.default.create(userInfo);
                // 返回结果
                const result = {
                    userInfo: user
                };
                // 记录注册日志
                log4js_1.logger.info('管理员注册成功', {
                    username: params.username,
                    ip: ctx.ip
                });
                return ctx.success(result, auth_1.AuthMessage.REGISTER_SUCCESS);
            }
            catch (err) {
                const error = err;
                // 记录失败日志
                log4js_1.logger.error('管理员注册失败', {
                    username: params.username,
                    ip: ctx.ip,
                    error: error.message
                });
                throw error;
            }
        });
    }
    static getInfo(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { userId } = ctx.state.user;
                const user = yield authService_1.default.findById(userId);
                if (!user) {
                    errorUtil_1.ErrorUtil.throw(auth_1.AuthMessage.USER_NOT_FOUND);
                }
                const userInfo = {
                    id: user.id,
                    username: user.username,
                    nickname: user.nickname,
                    email: user.email,
                    phone: user.phone,
                    avatar: user.avatar,
                    roles: user.roles
                };
                return ctx.success(userInfo);
            }
            catch (err) {
                const error = err;
                log4js_1.logger.error('获取管理员信息失败', {
                    userId: (_a = ctx.state.user) === null || _a === void 0 ? void 0 : _a.id,
                    error: error.message
                });
                throw error;
            }
        });
    }
    static logout(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const token = (_a = ctx.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
                if (token) {
                    // 将token加入黑名单
                }
                ctx.success(null, enums_1.UserMessage.LOGOUT_SUCCESS);
            }
            catch (error) {
                ctx.error(enums_1.UserMessage.LOGOUT_ERROR);
            }
        });
    }
}
exports.default = AdminController;
__decorate([
    (0, koa_swagger_decorator_1.request)('get', '/login'),
    (0, koa_swagger_decorator_1.tags)(['管理员']),
    (0, koa_swagger_decorator_1.summary)('管理员登录'),
    (0, koa_swagger_decorator_1.query)({
        username: {
            type: 'string',
            required: true,
            description: '用户名/邮箱/手机号'
        },
        password: { type: 'string', required: true, description: '密码' }
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController, "login", null);
__decorate([
    (0, koa_swagger_decorator_1.request)('post', '/register'),
    (0, koa_swagger_decorator_1.tags)(['管理员']),
    (0, koa_swagger_decorator_1.summary)('管理员注册'),
    (0, koa_swagger_decorator_1.body)({
        username: { type: 'string', required: true, description: '用户名' },
        password: { type: 'string', required: true, description: '密码' },
        confirmPassword: {
            type: 'string',
            required: true,
            description: '确认密码'
        },
        email: { type: 'string', required: false, description: '邮箱' },
        phone: { type: 'string', required: false, description: '手机号' },
        nickname: { type: 'string', required: false, description: '昵称' },
        roles: { type: 'array', required: false, description: '角色' }
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController, "register", null);
__decorate([
    (0, koa_swagger_decorator_1.request)('get', '/admin/info'),
    (0, koa_swagger_decorator_1.tags)(['管理员']),
    (0, koa_swagger_decorator_1.summary)('获取管理员信息'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController, "getInfo", null);
__decorate([
    (0, koa_swagger_decorator_1.request)('get', '/logout'),
    (0, koa_swagger_decorator_1.tags)(['管理员']),
    (0, koa_swagger_decorator_1.summary)('退出登录'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController, "logout", null);
