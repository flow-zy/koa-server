import fs from 'fs'
import path from 'path'

export const initApp = () => {
	// 创建日志目录
	const logPath = path.resolve(__dirname, '../../logs')
	if (!fs.existsSync(logPath)) {
		fs.mkdirSync(logPath, { recursive: true })
	}
}
