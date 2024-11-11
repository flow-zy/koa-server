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
exports.noticeService = exports.NoticeService = void 0;
const baseDao_1 = require("../dao/baseDao");
const noticeModel_1 = __importDefault(require("../model/noticeModel"));
const sequelize_1 = require("sequelize");
const businessError_1 = require("../utils/businessError");
const dateUtil_1 = require("../utils/dateUtil");
const notice_1 = require("../enums/notice");
class NoticeService {
    /**
     * 获取通知公告列表
     */
    getList(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const { keyword, type, status, startTime, endTime } = params, restParams = __rest(params, ["keyword", "type", "status", "startTime", "endTime"]);
            const queryParams = Object.assign(Object.assign({}, restParams), { where: Object.assign(Object.assign(Object.assign(Object.assign({}, (keyword && {
                    [sequelize_1.Op.or]: [
                        { title: { [sequelize_1.Op.like]: `%${keyword}%` } },
                        { content: { [sequelize_1.Op.like]: `%${keyword}%` } }
                    ]
                })), (type !== undefined && { type })), (status !== undefined && { status })), (startTime &&
                    endTime && {
                    created_at: {
                        [sequelize_1.Op.between]: [
                            dateUtil_1.DateUtil.formatDate(new Date(startTime)),
                            dateUtil_1.DateUtil.formatDate(new Date(endTime))
                        ]
                    }
                })), order: [
                    ['istop', 'DESC'],
                    ['sort', 'ASC'],
                    ['created_at', 'DESC']
                ] });
            return yield baseDao_1.BaseDao.findByPage(noticeModel_1.default, queryParams);
        });
    }
    /**
     * 创建通知公告
     */
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            if (!((_a = data.title) === null || _a === void 0 ? void 0 : _a.trim())) {
                throw new businessError_1.BusinessError(notice_1.NoticeMessage.TITLE_REQUIRED);
            }
            if (!((_b = data.content) === null || _b === void 0 ? void 0 : _b.trim())) {
                throw new businessError_1.BusinessError(notice_1.NoticeMessage.CONTENT_REQUIRED);
            }
            return yield baseDao_1.BaseDao.create(noticeModel_1.default, Object.assign(Object.assign({}, data), { status: (_c = data.status) !== null && _c !== void 0 ? _c : 0, publish_time: data.status === 1 ? new Date() : undefined }));
        });
    }
    /**
     * 更新通知公告
     */
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const notice = yield baseDao_1.BaseDao.findById(noticeModel_1.default, id);
            if (!notice) {
                throw new businessError_1.BusinessError(notice_1.NoticeMessage.NOT_FOUND);
            }
            if (notice.status === 1) {
                throw new businessError_1.BusinessError(notice_1.NoticeMessage.CANNOT_UPDATE_PUBLISHED);
            }
            return yield baseDao_1.BaseDao.update(noticeModel_1.default, data, { id });
        });
    }
    /**
     * 删除通知公告
     */
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const notice = yield baseDao_1.BaseDao.findById(noticeModel_1.default, id);
            if (!notice) {
                throw new businessError_1.BusinessError(notice_1.NoticeMessage.NOT_FOUND);
            }
            if (notice.status === 1) {
                throw new businessError_1.BusinessError(notice_1.NoticeMessage.CANNOT_DELETE_PUBLISHED);
            }
            return yield baseDao_1.BaseDao.delete(noticeModel_1.default, { id });
        });
    }
    /**
     * 获取通知公告详情
     */
    getDetail(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const notice = yield baseDao_1.BaseDao.findById(noticeModel_1.default, id);
            if (!notice) {
                throw new businessError_1.BusinessError(notice_1.NoticeMessage.NOT_FOUND);
            }
            return notice;
        });
    }
    /**
     * 发布通知公告
     */
    publish(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const notice = yield baseDao_1.BaseDao.findById(noticeModel_1.default, id);
            if (!notice) {
                throw new businessError_1.BusinessError(notice_1.NoticeMessage.NOT_FOUND);
            }
            if (notice.status === 1) {
                throw new businessError_1.BusinessError(notice_1.NoticeMessage.ALREADY_PUBLISHED);
            }
            return yield baseDao_1.BaseDao.update(noticeModel_1.default, {
                status: 1,
                publish_time: new Date()
            }, { id });
        });
    }
    /**
     * 撤回通知公告
     */
    revoke(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const notice = yield baseDao_1.BaseDao.findById(noticeModel_1.default, id);
            if (!notice) {
                throw new businessError_1.BusinessError(notice_1.NoticeMessage.NOT_FOUND);
            }
            if (notice.status !== 1) {
                throw new businessError_1.BusinessError(notice_1.NoticeMessage.NOT_PUBLISHED);
            }
            return yield baseDao_1.BaseDao.update(noticeModel_1.default, {
                status: 2
            }, { id });
        });
    }
    /**
     * 置顶/取消置顶通知公告
     */
    toggleTop(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const notice = yield baseDao_1.BaseDao.findById(noticeModel_1.default, id);
            if (!notice) {
                throw new businessError_1.BusinessError(notice_1.NoticeMessage.NOT_FOUND);
            }
            return yield baseDao_1.BaseDao.update(noticeModel_1.default, {
                istop: notice.istop === 1 ? 0 : 1
            }, { id });
        });
    }
}
exports.NoticeService = NoticeService;
exports.noticeService = new NoticeService();
