import { Context, Next } from 'koa'
import jwt from 'jsonwebtoken'
import { logger } from '../config/log4js'
import { redis } from '../config/redis'
import { StatusCode } from '../types/response'
import { AuthMessage } from '../enums/auth'
import { filterObject } from '../utils/auth'
interface AuthOptions {
	// JWT 配置
	jwt: {
		secret: string
		expiresIn: string | number
		refreshExpiresIn: string | number
		issuer?: string
		audience?: string
	}
	// 白名单路径
	whitelist: RegExp[]
	// 是否启用刷新令牌
	enableRefreshToken?: boolean
	// 是否检查IP
	checkIp?: boolean
	// 是否启用单点登录
	singleLogin?: boolean
	// 是否记录访问日志
	logging?: boolean
	// 自定义令牌获取方法
	getToken?: (ctx: Context) => string | null
}

export const defaultOptions: AuthOptions = {
	jwt: {
		secret: process.env.JWT_SECRET || 'secret-key',
		expiresIn: '3h',
		refreshExpiresIn: '7d',
		issuer: 'app-name',
		audience: 'app-users'
	},
	whitelist: [
		/^\/static/,
		/^\/login/,
		/^\/register/,
		/^\/upload/,
		/^\/apidocs/,
		/^\/swagger-json/
	],
	enableRefreshToken: true,
	checkIp: true,
	singleLogin: true,
	logging: true
}

export default function auth(options: Partial<AuthOptions> = {}) {
	const finalOptions = { ...defaultOptions, ...options }

	return async (ctx: Context, next: Next) => {
		// 检查是否在白名单中
		if (finalOptions.whitelist.some((path) => path.test(ctx.path))) {
			return next()
		}

		try {
			// 获取令牌
			const token = getTokenFromRequest(ctx, finalOptions.getToken)
			if (!token) {
				return ctx.error(
					AuthMessage.TOKEN_REQUIRED,
					StatusCode.UNAUTHORIZED
				)
			}

			// 验证令牌
			const decoded = await verifyToken(token, finalOptions)
			if (!decoded) {
				return ctx.error(
					AuthMessage.TOKEN_INVALID,
					StatusCode.UNAUTHORIZED
				)
			}

			// 检查令牌是否被注销
			// const isRevoked = await checkTokenRevocation(decoded.jti)
			// if (isRevoked) {
			// 	return ctx.error(
			// 		AuthMessage.TOKEN_REVOKED,
			// 		StatusCode.UNAUTHORIZED
			// 	)
			// }
			console.log(decoded, 'decoded', ctx.ip)
			// IP 检查
			if (finalOptions.checkIp && decoded.payload.ip !== ctx.ip) {
				return ctx.error(
					AuthMessage.IP_MISMATCH,
					StatusCode.UNAUTHORIZED
				)
			}

			// 单点登录检查
			// if (finalOptions.singleLogin) {
			// 	const currentToken = await redis.get(
			// 		`user:token:${decoded.userId}`
			// 	)
			// 	if (currentToken && currentToken !== token) {
			// 		return ctx.error(
			// 			AuthMessage.ACCOUNT_LOGGED_ELSEWHERE,
			// 			StatusCode.UNAUTHORIZED
			// 		)
			// 	}
			// }

			// 记录访问日志
			if (finalOptions.logging) {
				logger.info('Auth Access:', {
					userId: decoded.userId,
					path: ctx.path,
					method: ctx.method,
					ip: ctx.ip,
					userAgent: ctx.get('user-agent')
				})
			}
			// 将用户信息添加到上下文
			ctx.state.user = decoded.payload

			// 检查令牌是否即将过期，如果是则刷新
			await handleTokenRefresh(ctx, decoded, finalOptions)

			await next()
		} catch (err) {
			const error = err as any
			console.log(error, 'error')
			logger.error('Auth Error:', {
				path: ctx.path,
				method: ctx.method,
				ip: ctx.ip,
				error: error.message
			})

			if (error.name === 'TokenExpiredError') {
				return ctx.error(
					AuthMessage.TOKEN_EXPIRED,
					StatusCode.UNAUTHORIZED
				)
			}

			return ctx.error(AuthMessage.AUTH_FAILED, StatusCode.UNAUTHORIZED)
		}
	}
}

// 从请求中获取令牌
function getTokenFromRequest(
	ctx: Context,
	customGetToken?: AuthOptions['getToken']
): string | null {
	if (customGetToken) {
		return customGetToken(ctx)
	}

	const authorization = ctx.get('Authorization')
	if (authorization && authorization.startsWith('Bearer ')) {
		return authorization.slice(7)
	}

	return null
}

// 验证令牌
export async function verifyToken(
	token: string,
	options: AuthOptions = defaultOptions
): Promise<any> {
	return new Promise((resolve) => {
		jwt.verify(
			token,
			options.jwt.secret,
			{
				issuer: options.jwt.issuer,
				audience: options.jwt.audience
			},
			(err, decoded) => {
				if (err) {
					resolve(null)
				} else {
					resolve(decoded)
				}
			}
		)
	})
}

// 检查令牌是否被注销
async function checkTokenRevocation(jti: string): Promise<boolean> {
	const revoked = await redis.get(`token:revoked:${jti}`)
	return !!revoked
}

// 处理令牌刷新
async function handleTokenRefresh(
	ctx: Context,
	decoded: any,
	options: AuthOptions
) {
	if (!options.enableRefreshToken) return

	const now = Math.floor(Date.now() / 1000)
	const exp = decoded.exp
	const threshold = 60 * 30 // 30分钟

	if (exp - now < threshold) {
		const newToken = jwt.sign(
			{
				userId: decoded.userId,
				ip: ctx.ip,
				jti: decoded.jti
			},
			options.jwt.secret,
			{
				expiresIn: options.jwt.expiresIn,
				issuer: options.jwt.issuer,
				audience: options.jwt.audience
			}
		)

		ctx.set('X-New-Token', newToken)
	}
}

// 生成新的访问令牌
export function generateToken(payload: any, options: AuthOptions) {
	return jwt.sign(
		{
			...payload,
			jti: Math.random().toString(36).substr(2)
		},
		options.jwt.secret,
		{
			expiresIn: options.jwt.expiresIn,
			issuer: options.jwt.issuer,
			audience: options.jwt.audience
		}
	)
}

// 生成刷新令牌
export function generateRefreshToken(userId: number, options: AuthOptions) {
	return jwt.sign(
		{
			userId,
			type: 'refresh',
			jti: Math.random().toString(36).substr(2)
		},
		options.jwt.secret,
		{
			expiresIn: options.jwt.refreshExpiresIn,
			issuer: options.jwt.issuer,
			audience: options.jwt.audience
		}
	)
}
