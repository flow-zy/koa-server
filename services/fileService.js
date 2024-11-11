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
exports.fileService = exports.FileService = void 0;
const baseDao_1 = require("../dao/baseDao");
const fileModel_1 = __importDefault(require("../model/fileModel"));
const sequelize_1 = require("sequelize");
const businessError_1 = require("../utils/businessError");
const dateUtil_1 = require("../utils/dateUtil");
const file_1 = require("../enums/file");
const fs_1 = require("fs");
const path_1 = require("path");
const util_1 = require("util");
const uid_1 = require("uid");
const unlinkAsync = (0, util_1.promisify)(fs_1.unlink);
class FileService {
    /**
     * 获取文件列表
     */
    getList(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const { keyword, category, storage, status, startTime, endTime } = params, restParams = __rest(params, ["keyword", "category", "storage", "status", "startTime", "endTime"]);
            const queryParams = Object.assign(Object.assign({}, restParams), { where: Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, (keyword && {
                    [sequelize_1.Op.or]: [
                        { filename: { [sequelize_1.Op.like]: `%${keyword}%` } },
                        { original_name: { [sequelize_1.Op.like]: `%${keyword}%` } }
                    ]
                })), (category !== undefined && { category })), (storage !== undefined && { storage })), (status !== undefined && { status })), (startTime &&
                    endTime && {
                    created_at: {
                        [sequelize_1.Op.between]: [
                            dateUtil_1.DateUtil.formatDate(new Date(startTime)),
                            dateUtil_1.DateUtil.formatDate(new Date(endTime))
                        ]
                    }
                })), order: [['created_at', 'DESC']] });
            return yield baseDao_1.BaseDao.findByPage(fileModel_1.default, queryParams);
        });
    }
    /**
     * 上传文件
     */
    upload(file, userId, username) {
        return __awaiter(this, void 0, void 0, function* () {
            const { originalname, mimetype, size } = file;
            // 生成唯一文件名
            const ext = originalname.split('.').pop();
            const filename = `${(0, uid_1.uid)()}.${ext}`;
            // 根据文件类型确定分类
            const category = this.getFileCategory(mimetype);
            // 确定存储路径
            const uploadDir = (0, path_1.join)(__dirname, '../../uploads', category.toString());
            const filepath = (0, path_1.join)(uploadDir, filename);
            // 写入文件
            yield new Promise((resolve, reject) => {
                const writeStream = (0, fs_1.createWriteStream)(filepath);
                writeStream.write(file.buffer);
                writeStream.end();
                writeStream.on('finish', resolve);
                writeStream.on('error', reject);
            });
            // 保存文件信息
            return yield baseDao_1.BaseDao.create(fileModel_1.default, {
                filename,
                original_name: originalname,
                filepath: `/uploads/${category}/${filename}`,
                mimetype,
                size,
                category,
                storage: 1, // 本地存储
                uploader_id: userId,
                uploader: username
            });
        });
    }
    /**
     * 删除文件
     */
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const file = yield baseDao_1.BaseDao.findById(fileModel_1.default, id);
            if (!file) {
                throw new businessError_1.BusinessError(file_1.FileMessage.NOT_FOUND);
            }
            // 删除物理文件
            try {
                yield unlinkAsync((0, path_1.join)(__dirname, '../..', file.filepath));
            }
            catch (error) {
                console.error('删除文件失败:', error);
                throw new businessError_1.BusinessError(file_1.FileMessage.DELETE_ERROR);
            }
            // 删除数据库记录
            return yield baseDao_1.BaseDao.delete(fileModel_1.default, { id });
        });
    }
    /**
     * 更新文件状态
     */
    updateStatus(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const file = yield baseDao_1.BaseDao.findById(fileModel_1.default, id);
            if (!file) {
                throw new businessError_1.BusinessError(file_1.FileMessage.NOT_FOUND);
            }
            const status = file.status === 1 ? 0 : 1;
            return yield baseDao_1.BaseDao.update(fileModel_1.default, { status }, { id });
        });
    }
    /**
     * 获取文件详情
     */
    getDetail(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const file = yield baseDao_1.BaseDao.findById(fileModel_1.default, id);
            if (!file) {
                throw new businessError_1.BusinessError(file_1.FileMessage.NOT_FOUND);
            }
            return file;
        });
    }
    /**
     * 根据MIME类型获取文件分类
     */
    getFileCategory(mimetype) {
        if (mimetype.startsWith('image/'))
            return 1;
        if (mimetype.startsWith('application/'))
            return 2;
        if (mimetype.startsWith('video/'))
            return 3;
        if (mimetype.startsWith('audio/'))
            return 4;
        return 5;
    }
}
exports.FileService = FileService;
exports.fileService = new FileService();
