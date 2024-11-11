import { BaseDao, QueryParams } from '../dao/baseDao'
import NoticeModel from '../model/noticeModel'
import { Op } from 'sequelize'
import { BusinessError } from '../utils/businessError'
import { DateUtil } from '../utils/dateUtil'
import { NoticeMessage } from '../enums/notice'

export class NoticeService {
	/**
	 * 获取通知公告列表
	 */
	async getList(
		params: QueryParams & {
			keyword?: string
			type?: number
			status?: number
			startTime?: string
			endTime?: string
		}
	) {
		const { keyword, type, status, startTime, endTime, ...restParams } =
			params

		const queryParams: QueryParams = {
			...restParams,
			where: {
				...(keyword && {
					[Op.or]: [
						{ title: { [Op.like]: `%${keyword}%` } },
						{ content: { [Op.like]: `%${keyword}%` } }
					]
				}),
				...(type !== undefined && { type }),
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
			order: [
				['istop', 'DESC'],
				['sort', 'ASC'],
				['created_at', 'DESC']
			]
		}

		return await BaseDao.findByPage(NoticeModel, queryParams)
	}

	/**
	 * 创建通知公告
	 */
	async create(data: Partial<NoticeModel>) {
		if (!data.title?.trim()) {
			throw new BusinessError(NoticeMessage.TITLE_REQUIRED)
		}
		if (!data.content?.trim()) {
			throw new BusinessError(NoticeMessage.CONTENT_REQUIRED)
		}

		return await BaseDao.create(NoticeModel, {
			...data,
			status: data.status ?? 0,
			publish_time: data.status === 1 ? new Date() : undefined
		})
	}

	/**
	 * 更新通知公告
	 */
	async update(id: number, data: Partial<NoticeModel>) {
		const notice = await BaseDao.findById(NoticeModel, id)
		if (!notice) {
			throw new BusinessError(NoticeMessage.NOT_FOUND)
		}

		if (notice.status === 1) {
			throw new BusinessError(NoticeMessage.CANNOT_UPDATE_PUBLISHED)
		}

		return await BaseDao.update(NoticeModel, data, { id })
	}

	/**
	 * 删除通知公告
	 */
	async delete(id: number) {
		const notice = await BaseDao.findById(NoticeModel, id)
		if (!notice) {
			throw new BusinessError(NoticeMessage.NOT_FOUND)
		}

		if (notice.status === 1) {
			throw new BusinessError(NoticeMessage.CANNOT_DELETE_PUBLISHED)
		}

		return await BaseDao.delete(NoticeModel, { id })
	}

	/**
	 * 获取通知公告详情
	 */
	async getDetail(id: number) {
		const notice = await BaseDao.findById(NoticeModel, id)
		if (!notice) {
			throw new BusinessError(NoticeMessage.NOT_FOUND)
		}
		return notice
	}

	/**
	 * 发布通知公告
	 */
	async publish(id: number) {
		const notice = await BaseDao.findById(NoticeModel, id)
		if (!notice) {
			throw new BusinessError(NoticeMessage.NOT_FOUND)
		}

		if (notice.status === 1) {
			throw new BusinessError(NoticeMessage.ALREADY_PUBLISHED)
		}

		return await BaseDao.update(
			NoticeModel,
			{
				status: 1,
				publish_time: new Date()
			},
			{ id }
		)
	}

	/**
	 * 撤回通知公告
	 */
	async revoke(id: number) {
		const notice = await BaseDao.findById(NoticeModel, id)
		if (!notice) {
			throw new BusinessError(NoticeMessage.NOT_FOUND)
		}

		if (notice.status !== 1) {
			throw new BusinessError(NoticeMessage.NOT_PUBLISHED)
		}

		return await BaseDao.update(
			NoticeModel,
			{
				status: 2
			},
			{ id }
		)
	}

	/**
	 * 置顶/取消置顶通知公告
	 */
	async toggleTop(id: number) {
		const notice = await BaseDao.findById(NoticeModel, id)
		if (!notice) {
			throw new BusinessError(NoticeMessage.NOT_FOUND)
		}

		return await BaseDao.update(
			NoticeModel,
			{
				istop: notice.istop === 1 ? 0 : 1
			},
			{ id }
		)
	}
}

export const noticeService = new NoticeService()
