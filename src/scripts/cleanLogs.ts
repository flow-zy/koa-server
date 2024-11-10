import fs from 'fs'
import path from 'path'
import dayjs from 'dayjs'

const LOG_ROOT = path.join(process.cwd(), 'logs')
const DAYS_TO_KEEP = 30 // 保留最近30天的日志

async function cleanOldLogs() {
	try {
		// 获取所有日期目录
		const dates = await fs.promises.readdir(LOG_ROOT)
		const now = dayjs()

		for (const date of dates) {
			const datePath = path.join(LOG_ROOT, date)
			const stats = await fs.promises.stat(datePath)

			// 如果是目录才处理
			if (stats.isDirectory()) {
				const folderDate = dayjs(date, 'YYYYMMDD')

				// 如果目录名是有效的日期且超过保留期限
				if (
					folderDate.isValid() &&
					now.diff(folderDate, 'day') > DAYS_TO_KEEP
				) {
					// 删除整个日期目录
					await fs.promises.rm(datePath, { recursive: true })
					console.log(`Deleted old log directory: ${date}`)
				}
			}
		}
	} catch (error) {
		console.error('Error cleaning logs:', error)
	}
}

// 执行清理
cleanOldLogs()
