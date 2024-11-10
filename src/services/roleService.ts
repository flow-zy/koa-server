import { Op } from 'sequelize'
import RoleModel from '../model/roleModel'
import { ParamsType } from '../types'
import { getLimitAndOffset } from '../utils/util'
import RolePermissionModel from '../model/rolePermissionModel'
import PermissionModel from '../model/permissionModel'

class RoleService {
	getRoleList = async (params: ParamsType<RoleModel>) => {
		const { pagesize, pagenumber, startTime, endTime, name, ..._params } =
			params

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
		if (name) {
			where.name = { [Op.like]: `%${name}%` } // 模糊查询
		}
		if (Object.keys(_params).length > 0) options.where = where
		const { count, rows } = await RoleModel.findAndCountAll({
			...options,
			order: [['sort', 'DESC']],
			attributes: {
				exclude: ['deleted_at', 'updated_at']
			}
		})
		return {
			total: count,
			pagesize: params.pagesize,
			pagenumber: params.pagenumber,
			list: rows
		}
	}
	getAllRole = async () => {
		return await RoleModel.findAll({
			order: [['sort', 'DESC']],
			attributes: {
				exclude: ['deleted_at', 'updated_at']
			}
		})
	}
	addRole = async (params: Partial<RoleModel>) => {
		const existRole = await RoleModel.findOne({
			where: {
				name: params.name
			}
		})
		if (existRole) return false

		const transaction = await RoleModel.sequelize!.transaction()

		try {
			const role = await RoleModel.create(params, { transaction })

			if (params.permissions && params.permissions.length > 0) {
				await RolePermissionModel.bulkCreate(
					params.permissions.map((permissionId) => ({
						role_id: role.id,
						permission_id: permissionId
					})),
					{ transaction }
				)
			}

			await transaction.commit()
			return true
		} catch (error) {
			await transaction.rollback()
			return false
		}
	}
	deleteRole = async (id: number) => {
		const transaction = await RoleModel.sequelize!.transaction()

		try {
			const roleResult = await RoleModel.destroy({
				where: { id },
				transaction
			})

			await RolePermissionModel.destroy({
				where: { role_id: id },
				transaction
			})

			await transaction.commit()
			return roleResult
		} catch (error) {
			await transaction.rollback()
			return false
		}
	}
	updateRole = async (id: number, params: Partial<RoleModel>) => {
		if (params.name) {
			const existRole = await RoleModel.findOne({
				where: {
					name: params.name,
					id: { [Op.ne]: id }
				}
			})
			if (existRole) return false
		}

		const transaction = await RoleModel.sequelize!.transaction()

		try {
			const result = await RoleModel.update(params, {
				where: { id },
				transaction
			})

			if (params.permissions) {
				await RolePermissionModel.destroy({
					where: { role_id: id },
					transaction
				})

				if (params.permissions.length > 0) {
					await RolePermissionModel.bulkCreate(
						params.permissions.map((permissionId) => ({
							role_id: id,
							permission_id: permissionId
						})),
						{ transaction }
					)
				}
			}

			await transaction.commit()
			return result[0] > 0
		} catch (error) {
			await transaction.rollback()
			return false
		}
	}
	changeStatus = async (id: number) => {
		const role = await RoleModel.findByPk(id)
		if (!role) return false

		const newStatus = role.status === 1 ? 0 : 1
		console.log(newStatus)
		const result = await RoleModel.update(
			{ status: newStatus },
			{ where: { id } }
		)
		return result[0] > 0
	}
	async getRoleDetail(id: number) {
		try {
			const role = await RoleModel.findOne({
				where: { id },
				include: [
					{
						model: PermissionModel,
						as: 'permissions',
						through: { attributes: [] },
						attributes: ['id', 'name', 'code', 'description']
					}
				],
				attributes: [
					'id',
					'name',
					'nickname',
					'status',
					'sort',
					'description',
					'created_at',
					'updated_at'
				]
			})

			if (!role) return null

			// 正确处理 Sequelize 模型实例
			const roleData = role instanceof RoleModel ? role.toJSON() : role

			// 格式化数据
			return {
				...roleData,
				permissions: roleData.permissions || [],
				permissionIds: roleData.permissions?.map((p: any) => p.id) || []
			}
		} catch (error) {
			console.error('获取角色详情服务错误:', error)
			throw error
		}
	}
}

export default new RoleService()
