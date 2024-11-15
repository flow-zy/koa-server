import { Context } from 'koa'
import {
	body,
	params,
	path,
	query,
	request,
	summary,
	tags
} from 'koa-swagger-decorator'

import userService from '../services/useServices'
import UserModel from '../model/userModel'
import { HttpError, UserMessage } from '../enums'
import RoleModel from '../model/roleModel'
import { filterObject } from '../utils/auth'
import { logger } from '../config/log4js'
import RoleUserModel from '../model/roleUserModel'
import { CryptoUtil } from '../utils/cryptoUtil'
import { BusinessError } from '../middleware/errHandler'
export default class UserController {
	@request('get', '/user/info/{id}')
	@summary(['用户信息'])
	@path({
		id: { type: 'number', required: true, description: '用户ID' }
	})
	@tags(['用户管理'])
	static async getInfo(ctx: Context) {
		try {
			const { id } = ctx.params
			const result = await userService.getUserInfo(Number(id))
			return ctx.success(result, UserMessage.USER_INFO_SUCCESS)
		} catch (error) {
			logger.error('获取用户信息失败:', error)
			if (error instanceof BusinessError) {
				return ctx.error(error.message)
			}
			return ctx.error(UserMessage.USER_INFO_ERROR)
		}
	}

	@request('put', '/user/status/{id}')
	@summary(['用户状态'])
	@tags(['用户管理'])
	@path({
		id: { type: 'number', required: true, description: '用户ID' }
	})
	static async updateStatus(ctx: Context) {
		const params = ctx.params as unknown as UserModel
		console.log(params)
		try {
			const res = await userService.updStatus(params.id)
			if (!res) return ctx.error(UserMessage.USER_STATUS_ERROR)
			return ctx.success(null, UserMessage.USER_STATUS_SUCCESS)
		} catch (error) {
			throw ctx.error(HttpError.HTTP)
		}
	}

	@request('get', '/user/list')
	@summary(['用户列表'])
	@tags(['用户管理'])
	@query({
		pagesize: { type: 'number', require: true, description: '每页条数' },
		pagenumber: { type: 'number', require: true, description: '页码' },
		keyword: { type: 'string', require: false, description: '关键词' },
		status: { type: 'number', require: false, description: '用户状态' },
		gender: { type: 'number', require: false, description: '性别' },
		startTime: { type: 'string', require: false, description: '开始时间' },
		endTime: { type: 'date', require: false, description: '结束时间' }
	})
	static async getAllUser(ctx: Context) {
		const params = ctx.request.query as unknown as any
		try {
			const res = await userService.getList(params)
			if (res) return ctx.success(res, UserMessage.USER_LIST_SUCCESS)
			return ctx.error(UserMessage.USER_LIST_ERROR)
		} catch (error) {
			throw ctx.error(HttpError.HTTP)
		}
	}

	@summary(['修改用户信息'])
	@request('put', '/user/upd/info')
	@tags(['用户管理'])
	@body({
		id: { type: 'number', required: true, description: '用户id' },
		username: { type: 'string', required: true, description: '用户名' },
		gender: { type: 'number', required: false, description: '性别' },
		roles: { type: 'array<number>', required: false, description: '角色' },
		departmentId: {
			type: 'number',
			required: false,
			description: '部门ID'
		},
		nickname: { type: 'string', required: false, description: '昵称' },
		email: { type: 'string', required: false, description: '邮箱' },
		phone: { type: 'string', required: false, description: '手机号' },
		avatar: { type: 'string', required: false, description: '头像' },
		remark: { type: 'string', required: false, description: '备注' },
		sort: { type: 'number', required: false, description: '排序' },
		status: { type: 'number', required: false, description: '状态' }
	})
	static async updUserInfo(ctx: Context) {
		const params = ctx.request.body as UserModel & { roles: number[] }
		const existUser = await userService.findByUsername(params.username)
		if (!existUser) {
			return ctx.error(UserMessage.USER_NOT_EXIST)
		}

		try {
			const res = await userService.updUserInfo(params)
			if (!res) return ctx.error(UserMessage.USER_UPD_INFO_ERROR)
			return ctx.success(null, UserMessage.USER_UPD_INFO_SUCCESS)
		} catch (error) {
			throw ctx.error(HttpError.HTTP)
		}
	}

	// 批量删除用户
	@request('delete', '/user/batch/delete/{ids}')
	@summary(['批量删除用户'])
	@tags(['用户管理'])
	@path({
		ids: { type: 'array<number>', required: true, description: '用户ID' }
	})
	static async batchDelete(ctx: Context) {
		const params = ctx.params as unknown as {
			ids: string
		}
		try {
			const ids = params.ids.split(',').map(Number)
			const res = await userService.batchDelete(ids)
			if (!res) return ctx.error(UserMessage.USER_BATCH_USER_ERROR)
			return ctx.success(null, UserMessage.USER_BATCH_USER_SUCCESS)
		} catch (error) {
			throw ctx.error(HttpError.HTTP)
		}
	}

