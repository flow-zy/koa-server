import { Context, Next } from 'koa'
import { logger } from '../config/log4js'

interface CorsOptions {
	// 允许的域名列表
	origins?: string[]
	// 允许的请求方法
	methods?: string[]
	// 允许的请求头
	allowHeaders?: string[]
	// 允许发送 cookie
	credentials?: boolean
	// 预检请求的有效期，单位秒
	maxAge?: number
	// 允许暴露的响应头
	exposeHeaders?: string[]
	// 是否启用安全策略
	security?: boolean
	// 是否记录 CORS 日志
	logging?: boolean
}

const defaultOptions: CorsOptions = {
	origins: ['http://localhost:3000'],
	methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
	allowHeaders: [
		'Content-Type',
		'Authorization',
		'X-Requested-With',
		'Accept',
		'Origin',
		'X-Token'
	],
	credentials: true,
	maxAge: 86400, // 24小时
	exposeHeaders: ['X-Total-Count', 'X-Request-Id'],
	security: true,
	logging: true
}

export default function corsHandler(options: CorsOptions = {}) {
	const finalOptions = { ...defaultOptions, ...options }

	return async (ctx: Context, next: Next) => {
		const origin = ctx.get('Origin')

		// 检查请求来源是否在允许列表中
		const allowOrigin = finalOptions.origins!.includes('*')
			? origin
			: finalOptions.origins!.includes(origin)
				? origin
				: finalOptions.origins![0]

		// 设置 CORS 响应头
		ctx.set({
			'Access-Control-Allow-Origin': allowOrigin,
			'Access-Control-Allow-Methods': finalOptions.methods!.join(', '),
			'Access-Control-Allow-Headers':
				finalOptions.allowHeaders!.join(', '),
			'Access-Control-Max-Age': finalOptions.maxAge!.toString(),
			'Access-Control-Expose-Headers':
				finalOptions.exposeHeaders!.join(', '),
			'Access-Control-Allow-Credentials':
				finalOptions.credentials!.toString()
		})

		// 启用安全策略
		if (finalOptions.security) {
			ctx.set({
				'X-Content-Type-Options': 'nosniff',
				'X-Frame-Options': 'DENY',
				'X-XSS-Protection': '1; mode=block',
				'Strict-Transport-Security':
					'max-age=31536000; includeSubDomains'
			})
		}

		// 记录 CORS 请求日志
		if (finalOptions.logging) {
			logger.info('CORS Request:', {
				origin,
				method: ctx.method,
				url: ctx.url,
				headers: ctx.headers
			})
		}

		// 处理预检请求
		if (ctx.method === 'OPTIONS') {
			ctx.status = 204
			return
		}

		try {
			await next()
		} catch (err) {
			const error = err as any
			// 处理 CORS 相关错误
			if (error.message.includes('CORS')) {
				logger.error('CORS Error:', {
					origin,
					method: ctx.method,
					url: ctx.url,
					error: error.message
				})
				ctx.status = 403
				ctx.body = {
					code: 403,
					message: 'CORS policy violation'
				}
				return
			}
			throw error
		}
	}
}
