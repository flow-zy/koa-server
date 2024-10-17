import {WHITE_LIST} from '../config';
import {verifyToken} from '../utils/auth';
import {Context, Next} from 'koa';
export default () => {
  return async (ctx: Context, next: Next) => {
    const token = ctx.request.headers.authorization;
    const isWhite = WHITE_LIST.some((item) => RegExp(item).test(ctx.url));
    if (isWhite) return await next();
    if (!token) {
      ctx.send('Token is required ', 401);
      return;
    }
    try {
      const user = await verifyToken(token);
      ctx.state.user = user;
    } catch (error) {
      ctx.send('Token is required', 401);
    }
    await next();
  };
};
