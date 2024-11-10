import { Context, Next } from 'koa'
import { DateUtil } from '../utils/dateUtil'

// 需要格式化的时间字段
const DATE_FIELDS = [
	'created_at',
	'updated_at',
	'deleted_at',
	'last_login',
	'expire_time',
	'start_time',
	'end_time',
	'birth_date'
]

export const dateFormatMiddleware = async (ctx: Context, next: Next) => {
	await next()

	// 只处理响应数据
	if (ctx.body && typeof ctx.body === 'object') {
		ctx.body = formatDates(ctx.body)
	}
}

function formatDates(data: any): any {
	if (Array.isArray(data)) {
		return data.map((item) => formatDates(item))
	}

	if (data && typeof data === 'object') {
		const formatted: any = {}

		for (const [key, value] of Object.entries(data)) {
			if (DATE_FIELDS.includes(key) && DateUtil.isValidDate(value)) {
				formatted[key] = DateUtil.formatDateTime(value as any)
			} else if (Array.isArray(value)) {
				formatted[key] = value.map((item) => formatDates(item))
			} else if (value && typeof value === 'object') {
				formatted[key] = formatDates(value)
			} else {
				formatted[key] = value
			}
		}

		return formatted
	}

	return data
}
