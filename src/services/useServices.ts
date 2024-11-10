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
import { DataUtil } from '../utils/dataUtil'
class UserService {
	async getUserInfo(id: number) {
		try {
			const user = await User.findOne({
				where: { id },
				include: [
					{
						model: RoleModel,
						as: 'roles',
						through: { attributes: [] },
						attributes: ['id', 'name']
					}
				],
				attributes: {
					exclude: ['password', 'deleted_at'] // 排除密码字段
				}
			})

			if (!user) return null

			// 使用 DataUtil 处理数据
			const userData = DataUtil.toJSON(user)

			return {
				...userData,
				roles: userData.roles || []
			}
		} catch (error) {
			console.error('获取用户信息错误:', error)
			throw error
		}
	}

	// 查找用户用户名查找用户
	findByUsername = async (username: string) => {
		try {
			const user = await User.findOne({
				where: { username },
				include: [
					{
						model: RoleModel,
						as: 'roles',
						through: { attributes: [] },
						attributes: ['id', 'name']
					}
				]
			})

			return user ? DataUtil.toJSON(user) : null
		} catch (error) {
			console.error('通过用户名查询用户错误:', error)
			throw error
		}
	}
	// 通过用户名id查找用户
	findById = async (id: number) => {
		const userInfo = await userModel.findOne({
			where: { id },
			attributes: {
				exclude: ['password', 'deleted_at']
			}
		})
		return userInfo?.dataValues
	}
	// 修改用户状态
	updStatus = async (id: number) => {
		const user = await userModel.findOne({ where: { id } })
		if (!user) return false
		const status = user.dataValues.status === 1 ? 0 : 1
		return await userModel.update(
			{ status },
			{
				where: { id }
			}
		)
	}
	// 查找全部用户列表
	getAllUser = async (
		params: Partial<User> & {
			pagesize: number
			pagenumber: number
			startTime: Date
			endTime: Date
		}
	) => {
		const {
			pagesize,
			pagenumber,
			startTime,
			endTime,
			username,
			..._params
		} = params

		const { limit, offset } = getLimitAndOffset(pagesize, pagenumber)
		const options: any = { limit, offset }

		const where: any = { ..._params, status: 1 }
		// 添加时间范围过滤
		if (startTime && endTime) {
			where.created_at = {
				[Op.between]: [new Date(startTime), new Date(endTime)]
			}
		} else if (startTime) {
			where.created_at = {
				[Op.gte]: new Date(startTime)
			}
		} else if (endTime) {
			where.created_at = {
				[Op.lte]: new Date(endTime)
			}
		}
		if (username) where.username = { [Op.like]: `%${username}%` } // 模糊查询
		if (Object.keys(_params).length > 0) options.where = where
		const { count, rows } = await userModel.findAndCountAll({
			...options,
			order: [['sort', 'DESC']],
			attributes: {
				exclude: ['password', 'deleted_at']
			},
			include: [
				{
					model: RoleModel,
					attributes: ['id', 'name'],
					through: { attributes: [] }
				}
			]
		})
		const list = rows.map((item) => {
			item = item.toJSON()
			// @ts-ignore
			item.avatar = item.avatar?.split(',') || []
			if (
				item.roles &&
				Array.isArray(item.roles) &&
				item.roles.length === 0
			) {
				// @ts-ignore
				item.roles = null
			}
			return item
		})
		return {
			total: count,
			pagesize: params.pagesize,
			pagenumber: params.pagenumber,
			list: list
		}
	}
	updUserInfo = async (params: User & { roles: number[] }) => {
		const { id, roles, avatar, ...option } = params
		const user = await userModel.findByPk(id)
		if (!user) return false
		// @ts-ignore
		await user.addRoles(roles)
		return await user.update(
			{ ...option, avatar: avatar.toString() },
			{ where: { id } }
		)
	}
	// 批量删除
	batchDelete = async (ids: number[]) => {
		return await User.destroy({
			where: {
				id: { [Op.in]: ids }
			}
		})
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
	addUser = async (data: Partial<userModel>) => {
		try {
			// 设置默认密码
			data.password = encrypt('123456')
			const { roles, ...userInfo } = data
			const users = await userModel.create({
				...userInfo,
				avatar: userInfo.avatar?.toString()
			})
			// @ts-ignore
			await users.setRoles(roles)
			users.save()
			return users
		} catch (error) {
			console.log(error)
			return false
		}
	}
}
export default new UserService()