	// 给用户增加角色
	@request('put', '/user/role/{id}')
	@summary(['用户角色设置'])
	@tags(['用户管理'])
	@path({
		id: { type: 'number', required: true, description: '用户ID' }
	})
	@query({
		roles: {
			type: 'array<number>',
			required: true,
			description: '角色id'
		}
	})
	static async updUserRole(ctx: Context) {
		const params = ctx.request.body as unknown as {
			roles: RoleModel['id'][]
		}

		try {
			const id = ctx.params.id
			const res = await userService.updUserRole(id, params.roles)
			if (res) return ctx.error(UserMessage.USER_ROLE_ERROR)
			return ctx.success(null, UserMessage.USER_ROLE_SUCCESS)
		} catch (error) {
			throw ctx.error(HttpError.HTTP)
		}
	}

	// 重置密码
	@request('put', '/user/updpwd/{id}')
	@body({
		password: { type: 'string', required: true, description: '用户密码' },
		confirmPassword: {
			type: 'string',
			required: true,
			description: '确认密码'
		}
	})
	@tags(['用户管理'])
	@summary(['重置密码'])
	static async updPassword(ctx: Context) {
		const { id } = ctx.params
		const { password = '', confirmPassword = '' } = ctx.request.body
		try {
			// 校验新密码与旧密码是否一致
			const user = await userService.findById(id)
			if (!user) return ctx.error(UserMessage.USER_NOT_EXIST)
			if (password === user.password)
				return ctx.error(UserMessage.NEW_PASSWORD_NOT_MATCH)
			if (password !== confirmPassword)
				return ctx.error(UserMessage.PASSWORD_NOT_MATCH)
			const res = await userService.updPassword({ id, password })
			if (!res) return ctx.error(UserMessage.USER_PASSWORD_ERROR)
			return ctx.success(null, UserMessage.USER_PASSWORD_SUCCESS)
		} catch (error) {
			throw ctx.error(HttpError.HTTP)
		}
	}

	// 修改用户头像
	@request('put', '/user/avatar/{id}')
	@path({
		id: { type: 'number', required: true, description: '用户ID' }
	})
	@body({
		avatar: { type: 'string', required: true, description: '头像' }
	})
	@tags(['用户管理'])
	@summary(['修改用户头像'])
	static async updAvatar(ctx: Context) {
		const { id } = ctx.params
		try {
			const res = await userService.updAvatar(
				id,
				ctx.request.body?.avatar
			)
			if (!res) return ctx.error(UserMessage.USER_AVATAR_ERROR)
			return ctx.success(null, UserMessage.USER_AVATAR_SUCCESS)
		} catch (err) {
			throw ctx.error(HttpError.HTTP)
		}
	}
	// 添加用户
	@request('post', '/user/add')
	@summary(['添加用户'])
	@tags(['用户管理'])
	@body({
		username: { type: 'string', required: true, description: '用户名' },
		nickname: { type: 'string', required: false, description: '昵称' },
		email: { type: 'string', required: false, description: '邮箱' },
		phone: { type: 'string', required: false, description: '手机号' },
		roles: { type: 'array<number>', required: false, description: '角色' },
		departmentId: {
			type: 'number',
			required: true,
			description: '部门ID'
		},
		avatar: { type: 'string', required: false, description: '头像' },
		remark: { type: 'string', required: false, description: '备注' },
		sort: { type: 'number', required: false, description: '排序' },
		status: { type: 'number', required: false, description: '状态' }
	})
	static async addUser(ctx: Context) {
		const requestBody = ctx.request.body
		// 参数验证
		if (!requestBody.username?.trim()) {
			return ctx.error(UserMessage.USERNAME_REQUIRED)
		}
		// 检查用户名是否存在
		const existUser = await userService.findByUsername(requestBody.username)
		if (existUser) {
			return ctx.error(UserMessage.USER_EXIST)
		}
		// 查询超级管理员是否存在
		const hasSuper = (await RoleUserModel.findAll()).some((item) => {
			return item.role_id === 1
		})
		// @ts-ignore
		if (hasSuper && requestBody.roles?.includes(1))
			return ctx.error(UserMessage.SUPER_EXIT)
		try {
			const res = await userService.addUser(requestBody)
			if (!res) return ctx.error(UserMessage.USER_ADD_ERROR)
			logger.info(`用户${requestBody.username}添加成功`, {
				username: requestBody.username,
				ip: ctx.ip,
				userAgent: ctx.get('user-agent')
			})
			return ctx.success(null, UserMessage.USER_ADD_SUCCESS)
		} catch (err) {
			const error = err as any
			logger.error(error.message)
			throw ctx.send(HttpError.HTTP, 500)
		}
	}

