import Log from '../model/log'
import { Op } from 'sequelize'
import { DateUtil } from '../utils/dateUtil'

export class LogService {
	/**
	 * 获取日志列表
	 */
	static async getList(params: {
		pagenumber: number
		pagesize: number
		username?: string
		startTime?: string
		endTime?: string
		status?: number
	}) {
		const { pagenumber, pagesize, username, startTime, endTime, status } =
			params
		const where: any = {}

		if (username) {
			where.username = {
				[Op.like]: `%${username}%`
			}
		}

		// 添加时间范围过滤
		if (startTime && endTime) {
			where.created_at = {
				[Op.between]: [new Date(startTime), new Date(endTime)]
			}
		} else if (startTime) {
			where.created_at = {
				[Op.gte]: new Date(startTime)
			}
		} else if (endTime) {
			where.created_at = {
				[Op.lte]: new Date(endTime)
			}
		}

		if (status) {
			where.status = status
		}

		const { count, rows } = await Log.findAndCountAll({
			where,
			order: [['created_at', 'DESC']],
			offset: (pagenumber - 1) * pagesize,
			limit: pagesize,
			attributes: {
				exclude: ['deleted_at']
			}
		})

		return {
			list: rows,
			total: count,
			pagenumber,
			pagesize
		}
	}

	/**
	 * 获取日志详情
	 */
	static async getDetail(id: number) {
		return await Log.findByPk(id)
	}
	// 写入日志
	static async writeLog(logData: Partial<Log>) {
		return await Log.create(logData)
	}
}
