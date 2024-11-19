import { Context } from 'koa'
import { request, summary, tags, query, path } from 'koa-swagger-decorator'
import { LogService } from '../services/logService'
import { createLogger } from '../utils/logger'
export default class LogController {
	@request('get', '/log/list')
	@tags(['日志管理'])
	@summary('获取日志列表')
	@query({
		pagenumber: {
			type: 'number',
			required: false,
			default: 1,
			description: '页码'
		},
		pagesize: {
			type: 'number',
			required: false,
			default: 10,
			description: '每页条数'
		},
		username: { type: 'string', required: false, description: '用户名' },
		startTime: { type: 'string', required: false, description: '开始时间' },
		endTime: { type: 'string', required: false, description: '结束时间' },
		status: {
			type: 'number',
			required: false,
			description: '状态：1成功 2失败'
		}
	})
	static async getList(ctx: Context) {
		const logger = createLogger(ctx)
		const start = Date.now()
		const {
			pagenumber = 1,
			pagesize = 10,
			username,
			startTime,
			endTime,
			status
		} = ctx.query

		const result = await LogService.getList({
			pagenumber: Number(pagenumber),
			pagesize: Number(pagesize),
			username: username as string,
			startTime: startTime as string,
			endTime: endTime as string,
			status: status ? Number(status) : undefined
		})
		const responseTime = Date.now() - start
		LogService.writeLog({
			...logger,
			username: ctx.user.username,
			content: `获取日志列表成功，耗时：${responseTime}ms`,
			status: 1,
			responseTime: Date.now() - start
		})
		ctx.success(result, `获取日志列表成功，耗时：${responseTime}ms`)
	}

	@request('get', '/log/detail/{id}')
	@tags(['日志管理'])
	@summary('获取日志详情')
	@path({
		id: { type: 'number', required: true, description: '日志ID' }
	})
	static async getDetail(ctx: Context) {
		const logger = createLogger(ctx)
		const start = Date.now()
		const { id } = ctx.params
		try {
			const log = await LogService.getDetail(Number(id))

			if (!log) {
				LogService.writeLog({
					...logger,
					content: '日志不存在',
					status: 2,
					responseTime: Date.now() - start
				})
				return ctx.error('日志不存在')
			}

			ctx.success(log, '获取日志详情成功')
		} catch (error) {
			LogService.writeLog({
				...logger,
				content: '获取日志详情失败',
				status: 2,
				responseTime: Date.now() - start
			})
			ctx.error(
				error instanceof Error ? error.message : '获取日志详情失败'
			)
		}
	}
}
