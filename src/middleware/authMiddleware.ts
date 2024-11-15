import { Context, Next } from 'koa'
import { verifyToken, defaultOptions } from './auth'
import { BusinessError } from '../utils/businessError'
import { logger } from '../config/log4js'
import { AuthMessage } from '../enums/auth'

export default async function authMiddleware(ctx: Context, next: Next) {
	try {
		const token = ctx.headers.authorization?.split(' ')[1]

		if (!token) {
			throw new BusinessError(AuthMessage.TOKEN_EXPIRED)
		}

		try {
			const decoded = verifyToken(token, defaultOptions)
			ctx.state.user = decoded
		} catch (error) {
			throw new BusinessError(AuthMessage.AUTH_FAILED)
		}

		await next()
	} catch (error) {
		logger.error('认证失败:', error)

		if (error instanceof BusinessError) {
			ctx.status = 401
			ctx.body = {
				code: 401,
				message: error.message,
				data: null
			}
			return
		}

		ctx.status = 500
		ctx.body = {
			code: 500,
			message: '认证失败',
			error: error instanceof Error ? error.message : '未知错误'
		}
	}
}
