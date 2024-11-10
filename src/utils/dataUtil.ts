import { DateUtil } from './dateUtil'

// 需要格式化的日期字段
const DATE_FIELDS = [
	'created_at',
	'updated_at',
	'deleted_at',
	'last_login',
	'expire_time',
	'start_time',
	'end_time'
]
/**
 * 数据处理工具类
 */
export class DataUtil {
	/**
	 * 将任意数据转换为纯 JSON 对象
	 * @param data 需要转换的数据
	 * @returns 转换后的纯对象
	 */
	static toJSON(data: any): any {
		if (data === null || data === undefined) {
			return null
		}

		// 处理数组
		if (Array.isArray(data)) {
			return data.map((item) => this.toJSON(item))
		}

		// 处理 Sequelize 模型实例
		if (data && typeof data.toJSON === 'function') {
			return this.formatDates(data.toJSON())
		}

		// 处理 Date 对象
		if (data instanceof Date) {
			return DateUtil.formatDateTime(data)
		}

		// 处理普通对象
		if (data && typeof data === 'object') {
			return this.formatDates(data)
		}

		return data
	}

	/**
	 * 移除对象中的敏感字段
	 * @param data 需要处理的数据
	 * @param sensitiveFields 敏感字段列表
	 * @returns 处理后的数据
	 */
	static removeSensitive(
		data: any,
		sensitiveFields: string[] = ['password']
	): any {
		if (!data) return null

		const jsonData = this.toJSON(data)
		if (typeof jsonData !== 'object') return jsonData

		const result: Record<string, any> = { ...jsonData }
		sensitiveFields.forEach((field) => delete result[field])
		return result
	}

	/**
	 * 过滤对象中的空值
	 * @param data 需要过滤的数据
	 * @returns 过滤后的数据
	 */
	static removeEmpty(data: any): any {
		if (!data) return null

		// 处理数组
		if (Array.isArray(data)) {
			return data
				.map((item) => this.removeEmpty(item))
				.filter((item) => item !== null && item !== undefined)
		}

		// 处理对象
		if (typeof data === 'object') {
			const result: Record<string, any> = {}
			for (const [key, value] of Object.entries(data)) {
				const processed = this.removeEmpty(value)
				if (
					processed !== null &&
					processed !== undefined &&
					processed !== ''
				) {
					result[key] = processed
				}
			}
			return result
		}

		return data
	}

	/**
	 * 转换分页数据
	 * @param data Sequelize 查询结果
	 * @returns 标准分页数据格式
	 */
	static formatPagination(data: any) {
		if (!data) return null

		const jsonData = this.toJSON(data)
		return {
			list: jsonData.rows || [],
			total: jsonData.count || 0,
			pageSize: jsonData.pageSize || 10,
			pageNumber: jsonData.pageNumber || 1
		}
	}

	/**
	 * 检查对象是否为空
	 * @param obj 要检查的对象
	 * @returns boolean
	 */
	static isEmpty(obj: any): boolean {
		if (obj === null || obj === undefined) return true
		if (typeof obj === 'string') return obj.trim().length === 0
		if (Array.isArray(obj)) return obj.length === 0
		if (typeof obj === 'object') return Object.keys(obj).length === 0
		return false
	}

	/**
	 * 格式化对象中的日期字段
	 */
	static formatDates(obj: Record<string, any>): Record<string, any> {
		const result: Record<string, any> = {}

		for (const [key, value] of Object.entries(obj)) {
			if (DATE_FIELDS.includes(key) && value) {
				// 处理日期字段
				result[key] = DateUtil.formatDateTime(value)
			} else if (Array.isArray(value)) {
				// 处理数组
				result[key] = value.map((item) => this.toJSON(item))
			} else if (value && typeof value === 'object') {
				// 处理嵌套对象
				result[key] = this.toJSON(value)
			} else {
				// 保持其他字段不变
				result[key] = value
			}
		}

		return result
	}
}
