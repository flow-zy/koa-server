import { Context } from 'koa'
import { request, summary, tags, query } from 'koa-swagger-decorator'
import { DashboardService } from '../services/dashboardService'
import { logger } from '../config/log4js'
import { createLogger } from '../utils/logger'
import { LogService as logService } from '../services/logService'
import { BusinessError } from '../utils/businessError'
import { DashboardMessage } from '../enums/dashboard'
const dashboardService = new DashboardService()

export default class DashboardController {
	@request('get', '/dashboard/overview')
	@tags(['数据统计'])
	@summary('获取总览数据')
	static async getOverview(ctx: Context) {
		const startTime = Date.now()
		const loggers = createLogger(ctx)
		try {
			const result = await dashboardService.getOverview()
			const responseTime = Date.now() - startTime
			logService.writeLog({
				...loggers,
				responseTime,
				status: 1,
				content: '获取总览数据成功'
			})
			ctx.success(result)
		} catch (err) {
			const error = err as any
			const responseTime = Date.now() - startTime
			logService.writeLog({
				...loggers,
				responseTime,
				status: 2,
				content:
					error instanceof BusinessError
						? error.message
						: DashboardMessage.OVERVIEW_ERROR
			})
			if (error instanceof BusinessError) {
				return ctx.error(error.message)
			}
			return ctx.error(DashboardMessage.OVERVIEW_ERROR)
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
		const startTime = Date.now()
		const loggers = createLogger(ctx)
		try {
			const result = await dashboardService.getTrend(ctx.query)
			const responseTime = Date.now() - startTime
			logService.writeLog({
				...loggers,
				responseTime,
				status: 1,
				content: '获取趋势数据成功'
			})
			ctx.success(result)
		} catch (err) {
			const error = err as any
			const responseTime = Date.now() - startTime
			logService.writeLog({
				...loggers,
				responseTime,
				status: 2,
				content:
					error instanceof BusinessError
						? error.message
						: DashboardMessage.TREND_ERROR
			})
			if (error instanceof BusinessError) {
				return ctx.error(error.message)
			}
			return ctx.error(DashboardMessage.TREND_ERROR)
		}
	}

	@request('get', '/dashboard/logs')
	@tags(['数据统计'])
	@summary('获取操作日志统计')
	@query({
		days: { type: 'number', required: false, default: 7 }
	})
	static async getLogStats(ctx: Context) {
		const startTime = Date.now()
		const loggers = createLogger(ctx)
		try {
			const { days } = ctx.query
			const result = await dashboardService.getLogStats(Number(days))
			ctx.success(result)
		} catch (err) {
			const error = err as any
			const responseTime = Date.now() - startTime
			logService.writeLog({
				...loggers,
				responseTime,
				status: 2,
				content:
					error instanceof BusinessError
						? error.message
						: DashboardMessage.LOGS_ERROR
			})
			if (error instanceof BusinessError) {
				return ctx.error(error.message)
			}
			return ctx.error(DashboardMessage.LOGS_ERROR)
		}
	}

	@request('get', '/dashboard/users')
	@tags(['数据统计'])
	@summary('获取用户统计数据')
	static async getUserStats(ctx: Context) {
		const startTime = Date.now()
		const loggers = createLogger(ctx)
		try {
			const result = await dashboardService.getUserStats()
			const responseTime = Date.now() - startTime
			logService.writeLog({
				...loggers,
				responseTime,
				status: 1,
				content: '获取用户统计数据成功'
			})
			ctx.success(result)
		} catch (err) {
			console.log(err)
			const error = err as any
			const responseTime = Date.now() - startTime
			logService.writeLog({
				...loggers,
				responseTime,
				status: 2,
				content:
					error instanceof BusinessError
						? error.message
						: DashboardMessage.USERS_ERROR
			})
			if (error instanceof BusinessError) {
				return ctx.error(error.message)
			}
			return ctx.error(DashboardMessage.USERS_ERROR)
		}
	}
}
