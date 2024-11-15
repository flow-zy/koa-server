// @ts-ignore
import websocket from 'koa-websocket'
import { verifyToken } from '../middleware/auth'
import { notificationService } from '../services/notificationService'
import { logger } from '../config/log4js'
import Koa, { Context } from 'koa'

export function initWebSocket(app: Koa) {
	const wsApp = websocket(app)

	// WebSocket 路由
	wsApp.ws.use(async (ctx: Context) => {
		try {
			// 获取token
			const token = ctx.query.token as string
			if (!token) {
				ctx.websocket.close()
				return
			}

			// 验证token
			const decoded = verifyToken(token)
			// @ts-ignore
			const userId = decoded.payload.userId

			// 添加到客户端列表
			notificationService.addClient(userId, ctx.websocket)

			// 监听关闭事件
			ctx.websocket.on('close', () => {
				notificationService.removeClient(userId)
			})

			// 监听消息事件
			ctx.websocket.on('message', (message: string) => {
				try {
					const data = JSON.parse(message)
					if (data.type === 'ping') {
						ctx.websocket.send(JSON.stringify({ type: 'pong' }))
					}
				} catch (error) {
					logger.error('WebSocket消息处理错误:', error)
				}
			})

			// 发送连接成功消息
			ctx.websocket.send(
				JSON.stringify({
					type: 'connected',
					message: '连接成功'
				})
			)
		} catch (error) {
			logger.error('WebSocket连接失败:', error)
			ctx.websocket.close()
		}
	})

	return wsApp
}
