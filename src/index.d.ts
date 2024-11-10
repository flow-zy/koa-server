// send 是ctx的扩展方法
declare module 'koa' {
	interface Context {
		send: (message: string, status: number, data?: any) => void
	}
}
