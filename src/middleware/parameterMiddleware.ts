import { Context, Next } from 'koa'
import { logger } from '../config/log4js'
import processEnv from '../config/config.default'
interface FilterOptions {
	removeEmpty: boolean
	trimStrings: boolean
	removeUndefined: boolean
	removeNull: boolean
	customFilters: string[]
}

const DEFAULT_OPTIONS: FilterOptions = {
	removeEmpty: true,
	trimStrings: true,
	removeUndefined: true,
	removeNull: true,
	customFilters: ['_t']
}

export const createParameterMiddleware = (
	options: Partial<FilterOptions> = {}
) => {
	const finalOptions: FilterOptions = { ...DEFAULT_OPTIONS, ...options }

	return async (ctx: Context, next: Next) => {
		try {
			// 处理 query 参数
			if (ctx.query) {
				const filteredQuery: Record<string, any> = {}
				Object.entries(ctx.query).forEach(([key, value]) => {
					if (
						!finalOptions.customFilters.includes(key) &&
						value !== undefined &&
						value !== null &&
						value !== ''
					) {
						filteredQuery[key] = value
					}
				})
				ctx.query = filteredQuery
			}

			// 处理 request body
			if (ctx.request.body) {
				const filteredBody: Record<string, any> = {}
				Object.entries(ctx.request.body).forEach(([key, value]) => {
					if (!finalOptions.customFilters.includes(key)) {
						if (Array.isArray(value)) {
							if (value.length > 0) {
								filteredBody[key] = value
							}
						} else if (value && typeof value === 'object') {
							if (Object.keys(value).length > 0) {
								filteredBody[key] = value
							}
						} else if (
							value !== undefined &&
							value !== null &&
							value !== ''
						) {
							filteredBody[key] = value
						}
					}
				})
				ctx.request.body = filteredBody
			}

			// 开发环境下记录处理后的参数
			if (processEnv.NODE_ENV !== 'production') {
				logger.debug('处理后的请求参数:', {
					method: ctx.method,
					url: ctx.url,
					query: ctx.query,
					body: ctx.request.body
				})
			}

			await next()
		} catch (error) {
			logger.error('参数处理中间件错误:', {
				error: error instanceof Error ? error.message : '未知错误',
				stack: error instanceof Error ? error.stack : '',
				url: ctx.url,
				method: ctx.method
			})

			// 返回错误响应
			ctx.status = 500
			ctx.body = {
				code: 500,
				message: '请求参数处理错误',
				error:
					processEnv.NODE_ENV === 'development'
						? error instanceof Error
							? error.message
							: '未知错误'
						: '服务器内部错误'
			}
		}
	}
}

// 创建默认中间件实例
export const parameterMiddleware = createParameterMiddleware()
