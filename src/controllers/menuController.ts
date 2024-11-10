import { Context } from 'koa'
import { tags, summary, request, query, body } from 'koa-swagger-decorator'
import menuService from '../services/menuService'
import { MenuMessage } from '../enums/menu'
import MenuModel from '../model/menuModel'
import { ParamsType } from '../types'
import { HttpError } from '../enums'

export default class MenuController {
	@request('get', '/menu/list')
	@tags(['Menu'])
	@summary('获取菜单列表')
	@query({
		pagesize: { type: 'number', required: true, description: '每页条数' },
		pagenumber: { type: 'number', required: true, description: '页码' },
		name: { type: 'string', required: false },
		startTime: { type: 'string', required: false },
		endTime: { type: 'string', required: false }
	})
	static async getMenuList(ctx: Context) {
		try {
			const params = ctx.request.query as unknown as ParamsType<MenuModel>
			const res = await menuService.getMenuList(params)
			if (!res) return ctx.error(MenuMessage.MENU_LIST_ERROR)
			return ctx.success(res, MenuMessage.MENU_LIST_SUCCESS)
		} catch (error) {
			return ctx.error(HttpError.HTTP)
		}
	}

	@request('get', '/menu/all')
	@tags(['Menu'])
	@summary('获取所有菜单')
	static async getAllMenu(ctx: Context) {
		try {
			const res = await menuService.getAllMenu()
			if (!res) return ctx.error(MenuMessage.MENU_LIST_ERROR)
			return ctx.success(res, MenuMessage.MENU_LIST_SUCCESS)
		} catch (error) {
			return ctx.error(HttpError.HTTP)
		}
	}

	@request('post', '/menu/add')
	@tags(['Menu'])
	@summary('添加菜单')
	@body({
		name: { type: 'string', required: true, description: '菜单名称' },
		path: { type: 'string', required: true, description: '菜单路径' },
		parentid: { type: 'number', required: false, description: '父菜单ID' },
		icon: { type: 'string', required: false, description: '图标' },
		sort: { type: 'number', required: false, description: '排序' }
	})
	static async addMenu(ctx: Context) {
		try {
			const params = ctx.request.body as MenuModel
			const res = await menuService.addMenu(params)
			if (!res) return ctx.error(MenuMessage.MENU_ADD_ERROR)
			return ctx.success(null, MenuMessage.MENU_ADD_SUCCESS)
		} catch (error) {
			return ctx.error(HttpError.HTTP)
		}
	}

	@request('put', '/menu/update/{id}')
	@tags(['Menu'])
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
	@tags(['Menu'])
	@summary('删除菜单')
	static async deleteMenu(ctx: Context) {
		try {
			const id = parseInt(ctx.params.id)
			if (!id) return ctx.error(MenuMessage.MENU_DELETE_ERROR)

			const res = await menuService.deleteMenu(id)
			if (!res) return ctx.error(MenuMessage.MENU_DELETE_ERROR)
			return ctx.success(null, MenuMessage.MENU_DELETE_SUCCESS)
		} catch (error) {
			return ctx.error(HttpError.HTTP)
		}
	}

	@request('put', '/menu/status/{id}')
	@tags(['Menu'])
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
