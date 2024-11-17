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
import { createLogger } from '../utils/logger'
import { LogService as logService } from '../services/logService'
import { BusinessError } from '../utils/businessError'
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
		const startTime = Date.now()
		const loggers = createLogger(ctx)
		try {
			const result = await dictionaryService.getList(ctx.query)
			const responseTime = Date.now() - startTime
			logService.writeLog({
				...loggers,
				responseTime,
				status: 1,
				content: '获取字典列表成功'
			})
			return ctx.success(result, DictionaryMessage.DICT_LIST_SUCCESS)
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
						: DictionaryMessage.DICT_LIST_ERROR
			})
			if (error instanceof BusinessError) {
				return ctx.error(error.message)
			}
			return ctx.error(DictionaryMessage.DICT_LIST_ERROR)
		}
	}

	@request('get', '/dictionary/all')
	@tags(['字典管理'])
	@summary('获取所有字典')
	static async getAll(ctx: Context) {
		const startTime = Date.now()
		const loggers = createLogger(ctx)
		try {
			const result = await dictionaryService.getAll()
			const responseTime = Date.now() - startTime
			logService.writeLog({
				...loggers,
				responseTime,
				status: 1,
				content: '获取所有字典成功'
			})
			return ctx.success(result, DictionaryMessage.DICT_ALL_SUCCESS)
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
						: DictionaryMessage.DICT_ALL_ERROR
			})
			if (error instanceof BusinessError) {
				return ctx.error(error.message)
			}
			return ctx.error(DictionaryMessage.DICT_ALL_ERROR)
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
		remark: { type: 'string', required: false },
		parentid: { type: 'number', required: false },
		type: { type: 'number', required: false }
	})
	static async create(ctx: Context) {
		const startTime = Date.now()
		const loggers = createLogger(ctx)
		try {
			const result = await dictionaryService.create(ctx.request.body)
			const responseTime = Date.now() - startTime
			logService.writeLog({
				...loggers,
				responseTime,
				status: 1,
				content: '添加字典成功'
			})
			return ctx.success(null, DictionaryMessage.DICT_ADD_SUCCESS)
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
						: DictionaryMessage.DICT_OPERATION_ERROR
			})
			if (error instanceof BusinessError) {
				return ctx.error(error.message)
			}
			return ctx.error(
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
	@body({
		dictname: { type: 'string', required: true },
		dictcode: { type: 'string', required: true },
		sort: { type: 'number', required: false },
		status: { type: 'number', required: false },
		remark: { type: 'string', required: false },
		type: { type: 'number', required: false }
	})
	static async update(ctx: Context) {
		const startTime = Date.now()
		const loggers = createLogger(ctx)
		try {
			const { id } = ctx.params
			const result = await dictionaryService.update(
				Number(id),
				ctx.request.body
			)
			return ctx.success(null, DictionaryMessage.DICT_UPDATE_SUCCESS)
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
						: DictionaryMessage.DICT_OPERATION_ERROR
			})
			if (error instanceof BusinessError) {
				return ctx.error(error.message)
			}
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
		const startTime = Date.now()
		const loggers = createLogger(ctx)
		try {
			const { id } = ctx.params
			await dictionaryService.delete(Number(id))
			const responseTime = Date.now() - startTime
			logService.writeLog({
				...loggers,
				responseTime,
				status: 1,
				content: '删除字典成功'
			})
			return ctx.success(null, DictionaryMessage.DICT_DELETE_SUCCESS)
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
						: DictionaryMessage.DICT_OPERATION_ERROR
			})
			if (error instanceof BusinessError) {
				return ctx.error(error.message)
			}
			return ctx.error(
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
		const startTime = Date.now()
		const loggers = createLogger(ctx)
		try {
			const { id } = ctx.params
			const result = await dictionaryService.getDetail(Number(id))
			const responseTime = Date.now() - startTime
			logService.writeLog({
				...loggers,
				responseTime,
				status: 1,
				content: '获取字典详情成功'
			})
			return ctx.success(result)
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
						: DictionaryMessage.DICT_OPERATION_ERROR
			})
			return ctx.error(
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
		const startTime = Date.now()
		const loggers = createLogger(ctx)
		try {
			const { id } = ctx.params
			await dictionaryService.updateStatus(Number(id))
			const responseTime = Date.now() - startTime
			logService.writeLog({
				...loggers,
				responseTime,
				status: 1,
				content: '更新字典状态成功'
			})
			return ctx.success(null, DictionaryMessage.DICT_STATUS_SUCCESS)
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
						: DictionaryMessage.DICT_OPERATION_ERROR
			})
			return ctx.error(
				error instanceof Error
					? error.message
					: DictionaryMessage.DICT_OPERATION_ERROR
			)
		}
	}

	@request('get', '/dictionary/code/{dictcode}')
	@tags(['字典管理'])
	@summary('根据编码获取字典')
	@path({
		dictcode: { type: 'string', required: true }
	})
	static async getByCode(ctx: Context) {
		const startTime = Date.now()
		const loggers = createLogger(ctx)
		try {
			const { dictcode } = ctx.params
			const result = await dictionaryService.getByCode(dictcode)
			const responseTime = Date.now() - startTime
			logService.writeLog({
				...loggers,
				responseTime,
				status: 1,
				content: '根据编码获取字典成功'
			})
			return ctx.success(result, DictionaryMessage.DICT_GET_SUCCESS)
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
						: DictionaryMessage.DICT_OPERATION_ERROR
			})
			ctx.error(
				error instanceof Error
					? error.message
					: DictionaryMessage.DICT_OPERATION_ERROR
			)
		}
	}
}
