import { Context } from 'koa';
import { body, params, query, request, tags } from 'koa-swagger-decorator';
import { regSchema } from '../schemas/userSchema';
import userService from '../services/useServices';
import UserModel from '../model/userModel';
import { createToken, decrypt } from '../utils/auth';
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
			if (!res) return ctx.send('用户不存在', 201);
			const str = decrypt(res.password);
			if (params.password !== str)
				return ctx.send('账号或者密码错误', 201);
			const userinfo = await userService.userLogin(params);
			const token = createToken({
				id: userinfo?.id,
				username: userinfo?.username
			});
			return ctx.send('登录成功', 200, {
				token: `Bearer ${token}`,
				userinfo
			});
		} catch (error) {
			console.log(error);
			return ctx.send('服务器请求失败', 500);
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
			if (!!res) return ctx.send('用户名已存在', 201);
			await userService.useRegister(params);
			return ctx.send('注册成功', 200);
		} catch (error) {
			console.log(error);
			return ctx.send('服务器请求失败', 500);
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
			return ctx.send('服务器请求失败', 500);
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
			if (!res) return ctx.send('更新用户状态成功', 200);
			return ctx.send('更新用户状态失败', 201);
		} catch (error) {
			console.log(error);
			return ctx.send('服务器请求失败', 500);
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
			if (!!res) return ctx.send('获取用户列表成功', 200, res);
			return ctx.send('获取用户列表失败', 201);
		} catch (error) {
			return ctx.send('服务器请求失败', 500);
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
		avatar: { type: 'string', required: false, description: '头像' }
	})
	static async updUserInfo(ctx: Context) {
		const params = ctx.request.body as UserModel;
		const id = ctx.request.search;
		console.log(ctx);
	}
}
