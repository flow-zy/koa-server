import { Model } from 'sequelize-typescript'
import MenuModel from '../model/menuModel'
import PermissionModel from '../model/permissionModel'
import RoleModel from '../model/roleModel'
import userModel from '../model/userModel'
import { encrypt } from '../utils/auth'
import User from '../model/userModel'
import { getLimitAndOffset } from '../utils/util'
import RoleUserModel from '../model/roleUserModel'
import { Op } from 'sequelize'
class UserService {

	// 查找用户用户名查找用户
	findByUsername = async (username: string) => {
		return await userModel.findOne({ where: { username } })
	}
	// 通过用户名id查找用户
	findById = async (id: number) => {
		const userInfo = await userModel.findOne({
			where: { id },
			attributes: {
				exclude: ['password']
			}
		})
		return userInfo?.dataValues
	}
	// 修改用户状态
	updStatus = async (id: number, status: number) => {
		return await userModel.update(
			{ status },
			{
				where: { id }
			}
		)
	}
	// 查找全部用户列表
	getAllUser = async (params: Partial<User>& {
		pagesize: number
		pagenumber: number
	}) => {
		const {pagesize,pagenumber,..._params} = params

		const { limit, offset } = getLimitAndOffset(pagesize,pagenumber)
		const options = { limit, offset }
		const findOption =
			Object.keys(params).length > 0
				? { ...options, where: { ..._params } }
				: options
		const { count, rows } = await userModel.findAndCountAll({
			...findOption,
			order: [['sort', 'DESC']],
			attributes: {
				exclude: ['password','deleted_at']
			}
		})
		return {
			total: count,
			pagesize: params.pagesize,
			pagenumber: params.pagenumber,
			list: rows
		}
	}
	updUserInfo = async (params: User & { roles: number[] }, id: number) => {
		params.roles.forEach(async (roleId: number) => {
			await RoleUserModel.create({
				user_id: id,
				role_id: roleId
			})
		})
		const option = {
			username: params.username,
			nickname: params.nickname,
			email: params.email,
			phone: params.phone,
			gender: params.gender,
			sort: params.sort,
			status: params.status
		}
		return await User.update(option, { where: { id } })
	}
	// 批量删除
	batchDelete = async (ids: number[]) => {
		let res = 0
		ids.forEach(async (id) => {
			res = await User.destroy({
				where: {
					id
				}
			})
			res = await RoleUserModel.destroy({
				where: {
					user_id: id
				}
			})
		})
		return res
	}
	// 给用户添加角色
	updUserRole = async (id: number, roles: RoleModel['id'][]) => {
		const options = roles.map((roleId) => ({
			user_id: id,
			role_id: roleId
		}))
		return await RoleUserModel.bulkCreate(options)
	}
	// 修改密码
	updPassword = async (params: { id: number; password: string }) => {
		params.password = encrypt(params.password)
		return await userModel.update(
			{ password: params.password },
			{ where: { id: params.id } }
		)
	}
	// 修改用户头像
	updAvatar = async (id: number, avatar: string) => {
		return await userModel.update({ avatar }, { where: { id } })
	}
}
export default new UserService()
