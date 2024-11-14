import path from 'node:path'

import { Sequelize } from 'sequelize-typescript'

import processEnv from '../config/config.default'
import RoleModel from '../model/roleModel'
import { logger } from '../config/log4js'
import { DateUtil } from '../utils/dateUtil'
import models from '../model'
import { initService } from '../services/initService'
const {
	MYSQL_DB,
	MYSQL_HOST,
	MYSQL_USER,
	MYSQL_PWD,
	MYSQL_SERVICE_USER,
	MYSQL_SERVICE_PWD,
	MYSQL_SERVICE_DB,
	MYSQL_SERVICE_HOST,
	NODE_ENV
} = processEnv

// 本地数据库
const sequelize =
	NODE_ENV === 'development'
		? // 本地数据库
			new Sequelize(MYSQL_DB as string, MYSQL_USER as string, MYSQL_PWD, {
				host: MYSQL_HOST,
				dialect: 'mysql',
				models: models, // 数据库模板存放地址
				define: {
					freezeTableName: false, // sequelize会给表名自动添加为复数，
					timestamps: true, // 开启时间戳 create_at delete_at update_at
					paranoid: true, // 开启假删除
					createdAt: 'created_at',
					updatedAt: 'updated_at',
					deletedAt: 'deleted_at',
					charset: 'utf8mb4', // 字符集
					collate: 'utf8mb4_bin' // 排序规则
				}
			})
		: //   服务器数据库
			new Sequelize(
				MYSQL_SERVICE_DB as string,
				MYSQL_SERVICE_USER as string,
				MYSQL_SERVICE_PWD,
				{
					host: MYSQL_SERVICE_HOST,
					dialect: 'mysql',
					models, // 数据库模板存放地址
					define: {
						freezeTableName: false, // sequelize会给表名自动添加为复数，
						timestamps: true, // 开启时间戳 create_at delete_at update_at
						paranoid: true, // 开启假删除
						createdAt: 'created_at',
						updatedAt: 'updated_at',
						deletedAt: 'deleted_at',
						charset: 'utf8mb4', // 字符集
						collate: 'utf8mb4_bin' // 排序规则
					},
					logging: (sql, timing) => {
						// 记录 SQL 语句和执行时间
						logger.sql({
							sql,
							executionTime: timing ? `${timing}ms` : 'N/A',
							timestamp: DateUtil.getCurrentDateTime()
						})
					}, // 日志，不打印则可设置为 false
					benchmark: true // 启用 SQL 执行时间统计
				}
			)
// sequelize.sync({ force: true });
// sequelize.sync();
export function db() {
	sequelize
		.authenticate()
		.then(async () => {
			await sequelize.sync({ force: true })
			// const initRole = [
			// 	{
			// 		name: '超级管理员',
			// 		nickname: 'super',
			// 		description: '最高权限'
			// 	},
			// 	{
			// 		name: '管理员',
			// 		nickname: 'admin',
			// 		description: '普通管理员'
			// 	},
			// 	{
			// 		name: '普通用户',
			// 		nickname: 'user',
			// 		description: '普通用户'
			// 	}
			// ]
			// {
			// 	force: true;
			// }
			// await RoleModel.bulkCreate(initRole, { ignoreDuplicates: true })
			console.log('数据库连接成功')
			initService.initAll()
		})
		.catch((err: any) => {
			console.log('数据库连接失败', err)
		})
}
export default sequelize
