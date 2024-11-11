import { Context } from 'koa'
import {
	request,
	summary,
	tags,
	query,
	path,
	body
} from 'koa-swagger-decorator'
import { noticeService } from '../services/noticeService'
import { logger } from '../config/log4js'
import { NoticeMessage } from '../enums/notice'

export default class NoticeController {
	@request('get', '/notice/list')
	@tags(['通知公告'])
	@summary('获取通知公告列表')
	@query({
		pagenumber: { type: 'number', required: false, default: 1 },
		pagesize: { type: 'number', required: false, default: 10 },
		keyword: { type: 'string', required: false },
		type: { type: 'number', required: false },
		status: { type: 'number', required: false },
		startTime: { type: 'string', required: false },
		endTime: { type: 'string', required: false }
	})
	static async getList(ctx: Context) {
		try {
			const result = await noticeService.getList(ctx.query)
			ctx.success(result)
		} catch (error) {
			logger.error('获取通知公告列表失败:', error)
			ctx.error(NoticeMessage.LIST_ERROR)
		}
	}

	@request('post', '/notice/add')
	@tags(['通知公告'])
	@summary('添加通知公告')
	@body({
		title: { type: 'string', required: true },
		content: { type: 'string', required: true },
		type: { type: 'number', required: true },
		status: { type: 'number', required: false },
		istop: { type: 'number', required: false },
		sort: { type: 'number', required: false },
		remark: { type: 'string', required: false }
	})
	static async create(ctx: Context) {
		try {
			const data = {
				...ctx.request.body,
				publisher_id: ctx.state.user.userId,
				publisher: ctx.state.user.username
			}
			const result = await noticeService.create(data)
			ctx.success(result, NoticeMessage.CREATE_SUCCESS)
		} catch (error) {
			logger.error('添加通知公告失败:', error)
			ctx.error(
				error instanceof Error
					? error.message
					: NoticeMessage.CREATE_ERROR
			)
		}
	}

	@request('put', '/notice/update/{id}')
	@tags(['通知公告'])
	@summary('更新通知公告')
	@path({
		id: { type: 'number', required: true }
	})
	static async update(ctx: Context) {
		try {
			const { id } = ctx.params
			const result = await noticeService.update(
				Number(id),
				ctx.request.body
			)
			ctx.success(result, NoticeMessage.UPDATE_SUCCESS)
		} catch (error) {
			logger.error('更新通知公告失败:', error)
			ctx.error(
				error instanceof Error
					? error.message
					: NoticeMessage.UPDATE_ERROR
			)
		}
	}

	@request('delete', '/notice/delete/{id}')
	@tags(['通知公告'])
	@summary('删除通知公告')
	@path({
		id: { type: 'number', required: true }
	})
	static async delete(ctx: Context) {
		try {
			const { id } = ctx.params
			await noticeService.delete(Number(id))
			ctx.success(null, NoticeMessage.DELETE_SUCCESS)
		} catch (error) {
			logger.error('删除通知公告失败:', error)
			ctx.error(NoticeMessage.DELETE_ERROR)
		}
	}

	@request('get', '/notice/detail/{id}')
	@tags(['通知公告'])
	@summary('获取通知公告详情')
	@path({
		id: { type: 'number', required: true }
	})
	static async getDetail(ctx: Context) {
		try {
			const { id } = ctx.params
			const result = await noticeService.getDetail(Number(id))
			ctx.success(result)
		} catch (error) {
			logger.error('获取通知公告详情失败:', error)
			ctx.error(NoticeMessage.DETAIL_ERROR)
		}
	}

	@request('put', '/notice/publish/{id}')
	@tags(['通知公告'])
	@summary('发布通知公告')
	@path({
		id: { type: 'number', required: true }
	})
	static async publish(ctx: Context) {
		try {
			const { id } = ctx.params
			await noticeService.publish(Number(id))
			ctx.success(null, NoticeMessage.PUBLISH_SUCCESS)
		} catch (error) {
			logger.error('发布通知公告失败:', error)
			ctx.error(NoticeMessage.PUBLISH_ERROR)
		}
	}

	@request('put', '/notice/revoke/{id}')
	@tags(['通知公告'])
	@summary('撤回通知公告')
	@path({
		id: { type: 'number', required: true }
	})
	static async revoke(ctx: Context) {
		try {
			const { id } = ctx.params
			await noticeService.revoke(Number(id))
			ctx.success(null, NoticeMessage.REVOKE_SUCCESS)
		} catch (error) {
			logger.error('撤回通知公告失败:', error)
			ctx.error(NoticeMessage.REVOKE_ERROR)
		}
	}

	@request('put', '/notice/top/{id}')
	@tags(['通知公告'])
	@summary('置顶/取消置顶通知公告')
	@path({
		id: { type: 'number', required: true }
	})
	static async toggleTop(ctx: Context) {
		try {
			const { id } = ctx.params
			await noticeService.toggleTop(Number(id))
			ctx.success(null, NoticeMessage.TOP_SUCCESS)
		} catch (error) {
			logger.error('置顶/取消置顶通知公告失败:', error)
			ctx.error(NoticeMessage.TOP_ERROR)
		}
	}
}
