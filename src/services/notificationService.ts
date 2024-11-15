import { BaseDao, QueryParams } from '../dao/baseDao'
import NotificationModel, {
	NotificationStatus
} from '../model/notificationModel'
import { Op, WhereOptions } from 'sequelize'
import { BusinessError } from '../utils/businessError'
import { logger } from '../config/log4js'
import { DefaultState, DefaultContext } from 'koa'
import * as KoaWebsocket from 'koa-websocket'
// @ts-ignore
import { Server as WebSocketServer } from 'ws'

export class NotificationService {
	private clients: Map<number, WebSocketServer> = new Map()

	addClient(userId: number, ws: WebSocketServer) {
		this.clients.set(userId, ws)
		logger.info(`用户${userId}已连接WebSocket`)
	}

	removeClient(userId: number) {
		this.clients.delete(userId)
		logger.info(`用户${userId}已断开WebSocket连接`)
	}

	async getList(
		params: QueryParams & {
			userId: number
			status?: NotificationStatus
		}
	) {
		try {
			const { userId, status, ...restParams } = params

			const where: WhereOptions = {
				receiver_id: userId
			}

			if (status !== undefined) {
				where.status = Number(status)
			}

			const queryParams: QueryParams = {
				...restParams,
				where,
				include: [
					{
						association: 'sender',
						attributes: ['id', 'username', 'nickname', 'avatar']
					}
				],
				order: [['created_at', 'DESC']]
			}

			return await BaseDao.findByPage(NotificationModel, queryParams)
		} catch (error) {
			logger.error('获取通知列表失败:', error)
			throw new BusinessError('获取通知列表失败')
		}
	}

	async checkOverdueNotifications() {
		try {
			const where: WhereOptions = {
				status: Number(NotificationStatus.PENDING),
				expire_time: {
					[Op.lt]: new Date()
				}
			}

			await NotificationModel.update(
				{ status: Number(NotificationStatus.OVERDUE) },
				{ where }
			)

			logger.info('过期通知检查完成')
		} catch (error) {
			logger.error('检查过期通知失败:', error)
			throw new BusinessError('检查过期通知失败')
		}
	}

	async getUnreadCount(userId: number) {
		try {
			const where: WhereOptions = {
				receiver_id: userId,
				status: Number(NotificationStatus.PENDING)
			}

			return await NotificationModel.count({ where })
		} catch (error) {
			logger.error('获取未读通知数量失败:', error)
			throw new BusinessError('获取未读通知数量失败')
		}
	}

	async updateStatus(id: number, userId: number, status: NotificationStatus) {
		try {
			const notification = await NotificationModel.findByPk(id)

			if (!notification) {
				throw new BusinessError('通知不存在')
			}

			if (notification.receiver_id !== userId) {
				throw new BusinessError('无权处理该通知')
			}

			await notification.update({
				status: Number(status),
				process_time:
					status === NotificationStatus.PROCESSED ? new Date() : null
			})

			return true
		} catch (error) {
			logger.error('更新通知状态失败:', error)
			if (error instanceof BusinessError) {
				throw error
			}
			throw new BusinessError('更新通知状态失败')
		}
	}

	async batchUpdateStatus(
		ids: number[],
		userId: number,
		status: NotificationStatus
	) {
		try {
			const where: WhereOptions = {
				id: { [Op.in]: ids },
				receiver_id: userId
			}

			await NotificationModel.update(
				{
					status: Number(status),
					process_time:
						status === NotificationStatus.PROCESSED
							? new Date()
							: null
				},
				{ where }
			)
			return true
		} catch (error) {
			logger.error('批量更新通知状态失败:', error)
			throw new BusinessError('批量更新通知状态失败')
		}
	}
}

export const notificationService = new NotificationService()
