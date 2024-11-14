import { Context, Next } from 'koa'
import { DateUtil } from '../utils/dateUtil'
import { logger } from '../config/log4js'
import Log from '../model/log'
import { ApiActions } from '../enums/apiPaths'
export const loggerMiddleware = async (ctx: Context, next: Next) => {
	const startTime = Date.now()
	const requestId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

	// 记录请求信息
	const requestLog = {
		requestId,
		timestamp: DateUtil.getCurrentDateTime(),
		method: ctx.method,
		url: ctx.url,
		query: ctx.query,
		body: ctx.request.body,
		headers: {
			'user-agent': ctx.headers['user-agent'],
			authorization: ctx.headers['authorization'] ? '******' : undefined,
			'content-type': ctx.headers['content-type']
		},
		ip: ctx.ip,
		userId: ctx.state.user?.id,
		username: ctx.state.user?.username || 'guest'
	}

	logger.info('API Request:', requestLog)
	let apipath = ctx.url
	const arr = ctx.url.split('?')[0].split('/')
	if (arr.length > 2) {
		apipath = arr.slice(0, 3).join('/')
	} else {
		apipath = arr.join('/')
	}
	try {
		// 执行后续中间件
		await next()

		// 计算响应时间
		const responseTime = Date.now() - startTime

		// 记录响应信息
		const responseLog = {
			requestId,
			timestamp: DateUtil.getCurrentDateTime(),
			method: ctx.method,
			url: ctx.url,
			status: ctx.status,
			responseTime: `${responseTime}ms`,
			response: ctx.body,
			userId: ctx.state.user?.id,
			username: ctx.state.user?.username || 'guest'
		}

		logger.info('API Response:', responseLog)
		await Log.create({
			username: ctx.state.user?.username,
			ip: ctx.ip,
			method: ctx.method,
			url: ctx.url,
			content: ApiActions[apipath as keyof typeof ApiActions],
			status: 1 // 成功
		})
	} catch (err) {
		const error = err as Error
		// 记录错误信息
		const errorLog = {
			requestId,
			timestamp: DateUtil.getCurrentDateTime(),
			method: ctx.method,
			url: ctx.url,
			error: {
				name: error.name,
				message: error.message,
				stack: error.stack
			},
			userId: ctx.state.user?.id
		}

		logger.error('API Error:', errorLog)
		await Log.create({
			username: ctx.state.user?.username,
			ip: ctx.ip,
			method: ctx.method,
			url: ctx.url,
			content: ApiActions[apipath as keyof typeof ApiActions],
			status: 2 // 失败
		})
		throw error
	}
}
