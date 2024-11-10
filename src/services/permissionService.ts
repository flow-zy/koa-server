import { Op } from 'sequelize'
import { DataUtil } from '../utils/dataUtil'
import { BusinessError } from '../utils/businessError'
import { PermissionMessage } from '../enums/permissionMessage'
import PermissionModel from '../model/permissionModel'
class PermissionService {
	/**
	 * 检查权限是否存在
	 */
	private async checkPermissionExists(code: string, excludeId?: number) {
		const where: any = { code }

		// 如果是更新操作，排除当前ID
		if (excludeId) {
			where.id = { [Op.ne]: excludeId }
		}

		const existingPermission = await PermissionModel.findOne({ where })
		return !!existingPermission
	}

	/**
	 * 创建权限
	 */
	async create(data: any) {
		// 检查必要字段
		if (!data.name || !data.code) {
			throw new BusinessError(PermissionMessage.INVALID_PARAMS)
		}

		// 检查权限码是否已存在
		const exists = await this.checkPermissionExists(data.code)
		if (exists) {
			throw new BusinessError(PermissionMessage.CODE_EXISTS)
		}

		try {
			const permission = await PermissionModel.create({
				name: data.name,
				code: data.code,
				description: data.description,
				status: data.status ?? 1, // 默认启用
				sort: data.sort ?? 0 // 默认排序值
			})

			return DataUtil.toJSON(permission)
		} catch (error) {
			console.error('创建权限错误:', error)
			throw new BusinessError(PermissionMessage.CREATE_ERROR)
		}
	}

	/**
	 * 更新权限
	 */
	async update(id: number, data: any) {
		const permission = await PermissionModel.findByPk(id)
		if (!permission) {
			throw new BusinessError(PermissionMessage.NOT_EXIST)
		}

		// 如果要更新权限码，检查是否与其他权限冲突
		if (data.code && data.code !== permission.code) {
			const exists = await this.checkPermissionExists(data.code, id)
			if (exists) {
				throw new BusinessError(PermissionMessage.CODE_EXISTS)
			}
		}

		try {
			await permission.update({
				...data,
				updated_at: new Date()
			})

			return DataUtil.toJSON(permission)
		} catch (error) {
			console.error('更新权限错误:', error)
			throw new BusinessError(PermissionMessage.UPDATE_ERROR)
		}
	}

	/**
	 * 删除权限
	 */
	async delete(id: number) {
		const permission = await PermissionModel.findByPk(id)
		if (!permission) return false

		await permission.destroy()
		return true
	}

	/**
	 * 获取权限详情
	 */
	async getDetail(id: number) {
		const permission = await PermissionModel.findByPk(id)
		return permission ? DataUtil.toJSON(permission) : null
	}

	/**
	 * 获取权限列表
	 */
	async getList(params: any) {
		const {
			current = 1,
			pageSize = 10,
			name,
			code,
			status,
			startTime,
			endTime
		} = params

		const where: any = {}
		if (name) where.name = { [Op.like]: `%${name}%` }
		if (code) where.code = { [Op.like]: `%${code}%` }
		if (status !== undefined) where.status = status
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
		const { count, rows } = await PermissionModel.findAndCountAll({
			where,
			order: [['created_at', 'DESC']],
			offset: (Number(current) - 1) * Number(pageSize),
			limit: Number(pageSize)
		})

		return {
			list: DataUtil.toJSON(rows),
			total: count,
			current: Number(current),
			pageSize: Number(pageSize)
		}
	}
	// 全部权限
	async getAll() {
		const permissions = await PermissionModel.findAll()
		return DataUtil.toJSON(permissions)
	}
}

export const permissionService = new PermissionService()
