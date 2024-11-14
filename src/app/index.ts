import path from 'node:path'
// Koa业务
import Koa from 'koa'
import { koaBody } from 'koa-body'
import cors from 'koa2-cors' // 跨域处理
// import parameter from 'koa-parameter';
// import koaStatic from 'koa-static';
import jwt from 'koa-jwt'
// @ts-ignore
import parameter from 'koa-parameter'
import koaStatic from 'koa-static'
import logger from 'koa-logger'

import router from '../router/index'
import corsHandler from '../middleware/cors'
import Result from '../utils/Result'
import { deleteStatic, staticInit } from '../utils/Schedule'
import processEnv, { white_list } from '../config/config.default'
import { initApp } from '../utils/init'
import { logger as logger4js } from '../config/log4js'
import { initRedis, checkRedisHealth } from '../config/redis'
import auth from '../middleware/auth'
import { createParameterMiddleware } from '../middleware/parameterMiddleware'
// import sequelize from '../db/index';
// @ts-ignore

import send from '../middleware/send'
// 引入数据库
import { db } from '../db/mysql'

import errHandler from '../middleware/errHandler'
import { loggerMiddleware } from '../middleware/loggerMiddleware'

async function start() {
	initApp()
	staticInit()
	db()
	// await initRedis()
	const app = new Koa()
	// 使用自定义配置
	const parameterMiddleware = createParameterMiddleware({
		customFilters: ['_t', 'timestamp', 'debug'],
		trimStrings: true,
		removeEmpty: true
	})
	// 注册全局错误处理中间件（需要放在最前面）
	app.use(errHandler())
	app.use(loggerMiddleware)
	// 日志
	app.use(logger())
	// 添加日志中间件
	app.use(async (ctx, next) => {
		const start = Date.now()
		try {
			await next()
			const ms = Date.now() - start
			logger4js.info(`${ctx.method} ${ctx.url} ${ctx.status} - ${ms}ms`)
		} catch (error) {
			const ms = Date.now() - start
			logger4js.error(
				// @ts-ignore
				`${ctx.method} ${ctx.url} ${ctx.status} - ${ms}ms - Error: ${error.message}`
			)
			throw error
		}
	})
	app.use(
		koaBody({
			multipart: true,
			formidable: {
				uploadDir: path.resolve(__dirname, '../static/uploads'),
				keepExtensions: true,
				maxFileSize: 200 * 1024 * 1024 // 200MB
			}
		})
	)
	// 可以通过路径访问静态资源
	app.use(koaStatic(path.resolve(__dirname, '../static')))
	app.use(send())
	// app.use(
	// 	jwt({
	// 		secret: processEnv.JWT_SECRET!
	// 	}).unless({
	// 		path: white_list
	// 	})
	// )

	// 注册参数处理中间件（要在路由中间件之前）
	app.use(parameterMiddleware)
	app.use(auth())
	app.use(router.routes())
	app.use(router.allowedMethods())

	// 跨域
	app.use(
		corsHandler({
			origins: ['*'],
			methods: ['GET', 'POST', 'PUT', 'DELETE'],
			allowHeaders: ['Content-Type', 'Authorization', 'X-Token'],
			security: true,
			logging: process.env.NODE_ENV !== 'production'
		})
	)
	parameter(app)

	// 执行定时任务
	deleteStatic()
	// 错误事件监听
	app.on('error', (err, ctx) => {
		logger4js.error('Application Error:', {
			error: err,
			url: ctx.url,
			method: ctx.method
		})
	})
	app.listen(processEnv.APP_PORT, () => {
		console.log(
			`服务已经启动, 环境:${processEnv.NODE_ENV}，端口号:http://localhost:${processEnv.APP_PORT}`
		)
	})

	return app
}
export default start
