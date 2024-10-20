declare module 'koa' {
	interface Context {
		send<T = any>(message: string, code: number, data?: T): void;
	}
}
