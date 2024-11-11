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
exports.permissionService = void 0;
const sequelize_1 = require("sequelize");
const dataUtil_1 = require("../utils/dataUtil");
const businessError_1 = require("../utils/businessError");
const permissionMessage_1 = require("../enums/permissionMessage");
const permissionModel_1 = __importDefault(require("../model/permissionModel"));
class PermissionService {
    /**
     * 检查权限是否存在
     */
    checkPermissionExists(code, excludeId) {
        return __awaiter(this, void 0, void 0, function* () {
            const where = { code };
            // 如果是更新操作，排除当前ID
            if (excludeId) {
                where.id = { [sequelize_1.Op.ne]: excludeId };
            }
            const existingPermission = yield permissionModel_1.default.findOne({ where });
            return !!existingPermission;
        });
    }
    /**
     * 创建权限
     */
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            // 检查必要字段
            if (!data.name || !data.code) {
                throw new businessError_1.BusinessError(permissionMessage_1.PermissionMessage.INVALID_PARAMS);
            }
            // 检查权限码是否已存在
            const exists = yield this.checkPermissionExists(data.code);
            if (exists) {
                throw new businessError_1.BusinessError(permissionMessage_1.PermissionMessage.CODE_EXISTS);
            }
            try {
                const permission = yield permissionModel_1.default.create({
                    name: data.name,
                    code: data.code,
                    description: data.description,
                    status: (_a = data.status) !== null && _a !== void 0 ? _a : 1, // 默认启用
                    sort: (_b = data.sort) !== null && _b !== void 0 ? _b : 0 // 默认排序值
                });
                return dataUtil_1.DataUtil.toJSON(permission);
            }
            catch (error) {
                console.error('创建权限错误:', error);
                throw new businessError_1.BusinessError(permissionMessage_1.PermissionMessage.CREATE_ERROR);
            }
        });
    }
    /**
     * 更新权限
     */
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const permission = yield permissionModel_1.default.findByPk(id);
            if (!permission) {
                throw new businessError_1.BusinessError(permissionMessage_1.PermissionMessage.NOT_EXIST);
            }
            // 如果要更新权限码，检查是否与其他权限冲突
            if (data.code && data.code !== permission.code) {
                const exists = yield this.checkPermissionExists(data.code, id);
                if (exists) {
                    throw new businessError_1.BusinessError(permissionMessage_1.PermissionMessage.CODE_EXISTS);
                }
            }
            try {
                yield permission.update(Object.assign(Object.assign({}, data), { updated_at: new Date() }));
                return dataUtil_1.DataUtil.toJSON(permission);
            }
            catch (error) {
                console.error('更新权限错误:', error);
                throw new businessError_1.BusinessError(permissionMessage_1.PermissionMessage.UPDATE_ERROR);
            }
        });
    }
    /**
     * 删除权限
     */
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const permission = yield permissionModel_1.default.findByPk(id);
            if (!permission)
                return false;
            yield permission.destroy();
            return true;
        });
    }
    /**
     * 获取权限详情
     */
    getDetail(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const permission = yield permissionModel_1.default.findByPk(id);
            return permission ? dataUtil_1.DataUtil.toJSON(permission) : null;
        });
    }
    /**
     * 获取权限列表
     */
    getList(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const { current = 1, pageSize = 10, name, code, status, startTime, endTime } = params;
            const where = {};
            if (name)
                where.name = { [sequelize_1.Op.like]: `%${name}%` };
            if (code)
                where.code = { [sequelize_1.Op.like]: `%${code}%` };
            if (status !== undefined)
                where.status = status;
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
            const { count, rows } = yield permissionModel_1.default.findAndCountAll({
                where,
                order: [['created_at', 'DESC']],
                offset: (Number(current) - 1) * Number(pageSize),
                limit: Number(pageSize)
            });
            return {
                list: dataUtil_1.DataUtil.toJSON(rows),
                total: count,
                current: Number(current),
                pageSize: Number(pageSize)
            };
        });
    }
    // 全部权限
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const permissions = yield permissionModel_1.default.findAll();
            return dataUtil_1.DataUtil.toJSON(permissions);
        });
    }
    /**
     * 根据ID查找权限
     */
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield permissionModel_1.default.findByPk(id);
        });
    }
    /**
     * 更新权限状态
     */
    updateStatus(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const per = yield permissionModel_1.default.findByPk(id);
            const status = (per === null || per === void 0 ? void 0 : per.status) === 0 ? 1 : 0;
            return yield permissionModel_1.default.update({ status }, {
                where: { id }
            });
        });
    }
}
exports.permissionService = new PermissionService();
