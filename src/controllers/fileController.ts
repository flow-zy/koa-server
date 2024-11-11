import { Context } from 'koa'
import {
	request,
	summary,
	tags,
	query,
	path,
	formData
} from 'koa-swagger-decorator'
import { fileService } from '../services/fileService'
import { logger } from '../config/log4js'
import { FileMessage } from '../enums/file'

export default class FileController {
	@request('get', '/file/list')
	@tags(['文件管理'])
	@summary('获取文件列表')
	@query({
		pagenumber: { type: 'number', required: false, default: 1 },
		pagesize: { type: 'number', required: false, default: 10 },
		keyword: { type: 'string', required: false },
		category: { type: 'number', required: false },
		storage: { type: 'number', required: false },
		status: { type: 'number', required: false },
		startTime: { type: 'string', required: false },
		endTime: { type: 'string', required: false }
	})
	static async getList(ctx: Context) {
		try {
			const result = await fileService.getList(ctx.query)
			ctx.success(result)
		} catch (error) {
			logger.error('获取文件列表失败:', error)
			ctx.error(FileMessage.LIST_ERROR)
		}
	}

	@request('post', '/file/upload')
	@tags(['文件管理'])
	@summary('上传文件')
	@formData({
		file: { type: 'file', required: true }
	})
	static async upload(ctx: Context) {
		try {
			const file = ctx.request.files?.file
			if (!file) {
				return ctx.error(FileMessage.FILE_REQUIRED)
			}

			const result = await fileService.upload(
				file,
				ctx.state.user.userId,
				ctx.state.user.username
			)
			ctx.success(result, FileMessage.UPLOAD_SUCCESS)
		} catch (error) {
			logger.error('上传文件失败:', error)
			ctx.error(
				error instanceof Error
					? error.message
					: FileMessage.UPLOAD_ERROR
			)
		}
	}

	@request('delete', '/file/delete/{id}')
	@tags(['文件管理'])
	@summary('删除文件')
	@path({
		id: { type: 'number', required: true }
	})
	static async delete(ctx: Context) {
		try {
			const { id } = ctx.params
			await fileService.delete(Number(id))
			ctx.success(null, FileMessage.DELETE_SUCCESS)
		} catch (error) {
			logger.error('删除文件失败:', error)
			ctx.error(
				error instanceof Error
					? error.message
					: FileMessage.DELETE_ERROR
			)
		}
	}

	@request('put', '/file/status/{id}')
	@tags(['文件管理'])
	@summary('更新文件状态')
	@path({
		id: { type: 'number', required: true }
	})
	static async updateStatus(ctx: Context) {
		try {
			const { id } = ctx.params
			await fileService.updateStatus(Number(id))
			ctx.success(null, FileMessage.STATUS_SUCCESS)
		} catch (error) {
			logger.error('更新文件状态失败:', error)
			ctx.error(
				error instanceof Error
					? error.message
					: FileMessage.STATUS_ERROR
			)
		}
	}

	@request('get', '/file/detail/{id}')
	@tags(['文件管理'])
	@summary('获取文件详情')
	@path({
		id: { type: 'number', required: true }
	})
	static async getDetail(ctx: Context) {
		try {
			const { id } = ctx.params
			const result = await fileService.getDetail(Number(id))
			ctx.success(result)
		} catch (error) {
			logger.error('获取文件详情失败:', error)
			ctx.error(
				error instanceof Error
					? error.message
					: FileMessage.DETAIL_ERROR
			)
		}
	}
}
