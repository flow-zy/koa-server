import { UserModel, DepartmentModel, RoleModel } from '../model'
import { Op } from 'sequelize'
import { BusinessError } from '../utils/businessError'
import { DateUtil } from '../utils/dateUtil'
import { BaseDao } from '../dao/baseDao'
import { UserMessage } from '../enums/user'
export class UserService {
	/**
	 * 获取用户列表
	 */
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
			console.log(params, 'params')
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
				attributes: { exclude: ['password'] }, // 排除密码字段
				order: [['created_at', 'DESC']],
				offset: (pagenumber - 1) * pagesize,
				limit: pagesize
			})

			return {
				list: rows,
				total: count,
				pagenumber: Number(pagenumber),
				pagesize: Number(pagesize)
			}
		} catch (error) {
			console.error('获取用户列表失败:', error)
			throw new BusinessError(UserMessage.USER_LIST_ERROR)
		}
	}

	/**
	 * 创建用户
	 */
	async create(data: any) {
		return await BaseDao.create(UserModel, data)
	}

	/**
	 * 更新用户
	 */
	async update(id: number, data: any) {
		return await BaseDao.update(UserModel, data, { id })
	}

	/**
	 * 删除用户
	 */
	async delete(id: number) {
		return await BaseDao.delete(UserModel, { id })
	}

	/**
	 * 获取用户详情
	 */
	async getDetail(id: number) {
		try {
			const user = await UserModel.findByPk(id, {
				include: [
					{
						model: DepartmentModel,
						attributes: ['id', 'name', 'code']
					},
					{
						model: RoleModel,
						attributes: ['id', 'name', 'code'],
						through: { attributes: [] }
					}
				],
				attributes: { exclude: ['password'] }
			})

			if (!user) {
				throw new BusinessError('用户不存在')
			}

			return user
		} catch (error) {
			if (error instanceof BusinessError) {
				throw error
			}
			throw new BusinessError('获取用户详情失败')
		}
	}

	/**
	 * 根据用户名查找用户
	 */
	async findByUsername(username: string) {
		return await UserModel.findOne({
			where: { username },
			include: [
				{
					model: DepartmentModel,
					as: 'department',
					attributes: ['id', 'name', 'code']
				}
			]
		})
	}
}

export const userService = new UserService()
