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
exports.dictionaryService = exports.DictionaryService = void 0;
const baseDao_1 = require("../dao/baseDao");
const dictionaryModel_1 = __importDefault(require("../model/dictionaryModel"));
const sequelize_1 = require("sequelize");
const businessError_1 = require("../utils/businessError");
const dateUtil_1 = require("../utils/dateUtil");
const dictionary_1 = require("../enums/dictionary");
class DictionaryService {
    /**
     * 获取字典列表
     */
    getList(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const { keyword, status, startTime, endTime } = params, restParams = __rest(params, ["keyword", "status", "startTime", "endTime"]);
            const queryParams = Object.assign(Object.assign({}, restParams), { where: Object.assign(Object.assign(Object.assign({}, (keyword && {
                    [sequelize_1.Op.or]: [
                        { dictname: { [sequelize_1.Op.like]: `%${keyword}%` } },
                        { dictcode: { [sequelize_1.Op.like]: `%${keyword}%` } }
                    ]
                })), (status !== undefined && { status })), (startTime &&
                    endTime && {
                    created_at: {
                        [sequelize_1.Op.between]: [
                            dateUtil_1.DateUtil.formatDate(new Date(startTime)),
                            dateUtil_1.DateUtil.formatDate(new Date(endTime))
                        ]
                    }
                })), order: [
                    ['sort', 'ASC'],
                    ['created_at', 'DESC']
                ] });
            const result = yield baseDao_1.BaseDao.findByPage(dictionaryModel_1.default, queryParams);
            // 将列表数据转换为树形结构
            const treeData = this.buildDictionaryTree(result.list);
            return Object.assign(Object.assign({}, result), { list: treeData });
        });
    }
    /**
     * 获取所有字典
     */
    getAll() {
        return __awaiter(this, arguments, void 0, function* (params = {}) {
            const result = yield baseDao_1.BaseDao.findAll(dictionaryModel_1.default, Object.assign(Object.assign({}, params), { order: [['sort', 'ASC']] }));
            // 将列表数据转换为树形结构
            const treeData = this.buildDictionaryTree(result.list);
            return Object.assign(Object.assign({}, result), { list: treeData });
        });
    }
    /**
     * 构建字典树
     */
    buildDictionaryTree(dictList, parentId = null) {
        return dictList
            .filter((dict) => dict.parentid === parentId)
            .map((dict) => (Object.assign(Object.assign({}, dict), { children: this.buildDictionaryTree(dictList, dict.id) })))
            .sort((a, b) => a.sort - b.sort);
    }
    /**
     * 创建字典
     */
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            // 检查编码是否存在
            const exists = yield baseDao_1.BaseDao.findOne(dictionaryModel_1.default, {
                where: { dictcode: data.dictcode }
            });
            if (exists) {
                throw new businessError_1.BusinessError(dictionary_1.DictionaryMessage.DICT_CODE_EXISTS);
            }
            // 如果有父级ID，检查父级是否存在
            if (data.parentid) {
                const parent = yield baseDao_1.BaseDao.findById(dictionaryModel_1.default, data.parentid);
                if (!parent) {
                    throw new businessError_1.BusinessError(dictionary_1.DictionaryMessage.DICT_PARENT_NOT_FOUND);
                }
            }
            return yield baseDao_1.BaseDao.create(dictionaryModel_1.default, Object.assign(Object.assign({}, data), { status: (_a = data.status) !== null && _a !== void 0 ? _a : 1, sort: (_b = data.sort) !== null && _b !== void 0 ? _b : 1, parentid: (_c = data.parentid) !== null && _c !== void 0 ? _c : undefined }));
        });
    }
    /**
     * 更新字典
     */
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            // 检查编码是否与其他记录冲突
            if (data.dictcode) {
                const exists = yield baseDao_1.BaseDao.findOne(dictionaryModel_1.default, {
                    where: {
                        dictcode: data.dictcode,
                        id: { [sequelize_1.Op.ne]: id }
                    }
                });
                if (exists) {
                    throw new businessError_1.BusinessError(dictionary_1.DictionaryMessage.DICT_CODE_EXISTS);
                }
            }
            // 如果更新父级ID，检查父级是否存在且不能设置为自己或自己的子级
            if (data.parentid) {
                if (data.parentid === id) {
                    throw new businessError_1.BusinessError(dictionary_1.DictionaryMessage.DICT_PARENT_ERROR);
                }
                const parent = yield baseDao_1.BaseDao.findById(dictionaryModel_1.default, data.parentid);
                if (!parent) {
                    throw new businessError_1.BusinessError(dictionary_1.DictionaryMessage.DICT_PARENT_NOT_FOUND);
                }
                // 检查是否设置为自己的子级
                const children = yield this.getChildrenIds(id);
                if (children.includes(data.parentid)) {
                    throw new businessError_1.BusinessError(dictionary_1.DictionaryMessage.DICT_PARENT_ERROR);
                }
            }
            return yield baseDao_1.BaseDao.update(dictionaryModel_1.default, data, { id });
        });
    }
    /**
     * 获取所有子级ID
     */
    getChildrenIds(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const allDict = yield baseDao_1.BaseDao.findAll(dictionaryModel_1.default, {});
            const result = [];
            const findChildren = (parentId) => {
                const children = allDict.list.filter((dict) => dict.parentid === parentId);
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
     * 删除字典
     */
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            // 检查是否存在子级
            const children = yield baseDao_1.BaseDao.findOne(dictionaryModel_1.default, {
                where: { parentid: id }
            });
            if (children) {
                throw new businessError_1.BusinessError(dictionary_1.DictionaryMessage.DICT_HAS_CHILDREN);
            }
            return yield baseDao_1.BaseDao.delete(dictionaryModel_1.default, { id });
        });
    }
    /**
     * 获取字典详情
     */
    getDetail(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield baseDao_1.BaseDao.findById(dictionaryModel_1.default, id);
        });
    }
    /**
     * 更新字典状态
     */
    updateStatus(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const dict = yield baseDao_1.BaseDao.findById(dictionaryModel_1.default, id);
            if (!dict) {
                throw new businessError_1.BusinessError(dictionary_1.DictionaryMessage.DICT_NOT_FOUND);
            }
            const status = dict.status === 1 ? 0 : 1;
            return yield baseDao_1.BaseDao.update(dictionaryModel_1.default, { status }, { id });
        });
    }
    /**
     * 根据编码获取字典
     */
    getByCode(code) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield baseDao_1.BaseDao.findOne(dictionaryModel_1.default, {
                where: { dictcode: code, status: 1 },
                order: [['sort', 'ASC']]
            });
        });
    }
}
exports.DictionaryService = DictionaryService;
exports.dictionaryService = new DictionaryService();
