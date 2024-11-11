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
exports.uploadFile = uploadFile;
exports.deleteObject = deleteObject;
exports.getObjectUrl = getObjectUrl;
const node_fs_1 = __importDefault(require("node:fs"));
const config_default_1 = __importDefault(require("../config/config.default"));
const cos_nodejs_sdk_v5_1 = __importDefault(require("cos-nodejs-sdk-v5"));
const cos = new cos_nodejs_sdk_v5_1.default({
    SecretId: config_default_1.default.SecretId,
    SecretKey: config_default_1.default.SecretKey,
});
const Bucket = config_default_1.default.Bucket;
// 上传图片到cos
function uploadFile(filePath, fileName, path) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            cos.putObject({
                Bucket: Bucket,
                Region: 'ap-nanchang',
                Key: `flockmaster-blogs/${path}/${fileName}`,
                Body: node_fs_1.default.createReadStream(filePath),
                ContentLength: node_fs_1.default.statSync(filePath).size,
                ContentType: 'image/jpeg',
            }, (err, data) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(data);
                }
            });
        });
    });
}
// 删除cos文件
function deleteObject(key) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            cos.deleteObject({
                Bucket: Bucket,
                Region: 'ap-nanchang',
                Key: key,
            }, (err, data) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(data);
                }
            });
        });
    });
}
function getObjectUrl(key) {
    return cos.getObjectUrl({
        Bucket: Bucket,
        Region: 'ap-nanchang',
        Key: key,
        Expires: 3600, // URL 过期时间，单位秒，默认 300 秒
    }, () => {
    });
}
