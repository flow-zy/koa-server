import log4js from 'log4js'
import path from 'path'
import fs from 'fs'
import { DateUtil } from '../utils/dateUtil'
// 定义 SQL 日志的接口
interface SqlLogData {
	model?: string
	method?: string
	params?: any
	sql?: string
	executionTime?: string
	status?: 'success' | 'error'
	error?: string
	stack?: string
	resultCount?: number
	timestamp: string
	[key: string]: any
}
// 日志根目录
const LOG_ROOT = path.join(process.cwd(), 'logs')

// 获取当前日期作为子目录
const getCurrentDateDir = () => {
	return DateUtil.formatDate(new Date()).replace(/-/g, '')
}

// 创建日志目录
const LOG_DIR = path.join(LOG_ROOT, getCurrentDateDir())
if (!fs.existsSync(LOG_DIR)) {
	fs.mkdirSync(LOG_DIR, { recursive: true })
}

// 日志文件名格式
const getLogFileName = (type: string) => {
	return `${type}.log`
}

// 配置 log4js
log4js.configure({
	appenders: {
		console: {
			type: 'console'
		},
		// 应用日志
		app: {
			type: 'file',
			filename: path.join(LOG_DIR, getLogFileName('app')),
			layout: {
				type: 'pattern',
				pattern: '[%d{yyyy-MM-dd hh:mm:ss.SSS}] [%p] %c - %m'
			}
		},
		// 错误日志
		error: {
			type: 'file',
			filename: path.join(LOG_DIR, getLogFileName('error')),
			layout: {
				type: 'pattern',
				pattern: '[%d{yyyy-MM-dd hh:mm:ss.SSS}] [%p] %c - %m'
			}
		},
		// API 访问日志
		api: {
			type: 'file',
			filename: path.join(LOG_DIR, getLogFileName('api')),
			layout: {
				type: 'pattern',
				pattern: '[%d{yyyy-MM-dd hh:mm:ss.SSS}] [%p] %c - %m'
			}
		},
		// SQL 日志
		sql: {
			type: 'file',
			filename: path.join(LOG_DIR, getLogFileName('sql')),
			layout: {
				type: 'pattern',
				pattern: '[%d{yyyy-MM-dd hh:mm:ss.SSS}] [%p] %c - %m'
			}
		}
	},
	categories: {
		default: {
			appenders: ['console', 'app'],
			level: process.env.NODE_ENV === 'production' ? 'info' : 'debug'
		},
		error: {
			appenders: ['console', 'error'],
			level: 'error'
		},
		api: {
			appenders: ['console', 'api'],
			level: 'info'
		},
		sql: {
			appenders: ['console', 'sql'],
			level: 'info'
		}
	}
})

// 创建日志记录器
const defaultLogger = log4js.getLogger()
const errorLogger = log4js.getLogger('error')
const apiLogger = log4js.getLogger('api')
const sqlLogger = log4js.getLogger('sql')

export const logger = {
	info: (message: string, ...args: any[]) => {
		apiLogger.info(message, ...args)
	},
	error: (message: string, ...args: any[]) => {
		errorLogger.error(message, ...args)
	},
	debug: (message: string, ...args: any[]) => {
		defaultLogger.debug(message, ...args)
	},
	warn: (message: string, ...args: any[]) => {
		defaultLogger.warn(message, ...args)
	},
	sql: (data: SqlLogData) => {
		sqlLogger.info('Database Operation:', {
			...data,
			timestamp: data.timestamp || DateUtil.getCurrentDateTime()
		})
	}
}
