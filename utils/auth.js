"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.createToken = createToken;
exports.verifyToken = verifyToken;
exports.encrypt = encrypt;
exports.decrypt = decrypt;
exports.filterObject = filterObject;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_js_1 = __importDefault(require("crypto-js"));
const config_default_1 = __importDefault(require("../config/config.default"));
const SECRETKEY = (_a = config_default_1.default.JWT_SECRET) !== null && _a !== void 0 ? _a : 'sercet_key';
const options = {
    iv: crypto_js_1.default.enc.Hex.parse('0000000000000000'), // 初始化向量为全零，初始化向量用于增加密码算法的安全性。16 字节的字节数组或WordArray 对象
    mode: crypto_js_1.default.mode.ECB, // 加密模式，默认为 ECB
    padding: crypto_js_1.default.pad.Pkcs7, // 加密模式，默认为 ECB
};
function createToken(user) {
    return jsonwebtoken_1.default.sign(user, config_default_1.default.JWT_SECRET, {
        expiresIn: '3h',
    });
}
function verifyToken(token) {
    return jsonwebtoken_1.default.verify(token, config_default_1.default.JWT_SECRET);
}
// 加密密码
function encrypt(str) {
    return crypto_js_1.default.AES.encrypt(JSON.stringify(str), SECRETKEY, options).toString();
}
// 解密密码
function decrypt(str) {
    const bytes = crypto_js_1.default.AES.decrypt(str, SECRETKEY, options);
    return JSON.parse(bytes.toString(crypto_js_1.default.enc.Utf8));
}
// 剔除对象中为_t的属性
function filterObject(obj) {
    return Object.keys(obj).reduce((acc, key) => {
        if (key !== '_t')
            acc[key] = obj[key];
        return acc;
    }, {});
}
