import jwt from 'jsonwebtoken'
import CryptoJS from 'crypto-js'

import processEnv from '../config/config.default'

const SECRETKEY = processEnv.JWT_SECRET ?? 'sercet_key'
const options = {
  iv: CryptoJS.enc.Hex.parse('0000000000000000'), // 初始化向量为全零，初始化向量用于增加密码算法的安全性。16 字节的字节数组或WordArray 对象
  mode: CryptoJS.mode.ECB, // 加密模式，默认为 ECB
  padding: CryptoJS.pad.Pkcs7, // 加密模式，默认为 ECB
}
export function createToken(user: any) {
  return jwt.sign(user, processEnv.JWT_SECRET!, {
    expiresIn: '3h',
  })
}
export function verifyToken(token: string) {
  return jwt.verify(token, processEnv.JWT_SECRET!)
}
// 加密密码
export function encrypt(str: string) {
  return CryptoJS.AES.encrypt(
    JSON.stringify(str),
    SECRETKEY,
    options,
  ).toString()
}
// 解密密码
export function decrypt(str: string) {
  const bytes = CryptoJS.AES.decrypt(str, SECRETKEY, options)
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
}

// 剔除对象中为_t的属性
export function filterObject(obj: any) {
  return Object.keys(obj).reduce((acc, key) => {
    if (key !== '_t') acc[key] = obj[key]
    return acc
  }, {} as any)
}
