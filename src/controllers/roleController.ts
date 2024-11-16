import { Context } from 'koa'
import {
	tags,
	summary,
	request,
	query,
	body,
	path
} from 'koa-swagger-decorator'
import roleService from '../services/roleService'
import { RoleMessage } from '../enums/role'
import RoleModel from '../model/roleModel'
import { ParamsType } from '../types'
import { HttpError } from '../enums'
import { createLogger } from '../utils/logger'
import { LogService as logService } from '../services/logService'
import { BusinessError } from '../utils/businessError'
export default class RoleController {
	@request('get', '/role/list')
	@tags(['角色管理'])
	@summary(['获取角色列表'])
	@query({
		pagesize: { type: 'number', require: true, description: '每页条数' },
		pagenumber: { type: 'number', require: true, description: '页码' },
		name: { type: 'string', require: false },
		startTime: { type: 'string', require: false },
		endTime: { type: 'date', require: false }
	})
	static async getRoleList(ctx: Context) {
		const startTime = Date.now()
		const loggers = createLogger(ctx)
		try {
			const params = ctx.request.query as unknown as ParamsType<RoleModel>
			const res = await roleService.getRoleList(params)
			if (!res) return ctx.send(RoleMessage.ROLE_LIST_ERROR, 201)
			const responseTime = Date.now() - startTime
			logService.writeLog({
				...loggers,
				responseTime,
				status: 1,
				content: '获取角色列表成功'
			})
			return ctx.send(RoleMessage.ROLE_LIST_SUCCESS, 200, res)
		} catch (err) {
			const error = err as any
			const responseTime = Date.now() - startTime
			logService.writeLog({
				...loggers,
				responseTime,
				status: 2,
				content:
					error instanceof BusinessError
						? error.message
						: RoleMessage.ROLE_LIST_ERROR
			})
			if (error instanceof BusinessError) {
				return ctx.error(error.message)
			}
			return ctx.send(HttpError.HTTP, 500)
		}
	}
	// 获取全部的角色没有分
	@request('get', '/role/all')
	@tags(['角色管理'])
	@summary(['获取全部的角色'])
	static async getAllRole(ctx: Context) {
		const startTime = Date.now()
		const loggers = createLogger(ctx)
		try {
			const res = await roleService.getAllRole()
			if (!res) return ctx.send(RoleMessage.ROLE_LIST_ERROR, 201)
			const responseTime = Date.now() - startTime
			logService.writeLog({
				...loggers,
				responseTime,
				status: 1,
				content: '获取全部角色成功'
			})
			return ctx.send(RoleMessage.ROLE_LIST_SUCCESS, 200, res)
		} catch (err) {
			const error = err as any
			const responseTime = Date.now() - startTime
			logService.writeLog({
				...loggers,
				responseTime,
				status: 2,
				content:
					error instanceof BusinessError
						? error.message
						: RoleMessage.ROLE_LIST_ERROR
			})
			if (error instanceof BusinessError) {
				return ctx.error(error.message)
			}
			return ctx.send(HttpError.HTTP, 500)
		}
	}

	@request('post', '/role/add')
	@tags(['角色管理'])
	@summary(['添加角色'])
	@body({
		name: {
			type: 'string',
			required: true,
			description: '角色名称'
		},
		code: {
			type: 'string',
			required: true,
			description: '角色编码'
		},
		sort: {
			type: 'number',
			required: false,
			default: 1,
			description: '排序'
		},
		status: {
			type: 'number',
			required: false,
			default: 1,
			description: '状态：0-禁用 1-启用'
		},
		remark: {
			type: 'string',
			required: false,
			description: '备注'
		},
		menus: {
			type: 'array',
			required: false,
			description: '菜单列表'
		},
		permissions: {
			type: 'array',
			required: false,
			description: '权限列表'
		}
	})
	static async addRole(ctx: Context) {
		const startTime = Date.now()
		const loggers = createLogger(ctx)
		try {
			const params = ctx.request.body as RoleModel
			const res = await roleService.addRole(params)
			if (!res) return ctx.send(RoleMessage.ROLE_ADD_ERROR, 201)
			const responseTime = Date.now() - startTime
			logService.writeLog({
				...loggers,
				responseTime,
				status: 1,
				content: '添加角色成功'
			})
			return ctx.send(RoleMessage.ROLE_ADD_SUCCESS, 200)
		} catch (err) {
			const error = err as any
			const responseTime = Date.now() - startTime
			logService.writeLog({
				...loggers,
				responseTime,
				status: 2,
				content:
					error instanceof BusinessError
						? error.message
						: RoleMessage.ROLE_ADD_ERROR
			})
			if (error instanceof BusinessError) {
				return ctx.error(error.message)
			}
			return ctx.send(HttpError.HTTP, 500)
		}
	}

