import Log from '../model/log'
import { Context } from 'koa'

export const createLogger = (ctx: Context): Partial<Log> => {
	const user = ctx.state.user || { userId: null, username: 'guest' }
	return {
		url: ctx.url,
		method: ctx.method,
		ip: ctx.ip,
		username: user.username,
		browser: ctx.get('user-agent')
	}
}
