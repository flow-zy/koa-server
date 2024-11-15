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
		try {
			const result = await departmentService.getList(ctx.query)
			ctx.success(result)
		} catch (error) {
			logger.error('获取部门列表失败:', error)
			ctx.error(UserMessage.GET_DEPARTMENT_LIST_ERROR)
		}
	}

	@request('post', '/department/add')
	@tags(['部门管理'])
	@summary('添加部门')
	@body({
		name: { type: 'string', required: true },
		code: { type: 'string', required: true },
		parentid: { type: 'number', required: false },
		leader_id: { type: 'number', required: false },
		leader: { type: 'string', required: false },
		phone: { type: 'string', required: false },
		email: { type: 'string', required: false },
		sort: { type: 'number', required: false },
		status: { type: 'number', required: false },
		remark: { type: 'string', required: false }
	})
	static async create(ctx: Context) {
		try {
			const result = await departmentService.create(ctx.request.body)
			ctx.success(result, UserMessage.CREATE_DEPARTMENT_SUCCESS)
		} catch (error) {
			logger.error('添加部门失败:', error)
			ctx.error(
				error instanceof Error
					? error.message
					: UserMessage.CREATE_DEPARTMENT_ERROR
			)
		}
	}

	@request('put', '/department/update/{id}')
	@tags(['部门管理'])
	@summary('更新部门')
	@path({
		id: { type: 'number', required: true }
	})
	static async update(ctx: Context) {
		try {
			const { id } = ctx.params
			const result = await departmentService.update(
				Number(id),
				ctx.request.body
			)
			ctx.success(result, UserMessage.UPDATE_DEPARTMENT_SUCCESS)
		} catch (error) {
			logger.error('更新部门失败:', error)
			ctx.error(
				error instanceof Error
					? error.message
					: UserMessage.UPDATE_DEPARTMENT_ERROR
			)
		}
	}

	@request('delete', '/department/delete/{id}')
	@tags(['部门管理'])
	@summary('删除部门')
	@path({
		id: { type: 'number', required: true }
	})
	static async delete(ctx: Context) {
		try {
			const { id } = ctx.params
			await departmentService.delete(Number(id))
			ctx.success(null, UserMessage.DELETE_DEPARTMENT_SUCCESS)
		} catch (error) {
			logger.error('删除部门失败:', error)
			ctx.error(
				error instanceof Error
					? error.message
					: UserMessage.DELETE_DEPARTMENT_ERROR
			)
		}
	}

	@request('get', '/department/detail/{id}')
	@tags(['部门管理'])
	@summary('获取部门详情')
	@path({
		id: { type: 'number', required: true }
	})
	static async getDetail(ctx: Context) {
		try {
			const { id } = ctx.params
			const result = await departmentService.getDetail(Number(id))
			if (!result) {
				return ctx.error(UserMessage.DEPARTMENT_NOT_FOUND)
			}
			ctx.success(result)
		} catch (error) {
			logger.error('获取部门详情失败:', error)
			ctx.error(UserMessage.DEPARTMENT_NOT_FOUND)
		}
	}

	@request('put', '/department/status/{id}')
	@tags(['部门管理'])
	@summary('更新部门状态')
	@path({
		id: { type: 'number', required: true }
	})
	static async updateStatus(ctx: Context) {
		try {
			const { id } = ctx.params
			await departmentService.updateStatus(Number(id))
			ctx.success(null, UserMessage.UPDATE_DEPARTMENT_STATUS_SUCCESS)
		} catch (error) {
			logger.error('更新部门状态失败:', error)
			ctx.error(
				error instanceof Error
					? error.message
					: UserMessage.UPDATE_DEPARTMENT_STATUS_ERROR
			)
		}
	}

	@request('get', '/department/tree')
	@tags(['部门管理'])
	@summary('获取部门树结构')
	static async getTree(ctx: Context) {
		try {
			const result = await departmentService.getList({
				pagesize: 999999, // 获取所有数据
				status: 1 // 只获取启用的部门
			})
			ctx.success(result.list) // 返回树形结构数据
		} catch (error) {
			logger.error('获取部门树失败:', error)
			ctx.error(UserMessage.GET_DEPARTMENT_LIST_ERROR)
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
			ctx.success(result)
		} catch (error) {
			logger.error('获取部门用户失败:', error)
			ctx.error('获取部门用户失败')
		}
	}
}
