import path from 'node:path'

import { Sequelize } from 'sequelize-typescript'

import processEnv from '../config/config.default'
import { dbLogger } from '../utils/log'
import RoleModel from '../model/roleModel'

const {
  MYSQL_DB,
  MYSQL_HOST,
  MYSQL_USER,
  MYSQL_PWD,
  MYSQL_SERVICE_USER,
  MYSQL_SERVICE_PWD,
  MYSQL_SERVICE_DB,
  MYSQL_SERVICE_HOST,
  NODE_ENV,
} = processEnv

// 本地数据库
const sequelize
	= NODE_ENV === 'development'
	  ? // 本地数据库
	  new Sequelize(MYSQL_DB as string, MYSQL_USER as string, MYSQL_PWD, {
	    host: MYSQL_HOST,
	    dialect: 'mysql',
	    models: [
	      `${path.resolve(__dirname, '../model')}/*.ts`,
	      `${path.resolve(__dirname, '../model')}/*.js`,
	    ], // 数据库模板存放地址
	    define: {
	      freezeTableName: false, // sequelize会给表名自动添加为复数，
	      timestamps: true, // 开启时间戳 create_at delete_at update_at
	      paranoid: true, // 开启假删除
	      createdAt: 'created_at',
	      updatedAt: 'updated_at',
	      deletedAt: 'deleted_at',
	      charset: 'utf8mb4', // 字符集
	      collate: 'utf8mb4_bin', // 排序规则
	    },
	  })
	  : //   服务器数据库
	  new Sequelize(
	    MYSQL_SERVICE_DB as string,
	    MYSQL_SERVICE_USER as string,
	    MYSQL_SERVICE_PWD,
	    {
	      host: MYSQL_SERVICE_HOST,
	      dialect: 'mysql',
	      timezone: '+8:00', // 设置为东八区
	      models: [
	        `${path.resolve(__dirname, '../model')}/*.ts`,
	        `${path.resolve(__dirname, '../model')}/*.js`,
	      ], // 数据库模板存放地址
	      define: {
	        freezeTableName: false, // sequelize会给表名自动添加为复数，
	        timestamps: true, // 开启时间戳 create_at delete_at update_at
	        paranoid: true, // 开启假删除
	        createdAt: 'created_at',
	        updatedAt: 'updated_at',
	        deletedAt: 'deleted_at',
	        charset: 'utf8mb4', // 字符集
	        collate: 'utf8mb4_bin', // 排序规则
	      },
	      logging: msg => dbLogger.info(msg), // 日志，不打印则可设置为 false
	    },
	  )

// 服务器数据库
// const sequelize = new Sequelize(
// 	MYSQL_SERVICE_DB as string,
// 	MYSQL_SERVICE_USER as string,
// 	MYSQL_SERVICE_PWD,
// 	{
// 		host: MYSQL_SERVICE_HOST,
// 		dialect: 'mysql',
// 		timezone: '+8:00', //设置为东八区
// 		models: [
// 			`${path.resolve(__dirname, '../model')}/*.ts`,
// 			`${path.resolve(__dirname, '../model')}/*.js`
// 		], // 数据库模板存放地址
// 		// 配置日期格式
// 		dialectOptions: {
// 			dateStrings: true,
// 			typeCast: true,
// 			useUTC: false
// 		}
// 	}
// );

// sequelize.sync({ force: true });
// sequelize.sync();
export function db() {
  sequelize
    .authenticate()
    .then(async () => {
      await sequelize.sync();
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
      // ];
      // // {
      // // 	force: true;
      // // }
      // await RoleModel.bulkCreate(initRole, { ignoreDuplicates: true });
      console.log('数据库连接成功')
    })
    .catch((err: any) => {
      console.log('数据库连接失败', err)
    })
}
export default sequelize
