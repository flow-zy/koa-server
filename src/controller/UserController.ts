import { Context } from 'koa'
import { body, query, request, summary, tags } from 'koa-swagger-decorator'

import userService from '../services/useServices'
import UserModel from '../model/userModel'
import { HttpError, UserMessage } from '../enums'
import RoleModel from '../model/roleModel'

export default class UserController {

  @request('get', '/user/info')
  @summary(['用户信息'])
  @tags(['User'])
  @query({
    id: { type: 'number', require: true, description: '用户id' },
  })
  static async getInfo(ctx: Context) {
    const params = ctx.request.query as unknown as UserModel
    try {
      const res = await userService.findById(params.id)
      if (Object.keys(res).length <= 0)
        return ctx.send('用户不存在', 201)
      return ctx.send('获取用户信息成功', 200, res)
    }
    catch (error) {
      throw ctx.send(HttpError.HTTP, 500)
    }
  }

  @request('put', '/user/status')
  @summary(['用户状态'])
  @tags(['User'])
  @query({
    id: { type: 'number', require: true, description: '用户id' },
    status: { type: 'number', require: true, description: '状态' },
  })
  static async updateStatus(ctx: Context) {
    const params = ctx.request.query as unknown as UserModel
    try {
      const res = await userService.updStatus(params.id, params.status)
      if (!res)
        return ctx.send(UserMessage.USER_STATUS_SUCCESS, 200)
      return ctx.send(UserMessage.USER_STATUS_ERROR, 201)
    }
    catch (error) {
      throw ctx.send(HttpError.HTTP, 500)
    }
  }

  @request('get', '/user/list')
  @summary(['用户列表'])
  @tags(['User'])
  @query({
    pagesize: { type: 'number', require: false, description: '每页条数' },
    pagenumber: { type: 'number', require: false, description: '页码' },
    searchParams: { require: false, description: '搜索参数' },
  })
  static async getAllUser(ctx: Context) {
    const params = ctx.request.query as unknown as {
      searchParams: Partial<UserModel>
      pagesize: number
      pagenumber: number
    }
    try {
      const res =await userService.getAllUser(params)
      if (res)
        return ctx.send(UserMessage.USER_LIST_SUCCESS, 200, res)
      return ctx.send(UserMessage.USER_LIST_ERROR, 201)
    }
    catch (error) {
      throw ctx.send(HttpError.HTTP, 500)
    }
  }

  @summary(['修改用户信息'])
  @request('put', '/user/upd/info/{id}')
  @tags(['User'])
  @query({
    username: { type: 'string', required: true, description: '用户名' },
    nickname: { type: 'string', required: false, description: '昵称' },
    email: { type: 'string', required: false, description: '邮箱' },
    phone: { type: 'string', required: false, description: '手机号' },
    gender: { type: 'number', required: false, description: '性别' },
    avatar: { type: 'string', required: false, description: '头像' },
    roles: { type: 'array<number>', required: false, description: '角色' },
  })
  static async updUserInfo(ctx: Context) {
    const params = ctx.request.body as UserModel & { roles: number[] }
    const id = ctx.params.id
    try {
      const res = await userService.updUserInfo(params, id)
      if (!res)
        return ctx.send(UserMessage.USER_UPD_INFO, 200)
      return ctx.send(UserMessage.USER_UPD_INFO_ERROR, 201)
    }
    catch (error) {
      throw ctx.send(HttpError.HTTP, 500)
    }
  }

  // 批量删除用户
  @request('delete', '/user/batch/delete')
  @summary(['批量删除用户'])
  @tags(['User'])
  @query({
    ids: { type: 'array<number>', required: true, description: '用户id' },
  })
  static async batchDelete(ctx: Context) {
    const params = ctx.request.query as unknown as {
      ids: number[]
    }
    try {
      const res = await userService.batchDelete(params.ids)
      if (!res)
        return ctx.send(UserMessage.USER_BATCH_USER_ERROR, 201)
      return ctx.send(UserMessage.USER_BATCH_USER_SUCCESS, 200)
    }
    catch (error) {
      throw ctx.send(HttpError.HTTP, 500)
    }
  }

  // 给用户增加角色
  @request('put', '/user/role/{id}')
  @summary(['用户角色设置'])
  @tags(['User'])
  @query({
    roleIds: {
      type: 'array<number>',
      required: true,
      description: '角色id',
    },
  })
  static async updUserRole(ctx: Context) {
    const params = ctx.request.query as unknown as {
      roleIds: RoleModel['id'][]
    }
    try {
      const id = ctx.params.id
      const res = await userService.updUserRole(id, params.roleIds)
      if (res)
        return ctx.send(UserMessage.USER_ROLE_ERROR, 201)
      return ctx.send(UserMessage.USER_ROLE_SUCCESS, 200)
    }
    catch (error) {
      throw ctx.send(HttpError.HTTP, 500)
    }
  }

  // 重置密码
  @request('put', '/user/updpwd/{id}')
  @body({
    password: { type: 'string', required: true, description: '用户密码' },
  })
  @tags(['User'])
  @summary(['重置密码'])
  static async updPassword(ctx: Context) {
    const { id = 1 } = ctx.params
    const { password = '' } = ctx.request.body
    try {
      const res = await userService.updPassword({ id, password })
      if (!res)
        return ctx.send(UserMessage.USER_PASSWORD_ERROR, 201)
      return ctx.send(UserMessage.USER_PASSWORD_SUCCESS, 200)
    }
    catch (error) {
      throw ctx.sned(HttpError.HTTP, 500)
    }
  }

  // 修改用户头像
  @request('put', '/user/avatar/{id}')
  @body({
    avatar: { type: 'string', required: true, description: '头像' },
  })
  @tags(['User'])
  @summary(['修改用户头像'])
  static async updAvatar(ctx: Context) {
    const { id } = ctx.params
    try {
      const res = await userService.updAvatar(
        id,
        ctx.request.body?.avatar,
      )
      if (!res)
        return ctx.send(UserMessage.USER_AVATAR_ERROR, 201)
      return ctx.send(UserMessage.USER_AVATAR_SUCCESS, 200)
    }
    catch (err) {
      throw ctx.send(HttpError.HTTP, 500)
    }
  }
}
