"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CryptoUtil = void 0;
const crypto_js_1 = __importDefault(require("crypto-js"));
class CryptoUtil {
    /**
     * AES解密
     * @param ciphertext 密文
     * @returns 明文
     */
    static aesDecrypt(ciphertext) {
        try {
            const key = crypto_js_1.default.enc.Utf8.parse(this.KEY);
            const iv = crypto_js_1.default.enc.Utf8.parse(this.IV);
            const decrypted = crypto_js_1.default.AES.decrypt(ciphertext, key, {
                iv: iv,
                mode: crypto_js_1.default.mode.CBC,
                padding: crypto_js_1.default.pad.Pkcs7
            });
            return decrypted.toString(crypto_js_1.default.enc.Utf8);
        }
        catch (error) {
            console.error('解密失败:', error);
            throw new Error('密码解密失败');
        }
    }
    /**
     * AES加密
     * @param plaintext 明文
     * @returns 密文
     */
    static aesEncrypt(plaintext) {
        try {
            const key = crypto_js_1.default.enc.Utf8.parse(this.KEY);
            const iv = crypto_js_1.default.enc.Utf8.parse(this.IV);
            const encrypted = crypto_js_1.default.AES.encrypt(plaintext, key, {
                iv: iv,
                mode: crypto_js_1.default.mode.CBC,
                padding: crypto_js_1.default.pad.Pkcs7
            });
            return encrypted.toString();
        }
        catch (error) {
            console.error('加密失败:', error);
            throw new Error('密码加密失败');
        }
    }
}
exports.CryptoUtil = CryptoUtil;
Object.defineProperty(CryptoUtil, "KEY", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: process.env.AES_KEY || 'your-secret-key'
}); // 从环境变量获取密钥
Object.defineProperty(CryptoUtil, "IV", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: process.env.AES_IV || 'your-iv-key'
}); // 从环境变量获取IV
