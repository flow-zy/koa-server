import { Op } from 'sequelize'
import { DateUtil } from '../utils/dateUtil'
import UserModel from '../model/userModel'
import LogModel from '../model/log'
import DepartmentModel from '../model/departmentModel'
import sequelize from '../db/mysql'

export class DashboardService {
	/**
	 * 获取总览数据
	 */
	async getOverview() {
		const now = new Date()
		const todayStart = new Date(now.setHours(0, 0, 0, 0))
		const todayEnd = new Date(now.setHours(23, 59, 59, 999))

		// 用户总数
		const totalUsers = await UserModel.count()
		// 今日新增用户
		const newUsers = await UserModel.count({
			where: {
				created_at: {
					[Op.between]: [todayStart, todayEnd]
				}
			}
		})
		// 部门总数
		const totalDepartments = await DepartmentModel.count()
		// 今日操作日志数
		const todayLogs = await LogModel.count({
			where: {
				created_at: {
					[Op.between]: [todayStart, todayEnd]
				}
			}
		})

		return {
			totalUsers,
			newUsers,
			totalDepartments,
			todayLogs
		}
	}

	/**
	 * 获取趋势数据
	 */
	async getTrend({
		type = 'week',
		startTime,
		endTime
	}: {
		type?: string
		startTime?: Date
		endTime?: Date
	}) {
		let dateFormat: string
		let groupBy: string

		switch (type) {
			case 'year':
				dateFormat = '%Y-%m'
				groupBy = 'month'
				break
			case 'month':
				dateFormat = '%Y-%m-%d'
				groupBy = 'day'
				break
			default:
				dateFormat = '%Y-%m-%d'
				groupBy = 'day'
		}

		// 用户增长趋势
		const userTrend = await UserModel.findAll({
			attributes: [
				[
					sequelize.fn(
						'DATE_FORMAT',
						sequelize.col('created_at'),
						dateFormat
					),
					'date'
				],
				[sequelize.fn('COUNT', sequelize.col('id')), 'count']
			],
			where: {
				created_at: {
					[Op.between]: [
						startTime || DateUtil.getLastDays(30),
						endTime || new Date()
					]
				}
			},
			group: [
				sequelize.fn(
					'DATE_FORMAT',
					sequelize.col('created_at'),
					dateFormat
				)
			],
			order: [[sequelize.col('date'), 'ASC']]
		})

		// 操作日志趋势
		const logTrend = await LogModel.findAll({
			attributes: [
				[
					sequelize.fn(
						'DATE_FORMAT',
						sequelize.col('created_at'),
						dateFormat
					),
					'date'
				],
				[sequelize.fn('COUNT', sequelize.col('id')), 'count']
			],
			where: {
				created_at: {
					[Op.between]: [
						startTime || DateUtil.getLastDays(30),
						endTime || new Date()
					]
				}
			},
			group: [
				sequelize.fn(
					'DATE_FORMAT',
					sequelize.col('created_at'),
					dateFormat
				)
			],
			order: [[sequelize.col('date'), 'ASC']]
		})

		return {
			userTrend,
			logTrend
		}
	}

	/**
	 * 获取操作日志统计
	 */
	async getLogStats(days: number = 7) {
		// 操作类型分布
		const typeStats = await LogModel.findAll({
			attributes: [
				'content',
				[sequelize.fn('COUNT', sequelize.col('id')), 'count']
			],
			where: {
				created_at: {
					[Op.gte]: DateUtil.getLastDays(days)
				}
			},
			group: ['content']
		})

		// 操作状态分布
		const statusStats = await LogModel.findAll({
			attributes: [
				'status',
				[sequelize.fn('COUNT', sequelize.col('id')), 'count']
			],
			where: {
				created_at: {
					[Op.gte]: DateUtil.getLastDays(days)
				}
			},
			group: ['status']
		})

		return {
			typeStats,
			statusStats
		}
	}

	/**
	 * 获取用户统计数据
	 */
	async getUserStats() {
		// 部门用户分布
		const departmentStats = await UserModel.findAll({
			attributes: [
				'department_id',
				[sequelize.fn('COUNT', sequelize.col('id')), 'count']
			],
			include: [
				{
					model: DepartmentModel,
					attributes: ['name']
				}
			],
			group: ['department_id']
		})

		// 用户状态分布
		const statusStats = await UserModel.findAll({
			attributes: [
				'status',
				[sequelize.fn('COUNT', sequelize.col('id')), 'count']
			],
			group: ['status']
		})

		return {
			departmentStats,
			statusStats
		}
	}
}

export const dashboardService = new DashboardService()
