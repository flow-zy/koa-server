import { decrypt, encrypt } from 'crypto-js/aes'
import { parse } from 'crypto-js/enc-utf8'
import pkcs7 from 'crypto-js/pad-pkcs7'
import CTR from 'crypto-js/mode-ctr'
import processEnv from '../config/config.default'
export class CryptoUtil {
	private static readonly KEY = processEnv.AES_KEY || 'secret-key' // 从环境变量获取密钥
	private static readonly IV = processEnv.AES_IV || 'iv-key' // 从环境变量获取IV

	static getOptions() {
		return {
			mode: CTR,
			padding: pkcs7,
			iv: parse(this.IV)
		}
	}

	/**
	 * AES解密
	 * @param ciphertext 密文
	 * @returns 明文
	 */
	static aesDecrypt(ciphertext: string): string {
		try {
			const key = parse(this.KEY)
			return decrypt(ciphertext, key, this.getOptions()).toString()
		} catch (error) {
			console.error('解密失败:', error)
			throw new Error('密码解密失败')
		}
	}

	/**
	 * AES加密
	 * @param plaintext 明文
	 * @returns 密文
	 */
	static aesEncrypt(plaintext: string): string {
		try {
			return encrypt(
				plaintext,
				parse(this.KEY),
				this.getOptions()
			).toString()
		} catch (error) {
			console.error('加密失败:', error)
			throw new Error('密码加密失败')
		}
	}
}
