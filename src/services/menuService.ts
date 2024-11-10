import { Op } from 'sequelize'
import MenuModel from '../model/menuModel'
import RoleMenuModel from '../model/roleMenuModel'
import { ParamsType } from '../types'
import { getLimitAndOffset } from '../utils/util'

interface MenuTree extends MenuModel {
	children?: MenuTree[]
}

class MenuService {
	// 将扁平数组转换为树状结构
	private buildMenuTree = (
		menus: MenuModel[],
		parentId: number | null = null
	): MenuTree[] => {
		const tree: MenuTree[] = []

		menus.forEach((menu) => {
			if (menu.parentid === parentId) {
				const node: MenuTree = menu.toJSON()
				const children = this.buildMenuTree(menus, menu.id)
				if (children.length) {
					node.children = children
				}
				tree.push(node)
			}
		})

		return tree
	}

	getMenuList = async (params: ParamsType<MenuModel>) => {
		const { pagesize, pagenumber, startTime, endTime, ..._params } = params

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

		if (Object.keys(_params).length > 0) options.where = where

		const { count, rows } = await MenuModel.findAndCountAll({
			...options,
			order: [['sort', 'DESC']],
			attributes: {
				exclude: ['deleted_at', 'updated_at']
			}
		})

		// 将结果转换为树状结构
		const menuTree = this.buildMenuTree(rows)

		return {
			total: count,
			pagesize: params.pagesize,
			pagenumber: params.pagenumber,
			list: menuTree
		}
	}

	getAllMenu = async () => {
		const menus = await MenuModel.findAll({
			order: [['sort', 'DESC']],
			where: { status: 1 },
			attributes: {
				exclude: ['deleted_at', 'updated_at']
			}
		})

		// 返回树状结构
		return this.buildMenuTree(menus)
	}

	addMenu = async (params: Partial<MenuModel> & { roles?: number[] }) => {
		// 如果有父级ID，检查父级菜单是否存在
		if (params.parentid) {
			const parentMenu = await MenuModel.findOne({
				where: {
					id: params.parentid,
					status: 1
				}
			})
			if (!parentMenu) return false
		}

		// 检查同级菜单名是否重复
		const existMenu = await MenuModel.findOne({
			where: {
				name: params.name,
				parentid: params.parentid || null,
				status: 1
			}
		})
		if (existMenu) return false

		const transaction = await MenuModel.sequelize!.transaction()

		try {
			const menu = await MenuModel.create(params, { transaction })

			if (params.roles && params.roles.length > 0) {
				await RoleMenuModel.bulkCreate(
					params.roles.map((roleId) => ({
						menu_id: menu.id,
						role_id: roleId
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

	updateMenu = async (
		id: number,
		params: Partial<MenuModel> & { roles?: number[] }
	) => {
		// 检查是否修改了父级ID
		if (params.parentid !== undefined) {
			// 不能将菜单设置为自己的子菜单
			if (params.parentid === id) return false

			// 检查新的父级菜单是否存在
			if (params.parentid) {
				const parentMenu = await MenuModel.findOne({
					where: {
						id: params.parentid,
						status: 1
					}
				})
				if (!parentMenu) return false
			}
		}

		// 检查同级菜单名是否重复
		if (params.name) {
			const existMenu = await MenuModel.findOne({
				where: {
					name: params.name,
					parentid: params.parentid || null,
					id: { [Op.ne]: id },
					status: 1
				}
			})
			if (existMenu) return false
		}

		const transaction = await MenuModel.sequelize!.transaction()

		try {
			const result = await MenuModel.update(params, {
				where: { id },
				transaction
			})

			if (params.roles) {
				await RoleMenuModel.destroy({
					where: { menu_id: id },
					transaction
				})

				if (params.roles.length > 0) {
					await RoleMenuModel.bulkCreate(
						params.roles.map((roleId) => ({
							menu_id: id,
							role_id: roleId
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

	deleteMenu = async (id: number) => {
		const transaction = await MenuModel.sequelize!.transaction()

		try {
			const result = await MenuModel.update(
				{ status: 0 },
				{
					where: { id },
					transaction
				}
			)

			await RoleMenuModel.destroy({
				where: { menu_id: id },
				transaction
			})

			await transaction.commit()
			return result[0] > 0
		} catch (error) {
			await transaction.rollback()
			return false
		}
	}

	changeStatus = async (id: number) => {
		// 先查询当前状态
		const menu = await MenuModel.findByPk(id)
		if (!menu) return false

		// 切换状态
		const newStatus = menu.dataValues.status === 1 ? 0 : 1

		const result = await MenuModel.update(
			{ status: newStatus },
			{ where: { id } }
		)
		return result[0] > 0
	}
}

export default new MenuService()
