import { Context } from 'koa'
import { request, summary, tags, query } from 'koa-swagger-decorator'
import { DashboardService } from '../services/dashboardService'
import { logger } from '../config/log4js'

const dashboardService = new DashboardService()

export default class DashboardController {
	@request('get', '/dashboard/overview')
	@tags(['数据统计'])
	@summary('获取总览数据')
	static async getOverview(ctx: Context) {
		try {
			const result = await dashboardService.getOverview()
			ctx.success(result)
		} catch (error) {
			logger.error('获取总览数据失败:', error)
			ctx.error('获取总览数据失败')
		}
	}

	@request('get', '/dashboard/trend')
	@tags(['数据统计'])
	@summary('获取趋势数据')
	@query({
		type: { type: 'string', required: false, default: 'week' }, // week/month/year
		startTime: { type: 'string', required: false },
		endTime: { type: 'string', required: false }
	})
	static async getTrend(ctx: Context) {
		try {
			const result = await dashboardService.getTrend(ctx.query)
			ctx.success(result)
		} catch (error) {
			logger.error('获取趋势数据失败:', error)
			ctx.error('获取趋势数据失败')
		}
	}

	@request('get', '/dashboard/logs')
	@tags(['数据统计'])
	@summary('获取操作日志统计')
	@query({
		days: { type: 'number', required: false, default: 7 }
	})
	static async getLogStats(ctx: Context) {
		try {
			const { days } = ctx.query
			const result = await dashboardService.getLogStats(Number(days))
			ctx.success(result)
		} catch (error) {
			logger.error('获取日志统计失败:', error)
			ctx.error('获取日志统计失败')
		}
	}

	@request('get', '/dashboard/users')
	@tags(['数据统计'])
	@summary('获取用户统计数据')
	static async getUserStats(ctx: Context) {
		try {
			const result = await dashboardService.getUserStats()
			ctx.success(result)
		} catch (error) {
			logger.error('获取用户统计失败:', error)
			ctx.error('获取用户统计失败')
		}
	}
}
