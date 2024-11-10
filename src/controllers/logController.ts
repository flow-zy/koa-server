import { Context } from 'koa'
import { request, summary, tags, query, path } from 'koa-swagger-decorator'
import { LogService } from '../services/logService'

export default class LogController {
	@request('get', '/log/list')
	@tags(['日志管理'])
	@summary('获取日志列表')
	@query({
		page: {
			type: 'number',
			required: false,
			default: 1,
			description: '页码'
		},
		pageSize: {
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
		const {
			page = 1,
			pageSize = 10,
			username,
			startTime,
			endTime,
			status
		} = ctx.query

		const result = await LogService.getList({
			page: Number(page),
			pageSize: Number(pageSize),
			username: username as string,
			startTime: startTime as string,
			endTime: endTime as string,
			status: status ? Number(status) : undefined
		})

		ctx.success(result)
	}

	@request('get', '/log/detail/:id')
	@tags(['日志管理'])
	@summary('获取日志详情')
	@path({
		id: { type: 'number', required: true, description: '日志ID' }
	})
	static async getDetail(ctx: Context) {
		const { id } = ctx.params
		const log = await LogService.getDetail(Number(id))

		if (!log) {
			return ctx.error('日志不存在')
		}

		ctx.success(log)
	}
}
