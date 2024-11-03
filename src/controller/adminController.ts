import { tags, query, body,request, summary, description } from "koa-swagger-decorator"
import { HttpError, UserMessage } from "../enums"
import { regSchema } from "../schemas/userSchema"
import userService from '../services/useServices'
import authService from '../services/authService'
import UserModel from '../model/userModel'
import { createToken, decrypt } from '../utils/auth'
import { Context } from "koa"


export default class AdminController {
  @request('get', '/login')
  @tags(['Auth'])
  @summary('登录')
  @description('用户通过用户名和密码登录')
  @query({
    password: { type: 'string', description: '密码' },
    username: { type: 'string', description: '用户名' },
  })
  static async login(ctx: Context) {
    const params = ctx.request.query as unknown as UserModel
    try {
      const res = await userService.findByUsername(params?.username)
      if (!res)
        return ctx.send(UserMessage.USER_NOT_EXIST, 201)
      const str = decrypt(res.dataValues.password)
      if (params.password !== str)
        return ctx.send(UserMessage.USER_OR_PASSWORD_ERROR, 201)
      const userInfo = await authService.userLogin(params)
      const token = createToken({
        id: userInfo?.id,
        username: userInfo?.username,
      })
      return ctx.send(UserMessage.USER_SUCCESS, 200, {
        token: `Bearer ${token}`,
        userInfo,
      })
    }
    catch (error) {
      throw ctx.send(HttpError.HTTP, 500)
    }
  }

  @request('post', '/register')
  @body({
    password: { type: 'string', required: true, description: '密码' },
    username: { type: 'string', required: true, description: '用户名' },
    nickname: { type: 'string', required: false, description: '昵称' },
    email: { type: 'string', required: false, description: '邮箱' },
    phone: { type: 'string', required: false, description: '手机号' },
    gender: { type: 'number', required: false, description: '性别' },
    avatar: { type: 'string', required: false, description: '头像' },
    confirmPassword: {
      type: 'string',
      required: true,
      description: '确认密码',
    },
  })
  @tags(['Auth'])
  @summary(['注册'])
  static async register(ctx: Context) {
    const params = ctx.request.body as UserModel
    try {
      const { error } = regSchema.validate(params)
      if (error)
        return ctx.send(error?.message, 201)
      const res = await userService.findByUsername(params?.username)
      if (res)
        return ctx.send(UserMessage.USER_EXIST, 201)
      const user = await authService.useRegister(params)
    if(!!user) return ctx.send(UserMessage.USER_REGISTER_ERROR, 201)
      return ctx.send(UserMessage.USER_REGISTER_SUCCESS, 200)
    }
    catch (error) {
      throw ctx.send(HttpError.HTTP, 500)
    }
  }
}