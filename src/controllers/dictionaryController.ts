import { Context } from 'koa'
import {
	request,
	summary,
	tags,
	query,
	path,
	body
} from 'koa-swagger-decorator'
import { dictionaryService } from '../services/dictionaryService'
import { logger } from '../config/log4js'
import { DictionaryMessage } from '../enums/dictionary'

export default class DictionaryController {
	@request('get', '/dictionary/list')
	@tags(['字典管理'])
	@summary('获取字典列表')
	@query({
		pagenumber: { type: 'number', required: false, default: 1 },
		pagesize: { type: 'number', required: false, default: 10 },
		keyword: { type: 'string', required: false },
		status: { type: 'number', required: false },
		startTime: { type: 'string', required: false },
		endTime: { type: 'string', required: false }
	})
	static async getList(ctx: Context) {
		try {
			const result = await dictionaryService.getList(ctx.query)
			ctx.success(result)
		} catch (error) {
			logger.error('获取字典列表失败:', error)
			ctx.error('获取字典列表失败')
		}
	}

	@request('get', '/dictionary/all')
	@tags(['字典管理'])
	@summary('获取所有字典')
	static async getAll(ctx: Context) {
		try {
			const result = await dictionaryService.getAll()
			ctx.success(result)
		} catch (error) {
			logger.error('获取所有字典失败:', error)
			ctx.error('获取所有字典失败')
		}
	}

	@request('post', '/dictionary/add')
	@tags(['字典管理'])
	@summary('添加字典')
	@body({
		dictname: { type: 'string', required: true },
		dictcode: { type: 'string', required: true },
		sort: { type: 'number', required: false },
		status: { type: 'number', required: false },
		remark: { type: 'string', required: false }
	})
	static async create(ctx: Context) {
		try {
			const result = await dictionaryService.create(ctx.request.body)
			ctx.success(result, DictionaryMessage.DICT_ADD_SUCCESS)
		} catch (error) {
			logger.error('添加字典失败:', error)
			ctx.error(
				error instanceof Error
					? error.message
					: DictionaryMessage.DICT_OPERATION_ERROR
			)
		}
	}

	@request('put', '/dictionary/update/{id}')
	@tags(['字典管理'])
	@summary('更新字典')
	@path({
		id: { type: 'number', required: true }
	})
	static async update(ctx: Context) {
		try {
			const { id } = ctx.params
			const result = await dictionaryService.update(
				Number(id),
				ctx.request.body
			)
			ctx.success(result, DictionaryMessage.DICT_UPDATE_SUCCESS)
		} catch (error) {
			logger.error('更新字典失败:', error)
			ctx.error(
				error instanceof Error
					? error.message
					: DictionaryMessage.DICT_OPERATION_ERROR
			)
		}
	}

	@request('delete', '/dictionary/delete/{id}')
	@tags(['字典管理'])
	@summary('删除字典')
	@path({
		id: { type: 'number', required: true }
	})
	static async delete(ctx: Context) {
		try {
			const { id } = ctx.params
			await dictionaryService.delete(Number(id))
			ctx.success(null, DictionaryMessage.DICT_DELETE_SUCCESS)
		} catch (error) {
			logger.error('删除字典失败:', error)
			ctx.error(
				error instanceof Error
					? error.message
					: DictionaryMessage.DICT_OPERATION_ERROR
			)
		}
	}

	@request('get', '/dictionary/detail/{id}')
	@tags(['字典管理'])
	@summary('获取字典详情')
	@path({
		id: { type: 'number', required: true }
	})
	static async getDetail(ctx: Context) {
		try {
			const { id } = ctx.params
			const result = await dictionaryService.getDetail(Number(id))
			ctx.success(result)
		} catch (error) {
			logger.error('获取字典详情失败:', error)
			ctx.error(
				error instanceof Error
					? error.message
					: DictionaryMessage.DICT_OPERATION_ERROR
			)
		}
	}

	@request('put', '/dictionary/status/{id}')
	@tags(['字典管理'])
	@summary('更新字典状态')
	@path({
		id: { type: 'number', required: true }
	})
	static async updateStatus(ctx: Context) {
		try {
			const { id } = ctx.params
			await dictionaryService.updateStatus(Number(id))
			ctx.success(null, DictionaryMessage.DICT_STATUS_SUCCESS)
		} catch (error) {
			logger.error('更新字典状态失败:', error)
			ctx.error(
				error instanceof Error
					? error.message
					: DictionaryMessage.DICT_OPERATION_ERROR
			)
		}
	}

	@request('get', '/dictionary/code/{code}')
	@tags(['字典管理'])
	@summary('根据编码获取字典')
	@path({
		code: { type: 'string', required: true }
	})
	static async getByCode(ctx: Context) {
		try {
			const { code } = ctx.params
			const result = await dictionaryService.getByCode(code)
			ctx.success(result, DictionaryMessage.DICT_GET_SUCCESS)
		} catch (error) {
			logger.error('获取字典失败:', error)
			ctx.error(
				error instanceof Error
					? error.message
					: DictionaryMessage.DICT_OPERATION_ERROR
			)
		}
	}
}
