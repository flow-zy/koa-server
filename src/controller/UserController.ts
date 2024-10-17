import {Context} from 'koa';
import {request, tags} from 'koa-swagger-decorator';
import {regSchema} from '../schemas/userSchema';
import {findByUsername, useRegister} from '../services/useServices';
import UserModel from '../model/userModel';
export default class UserController {
  @request('get', '/login')
  @tags(['user'])
  static async login(ctx: Context) {
    return (ctx.body = 'login');
  }
  @request('post', '/register')
  @tags(['user'])
  static async register(ctx: Context) {
    const params = ctx.request.body as UserModel;
    try {
      const {error} = regSchema.validate(params);
      if (error) return ctx.send(error?.message, 201);
      const res = findByUsername(params?.username!);
      if (!res) return ctx.send('用户名已存在', 201);
      await useRegister(params);
      return ctx.send('注册成功', 200);
    } catch (error) {
      console.log(error);
      return ctx.send('服务器请求失败', 400);
    }
  }
}
