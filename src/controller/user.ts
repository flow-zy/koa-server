import {Context} from 'koa';
export default class UserController {
  user = (ctx: Context) => {
    return (ctx.body = 'user');
  };
}
