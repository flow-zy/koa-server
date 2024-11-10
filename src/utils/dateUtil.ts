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
}
