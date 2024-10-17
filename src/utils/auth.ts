import {sign, verify} from 'jsonwebtoken';
import CryptoJS from 'crypto-js';
const SECRETKEY = 10;
export const createToken = (user: any) => {
  return sign({...user}, process.env.SCREET_KEY as string, {expiresIn: '3h'});
};
export const verifyToken = (token: string) => {
  return verify(token, process.env.SCREET_KEY as string);
};
// 加密密码
export function encrypt(str: string) {
  return CryptoJS.AES.encrypt(JSON.stringify(str), SECRETKEY).toString();
}
// 解密密码
export function decrypt(str: string) {
  const bytes = CryptoJS.AES.decrypt(str, SECRETKEY);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
}
