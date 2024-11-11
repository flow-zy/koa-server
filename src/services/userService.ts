import { BaseDao, QueryParams } from '../dao/baseDao'
import UserModel from '../model/userModel'
import { Op } from 'sequelize'
import { DateUtil } from '../utils/dateUtil'

export class UserService {
	/**
	 * 获取用户列表
	 */
	async getList(
		params: QueryParams & {
			keyword?: string
			status?: number
			startTime?: string
			endTime?: string
		}
	) {
		const { keyword, status, startTime, endTime, ...restParams } = params

		const queryParams: QueryParams = {
			...restParams,
			where: {
				...(keyword && {
					[Op.or]: [
						{ username: { [Op.like]: `%${keyword}%` } },
						{ email: { [Op.like]: `%${keyword}%` } },
						{ nickname: { [Op.like]: `%${keyword}%` } }
					]
				}),
				...(status !== undefined && { status }),
				...(startTime &&
					endTime && {
						created_at: {
							[Op.between]: [
								DateUtil.formatDate(new Date(startTime)),
								DateUtil.formatDate(new Date(endTime))
							]
						}
					})
			},
			include: [
				{
					association: 'roles',
					attributes: ['id', 'name', 'nickname']
				}
			]
		}

		return await BaseDao.findByPage(UserModel, queryParams)
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
		return await BaseDao.findById(UserModel, id, {
			include: [
				{
					association: 'roles',
					attributes: ['id', 'name']
				}
			]
		})
	}
}
