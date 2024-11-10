import { createClient } from 'redis'
import { logger } from './log4js'

// Redis 客户端配置接口
interface RedisConfig {
	host: string
	port: number
	password?: string
	db?: number
	prefix?: string
}

// Redis 配置
const config: RedisConfig = {
	host: process.env.REDIS_HOST || 'localhost',
	port: parseInt(process.env.REDIS_PORT || '6379'),
	password: process.env.REDIS_PASSWORD,
	db: parseInt(process.env.REDIS_DB || '0'),
	prefix: 'app:'
}

// 创建 Redis 客户端
const client = createClient({
	url: `redis://${config.host}:${config.port}`,
	password: config.password,
	database: config.db
})

// 连接错误处理
client.on('error', (err) => {
	logger.error('Redis Client Error:', err)
})

// 连接成功日志
client.on('connect', () => {
	logger.info('Redis Client Connected')
})

// 重连日志
client.on('reconnecting', () => {
	logger.info('Redis Client Reconnecting')
})

// 包装常用的 Redis 操作
export const redis = {
	// 设置键值对
	set: async (key: string, value: any, expireSeconds?: number) => {
		const fullKey = `${config.prefix}${key}`
		try {
			const stringValue =
				typeof value === 'string' ? value : JSON.stringify(value)
			if (expireSeconds) {
				await client.set(fullKey, stringValue, {
					EX: expireSeconds
				})
			} else {
				await client.set(fullKey, stringValue)
			}
			return true
		} catch (error) {
			logger.error('Redis Set Error:', { key: fullKey, error })
			return false
		}
	},

	// 获取值
	get: async (key: string) => {
		const fullKey = `${config.prefix}${key}`
		try {
			const value = await client.get(fullKey)
			if (!value) return null
			try {
				return JSON.parse(value)
			} catch {
				return value
			}
		} catch (error) {
			logger.error('Redis Get Error:', { key: fullKey, error })
			return null
		}
	},

	// 删除键
	del: async (key: string) => {
		const fullKey = `${config.prefix}${key}`
		try {
			await client.del(fullKey)
			return true
		} catch (error) {
			logger.error('Redis Del Error:', { key: fullKey, error })
			return false
		}
	},

	// 设置过期时间
	expire: async (key: string, seconds: number) => {
		const fullKey = `${config.prefix}${key}`
		try {
			await client.expire(fullKey, seconds)
			return true
		} catch (error) {
			logger.error('Redis Expire Error:', { key: fullKey, error })
			return false
		}
	},

	// 检查键是否存在
	exists: async (key: string) => {
		const fullKey = `${config.prefix}${key}`
		try {
			return (await client.exists(fullKey)) === 1
		} catch (error) {
			logger.error('Redis Exists Error:', { key: fullKey, error })
			return false
		}
	},

	// 获取所有匹配的键
	keys: async (pattern: string) => {
		const fullPattern = `${config.prefix}${pattern}`
		try {
			return await client.keys(fullPattern)
		} catch (error) {
			logger.error('Redis Keys Error:', {
				pattern: fullPattern,
				error
			})
			return []
		}
	},

	// 清除所有数据
	flushAll: async () => {
		try {
			await client.flushAll()
			return true
		} catch (error) {
			logger.error('Redis FlushAll Error:', error)
			return false
		}
	},

	// 获取原始客户端
	getClient: () => client
}

// 初始化 Redis 连接
export async function initRedis() {
	try {
		await client.connect()
		logger.info('Redis initialized successfully')
	} catch (error) {
		logger.error('Redis initialization failed:', error)
		process.exit(1)
	}
}
