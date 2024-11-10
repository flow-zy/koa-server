import { Context, Next } from 'koa'
import { logger } from '../config/log4js'
import { StatusCode } from '../types/response'
// 定义响应数据的接口
interface ResponseData<T = any> {
	code: number
	message: string
	data?: T
	timestamp?: number
	requestId?: string
}

// 扩展 Koa 的 Context 接口
declare module 'koa' {
	interface Context {
		send: <T = any>(
			message: string,
			code?: number,
			data?: T,
			extraOptions?: Partial<ResponseData>
		) => void
		success: <T = any>(data?: T, message?: string) => void
		error: (message: string, code?: number) => void
	}
}

// 生成请求ID
const generateRequestId = () => {
	return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

// 格式化响应数据
const formatResponse = <T>(
	message: string,
	code: number = StatusCode.SUCCESS,
	data?: T,
	extraOptions: Partial<ResponseData> = {}
): ResponseData<T> => {
	return {
		code,
		message,
		data,
		timestamp: Date.now(),
		requestId: generateRequestId(),
		...extraOptions
	}
}

// 中间件
export default function send() {
	return async (ctx: Context, next: Next) => {
		// 基础响应方法
		ctx.send = <T>(
			message: string,
			code: number = StatusCode.SUCCESS,
			data?: T,
			extraOptions?: Partial<ResponseData>
		) => {
			const response = formatResponse(message, code, data, extraOptions)

			// 记录响应日志
			if (code >= 400) {
				logger.error('Response Error:', {
					url: ctx.url,
					method: ctx.method,
					requestBody: ctx.request.body,
					query: ctx.request.query,
					response
				})
			} else {
				logger.info('Response:', {
					url: ctx.url,
					method: ctx.method,
					code,
					message
				})
			}

			ctx.body = response
		}

		// 成功响应的快捷方法
		ctx.success = <T>(data?: T, message: string = 'Success') => {
			ctx.send(message, StatusCode.SUCCESS, data)
		}

		// 错误响应的快捷方法
		ctx.error = (message: string, code: number = StatusCode.ERROR) => {
			ctx.send(message, code)
		}

		try {
			await next()

			// 处理 404
			if (ctx.status === 404 && !ctx.body) {
				ctx.error('Not Found', StatusCode.NOT_FOUND)
			}
		} catch (err) {
			// 统一错误处理
			const error = err as any
			const status = error.status || StatusCode.INTERNAL_ERROR
			const message = error.message || 'Internal Server Error'

			// 记录错误日志
			logger.error('Server Error:', {
				url: ctx.url,
				method: ctx.method,
				error: error.message,
				stack: error.stack
			})

			ctx.error(message, status)
		}
	}
}
