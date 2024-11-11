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
exports.UserService = void 0;
const baseDao_1 = require("../dao/baseDao");
const userModel_1 = __importDefault(require("../model/userModel"));
const sequelize_1 = require("sequelize");
const dateUtil_1 = require("../utils/dateUtil");
class UserService {
    /**
     * 获取用户列表
     */
    getList(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const { keyword, status, startTime, endTime } = params, restParams = __rest(params, ["keyword", "status", "startTime", "endTime"]);
            const queryParams = Object.assign(Object.assign({}, restParams), { where: Object.assign(Object.assign(Object.assign({}, (keyword && {
                    [sequelize_1.Op.or]: [
                        { username: { [sequelize_1.Op.like]: `%${keyword}%` } },
                        { email: { [sequelize_1.Op.like]: `%${keyword}%` } },
                        { nickname: { [sequelize_1.Op.like]: `%${keyword}%` } }
                    ]
                })), (status !== undefined && { status })), (startTime &&
                    endTime && {
                    created_at: {
                        [sequelize_1.Op.between]: [
                            dateUtil_1.DateUtil.formatDate(new Date(startTime)),
                            dateUtil_1.DateUtil.formatDate(new Date(endTime))
                        ]
                    }
                })), include: [
                    {
                        association: 'roles',
                        attributes: ['id', 'name', 'nickname']
                    }
                ] });
            return yield baseDao_1.BaseDao.findByPage(userModel_1.default, queryParams);
        });
    }
    /**
     * 创建用户
     */
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield baseDao_1.BaseDao.create(userModel_1.default, data);
        });
    }
    /**
     * 更新用户
     */
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield baseDao_1.BaseDao.update(userModel_1.default, data, { id });
        });
    }
    /**
     * 删除用户
     */
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield baseDao_1.BaseDao.delete(userModel_1.default, { id });
        });
    }
    /**
     * 获取用户详情
     */
    getDetail(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield baseDao_1.BaseDao.findById(userModel_1.default, id, {
                include: [
                    {
                        association: 'roles',
                        attributes: ['id', 'name']
                    }
                ]
            });
        });
    }
}
exports.UserService = UserService;
