import { Context } from 'koa'
import { tags, summary, request, query, body } from 'koa-swagger-decorator'
import menuService from '../services/menuService'
import { MenuMessage } from '../enums/menu'
import MenuModel from '../model/menuModel'
import { HttpError } from '../enums'
import { createLogger } from '../utils/logger'
import { LogService } from '../services/logService'
import { QueryParams } from '../dao/baseDao'
export default class MenuController {
	@request('get', '/menu/list')
	@tags(['菜单管理'])
	@summary('获取菜单列表')
	@query({
		pagesize: { type: 'number', required: false, description: '每页条数' },
		pagenumber: { type: 'number', required: false, description: '页码' },
		name: { type: 'string', required: false },
		startTime: { type: 'string', required: false },
		endTime: { type: 'string', required: false }
	})
	static async getMenuList(ctx: Context) {
		const logger = createLogger(ctx)
		const start = Date.now()
		try {
			const res = await menuService.getMenuList(ctx.query)
			LogService.writeLog({
				...logger,
				content: MenuMessage.MENU_LIST_SUCCESS,
				status: 1,
				responseTime: Date.now() - start
			})
			if (!res) return ctx.error(MenuMessage.MENU_LIST_ERROR)
			return ctx.success(res, MenuMessage.MENU_LIST_SUCCESS)
		} catch (error) {
			LogService.writeLog({
				...logger,
				content:
					error instanceof Error
						? error.message
						: MenuMessage.MENU_LIST_ERROR,
				status: 2,
				responseTime: Date.now() - start
			})
			return ctx.error(
				error instanceof Error ? error.message : HttpError.HTTP
			)
		}
	}

	@request('get', '/menu/all')
	@tags(['菜单管理'])
	@summary('获取所有菜单')
	static async getAllMenu(ctx: Context) {
		const logger = createLogger(ctx)
		const start = Date.now()
		try {
			const res = await menuService.getAllMenu()
			if (!res) return ctx.error(MenuMessage.MENU_LIST_ERROR)
			LogService.writeLog({
				...logger,
				content: MenuMessage.MENU_LIST_SUCCESS,
				status: 1,
				responseTime: Date.now() - start
			})
			return ctx.success(res, MenuMessage.MENU_LIST_SUCCESS)
		} catch (error) {
			const err = error as Error
			LogService.writeLog({
				...logger,
				content: err.message || MenuMessage.MENU_LIST_ERROR,
				status: 2,
				responseTime: Date.now() - start
			})
			return ctx.error(err.message || HttpError.HTTP)
		}
	}

	@request('post', '/menu/add')
	@tags(['菜单管理'])
	@summary('添加菜单')
	@body({
		name: { type: 'string', required: true, description: '菜单名称' },
		code: { type: 'string', required: true, description: '菜单编码' },
		path: { type: 'string', required: true, description: '菜单路径' },
		component: { type: 'string', required: false, description: '菜单组件' },
		redirect: {
			type: 'string',
			required: false,
			description: '菜单重定向'
		},
		parentid: { type: 'number', required: false, description: '父菜单ID' },
		icon: { type: 'string', required: false, description: '图标' },
		type: { type: 'number', required: true, description: '菜单类型' },
		sort: { type: 'number', required: false, description: '排序' },
		status: { type: 'number', required: true, description: '菜单状态' },
		isBlank: {
			type: 'number',
			required: true,
			description: '是否外链'
		},
		remark: { type: 'string', required: false, description: '备注' }
	})
	static async addMenu(ctx: Context) {
		const logger = createLogger(ctx)
		const start = Date.now()
		try {
			const params = ctx.request.body as MenuModel
			const res = await menuService.addMenu(params)
			if (!res) return ctx.error(MenuMessage.MENU_ADD_ERROR)
			LogService.writeLog({
				...logger,
				content: MenuMessage.MENU_ADD_SUCCESS,
				status: 1,
				responseTime: Date.now() - start
			})
			return ctx.success(null, MenuMessage.MENU_ADD_SUCCESS)
		} catch (error) {
			const err = error as Error
			LogService.writeLog({
				...logger,
				content: err.message || MenuMessage.MENU_ADD_ERROR,
				status: 2,
				responseTime: Date.now() - start
			})
			return ctx.error(err.message || HttpError.HTTP)
		}
	}

	@request('put', '/menu/update/{id}')
	@tags(['菜单管理'])
	@summary('修改菜单')
	static async updateMenu(ctx: Context) {
		try {
			const id = parseInt(ctx.params.id)
			const params = ctx.request.body as Partial<MenuModel>

			if (!id) return ctx.error(MenuMessage.MENU_UPDATE_ERROR)

			const res = await menuService.updateMenu(id, params)
			if (!res) return ctx.error(MenuMessage.MENU_UPDATE_ERROR)
			return ctx.success(null, MenuMessage.MENU_UPDATE_SUCCESS)
		} catch (error) {
			return ctx.error(HttpError.HTTP)
		}
	}

	@request('delete', '/menu/delete/{id}')
	@tags(['菜单管理'])
	@summary('删除菜单')
	static async deleteMenu(ctx: Context) {
		try {
			const id = parseInt(ctx.params.id)
			const hasChildren = await menuService.hasChildren(id)
			if (hasChildren) return ctx.error(MenuMessage.MENU_HAS_CHILDREN)
			if (!id) return ctx.error(MenuMessage.MENU_DELETE_ERROR)

			const res = await menuService.deleteMenu(id)
			if (!res) return ctx.error(MenuMessage.MENU_DELETE_ERROR)
			return ctx.success(null, MenuMessage.MENU_DELETE_SUCCESS)
		} catch (error) {
			return ctx.error(HttpError.HTTP)
		}
	}

	@request('put', '/menu/status/{id}')
	@tags(['菜单管理'])
	@summary('切换菜单状态')
	static async changeStatus(ctx: Context) {
		try {
			const id = parseInt(ctx.params.id)
			if (!id) return ctx.error(MenuMessage.MENU_PARAMS_ERROR)

			const res = await menuService.changeStatus(id)
			if (!res) return ctx.error(MenuMessage.MENU_STATUS_ERROR)
			return ctx.success(null, MenuMessage.MENU_STATUS_SUCCESS)
		} catch (error) {
			return ctx.error(HttpError.HTTP)
		}
	}
}
