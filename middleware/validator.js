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
exports.validatorId = validatorId;
exports.validatorPage = validatorPage;
exports.verifyUploadImg = verifyUploadImg;
exports.verifyUpload = verifyUpload;
const Error_1 = __importDefault(require("../utils/Error"));
// 校验是否携带id参数
function validatorId(ctx, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            ctx.verifyParams({
                id: 'number',
            });
        }
        catch (error) {
            return ctx.app.emit('error', Error_1.default.validatorIdError, ctx, error);
        }
        yield next();
    });
}
// 校验是否携带pageNum, pageSize
function validatorPage(ctx, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            ctx.verifyParams({
                pageNumber: 'number',
                pageSize: 'number',
            });
        }
        catch (error) {
            return ctx.app.emit('error', Error_1.default.validatorPageError, ctx, error);
        }
        yield next();
    });
}
// 校验上传图片格式
function verifyUploadImg(ctx, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { file } = ctx.request.files;
            const fileTypes = ['image/jpeg', 'image/png'];
            if (!Array.isArray(file)) {
                if (!fileTypes.includes(file.mimetype)) {
                    return ctx.app.emit('error', Error_1.default.uploadError, ctx);
                }
                ctx.state.blog_img = file;
                ctx.state.img = file;
            }
            else {
                file.every((item) => {
                    if (!fileTypes.includes(item.mimetype)) {
                        return ctx.app.emit('error', Error_1.default.uploadError, ctx);
                    }
                });
                ctx.state.imgList = file;
                // return ctx.app.emit('error', ERROR.uploadError, ctx);
            }
        }
        catch (error) {
            return ctx.app.emit('error', Error_1.default.uploadError, ctx, error);
        }
        yield next();
    });
}
// 校验文件
function verifyUpload(ctx, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { file } = ctx.request.files;
            const imgTypes = ['image/jpeg', 'image/png'];
            const videoTypes = ['video/mp4'];
            ctx.state.imageList = [];
            ctx.state.videoList = [];
            if (!Array.isArray(file)) {
                if (file.mimetype
                    && !imgTypes.includes(file.mimetype)
                    && !videoTypes.includes(file.mimetype)) {
                    return ctx.app.emit('error', Error_1.default.uploadError, ctx);
                }
                if (file.mimetype && imgTypes.includes(file.mimetype)) {
                    ctx.state.imageList.push(file);
                }
                else if (file.mimetype && videoTypes.includes(file.mimetype)) {
                    ctx.state.videoList.push(file);
                }
            }
            else {
                for (const item of file) {
                    if (item.mimetype
                        && !imgTypes.includes(item.mimetype)
                        && !videoTypes.includes(item.mimetype)) {
                        return ctx.app.emit('error', Error_1.default.uploadError, ctx);
                    }
                    if (item.mimetype && imgTypes.includes(item.mimetype)) {
                        ctx.state.imageList.push(item);
                    }
                    else if (item.mimetype
                        && videoTypes.includes(item.mimetype)) {
                        ctx.state.videoList.push(item);
                    }
                }
                // return ctx.app.emit('error', ERROR.uploadError, ctx);
            }
        }
        catch (error) {
            return ctx.app.emit('error', Error_1.default.uploadError, ctx, error);
        }
        yield next();
    });
}
