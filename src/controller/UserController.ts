import {Context} from 'koa';
import {request} from 'koa-swagger-decorator';
import {regSchema} from '@/schemas/userSchema';
import {findByUsername, useRegister} from '@/services/useServices';
import UserModel from '@/model/userModel';
export default class UserController {
  @request('get', '/login')
  static async login(ctx: Context) {
    return (ctx.body = 'login');
  }
  @request('post', '/register')
  static async register(ctx: Context) {
    const params = ctx.body as UserModel;
    try {
      const {error, value: valiadte} = await regSchema.validate(params);
      if (!valiadte) return ctx.send(error?.message, 400);
      const res = findByUsername(params?.username!);
      if (!res) return ctx.send('用户名已存在', 201);
      await useRegister(params);
      return ctx.send('注册成功', 200);
    } catch (error) {
      return ctx.send(error, 400);
    }
  }
}
