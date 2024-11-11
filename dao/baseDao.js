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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseDao = void 0;
const dataUtil_1 = require("../utils/dataUtil");
class BaseDao {
    /**
     * 构建查询条件
     */
    static buildWhere(params = {}) {
        const where = {};
        // 过滤掉不需要的字段
        const excludeFields = [
            'pagenumber',
            'pagesize',
            'order',
            'attributes',
            'include'
        ];
        Object.entries(params).forEach(([key, value]) => {
            if (!excludeFields.includes(key) &&
                value !== undefined &&
                value !== null &&
                value !== '') {
                where[key] = value;
            }
        });
        return where;
    }
    /**
     * 构建查询选项
     */
    static buildOptions(params = {}) {
        const { pagenumber = 1, pagesize = 10, order = [['created_at', 'DESC']], attributes, include, where } = params, rest = __rest(params, ["pagenumber", "pagesize", "order", "attributes", "include", "where"]);
        const options = Object.assign(Object.assign({ where: this.buildWhere(Object.assign(Object.assign({}, where), rest)), order }, (attributes && { attributes })), (include && { include }));
        // 如果有分页参数，添加分页
        if (pagenumber && pagesize) {
            options.offset = (pagenumber - 1) * pagesize;
            options.limit = pagesize;
        }
        return options;
    }
    /**
     * 分页查询
     */
    static findByPage(model, params, transaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const options = this.buildOptions(params);
            if (transaction) {
                options.transaction = transaction;
            }
            const { count, rows } = yield model.findAndCountAll(options);
            return {
                list: dataUtil_1.DataUtil.toJSON(rows),
                total: count,
                pagenumber: params.pagenumber || 1,
                pagesize: params.pagesize || 10
            };
        });
    }
    /**
     * 查找所有记录（带分页）
     */
    static findAll(model, params, transaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const { pagenumber = 1, pagesize = 999999 } = params, // 默认一个较大的数，实际上是查询所有
            restParams = __rest(params, ["pagenumber", "pagesize"]);
            const options = this.buildOptions(Object.assign(Object.assign({}, restParams), { pagenumber,
                pagesize }));
            if (transaction) {
                options.transaction = transaction;
            }
            const { count, rows } = yield model.findAndCountAll(options);
            return {
                list: dataUtil_1.DataUtil.toJSON(rows),
                total: count,
                pagenumber,
                pagesize
            };
        });
    }
    /**
     * 查找单条记录
     */
    static findOne(model, params, transaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const options = this.buildOptions(params);
            if (transaction) {
                options.transaction = transaction;
            }
            const result = yield model.findOne(options);
            return result ? dataUtil_1.DataUtil.toJSON(result) : null;
        });
    }
    /**
     * 创建记录
     */
    static create(model, data, transaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const options = {};
            if (transaction) {
                options.transaction = transaction;
            }
            const result = yield model.create(data, options);
            return dataUtil_1.DataUtil.toJSON(result);
        });
    }
    /**
     * 批量创建记录
     */
    static bulkCreate(model, dataList, transaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const options = {};
            if (transaction) {
                options.transaction = transaction;
            }
            const results = yield model.bulkCreate(dataList, options);
            return dataUtil_1.DataUtil.toJSON(results);
        });
    }
    /**
     * 更新记录
     */
    static update(model, data, where, transaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const options = { where };
            if (transaction) {
                options.transaction = transaction;
            }
            const [affectedCount] = yield model.update(data, options);
            return affectedCount;
        });
    }
    /**
     * 删除记录
     */
    static delete(model, where, transaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const options = { where };
            if (transaction) {
                options.transaction = transaction;
            }
            return yield model.destroy(options);
        });
    }
    /**
     * 根据ID查找
     */
    static findById(model_1, id_1) {
        return __awaiter(this, arguments, void 0, function* (model, id, params = {}, transaction) {
            const { attributes, include } = params;
            const options = Object.assign(Object.assign({}, (attributes && { attributes })), (include && { include }));
            if (transaction) {
                options.transaction = transaction;
            }
            const result = yield model.findByPk(id, options);
            return result ? dataUtil_1.DataUtil.toJSON(result) : null;
        });
    }
}
exports.BaseDao = BaseDao;
