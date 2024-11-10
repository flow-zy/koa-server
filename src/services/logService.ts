import { Op } from 'sequelize'
import Log from '../model/log'
import { DataUtil } from '../utils/dataUtil'

class LogService {
	/**
	 * 获取日志列表
	 */
	async getList(params: any) {
		const { current = 1, pageSize = 10, startTime, endTime } = params

		const where: any = {}

		// 添加时间范围过滤
		if (startTime && endTime) {
			where.createdAt = {
				[Op.between]: [new Date(startTime), new Date(endTime)]
			}
		} else if (startTime) {
			where.createdAt = {
				[Op.gte]: new Date(startTime)
			}
		} else if (endTime) {
			where.createdAt = {
				[Op.lte]: new Date(endTime)
			}
		}

		const { count, rows } = await Log.findAndCountAll({
			where,
			order: [['id', 'DESC']],
			offset: (Number(current) - 1) * Number(pageSize),
			limit: Number(pageSize)
		})

		return {
			list: DataUtil.toJSON(rows),
			total: count,
			current: Number(current),
			pageSize: Number(pageSize)
		}
	}

	/**
	 * 获取日志详情
	 */
	async getDetail(id: number) {
		const log = await Log.findByPk(id)
		return log ? DataUtil.toJSON(log) : null
	}
}

export const logService = new LogService()
