import { BaseDao, QueryParams } from '../dao/baseDao'
import FileModel from '../model/fileModel'
import { BusinessError } from '../utils/businessError'
import { logger } from '../config/log4js'
import path from 'path'
import fs from 'fs'
import { FileMessage } from '../enums/file'
import { Op } from 'sequelize'
import { DateUtil } from '../utils/dateUtil'
import { unlinkSync } from 'fs'
import { join } from 'path'

export class FileService {
	/**
	 * 获取文件列表
	 */
	async getList(
		params: QueryParams & {
			keyword?: string
			category?: number
			storage?: number
			status?: number
			startTime?: string
			endTime?: string
		}
	) {
		const {
			keyword,
			category,
			storage,
			status,
			startTime,
			endTime,
			...restParams
		} = params

		const queryParams: QueryParams = {
			...restParams,
			where: {
				...(keyword && {
					[Op.or]: [
						{ filename: { [Op.like]: `%${keyword}%` } },
						{ original_name: { [Op.like]: `%${keyword}%` } }
					]
				}),
				...(category !== undefined && { category }),
				...(storage !== undefined && { storage }),
				...(status !== undefined && { status }),
				...(startTime &&
					endTime && {
						created_at: {
							[Op.between]: [
								DateUtil.formatDate(new Date(startTime)),
								DateUtil.formatDate(new Date(endTime))
							]
						}
					})
			},
			order: [['created_at', 'DESC']]
		}

		return await BaseDao.findByPage(FileModel, queryParams)
	}

	/**
	 * 上传文件
	 */
	async upload(fileInfo: {
		originalname: string
		filename: string
		mimetype: string
		size: number
		filepath: string
		uploader_id?: number
		uploader?: string
	}) {
		try {
			// 获取文件扩展名
			const ext = path.extname(fileInfo.originalname).toLowerCase()

			// 检查文件类型
			const category = this.getFileCategory(fileInfo.mimetype)
			//
			// 构建存储路径
			const uploadDir = path.resolve(
				__dirname,
				'../static/uploads',
				fileInfo.mimetype.split('/')[1]
			)
			if (!fs.existsSync(uploadDir)) {
				fs.mkdirSync(uploadDir, { recursive: true })
			}

			// 生成新的文件名
			const newFilename = `${Date.now()}${ext}`
			const destPath = path.join(uploadDir, newFilename)

			// 移动文件
			fs.copyFileSync(fileInfo.filepath, destPath)
			fs.unlinkSync(fileInfo.filepath)
			// 保存文件信息到数据库
			const fileData = {
				filename: newFilename,
				original_name: fileInfo.originalname,
				filepath: `/uploads/${fileInfo.mimetype.split('/')[1]}/${newFilename}`,
				mimetype: fileInfo.mimetype,
				size: fileInfo.size,
				category,
				storage: 1, // 本地存储
				uploader_id: fileInfo.uploader_id,
				uploader: fileInfo.uploader,
				status: 1
			}

			const file = await BaseDao.create(FileModel, fileData)
			return file
		} catch (error) {
			logger.error('文件上传失败:', error)
			throw new BusinessError('文件上传失败')
		}
	}

	/**
	 * 删除文件
	 */
	async delete(id: number) {
		const file = await BaseDao.findById(FileModel, id)
		if (!file) {
			throw new BusinessError(FileMessage.NOT_FOUND)
		}
		// 删除物理文件
		try {
			await unlinkSync(join(__dirname, '../static', file.filepath))
			await BaseDao.delete(FileModel, { id })
		} catch (error) {
			console.error('删除文件失败:', error)
			throw new BusinessError(FileMessage.DELETE_ERROR)
		}

		// 删除数据库记录
		return await BaseDao.delete(FileModel, { id })
	}

	/**
	 * 更新文件状态
	 */
	async updateStatus(id: number) {
		const file = await BaseDao.findById(FileModel, id)
		if (!file) {
			throw new BusinessError(FileMessage.NOT_FOUND)
		}

		const status = file.status === 1 ? 0 : 1
		return await BaseDao.update(FileModel, { status }, { id })
	}

	/**
	 * 获取文件详情
	 */
	async getDetail(id: number) {
		const file = await BaseDao.findById(FileModel, id)
		if (!file) {
			throw new BusinessError(FileMessage.NOT_FOUND)
		}
		return file
	}

	/**
	 * 获取文件分类
	 */
	private getFileCategory(mimetype: string): number {
		if (mimetype.startsWith('image/')) return 1
		if (mimetype.startsWith('application/')) return 2
		if (mimetype.startsWith('video/')) return 3
		if (mimetype.startsWith('audio/')) return 4
		return 5
	}
}

export const fileService = new FileService()
