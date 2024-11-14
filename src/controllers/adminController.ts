import { Context } from 'koa'
import { request, summary, tags, body, query } from 'koa-swagger-decorator'
import { ErrorUtil } from '../utils/errorUtil'
import { AuthMessage } from '../enums/auth'
import userService from '../services/authService'
import { generateToken, defaultOptions } from '../middleware/auth'
import { logger } from '../config/log4js'
import { UserMessage } from '../enums'
import { CryptoUtil } from '../utils/cryptoUtil'
import UserModel from '../model/userModel'

// 登录参数验证
interface LoginParams {
	username: string
	password: string
}

// 注册参数验证
interface RegisterParams extends UserModel {
	confirmPassword: string
}

export default class AdminController {
	@request('get', '/login')
	@tags(['管理员'])
	@summary('管理员登录')
	@query({
		username: {
			type: 'string',
			required: true,
			description: '用户名/邮箱/手机号'
		},
		password: { type: 'string', required: true, description: '密码' }
	})
	static async login(ctx: Context) {
		const { username, password } = ctx.request
			.query as unknown as LoginParams

		try {
			// 参数验证
			ErrorUtil.assertParam(
				!!username?.trim(),
				AuthMessage.USERNAME_REQUIRED
			)
			ErrorUtil.assertParam(
				!!password?.trim(),
				AuthMessage.PASSWORD_REQUIRED
			)

			// 查找用户
			const user = await userService.findByUsername(username)
			if (!user) {
				ErrorUtil.throw(AuthMessage.USER_NOT_FOUND)
			}

			// 验证密码 - 使用解密后的密码进行验证
			const isValid = await user?.validatePassword(password)
			if (!isValid) {
				ErrorUtil.throw(AuthMessage.PASSWORD_ERROR)
			}

			// 生成 token
			const token = generateToken(
				{
					payload: {
						ip: ctx.ip,
						userId: user.id,
						username: user.username
					}
				},
				defaultOptions
			)

			const userInfo = await userService.userLogin(user.username)
			const result = {
				token: `Bearer ${token}`,
				userInfo
			}

			logger.info('管理员登录成功', {
				username,
				ip: ctx.ip,
				userAgent: ctx.get('user-agent')
			})

			return ctx.success(result, AuthMessage.LOGIN_SUCCESS)
		} catch (err) {
			const error = err as any
			logger.warn('管理员登录失败', {
				username,
				ip: ctx.ip,
				error: error.message
			})
			throw error
		}
	}

	@request('post', '/register')
	@tags(['管理员'])
	@summary('管理员注册')
	@body({
		username: { type: 'string', required: true, description: '用户名' },
		password: { type: 'string', required: true, description: '密码' },
		confirmPassword: {
			type: 'string',
			required: true,
			description: '确认密码'
		},
		email: { type: 'string', required: false, description: '邮箱' },
		phone: { type: 'string', required: false, description: '手机号' },
		nickname: { type: 'string', required: false, description: '昵称' },
		roles: { type: 'array', required: false, description: '角色' }
	})
	static async register(ctx: Context) {
		const params = ctx.request.body as RegisterParams

		try {
			// 基本参数验证
			ErrorUtil.assertParam(
				!!params.username?.trim(),
				AuthMessage.USERNAME_REQUIRED
			)
			ErrorUtil.assertParam(
				!!params.password?.trim(),
				AuthMessage.PASSWORD_REQUIRED
			)
			ErrorUtil.assertParam(
				!!params.confirmPassword?.trim(),
				AuthMessage.CONFIRM_PASSWORD_REQUIRED
			)
			ErrorUtil.assertParam(
				params.password === params.confirmPassword,
				AuthMessage.PASSWORD_NOT_MATCH
			)

			// 用户名格式验证
			ErrorUtil.assertParam(
				/^[a-zA-Z0-9_]{4,20}$/.test(params.username),
				AuthMessage.USERNAME_FORMAT_ERROR
			)

			// 密码强度验证
			ErrorUtil.assertParam(
				/^[a-zA-Z0-9]{6,20}$/.test(params.password),
				AuthMessage.PASSWORD_FORMAT_ERROR
			)

			// 邮箱格式验证（如果提供）
			if (params.email) {
				ErrorUtil.assertParam(
					/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(params.email),
					AuthMessage.EMAIL_FORMAT_ERROR
				)
			}

			// 手机号格式验证（如果提供）
			if (params.phone) {
				ErrorUtil.assertParam(
					/^1[3-9]\d{9}$/.test(params.phone),
					AuthMessage.PHONE_FORMAT_ERROR
				)
			}

			// 检查用户名是否已存在
			const existingUser = await userService.findByUsername(
				params.username
			)
			if (existingUser) {
				ErrorUtil.throw(AuthMessage.USER_EXISTS)
			}
			const { confirmPassword, ...userInfo } = params
			// 创建用户
			const user = await userService.create(userInfo as UserModel)
			// 返回结果
			const result = {
				userInfo: user
			}

			// 记录注册日志
			logger.info('管理员注册成功', {
				username: params.username,
				ip: ctx.ip
			})

			return ctx.success(null, AuthMessage.REGISTER_SUCCESS)
		} catch (err) {
			const error = err as any
			// 记录失败日志
			logger.error('管理员注册失败', {
				username: params.username,
				ip: ctx.ip,
				error: error.message
			})

			throw error
		}
	}

	@request('get', '/admin/info')
	@tags(['管理员'])
	@summary('获取管理员信息')
	static async getInfo(ctx: Context) {
		try {
			const { userId } = ctx.state.user
			const user = await userService.findById(userId)

			if (!user) {
				ErrorUtil.throw(AuthMessage.USER_NOT_FOUND)
			}

			const userInfo = {
				id: user.id,
				username: user.username,
				nickname: user.nickname,
				email: user.email,
				phone: user.phone,
				avatar: user.avatar,
				roles: user.roles
			}

			return ctx.success(userInfo)
		} catch (err) {
			const error = err as any
			logger.error('获取管理员信息失败', {
				userId: ctx.state.user?.id,
				error: error.message
			})
			throw error
		}
	}

	@request('get', '/logout')
	@tags(['管理员'])
	@summary('退出登录')
	static async logout(ctx: Context) {
		try {
			const token = ctx.headers.authorization?.split(' ')[1]
			if (token) {
				// 将token加入黑名单
			}
			ctx.success(null, UserMessage.LOGOUT_SUCCESS)
		} catch (error) {
			ctx.error(UserMessage.LOGOUT_ERROR)
		}
	}
}
