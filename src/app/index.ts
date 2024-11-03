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
import { corsHandler } from '../middleware/cors'
import Result from '../utils/Result'
import { deleteStatic, staticInit } from '../utils/Schedule'
import processEnv, { white_list } from '../config/config.default'
// import sequelize from '../db/index';
// @ts-ignore

import send from '../middleware/send'
// 引入数据库
import { db } from '../db/mysql'

import errHandler from './errHandler'

staticInit()

// // 初始化模型
// sequelize.addModels([
// 	`${path.resolve(__dirname, '../model')}/*.ts`,
// 	`${path.resolve(__dirname, '../model')}/*.js`
// ]);

const app = new Koa()

// const { koaSwagger } = require('koa2-swagger-ui')
// const swagger = require('../config/swagger')

// require("babel-register");

// 添加全局异常处理
app.use(async (ctx, next) => {
  try {
    await next()
  }
  catch (error: any) {
    console.error(error)
    ctx.status = error.statusCode || 500
    ctx.body = new Result(500, '全局异常', 'error')
  }
})

// 日志
app.use(logger())

app.use(
  koaBody({
    multipart: true,
    formidable: {
      uploadDir: path.resolve(__dirname, '../static/uploads'),
      keepExtensions: true,
    },
  }),
)
// 可以通过路径访问静态资源
app.use(koaStatic(path.resolve(__dirname, '../static')))
app.use(send())
app.use(
  jwt({
    secret: processEnv.JWT_SECRET!,
  }).unless({
    path: white_list,
  }),
)
// app.use(parameter(app))
parameter(app)

// swagger配置
// app.use(swagger.routes(), swagger.allowedMethods())
// app.use(koaSwagger({
//     routePrefix: '/swagger', // host at /swagger instead of default /docs
//     swaggerOptions: {
//       url: '/swagger.json', // example path to json 其实就是之后swagger-jsdoc生成的文档地址
//     },
// }))

app.use(router.routes())
app.use(router.allowedMethods())

// 跨域
app.use(cors(corsHandler))

app.on('error', errHandler)
db()
// 执行定时任务
deleteStatic()

export default app
