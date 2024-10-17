import {sign, verify} from 'jsonwebtoken';
import CryptoJS from 'crypto-js';
const SECRETKEY = 'sercet_key';
const options = {
  iv: CryptoJS.enc.Hex.parse('0000000000000000'), // 初始化向量为全零，初始化向量用于增加密码算法的安全性。16 字节的字节数组或WordArray 对象
  mode: CryptoJS.mode.ECB, // 加密模式，默认为 ECB
  padding: CryptoJS.pad.Pkcs7, // 加密模式，默认为 ECB
};
export const createToken = (user: any) => {
  return sign({...user}, process.env.SCREET_KEY as string, {expiresIn: '3h'});
};
export const verifyToken = (token: string) => {
  return verify(token, process.env.SCREET_KEY as string);
};
// 加密密码
export function encrypt(str: string) {
  return CryptoJS.AES.encrypt(
    JSON.stringify(str),
    SECRETKEY,
    options,
  ).toString();
}
// 解密密码
export function decrypt(str: string) {
  const bytes = CryptoJS.AES.decrypt(str, SECRETKEY, options);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
}
