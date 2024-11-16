import { Context } from 'koa'
import {
	request,
	summary,
	tags,
	query,
	path,
	body
} from 'koa-swagger-decorator'
import { departmentService } from '../services/departmentService'
import { logger } from '../config/log4js'
import { UserMessage } from '../enums/user'
import { createLogger } from '../utils/logger'
import { LogService as logService } from '../services/logService'
import { BusinessError } from '../utils/businessError'
export default class DepartmentController {
	@request('get', '/department/list')
	@tags(['部门管理'])
	@summary('获取部门列表')
	@query({
		pagenumber: {
			type: 'number',
			required: false,
			default: 1,
			description: '分页'
		},
		pagesize: {
			type: 'number',
			required: false,
			default: 10,
			description: '每页条数'
		},
		keyword: { type: 'string', required: false, description: '关键词' },
		status: { type: 'number', required: false, description: '状态' },
		startTime: { type: 'string', required: false, description: '开始时间' },
		endTime: { type: 'string', required: false, descriptin: '结束时间' }
	})
	static async getList(ctx: Context) {
		const startTime = Date.now()
		const loggers = createLogger(ctx)
		try {
			const result = await departmentService.getList(ctx.query)
			const responseTime = Date.now() - startTime
			logService.writeLog({
				...loggers,
				responseTime,
				status: 1,
				content: '获取部门列表成功'
			})
			return ctx.success(result, UserMessage.GET_DEPARTMENT_LIST_SUCCESS)
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
						: UserMessage.GET_DEPARTMENT_LIST_ERROR
			})
			if (error instanceof BusinessError) {
				return ctx.error(error.message)
			}
			return ctx.error(UserMessage.GET_DEPARTMENT_LIST_ERROR)
		}
	}

	@request('post', '/department/add')
	@tags(['部门管理'])
	@summary('添加部门')
	@body({
		name: { type: 'string', required: true },
		code: { type: 'string', required: true },
		parentid: { type: 'number', required: false },
		sort: { type: 'number', required: false },
		status: { type: 'number', required: false },
		remark: { type: 'string', required: false }
	})
	static async create(ctx: Context) {
		const startTime = Date.now()
		const loggers = createLogger(ctx)
		try {
			const result = await departmentService.create(ctx.request.body)
			const responseTime = Date.now() - startTime
			logService.writeLog({
				...loggers,
				responseTime,
				status: 1,
				content: '添加部门成功'
			})
			return ctx.success(result, UserMessage.CREATE_DEPARTMENT_SUCCESS)
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
						: UserMessage.CREATE_DEPARTMENT_ERROR
			})
			if (error instanceof BusinessError) {
				return ctx.error(error.message)
			}
			return ctx.error(UserMessage.CREATE_DEPARTMENT_ERROR)
		}
	}

	@request('put', '/department/update/{id}')
	@tags(['部门管理'])
	@summary('更新部门')
	@path({
		id: { type: 'number', required: true }
	})
	@body({
		name: { type: 'string', required: true },
		code: { type: 'string', required: true },
		parentid: { type: 'number', required: false },
		sort: { type: 'number', required: false },
		status: { type: 'number', required: false },
		remark: { type: 'string', required: false }
	})
	static async update(ctx: Context) {
		const startTime = Date.now()
		const loggers = createLogger(ctx)
		try {
			const { id } = ctx.params
			const result = await departmentService.update(
				Number(id),
				ctx.request.body
			)
			const responseTime = Date.now() - startTime
			logService.writeLog({
				...loggers,
				responseTime,
				status: 1,
				content: '更新部门成功'
			})
			return ctx.success(null, UserMessage.UPDATE_DEPARTMENT_SUCCESS)
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
						: UserMessage.UPDATE_DEPARTMENT_ERROR
			})
			if (error instanceof BusinessError) {
				return ctx.error(error.message)
			}
			return ctx.error(UserMessage.UPDATE_DEPARTMENT_ERROR)
		}
	}

	@request('delete', '/department/delete/{id}')
	@tags(['部门管理'])
	@summary('删除部门')
	@path({
		id: { type: 'number', required: true }
	})
	static async delete(ctx: Context) {
		const startTime = Date.now()
		const loggers = createLogger(ctx)
		try {
			const { id } = ctx.params
			await departmentService.delete(Number(id))
			const responseTime = Date.now() - startTime
			logService.writeLog({
				...loggers,
				responseTime,
				status: 1,
				content: '删除部门成功'
			})
			return ctx.success(null, UserMessage.DELETE_DEPARTMENT_SUCCESS)
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
						: UserMessage.DELETE_DEPARTMENT_ERROR
			})
			if (error instanceof BusinessError) {
				return ctx.error(error.message)
			}
			return ctx.error(UserMessage.DELETE_DEPARTMENT_ERROR)
		}
	}

	@request('get', '/department/detail/{id}')
	@tags(['部门管理'])
	@summary('获取部门详情')
	@path({
		id: { type: 'number', required: true }
	})
	static async getDetail(ctx: Context) {
		const startTime = Date.now()
		const loggers = createLogger(ctx)
		try {
			const { id } = ctx.params
			const result = await departmentService.getDetail(Number(id))
			if (!result) {
				return ctx.error(UserMessage.DEPARTMENT_NOT_FOUND)
			}
			const responseTime = Date.now() - startTime
			logService.writeLog({
				...loggers,
				responseTime,
				status: 1,
				content: '获取部门详情成功'
			})
			return ctx.success(
				result,
				UserMessage.GET_DEPARTMENT_DETAIL_SUCCESS
			)
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
						: UserMessage.DEPARTMENT_NOT_FOUND
			})
			if (error instanceof BusinessError) {
				return ctx.error(error.message)
			}
			return ctx.error(UserMessage.DEPARTMENT_NOT_FOUND)
		}
	}

	@request('put', '/department/status/{id}')
	@tags(['部门管理'])
	@summary('更新部门状态')
	@path({
		id: { type: 'number', required: true }
	})
	static async updateStatus(ctx: Context) {
		const startTime = Date.now()
		const loggers = createLogger(ctx)
		try {
			const { id } = ctx.params
			await departmentService.updateStatus(Number(id))
			const responseTime = Date.now() - startTime
			logService.writeLog({
				...loggers,
				responseTime,
				status: 1,
				content: '更新部门状态成功'
			})
			return ctx.success(
				null,
				UserMessage.UPDATE_DEPARTMENT_STATUS_SUCCESS
			)
		} catch (error) {
			const responseTime = Date.now() - startTime
			logService.writeLog({
				...loggers,
				responseTime,
				status: 2,
				content:
					error instanceof Error
						? error.message
						: UserMessage.UPDATE_DEPARTMENT_STATUS_ERROR
			})
			if (error instanceof BusinessError) {
				return ctx.error(error.message)
			}
			return ctx.error(UserMessage.UPDATE_DEPARTMENT_STATUS_ERROR)
		}
	}

	@request('get', '/department/tree')
	@tags(['部门管理'])
	@summary('获取部门树结构')
	static async getTree(ctx: Context) {
		const startTime = Date.now()
		const loggers = createLogger(ctx)
		try {
			const result = await departmentService.getList({
				pagesize: 999999, // 获取所有数据
				status: 1 // 只获取启用的部门
			})
			const responseTime = Date.now() - startTime
			logService.writeLog({
				...loggers,
				responseTime,
				status: 1,
				content: '获取部门树成功'
			})
			return ctx.success(
				result.list,
				UserMessage.GET_DEPARTMENT_LIST_SUCCESS
			)
		} catch (error) {
			const responseTime = Date.now() - startTime
			logService.writeLog({
				...loggers,
				responseTime,
				status: 2,
				content:
					error instanceof BusinessError
						? error.message
						: '获取部门树失败'
			})

			if (error instanceof BusinessError) {
				return ctx.error(error.message)
			}
			return ctx.error(UserMessage.GET_DEPARTMENT_LIST_ERROR)
		}
	}

	@request('get', '/department/users/{id}')
	@tags(['部门管理'])
	@summary('获取部门下的用户')
	@path({
		id: { type: 'number', required: true }
	})
	@query({
		pagenumber: { type: 'number', required: false, default: 1 },
		pagesize: { type: 'number', required: false, default: 10 }
	})
	static async getDepartmentUsers(ctx: Context) {
		const startTime = Date.now()
		const loggers = createLogger(ctx)
		try {
			const { id } = ctx.params
			const { pagenumber, pagesize } = ctx.query
			const result = await departmentService.getDepartmentUsers(
				Number(id),
				{
					pagenumber: Number(pagenumber),
					pagesize: Number(pagesize)
				}
			)
			const responseTime = Date.now() - startTime
			logService.writeLog({
				...loggers,
				responseTime,
				status: 1,
				content: '获取部门用户成功'
			})
			return ctx.success(result, UserMessage.GET_DEPARTMENT_USERS_SUCCESS)
		} catch (err) {
			const error = err as any
			const responseTime = Date.now() - startTime
			logService.writeLog({
				...loggers,
				responseTime,
				status: 2,
				content:
					err instanceof BusinessError
						? error.message
						: '获取部门用户失败'
			})
			if (err instanceof BusinessError) {
				return ctx.error(err.message)
			}
			return ctx.error('获取部门用户失败')
		}
	}
	// 往部门添加用户
	@request('post', '/department/addUser/{id}')
	@tags(['部门管理'])
	@summary('往部门添加用户')
	@path({
		id: { type: 'number', required: true }
	})
	@body({
		ids: { type: 'array', required: true }
	})
	static async addUser(ctx: Context) {
		const { id } = ctx.params
		const { ids } = ctx.request.body
		const startTime = Date.now()
		const loggers = createLogger(ctx)
		try {
			await departmentService.addUsers(Number(id), ids)
			const responseTime = Date.now() - startTime
			logService.writeLog({
				...loggers,
				responseTime,
				status: 1,
				content: '往部门添加用户成功'
			})
			return ctx.success(null, UserMessage.ADD_DEPARTMENT_USER_SUCCESS)
		} catch (err) {
			const error = err as any
			const responseTime = Date.now() - startTime
			logService.writeLog({
				...loggers,
				responseTime,
				status: 2,
				content: error.message
			})
			if (err instanceof BusinessError) {
				return ctx.error(err.message)
			}
			return ctx.error(UserMessage.ADD_DEPARTMENT_USER_ERROR)
		}
	}
}
