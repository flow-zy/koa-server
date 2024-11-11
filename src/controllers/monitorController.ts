import { Context } from 'koa'
import { request, summary, tags, query } from 'koa-swagger-decorator'
import { monitorService } from '../services/monitorService'
import { logger } from '../config/log4js'
import { MonitorMessage } from '../enums/monitor'

export default class MonitorController {
	@request('get', '/monitor/system')
	@tags(['系统监控'])
	@summary('获取系统监控数据')
	static async getSystemInfo(ctx: Context) {
		try {
			const result = await monitorService.getSystemInfo()
			ctx.success(result)
		} catch (error) {
			logger.error('获取系统监控数据失败:', error)
			ctx.error(MonitorMessage.GET_ERROR)
		}
	}

	@request('get', '/monitor/history')
	@tags(['系统监控'])
	@summary('获取历史监控数据')
	@query({
		pagenumber: { type: 'number', required: false, default: 1 },
		pagesize: { type: 'number', required: false, default: 10 },
		startTime: { type: 'string', required: false },
		endTime: { type: 'string', required: false }
	})
	static async getHistory(ctx: Context) {
		try {
			const result = await monitorService.getHistory(ctx.query)
			ctx.success(result)
		} catch (error) {
			logger.error('获取历史监控数据失败:', error)
			ctx.error(MonitorMessage.HISTORY_ERROR)
		}
	}
}
