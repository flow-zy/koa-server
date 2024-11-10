import { Context } from 'koa'
import { permissionService } from '../services/permissionService'
import { PermissionMessage } from '../enums/permissionMessage'
import { BusinessError } from '../utils/businessError'
import { logger } from '../config/log4js'
import { request, summary, tags } from 'koa-swagger-decorator'

export class PermissionController {
	@request('post', '/permission/create')
	@tags(['Permission'])
	@summary('增加权限')
	static async create(ctx: Context) {
		try {
			const data = ctx.request.body
			const result = await permissionService.create(data)
			return ctx.success(result, PermissionMessage.CREATE_SUCCESS)
		} catch (error) {
			logger.error('创建权限错误:', error)

			if (error instanceof BusinessError) {
				return ctx.error(error.message)
			}

			return ctx.error(PermissionMessage.CREATE_ERROR)
		}
	}

	/**
	 * 更新权限
	 */
	@request('post', '/permission/update/{id}')
	@tags(['Permission'])
	@summary('更新权限')
	static async update(ctx: Context) {
		try {
			const { id } = ctx.params
			const data = ctx.request.body
			const result = await permissionService.update(Number(id), data)
			return ctx.success(result, PermissionMessage.UPDATE_SUCCESS)
		} catch (error) {
			logger.error('更新权限错误:', error)

			if (error instanceof BusinessError) {
				return ctx.error(error.message)
			}

			return ctx.error(PermissionMessage.UPDATE_ERROR)
		}
	}

	/**
	 * 删除权限
	 */
	@request('post', '/permission/delete/{id}')
	@tags(['Permission'])
	@summary('删除权限')
	static async delete(ctx: Context) {
		try {
			const { id } = ctx.params
			await permissionService.delete(Number(id))
			return ctx.success(null, PermissionMessage.DELETE_SUCCESS)
		} catch (error) {
			console.error('删除权限错误:', error)
			return ctx.error(PermissionMessage.DELETE_ERROR)
		}
	}

	/**
	 * 获取权限详情
	 */
	@request('get', '/permission/detail/{id}')
	@tags(['Permission'])
	@summary('获取权限详情')
	static async getDetail(ctx: Context) {
		try {
			const { id } = ctx.params
			const result = await permissionService.getDetail(Number(id))
			if (!result) {
				return ctx.error(PermissionMessage.NOT_EXIST)
			}
			return ctx.success(result, PermissionMessage.GET_DETAIL_SUCCESS)
		} catch (error) {
			console.error('获取权限详情错误:', error)
			return ctx.error(PermissionMessage.GET_DETAIL_ERROR)
		}
	}

	/**
	 * 获取权限列表
	 */
	@request('get', '/permission/list')
	@tags(['Permission'])
	@summary('获取权限列表')
	static async getList(ctx: Context) {
		try {
			const params = ctx.query
			const result = await permissionService.getList(params)
			return ctx.success(result, PermissionMessage.GET_LIST_SUCCESS)
		} catch (error) {
			console.error('获取权限列表错误:', error)
			return ctx.error(PermissionMessage.GET_LIST_ERROR)
		}
	}
}
