import { BaseDao, QueryParams } from '../dao/baseDao'
import DepartmentModel from '../model/departmentModel'
import UserModel from '../model/userModel'
import { Op } from 'sequelize'
import { BusinessError } from '../utils/businessError'
import { UserMessage } from '../enums/user'

export class DepartmentService {
	/**
	 * 获取部门列表
	 */
	async getList(
		params: QueryParams & {
			keyword?: string
			status?: number
		}
	) {
		const { keyword, status, ...restParams } = params

		const queryParams: QueryParams = {
			...restParams,
			where: {
				...(keyword && {
					[Op.or]: [
						{ name: { [Op.like]: `%${keyword}%` } },
						{ code: { [Op.like]: `%${keyword}%` } }
					]
				}),
				...(status !== undefined && { status })
			},
			include: [
				{
					association: 'users',
					attributes: ['id', 'username', 'nickname']
				}
			]
		}

		const result = await BaseDao.findByPage(DepartmentModel, queryParams)

		// 将列表数据转换为树形结构
		const treeData = this.buildDepartmentTree(result.list)

		return {
			...result,
			list: treeData
		}
	}

	/**
	 * 构建部门树
	 */
	private buildDepartmentTree(
		deptList: any[],
		parentId: number | null = null
	): any[] {
		return deptList
			.filter((dept) => dept.parentid === parentId)
			.map((dept) => ({
				...dept,
				children: this.buildDepartmentTree(deptList, dept.id)
			}))
			.sort((a, b) => a.sort - b.sort)
	}

	/**
	 * 创建部门
	 */
	async create(data: Partial<DepartmentModel>) {
		// 检查部门编码是否存在
		const exists = await BaseDao.findOne(DepartmentModel, {
			where: { code: data.code }
		})

		if (exists) {
			throw new BusinessError(UserMessage.DEPARTMENT_CODE_EXISTS)
		}

		// 如果有父级ID，检查父级是否存在
		if (data.parentid) {
			const parent = await BaseDao.findById(
				DepartmentModel,
				data.parentid
			)
			if (!parent) {
				throw new BusinessError(UserMessage.PARENT_DEPARTMENT_NOT_FOUND)
			}
		}

		return await BaseDao.create(DepartmentModel, {
			...data,
			status: data.status ?? 1,
			sort: data.sort ?? 1
		})
	}

	/**
	 * 更新部门
	 */
	async update(id: number, data: Partial<DepartmentModel>) {
		const dept = await BaseDao.findById(DepartmentModel, id)
		if (!dept) {
			throw new BusinessError(UserMessage.DEPARTMENT_NOT_FOUND)
		}

		// 检查部门编码是否与其他部门冲突
		if (data.code) {
			const exists = await BaseDao.findOne(DepartmentModel, {
				where: {
					code: data.code,
					id: { [Op.ne]: id }
				}
			})

			if (exists) {
				throw new BusinessError(UserMessage.DEPARTMENT_CODE_EXISTS)
			}
		}

		// 检查父级部门
		if (data.parentid) {
			if (data.parentid === id) {
				throw new BusinessError(UserMessage.CANNOT_SET_SELF_AS_PARENT)
			}

			const parent = await BaseDao.findById(
				DepartmentModel,
				data.parentid
			)
			if (!parent) {
				throw new BusinessError(UserMessage.PARENT_DEPARTMENT_NOT_FOUND)
			}

			// 检查是否设置为自己的子部门
			const children = await this.getChildrenIds(id)
			if (children.includes(data.parentid)) {
				throw new BusinessError(UserMessage.CANNOT_SET_CHILD_AS_PARENT)
			}
		}

		return await BaseDao.update(DepartmentModel, data, { id })
	}

	/**
	 * 获取所有子部门ID
	 */
	private async getChildrenIds(id: number): Promise<number[]> {
		const allDepts = await BaseDao.findAll(DepartmentModel, {})
		const result: number[] = []

		const findChildren = (parentId: number) => {
			const children = allDepts.list.filter(
				(dept: Partial<DepartmentModel>) => dept.parentid === parentId
			)
			children.forEach((child: Partial<DepartmentModel>) => {
				result.push(child.id!)
				findChildren(child.id!)
			})
		}

		findChildren(id)
		return result
	}

	/**
	 * 删除部门
	 */
	async delete(id: number) {
		// 检查是否存在子部门
		const children = await BaseDao.findOne(DepartmentModel, {
			where: { parentid: id }
		})

		if (children) {
			throw new BusinessError(UserMessage.DEPARTMENT_HAS_CHILDREN)
		}

		// 检查是否有关联用户
		const users = await BaseDao.findOne(DepartmentModel, {
			where: { id },
			include: ['users']
		})

		if (users && users.users?.length > 0) {
			throw new BusinessError(UserMessage.DEPARTMENT_HAS_USERS)
		}

		return await BaseDao.delete(DepartmentModel, { id })
	}

	/**
	 * 更新部门状态
	 */
	async updateStatus(id: number) {
		const dept = await BaseDao.findById(DepartmentModel, id)
		if (!dept) {
			throw new BusinessError(UserMessage.DEPARTMENT_NOT_FOUND)
		}

		const status = dept.status === 1 ? 0 : 1
		return await BaseDao.update(DepartmentModel, { status }, { id })
	}

	/**
	 * 获取部门详情
	 */
	async getDetail(id: number) {
		const department = await BaseDao.findById(DepartmentModel, id, {
			include: [
				{
					model: UserModel,
					attributes: ['id', 'username', 'nickname', 'email', 'phone']
				}
			]
		})

		if (!department) {
			throw new BusinessError(UserMessage.DEPARTMENT_NOT_FOUND)
		}

		return department
	}

	/**
	 * 获取部门下的用户
	 */
	async getDepartmentUsers(
		id: number,
		params: { pagenumber: number; pagesize: number }
	) {
		// 先检查部门是否存在
		const department = await BaseDao.findById(DepartmentModel, id)
		if (!department) {
			throw new BusinessError(UserMessage.DEPARTMENT_NOT_FOUND)
		}

		// 查询该部门下的用户
		return await BaseDao.findByPage(UserModel, {
			...params,
			where: { department_id: id },
			attributes: [
				'id',
				'username',
				'nickname',
				'email',
				'phone',
				'status',
				'created_at'
			],
			order: [['created_at', 'DESC']]
		})
	}
}

export const departmentService = new DepartmentService()
