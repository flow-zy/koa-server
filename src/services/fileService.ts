import { BaseDao, QueryParams } from '../dao/baseDao'
import FileModel from '../model/fileModel'
import { Op } from 'sequelize'
import { BusinessError } from '../utils/businessError'
import { DateUtil } from '../utils/dateUtil'
import { FileMessage } from '../enums/file'
import { createWriteStream, unlink } from 'fs'
import { join } from 'path'
import { promisify } from 'util'
import { uid } from 'uid'

const unlinkAsync = promisify(unlink)

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
	async upload(file: any, userId: number, username: string) {
		const { originalname, mimetype, size } = file

		// 生成唯一文件名
		const ext = originalname.split('.').pop()
		const filename = `${uid()}.${ext}`

		// 根据文件类型确定分类
		const category = this.getFileCategory(mimetype)

		// 确定存储路径
		const uploadDir = join(__dirname, '../../uploads', category.toString())
		const filepath = join(uploadDir, filename)

		// 写入文件
		await new Promise((resolve, reject) => {
			const writeStream = createWriteStream(filepath)
			writeStream.write(file.buffer)
			writeStream.end()
			writeStream.on('finish', resolve)
			writeStream.on('error', reject)
		})

		// 保存文件信息
		return await BaseDao.create(FileModel, {
			filename,
			original_name: originalname,
			filepath: `/uploads/${category}/${filename}`,
			mimetype,
			size,
			category,
			storage: 1, // 本地存储
			uploader_id: userId,
			uploader: username
		})
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
			await unlinkAsync(join(__dirname, '../..', file.filepath))
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
	 * 根据MIME类型获取文件分类
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
