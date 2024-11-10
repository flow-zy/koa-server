import { Context } from 'koa'
import { tags, summary, request, query, body } from 'koa-swagger-decorator'
import dictionaryService from '../services/dictionaryService'
import { DictionaryMessage } from '../enums/dictionary'
import DictionaryModel from '../model/dictionaryModel'
import { ParamsType } from '../types'
import { HttpError } from '../enums'

export default class DictionaryController {
	@request('get', '/dictionary/list')
	@tags(['Dictionary'])
	@summary('获取字典列表')
	@query({
		pagesize: { type: 'number', required: true, description: '每页条数' },
		pagenumber: { type: 'number', required: true, description: '页码' },
		dictname: { type: 'string', required: false, description: '字典名称' },
		dictcode: { type: 'string', required: false, description: '字典编码' },
		startTime: { type: 'string', required: false },
		endTime: { type: 'string', required: false }
	})
	static async getDictList(ctx: Context) {
		try {
			const params = ctx.request
				.query as unknown as ParamsType<DictionaryModel>
			const res = await dictionaryService.getDictList(params)
			if (!res) return ctx.error(DictionaryMessage.DICT_LIST_ERROR)
			return ctx.success(res, DictionaryMessage.DICT_LIST_SUCCESS)
		} catch (error) {
			console.log(error, 'erererer')
			return ctx.error(HttpError.HTTP)
		}
	}

	@request('get', '/dictionary/all')
	@tags(['Dictionary'])
	@summary('获取所有字典')
	static async getAllDict(ctx: Context) {
		try {
			const res = await dictionaryService.getAllDict()
			if (!res) return ctx.error(DictionaryMessage.DICT_LIST_ERROR)
			return ctx.success(res, DictionaryMessage.DICT_LIST_SUCCESS)
		} catch (error) {
			return ctx.error(HttpError.HTTP)
		}
	}

	@request('post', '/dictionary/add')
	@tags(['Dictionary'])
	@summary('添加字典')
	@body({
		dictname: { type: 'string', required: true, description: '字典名称' },
		dictcode: { type: 'string', required: true, description: '字典编码' },
		sort: { type: 'number', required: false, description: '排序' }
	})
	static async addDict(ctx: Context) {
		try {
			const params = ctx.request.body as DictionaryModel
			if (!params.dictname || !params.dictcode) {
				return ctx.error(DictionaryMessage.DICT_PARAMS_ERROR)
			}

			const res = await dictionaryService.addDict(params)
			if (!res) return ctx.error(DictionaryMessage.DICT_ADD_ERROR)
			return ctx.success(null, DictionaryMessage.DICT_ADD_SUCCESS)
		} catch (error) {
			return ctx.error(HttpError.HTTP)
		}
	}

	@request('put', '/dictionary/update/{id}')
	@tags(['Dictionary'])
	@summary('修改字典')
	static async updateDict(ctx: Context) {
		try {
			const id = parseInt(ctx.params.id)
			const params = ctx.request.body as Partial<DictionaryModel>

			if (!id) return ctx.error(DictionaryMessage.DICT_UPDATE_ERROR)

			const res = await dictionaryService.updateDict(id, params)
			if (!res) return ctx.error(DictionaryMessage.DICT_UPDATE_ERROR)
			return ctx.success(null, DictionaryMessage.DICT_UPDATE_SUCCESS)
		} catch (error) {
			return ctx.error(HttpError.HTTP)
		}
	}

	@request('delete', '/dictionary/delete/{id}')
	@tags(['Dictionary'])
	@summary('删除字典')
	static async deleteDict(ctx: Context) {
		try {
			const id = parseInt(ctx.params.id)
			const hasChildren = await dictionaryService.hasChildren(id)
			if (hasChildren)
				return ctx.error(DictionaryMessage.DICT_HAS_CHILDREN)
			if (!id) return ctx.error(DictionaryMessage.DICT_DELETE_ERROR)

			const res = await dictionaryService.deleteDict(id)
			if (!res) return ctx.error(DictionaryMessage.DICT_DELETE_ERROR)
			return ctx.success(null, DictionaryMessage.DICT_DELETE_SUCCESS)
		} catch (error) {
			return ctx.error(HttpError.HTTP)
		}
	}

	@request('put', '/dictionary/status/{id}')
	@tags(['Dictionary'])
	@summary('切换字典状态')
	static async changeStatus(ctx: Context) {
		try {
			const id = parseInt(ctx.params.id)
			if (!id) return ctx.error(DictionaryMessage.DICT_PARAMS_ERROR)

			const res = await dictionaryService.changeStatus(id)
			if (!res) return ctx.send(DictionaryMessage.DICT_STATUS_ERROR)
			return ctx.success(null, DictionaryMessage.DICT_STATUS_SUCCESS)
		} catch (error) {
			return ctx.error(HttpError.HTTP)
		}
	}
}
