import { Context } from 'koa';
import { body, params, query, request, tags } from 'koa-swagger-decorator';
import { regSchema } from '../schemas/userSchema';
import userService from '../services/useServices';
import UserModel from '../model/userModel';
import { createToken, decrypt } from '../utils/auth';
import { HttpError, UserMessage } from '../enums';
import RoleModel from '../model/roleModel';
export default class UserController {
	@request('get', '/login')
	@tags(['登录'])
	@query({
		password: { type: 'string', required: true, description: '密码' },
		username: { type: 'string', required: true, description: '用户名' }
	})
	static async login(ctx: Context) {
		const params = ctx.request.query as unknown as UserModel;
		try {
			const res = await userService.findByUsername(params?.username!);
			if (!res) return ctx.send(UserMessage.USER_NOT_EXIST, 201);
			const str = decrypt(res.password);
			if (params.password !== str)
				return ctx.send(UserMessage.USER_OR_PASSWORD_ERROR, 201);
			const userinfo = await userService.userLogin(params);
			const token = createToken({
				id: userinfo?.id,
				username: userinfo?.username
			});
			return ctx.send(UserMessage.USER_SUCCESS, 200, {
				token: `Bearer ${token}`,
				userinfo
			});
		} catch (error) {
			return ctx.send(HttpError.HTTP, 500);
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
			description: '确认密码'
		}
	})
	@tags(['注册'])
	static async register(ctx: Context) {
		const params = ctx.request.body as UserModel;
		try {
			const { error } = regSchema.validate(params);
			if (error) return ctx.send(error?.message, 201);
			const res = await userService.findByUsername(params?.username!);
			if (!!res) return ctx.send(UserMessage.USER_EXIST, 201);
			await userService.useRegister(params);
			return ctx.send(UserMessage.USER_REGISTER_SUCCESS, 200);
		} catch (error) {
			console.log(error);
			return ctx.send(HttpError.HTTP, 500);
		}
	}
	@request('get', '/user/info')
	@tags(['用户信息'])
	@query({
		id: { type: 'number', require: true, description: '用户id' }
	})
	static async getInfo(ctx: Context) {
		const params = ctx.request.query as unknown as UserModel;
		try {
			const res = await userService.findById(params.id);
			if (Object.keys(res).length <= 0)
				return ctx.send('用户不存在', 201);
			return ctx.send('获取用户信息成功', 200, res);
		} catch (error) {
			console.log(error);
			return ctx.send(HttpError.HTTP, 500);
		}
	}
	@request('put', '/user/status')
	@tags(['用户状态'])
	@query({
		id: { type: 'number', require: true, description: '用户id' },
		status: { type: 'number', require: true, description: '状态' }
	})
	static async updateStatus(ctx: Context) {
		const params = ctx.request.query as unknown as UserModel;
		try {
			const res = await userService.updStatus(params.id, params.status);
			if (!res) return ctx.send(UserMessage.USER_STATUS_SUCCESS, 200);
			return ctx.send(UserMessage.USER_STATUS_ERROR, 201);
		} catch (error) {
			console.log(error);
			return ctx.send(HttpError.HTTP, 500);
		}
	}

	@request('get', '/user/list')
	@tags(['用户列表'])
	@query({
		pagesize: { type: 'number', require: false, description: '每页条数' },
		pagenumber: { type: 'number', require: false, description: '页码' },
		searchParams: { require: false, description: '搜索参数' }
	})
	static async getAllUser(ctx: Context) {
		const params = ctx.request.query as unknown as {
			searchParams: Partial<UserModel>;
			pagesize: number;
			pagenumber: number;
		};
		try {
			const res = userService.getAllUser(params);
			if (!!res) return ctx.send(UserMessage.USER_LIST_SUCCESS, 200, res);
			return ctx.send(UserMessage.USER_LIST_ERROR, 201);
		} catch (error) {
			return ctx.send(HttpError.HTTP, 500);
		}
	}
	@tags(['修改用户信息'])
	@request('put', '/user/upd/info/{id}')
	@query({
		username: { type: 'string', required: true, description: '用户名' },
		nickname: { type: 'string', required: false, description: '昵称' },
		email: { type: 'string', required: false, description: '邮箱' },
		phone: { type: 'string', required: false, description: '手机号' },
		gender: { type: 'number', required: false, description: '性别' },
		avatar: { type: 'string', required: false, description: '头像' },
		roles: { type: 'array<number>', required: false, description: '角色' }
	})
	static async updUserInfo(ctx: Context) {
		const params = ctx.request.body as UserModel & { roles: number[] };
		const id = ctx.params.id;
		try {
			const res = await userService.updUserInfo(params, id);
			if (!res) return ctx.send(UserMessage.USER_UPD_INFO, 200);
			return ctx.send(UserMessage.USER_UPD_INFO_ERROR, 201);
		} catch (error) {
			return ctx.send(HttpError.HTTP, 500);
		}
	}
	// 批量删除用户
	@request('delete', '/user/batch/delete')
	@tags(['批量删除用户'])
	@query({
		ids: { type: 'array<number>', required: true, description: '用户id' }
	})
	static async batchDelete(ctx: Context) {
		const params = ctx.request.query as unknown as {
			ids: number[];
		};
		try {
			const res = await userService.batchDelete(params.ids);
			if (!res) return ctx.send(UserMessage.USER_BATCH_USER_ERROR, 201);
			return ctx.send(UserMessage.USER_BATCH_USER_SUCCESS, 200);
		} catch (error) {
			return ctx.send(HttpError.HTTP, 500);
		}
	}
	// 给用户增加角色
	@request('put', '/user/role/{id}')
	@tags(['用户角色设置'])
	@query({
		roleIds: {
			type: 'array<number>',
			required: true,
			description: '角色id'
		}
	})
	static async updUserRole(ctx: Context) {
		const params = ctx.request.query as unknown as {
			roleIds: RoleModel['id'][];
		};
		try {
			const id = ctx.params.id;
			const res = await userService.updUserRole(id, params.roleIds);
			if (!!res) return ctx.send(UserMessage.USER_ROLE_ERROR, 201);
			return ctx.send(UserMessage.USER_ROLE_SUCCESS, 200);
		} catch (error) {
			return ctx.send(HttpError.HTTP, 500);
		}
	}
	// 重置密码
	@request('put', '/user/updpwd/{id}')
	@body({
		password: { type: 'string', required: true, description: '用户密码' }
	})
	@tags(['重置密码'])
	static async updPassword(ctx: Context) {
		const { id = 1 } = ctx.params;
		const { password = '' } = ctx.request.body;
		try {
			const res = await userService.updPassword({ id, password });
			if (!res) return ctx.send(UserMessage.USER_PASSWORD_ERROR, 201);
			return ctx.send(UserMessage.USER_PASSWORD_SUCCESS, 200);
		} catch (error) {
			return ctx.sned(HttpError.HTTP, 500);
		}
	}
	// 修改用户头像
	@request('put', '/user/avatar/{id}')
	@body({
		avatar: { type: 'string', required: true, description: '头像' }
	})
	@tags(['修改用户头像'])
	static async updAvatar(ctx: Context) {
		const { id } = ctx.params;
		try {
			const res = await userService.updAvatar(
				id,
				ctx.request.body?.avatar
			);
			if (!res) return ctx.send(UserMessage.USER_AVATAR_ERROR, 201);
			return ctx.send(UserMessage.USER_AVATAR_SUCCESS, 200);
		} catch (err) {
			return ctx.send(HttpError.HTTP, 500);
		}
	}
}