	@request('get', '/user/profile')
	@tags(['个人中心'])
	@summary('获取个人信息')
	static async getProfile(ctx: Context) {
		try {
			const { userId } = ctx.state.user
			const user = await userService.findById(userId)
			if (!user) {
				return ctx.error(UserMessage.USER_NOT_EXIST)
			}

			const result = {
				id: user.id,
				username: user.username,
				nickname: user.nickname,
				email: user.email,
				phone: user.phone,
				avatar: user.avatar,
				gender: user.gender,
				department: user.department,
				roles: user.roles
			}

			return ctx.success(result, UserMessage.USER_INFO_SUCCESS)
		} catch (error) {
			logger.error('获取个人信息失败:', error)
			return ctx.error(UserMessage.USER_INFO_ERROR)
		}
	}

	@request('put', '/user/profile')
	@tags(['个人中心'])
	@summary('更新个人信息')
	@body({
		nickname: { type: 'string', required: false },
		email: { type: 'string', required: false },
		phone: { type: 'string', required: false },
		avatar: { type: 'string', required: false },
		gender: { type: 'number', required: false },
		remark: { type: 'string', required: false },
		username: { type: 'string', required: false }
	})
	static async updateProfile(ctx: Context) {
		try {
			const { userId } = ctx.state.user
			const updateData = ctx.request.body

			// 邮箱格式验证
			if (
				updateData.email &&
				!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(updateData.email)
			) {
				return ctx.error(UserMessage.EMAIL_FORMAT_ERROR)
			}

			// 手机号格式验证
			if (updateData.phone && !/^1[3-9]\d{9}$/.test(updateData.phone)) {
				return ctx.error(UserMessage.PHONE_FORMAT_ERROR)
			}

			const result = await userService.updUserInfo({
				id: userId,
				...updateData
			})

			if (!result) {
				return ctx.error(UserMessage.USER_UPD_INFO_ERROR)
			}

			return ctx.success(null, UserMessage.USER_UPD_INFO_SUCCESS)
		} catch (error) {
			logger.error('更新个人信息失败:', error)
			return ctx.error(UserMessage.USER_UPD_INFO_ERROR)
		}
	}

	@request('put', '/user/password')
	@tags(['个人中心'])
	@summary('修改密码')
	@body({
		oldPassword: { type: 'string', required: true },
		newPassword: { type: 'string', required: true },
		confirmPassword: { type: 'string', required: true }
	})
	static async updatePassword(ctx: Context) {
		try {
			const { userId } = ctx.state.user
			const { oldPassword, newPassword, confirmPassword } =
				ctx.request.body

			// 参数验证
			if (
				!oldPassword?.trim() ||
				!newPassword?.trim() ||
				!confirmPassword?.trim()
			) {
				return ctx.error(UserMessage.PASSWORD_REQUIRED)
			}

			// 新密码与确认密码是否一致
			if (newPassword !== confirmPassword) {
				return ctx.error(UserMessage.PASSWORD_NOT_MATCH)
			}

			// 密码格式验证（至少6位，包含数字和字母）
			if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,20}$/.test(newPassword)) {
				return ctx.error(UserMessage.PASSWORD_FORMAT_ERROR)
			}

			// 解密密码
			const decryptedNewPassword = CryptoUtil.aesDecrypt(newPassword)

			// 验证旧密码
			const user = await userService.findById(userId)
			if (!user) {
				return ctx.error(UserMessage.USER_NOT_EXIST)
			}
			const isValidOldPassword = oldPassword ===user.password
			if (!isValidOldPassword) {
				return ctx.error(UserMessage.OLD_PASSWORD_ERROR)
			}

			// 更新密码
			const result = await userService.updPassword({
				id: userId,
				password: decryptedNewPassword
			})
			if (!result) {
				return ctx.error(UserMessage.USER_PASSWORD_ERROR)
			}

			return ctx.success(null, UserMessage.USER_PASSWORD_SUCCESS)
		} catch (error) {
			logger.error('修改密码失败:', error)
			return ctx.error(UserMessage.USER_PASSWORD_ERROR)
		}
	}

	@request('put', '/user/avatar')
	@tags(['个人中心'])
	@summary('更新头像')
	@body({
		avatar: { type: 'string', required: true, description: '头像' }
	})
	static async updateAvatar(ctx: Context) {
		try {
			const { userId } = ctx.state.user
			const file = ctx.request.body?.avatar

			if (!file) {
				return ctx.error(UserMessage.AVATAR_UPLOAD_ERROR)
			}
			// 直接使用 updAvatar 方法
			const result = await userService.updAvatar(userId, file)

			if (!result) {
				return ctx.error(UserMessage.USER_AVATAR_ERROR)
			}

			return ctx.success(null,
				UserMessage.USER_AVATAR_SUCCESS
			)
		} catch (error) {
			logger.error('更新头像失败:', error)
			return ctx.error(UserMessage.USER_AVATAR_ERROR)
		}
	}
}
