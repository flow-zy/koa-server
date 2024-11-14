import { Context, Next } from 'koa'
import { logger } from '../config/log4js'
import { StatusCode } from '../types/response'
import processEnv from '../config/config.default'
// 自定义错误类
export class AppError extends Error {
	public status: number
	public code: number
	public data?: any

	constructor(
		message: string,
		status: number = 500,
		code?: number,
		data?: any
	) {
		super(message)
		this.name = this.constructor.name
		this.status = status
		this.code = code || status
		this.data = data
		Error.captureStackTrace(this, this.constructor)
	}
}

// 业务错误类
export class BusinessError extends AppError {
	constructor(message: string, code: number = StatusCode.ERROR, data?: any) {
		super(message, 200, code, data)
	}
}

// 参数错误类
export class ParamError extends AppError {
	constructor(message: string = '参数错误', data?: any) {
		super(message, 200, StatusCode.PARAMS_ERROR, data)
	}
}

// 认证错误类
export class AuthError extends AppError {
	constructor(message: string = '认证失败', data?: any) {
		super(message, 401, StatusCode.AUTH_ERROR, data)
	}
}

// 权限错误类
export class ForbiddenError extends AppError {
	constructor(message: string = '无权访问', data?: any) {
		super(message, 403, StatusCode.FORBIDDEN, data)
	}
}

// 全局错误处理中间件
export default function errorHandler() {
	return async (ctx: Context, next: Next) => {
		try {
			await next()

			// 处理 404
			if (ctx.status === 404 && !ctx.body) {
				ctx.status = 404
				ctx.body = {
					code: StatusCode.NOT_FOUND,
					message: '接口不存在',
					timestamp: Date.now()
				}
			}
		} catch (err) {
			console.log(err, 'error')
			const error = err as any
			// 记录错误日志
			logger.error('Unhandled Error:', {
				url: ctx.url,
				method: ctx.method,
				headers: ctx.headers,
				query: ctx.query,
				body: ctx.request.body,
				error: {
					name: error.name,
					message: error.message,
					stack: error.stack,
					code: error.code
				}
			})

			// 开发环境下打印错误堆栈
			if (processEnv.NODE_ENV === 'development') {
				logger.error('Error Stack:', error.stack)
			}

			// 处理不同类型的错误
			if (error instanceof AppError) {
				// 自定义错误
				ctx.status = error.status
				ctx.body = {
					code: error.code,
					message: error.message,
					data: error.data,
					timestamp: Date.now()
				}
			} else if (error.name === 'ValidationError') {
				// 参数验证错误
				ctx.status = 200
				ctx.body = {
					code: StatusCode.PARAMS_ERROR,
					message: '参数验证失败',
					data: error.details,
					timestamp: Date.now()
				}
			} else if (error.name === 'UnauthorizedError') {
				// JWT 认证错误
				ctx.status = 401
				ctx.body = {
					code: StatusCode.AUTH_ERROR,
					message: '认证失败',
					timestamp: Date.now()
				}
			} else {
				// 未知错误
				ctx.status = 500
				ctx.body = {
					code: StatusCode.INTERNAL_ERROR,
					message:
						processEnv.NODE_ENV === 'production'
							? '服务器内部错误'
							: error.message,
					timestamp: Date.now()
				}
			}

			// 触发错误事件，方便做一些额外处理
			ctx.app.emit('error', error, ctx)
		}
	}
}
