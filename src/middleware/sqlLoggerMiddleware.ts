import { Model, ModelStatic } from 'sequelize'
import { logger } from '../config/log4js'
import { DateUtil } from '../utils/dateUtil'

// 需要监控的数据库操作方法
const MONITORED_METHODS = [
	'findOne',
	'findAll',
	'create',
	'update',
	'destroy',
	'count',
	'findAndCountAll',
	'bulkCreate',
	'increment',
	'decrement'
]

/**
 * 包装 Sequelize 模型方法以记录 SQL 操作
 * @param model Sequelize 模型
 */
export function wrapModelMethods(model: ModelStatic<any>) {
	MONITORED_METHODS.forEach((methodName) => {
		// @ts-ignore
		const originalMethod = model[methodName]
		if (typeof originalMethod === 'function') {
			// @ts-ignore
			model[methodName] = async function (...args: any[]) {
				const startTime = Date.now()
				const methodInfo = {
					model: model.name,
					method: methodName,
					params: args[0] || {},
					timestamp: DateUtil.getCurrentDateTime()
				}

				try {
					// 执行原始方法
					const result = await originalMethod.apply(this, args)

					// 计算执行时间
					const executionTime = Date.now() - startTime

					// 记录成功的操作
					logger.sql({
						...methodInfo,
						status: 'success',
						executionTime: `${executionTime}ms`,
						resultCount: Array.isArray(result)
							? result.length
							: result?.count
								? result.count
								: result
									? 1
									: 0
					})

					return result
				} catch (err) {
					const error = err as Error
					// 记录失败的操作
					logger.sql({
						...methodInfo,
						status: 'error',
						error: error.message,
						stack: error.stack
					})
					throw error
				}
			}
		}
	})
}
