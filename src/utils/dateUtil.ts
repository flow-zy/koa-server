import dayjs from 'dayjs'

export class DateUtil {
	// 格式化为 YYYY-MM-DD HH:mm:ss
	static formatDateTime(date?: Date | string | number): string {
		return dayjs(date).format('YYYY-MM-DD HH:mm:ss')
	}

	// 格式化为 YYYY-MM-DD
	static formatDate(date?: Date | string | number): string {
		return dayjs(date).format('YYYY-MM-DD')
	}

	// 格式化为 HH:mm:ss
	static formatTime(date?: Date | string | number): string {
		return dayjs(date).format('HH:mm:ss')
	}

	// 检查是否为有效日期
	static isValidDate(date: any): boolean {
		return dayjs(date).isValid()
	}

	// 获取当前时间的格式化字符串
	static getCurrentDateTime(): string {
		return this.formatDateTime(new Date())
	}

	/**
	 * 获取前N天的日期
	 * @param days 天数
	 * @returns Date 对象
	 */
	static getLastDays(days: number): Date {
		return dayjs().subtract(days, 'day').toDate()
	}

	/**
	 * 获取日期范围的开始时间（当天 00:00:00）
	 */
	static getStartOfDay(date: Date | string | number): Date {
		return dayjs(date).startOf('day').toDate()
	}

	/**
	 * 获取日期范围的结束时间（当天 23:59:59）
	 */
	static getEndOfDay(date: Date | string | number): Date {
		return dayjs(date).endOf('day').toDate()
	}

	/**
	 * 获取本周开始时间
	 */
	static getStartOfWeek(): Date {
		return dayjs().startOf('week').toDate()
	}

	/**
	 * 获取本周结束时间
	 */
	static getEndOfWeek(): Date {
		return dayjs().endOf('week').toDate()
	}

	/**
	 * 获取本月开始时间
	 */
	static getStartOfMonth(): Date {
		return dayjs().startOf('month').toDate()
	}

	/**
	 * 获取本月结束时间
	 */
	static getEndOfMonth(): Date {
		return dayjs().endOf('month').toDate()
	}

	/**
	 * 计算两个日期之间的天数
	 */
	static getDaysBetween(
		startDate: Date | string,
		endDate: Date | string
	): number {
		return dayjs(endDate).diff(dayjs(startDate), 'day')
	}
}