	@request('delete', '/role/delete/{id}')
	@tags(['角色管理'])
	@summary(['删除角色'])
	static async deleteRole(ctx: Context) {
		const startTime = Date.now()
		const loggers = createLogger(ctx)
		try {
			const id = parseInt(ctx.params.id)
			if (!id) return ctx.send(RoleMessage.ROLE_DELETE_ERROR, 201)

			const res = await roleService.deleteRole(id)
			if (!res) return ctx.send(RoleMessage.ROLE_DELETE_ERROR, 201)
			const responseTime = Date.now() - startTime
			logService.writeLog({
				...loggers,
				responseTime,
				status: 1,
				content: '删除角色成功'
			})
			return ctx.send(RoleMessage.ROLE_DELETE_SUCCESS, 200)
		} catch (err) {
			const error = err as any
			const responseTime = Date.now() - startTime
			logService.writeLog({
				...loggers,
				responseTime,
				status: 2,
				content:
					error instanceof BusinessError
						? error.message
						: RoleMessage.ROLE_DELETE_ERROR
			})
			if (error instanceof BusinessError) {
				return ctx.error(error.message)
			}
			return ctx.send(HttpError.HTTP, 500)
		}
	}

	@request('put', '/role/update/{id}')
	@tags(['角色管理'])
	@summary(['修改角色'])
	@path({
		id: {
			type: 'number',
			required: true
		}
	})
	@body({
		name: {
			type: 'string',
			required: true,
			description: '角色名称'
		},
		code: {
			type: 'string',
			required: true,
			description: '角色编码'
		},
		sort: {
			type: 'number',
			required: false,
			default: 1,
			description: '排序'
		},
		status: {
			type: 'number',
			required: false,
			default: 1,
			description: '状态：0-禁用 1-启用'
		},
		remark: {
			type: 'string',
			required: false,
			description: '备注'
		},
		menus: {
			type: 'array',
			required: false,
			description: '菜单列表'
		},
		permissions: {
			type: 'array',
			required: false,
			description: '权限列表'
		}
	})
	static async updateRole(ctx: Context) {
		const startTime = Date.now()
		const loggers = createLogger(ctx)
		try {
			const id = parseInt(ctx.params.id)
			const params = ctx.request.body as Partial<RoleModel>

			if (!id) return ctx.send(RoleMessage.ROLE_UPDATE_ERROR, 201)

			const res = await roleService.updateRole(id, params)
			if (!res) return ctx.send(RoleMessage.ROLE_UPDATE_ERROR, 201)
			const responseTime = Date.now() - startTime
			logService.writeLog({
				...loggers,
				responseTime,
				status: 1,
				content: '修改角色成功'
			})
			return ctx.send(RoleMessage.ROLE_UPDATE_SUCCESS, 200)
		} catch (err) {
			const error = err as any
			const responseTime = Date.now() - startTime
			logService.writeLog({
				...loggers,
				responseTime,
				status: 2,
				content:
					error instanceof BusinessError
						? error.message
						: RoleMessage.ROLE_UPDATE_ERROR
			})
			if (error instanceof BusinessError) {
				return ctx.error(error.message)
			}
			return ctx.send(HttpError.HTTP, 500)
		}
	}

	@request('put', '/role/status/{id}')
	@tags(['角色管理'])
	@summary('切换角色状态')
	@path({
		id: {
			type: 'number',
			required: true,
			description: '角色id'
		}
	})
	static async changeStatus(ctx: Context) {
		const startTime = Date.now()
		const loggers = createLogger(ctx)
		try {
			const id = parseInt(ctx.params.id)
			if (!id) return ctx.send(RoleMessage.ROLE_PARAMS_ERROR, 201)

			const res = await roleService.changeStatus(id)
			if (!res) return ctx.send(RoleMessage.ROLE_STATUS_ERROR, 201)
			const responseTime = Date.now() - startTime
			logService.writeLog({
				...loggers,
				responseTime,
				status: 1,
				content: '切换角色状态成功'
			})
			return ctx.send(RoleMessage.ROLE_STATUS_SUCCESS, 200)
		} catch (err) {
			const error = err as any
			const responseTime = Date.now() - startTime
			logService.writeLog({
				...loggers,
				responseTime,
				status: 2,
				content:
					error instanceof BusinessError
						? error.message
						: RoleMessage.ROLE_STATUS_ERROR
			})
			if (error instanceof BusinessError) {
				return ctx.error(error.message)
			}
			return ctx.send(HttpError.HTTP, 500)
		}
	}

	@request('get', '/role/detail/{id}')
	@tags(['角色管理'])
	@summary(['获取角色详情'])
	@path({
		id: {
			type: 'number',
			required: true
		}
	})
	static async getRoleDetail(ctx: Context) {
		const startTime = Date.now()
		const loggers = createLogger(ctx)
		try {
			const { id } = ctx.params

			// 参数验证
			if (!id) {
				return ctx.error(RoleMessage.ROLE_ID_REQUIRED)
			}

			// 获取角色详情
			const roleDetail = await roleService.getRoleDetail(Number(id))
			if (!roleDetail) {
				return ctx.error(RoleMessage.ROLE_NOT_EXIST)
			}
			const responseTime = Date.now() - startTime
			logService.writeLog({
				...loggers,
				responseTime,
				status: 1,
				content: '获取角色详情成功'
			})
			return ctx.success(roleDetail, RoleMessage.GET_ROLE_DETAIL_SUCCESS)
		} catch (err) {
			const error = err as any
			const responseTime = Date.now() - startTime
			logService.writeLog({
				...loggers,
				responseTime,
				status: 2,
				content:
					error instanceof BusinessError
						? error.message
						: RoleMessage.SYSTEM_ERROR
			})
			if (error instanceof BusinessError) {
				return ctx.error(error.message)
			}
			return ctx.error(RoleMessage.SYSTEM_ERROR, 500)
		}
	}
}
