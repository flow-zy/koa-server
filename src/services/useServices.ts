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
import UserModel from '../model/userModel'
import { UserMessage } from '../enums'
import { BusinessError } from '../utils/businessError'
import { DepartmentModel } from '../model'
import { DateUtil } from '../utils/dateUtil'
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
			console.log(user, 'user')
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
	async getList(params: {
		pagenumber?: number
		pagesize?: number
		keyword?: string
		gender?: number
		status?: number
		startTime?: string
		endTime?: string
	}) {
		try {
			const {
				keyword,
				status,
				startTime,
				endTime,
				pagenumber = 1,
				pagesize = 10,
				gender
			} = params
			const where: any = {}

			// 关键字搜索
			if (keyword) {
				where[Op.or] = [
					{ username: { [Op.like]: `%${keyword}%` } },
					{ nickname: { [Op.like]: `%${keyword}%` } },
					{ email: { [Op.like]: `%${keyword}%` } }
				]
			}
			if (gender !== undefined) {
				where.gender = gender
			}
			// 状态筛选
			if (status !== undefined) {
				console.log(Number(status), 'status')
				where.status = Number(status)
			}

			// 时间范围
			if (startTime && endTime) {
				where.created_at = {
					[Op.between]: [
						DateUtil.formatDate(new Date(startTime)),
						DateUtil.formatDate(new Date(endTime))
					]
				}
			}

			const { count, rows } = await UserModel.findAndCountAll({
				where,
				include: [
					{
						model: DepartmentModel,
						attributes: ['id', 'name', 'code'],
						required: false
					},
					{
						model: RoleModel,
						attributes: ['id', 'name', 'code'],
						through: { attributes: [] },
						required: false
					}
				],
				attributes: { exclude: ['password', 'deleted_at'] }, // 排除密码字段
				order: [['created_at', 'DESC']],
				offset: (pagenumber * 1 - 1) * pagesize * 1,
				limit: pagesize * 1
			})
			const data = DataUtil.toJSON(rows)
			return {
				list: data,
				total: count,
				pagenumber: Number(pagenumber),
				pagesize: Number(pagesize)
			}
		} catch (error) {
			console.error('获取用户列表失败:', error)
			throw new BusinessError(UserMessage.USER_LIST_ERROR)
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
	updAvatar = async (id: string, avatar: string) => {
		return await userModel.update({ avatar }, { where: { id } })
	}
	addUser = async (data: Partial<userModel>) => {
		try {
			// 设置默认密码
			data.password = encrypt('123456')
			const { roles, ...userInfo } = data
			const users = await userModel.create(userInfo as UserModel)
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
