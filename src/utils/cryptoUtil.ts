import CryptoJS from 'crypto-js'

export class CryptoUtil {
	private static readonly KEY = process.env.AES_KEY || 'your-secret-key' // 从环境变量获取密钥
	private static readonly IV = process.env.AES_IV || 'your-iv-key' // 从环境变量获取IV

	/**
	 * AES解密
	 * @param ciphertext 密文
	 * @returns 明文
	 */
	static aesDecrypt(ciphertext: string): string {
		try {
			const key = CryptoJS.enc.Utf8.parse(this.KEY)
			const iv = CryptoJS.enc.Utf8.parse(this.IV)

			const decrypted = CryptoJS.AES.decrypt(ciphertext, key, {
				iv: iv,
				mode: CryptoJS.mode.CBC,
				padding: CryptoJS.pad.Pkcs7
			})

			return decrypted.toString(CryptoJS.enc.Utf8)
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
			const key = CryptoJS.enc.Utf8.parse(this.KEY)
			const iv = CryptoJS.enc.Utf8.parse(this.IV)

			const encrypted = CryptoJS.AES.encrypt(plaintext, key, {
				iv: iv,
				mode: CryptoJS.mode.CBC,
				padding: CryptoJS.pad.Pkcs7
			})

			return encrypted.toString()
		} catch (error) {
			console.error('加密失败:', error)
			throw new Error('密码加密失败')
		}
	}
}
