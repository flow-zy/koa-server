import { Context, Next } from 'koa';
import Result from '../utils/Result';

export default () => {
	return async (ctx: Context, next: Next) => {
		ctx.send = <T>(message: string, code: number = 200, data?: T) => {
			ctx.body = new Result(code, message, data!);
		};
		await next();
	};
};
