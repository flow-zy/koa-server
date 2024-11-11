// import { Context } from 'koa'
// import { redisClient } from '../config/redis'
// // 在验证token的中间件中添加黑名单检查
// const token = ctx.headers.authorization?.split(' ')[1]
// if (token) {
// 	const isBlacklisted = await redisClient.get(`blacklist:${token}`)
// 	if (isBlacklisted) {
// 		ctx.error('token已失效，请重新登录', 401)
// 		return
// 	}
// }
