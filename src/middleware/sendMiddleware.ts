import {Context, Next} from 'koa';

export default () => {
  return async (ctx: Context, next: Next) => {
    ctx.send = (msg: string, status: number = 200, data = null) => {
      ctx.status = status;
      return (ctx.body = {
        msg,
        data,
        code: status,
      });
    };
    await next();
  };
};
