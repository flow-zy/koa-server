import { Context } from 'koa'
import { tags, summary, request, query, body } from 'koa-swagger-decorator'
import roleService from '../services/roleService'
import { RoleMessage } from '../enums/role'
import RoleModel from '../model/roleModel'
import { ParamsType } from '../types'
import { HttpError } from '../enums'

export default class RoleController {
	@request('get', '/role/list')
	@tags(['Role'])
	@summary(['获取角色列表'])
	@query({
		pagesize: { type: 'number', require: true, description: '每页条数' },
		pagenumber: { type: 'number', require: true, description: '页码' },
		name: { type: 'string', require: false },
		startTime: { type: 'string', require: false },
		endTime: { type: 'date', require: false }
	})
	static async getRoleList(ctx: Context) {
		try {
			const params = ctx.request.query as unknown as ParamsType<RoleModel>
			const res = await roleService.getRoleList(params)
			if (!res) return ctx.send(RoleMessage.ROLE_LIST_ERROR, 201)
			return ctx.send(RoleMessage.ROLE_LIST_SUCCESS, 200, res)
		} catch (error) {
			return ctx.send(HttpError.HTTP, 500)
		}
	}
	// 获取全部的角色没有分
	@request('get', '/role/all')
	@tags(['Role'])
	@summary(['获取全部的角色'])
	static async getAllRole(ctx: Context) {
		try {
			const res = await roleService.getAllRole()
			if (!res) return ctx.send(RoleMessage.ROLE_LIST_ERROR, 201)
			return ctx.send(RoleMessage.ROLE_LIST_SUCCESS, 200, res)
		} catch (error) {
			return ctx.send(HttpError.HTTP, 500)
		}
	}

	@request('post', '/role/add')
	@tags(['Role'])
	@summary(['添加角色'])
	static async addRole(ctx: Context) {
		try {
			const params = ctx.request.body as RoleModel
			const res = await roleService.addRole(params)
			if (!res) return ctx.send(RoleMessage.ROLE_ADD_ERROR, 201)
			return ctx.send(RoleMessage.ROLE_ADD_SUCCESS, 200)
		} catch (error) {
			return ctx.send(HttpError.HTTP, 500)
		}
	}

	@request('delete', '/role/delete/{id}')
	@tags(['Role'])
	@summary(['删除角色'])
	static async deleteRole(ctx: Context) {
		try {
			const id = parseInt(ctx.params.id)
			if (!id) return ctx.send(RoleMessage.ROLE_DELETE_ERROR, 201)

			const res = await roleService.deleteRole(id)
			if (!res) return ctx.send(RoleMessage.ROLE_DELETE_ERROR, 201)
			return ctx.send(RoleMessage.ROLE_DELETE_SUCCESS, 200)
		} catch (error) {
			return ctx.send(HttpError.HTTP, 500)
		}
	}

	@request('put', '/role/update/{id}')
	@tags(['Role'])
	@summary(['修改角色'])
	static async updateRole(ctx: Context) {
		try {
			const id = parseInt(ctx.params.id)
			const params = ctx.request.body as Partial<RoleModel>

			if (!id) return ctx.send(RoleMessage.ROLE_UPDATE_ERROR, 201)

			const res = await roleService.updateRole(id, params)
			if (!res) return ctx.send(RoleMessage.ROLE_UPDATE_ERROR, 201)
			return ctx.send(RoleMessage.ROLE_UPDATE_SUCCESS, 200)
		} catch (error) {
			return ctx.send(HttpError.HTTP, 500)
		}
	}

	@request('put', '/role/status/{id}')
	@tags(['Role'])
	@summary('切换角色状态')
	static async changeStatus(ctx: Context) {
		try {
			const id = parseInt(ctx.params.id)
			if (!id) return ctx.send(RoleMessage.ROLE_PARAMS_ERROR, 201)

			const res = await roleService.changeStatus(id)
			if (!res) return ctx.send(RoleMessage.ROLE_STATUS_ERROR, 201)
			return ctx.send(RoleMessage.ROLE_STATUS_SUCCESS, 200)
		} catch (error) {
			return ctx.send(HttpError.HTTP, 500)
		}
	}

	@request('get', '/role/detail/{id}')
	@tags(['Role'])
	@summary(['获取角色详情'])
	static async getRoleDetail(ctx: Context) {
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

			return ctx.success(roleDetail, RoleMessage.GET_ROLE_DETAIL_SUCCESS)
		} catch (error) {
			console.error('获取角色详情错误:', error)
			return ctx.error(RoleMessage.SYSTEM_ERROR, 500)
		}
	}
}
