import { Context } from 'koa'
import { request, summary, tags } from 'koa-swagger-decorator'

export default class HealthController {
	@request('get', '/health')
	@tags(['System'])
	@summary('Health check endpoint')
	static async healthCheck(ctx: Context) {
		ctx.status = 200
		ctx.body = {
			status: 'ok',
			timestamp: new Date().toISOString()
		}
	}
}
