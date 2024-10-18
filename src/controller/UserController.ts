import {Context} from 'koa';
import {request, tags} from 'koa-swagger-decorator';
import {regSchema} from '../schemas/userSchema';
import {findByUsername, useLogin, useRegister} from '../services/useServices';
import UserModel from '../model/userModel';
import {createToken, decrypt} from '../utils/auth';
export default class UserController {
  @request('get', '/login')
  @tags(['user'])
  static async login(ctx: Context) {
    const params = ctx.request.query as unknown as UserModel;
    const res = await findByUsername(params?.username!);
    if (!res) return ctx.send('用户不存在', 201);
    const str = decrypt(res.password);
    if (params.password !== str) return ctx.send('账号或者密码错误', 201)
    const userinfo = await useLogin(params);
    const token = createToken(userinfo);
    return ctx.send('登录成功',200,{token:`Bearer ${token}`,userinfo})
  }
  @request('post', '/register')
  @tags(['user'])
  static async register(ctx: Context) {
    const params = ctx.request.body as UserModel;
    try {
      const {error} = regSchema.validate(params);
      if (error) return ctx.send(error?.message, 201);
      const res = await findByUsername(params?.username!);
      if (!!res) return ctx.send('用户名已存在', 201);
      await useRegister(params);
      return ctx.send('注册成功', 200);
    } catch (error) {
      console.log(error);
      return ctx.send('服务器请求失败', 400);
    }
  }
}
