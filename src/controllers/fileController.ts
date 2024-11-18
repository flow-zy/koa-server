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
import { createLogger } from '../utils/logger'
import { LogService as logService } from '../services/logService'
import { BusinessError } from '../utils/businessError'
export default class FileController {
	@request('get', '/file/list')
	@tags(['文件管理'])
	@summary('获取文件列表')
	@query({
		pagenumber: { type: 'number', required: false, default: 1 },
		pagesize: { type: 'number', required: false, default: 10 },
		keyword: { type: 'string', required: false },
		category: { type: 'number', required: false },
		status: { type: 'number', required: false },
		startTime: { type: 'string', required: false },
		endTime: { type: 'string', required: false }
	})
	static async getList(ctx: Context) {
		const startTime = Date.now()
		const log = createLogger(ctx)
		try {
			const result = await fileService.getList(ctx.query)
			const responseTime = Date.now() - startTime
			logService.writeLog({
				...log,
				responseTime,
				status: 1,
				content: '获取文件列表成功'
			})
			ctx.success(result, FileMessage.LIST_SUCCESS)
		} catch (error) {
			const responseTime = Date.now() - startTime
			logService.writeLog({
				...log,
				responseTime,
				status: 2,
				content:
					error instanceof BusinessError
						? error.message
						: FileMessage.LIST_ERROR
			})
			ctx.error(
				error instanceof BusinessError
					? error.message
					: FileMessage.LIST_ERROR
			)
		}
	}

	@request('post', '/file/upload')
	@tags(['文件管理'])
	@summary('上传文件')
	@formData({
		file: { type: 'file', required: true }
	})
	static async upload(ctx: Context) {
		const startTime = Date.now()
		const logs = createLogger(ctx)
		try {
			const file = ctx.request.files?.file
			const responseTime = Date.now() - startTime
			if (!file) {
				logService.writeLog({
					...logs,
					responseTime,
					content: '上传文件失败',
					status: 2
				})
				return ctx.error(FileMessage.FILE_REQUIRED)
			}
			// 处理单个文件或文件数组
			const uploadedFile = Array.isArray(file) ? file[0] : file
			// 获取文件信息
			const fileInfo = {
				originalname: uploadedFile.originalFilename || '',
				filename: uploadedFile.newFilename || '',
				mimetype: uploadedFile.mimetype || '',
				size: uploadedFile.size,
				filepath: uploadedFile.filepath,
				uploader_id: ctx.state.user?.userId,
				uploader: ctx.state.user?.username
			}
			const result = await fileService.upload(fileInfo)
			logService.writeLog({
				...logs,
				responseTime,
				content: '上传文件成功',
				status: 1
			})
			ctx.success(result, FileMessage.UPLOAD_SUCCESS)
		} catch (error) {
			console.log(error, 'error')
			const responseTime = Date.now() - startTime
			logService.writeLog({
				...logs,
				responseTime,
				content:
					error instanceof Error
						? error.message
						: FileMessage.UPLOAD_ERROR,
				status: 2
			})
			ctx.error(
				error instanceof Error
					? error.message
					: FileMessage.UPLOAD_ERROR,
				500
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
		const startTime = Date.now()
		const logs = createLogger(ctx)
		try {
			const { id } = ctx.params
			await fileService.delete(Number(id))
			const responseTime = Date.now() - startTime
			logService.writeLog({
				...logs,
				responseTime,
				content: '删除文件成功',
				status: 1
			})
			ctx.success(null, FileMessage.DELETE_SUCCESS)
		} catch (error) {
			const responseTime = Date.now() - startTime
			logService.writeLog({
				...logs,
				responseTime,
				content:
					error instanceof Error
						? error.message
						: FileMessage.DELETE_ERROR,
				status: 2
			})
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
