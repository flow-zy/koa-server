import UserModel from '../model/userModel'
import RoleModel from '../model/roleModel'
import MenuModel from '../model/menuModel'
import PermissionModel from '../model/permissionModel'
import { DataUtil } from '../utils/dataUtil'

class AuthService {
	async findByUsername(username: string): Promise<UserModel | null> {
		return UserModel.findOne({
			where: { username }
		})
	}

	async findById(id: number): Promise<UserModel | null> {
		return UserModel.findByPk(id)
	}

	async userLogin(username: string) {
		const user = await UserModel.findOne({
			where: { username },
			include: [
				{
					model: RoleModel,
					include: [
						{
							model: MenuModel,
							through: { attributes: [] },
							attributes: {
								exclude: ['deleted_at', 'updated_at']
							},
							where: { status: 1 },
							required: false
						},
						{
							model: PermissionModel,
							through: { attributes: [] },
							attributes: ['id', 'name', 'code'],
							where: { status: 1 },
							required: false
						}
					]
				}
			]
		})

		if (!user) return null

		const userData = DataUtil.toJSON(user)

		const roles = userData.roles || []

		const menusSet = new Set()
		const menus = roles.reduce((acc: any[], role: any) => {
			role.menus?.forEach((menu: any) => {
				if (!menusSet.has(menu.id)) {
					menusSet.add(menu.id)
					acc.push(menu)
				}
			})
			return acc
		}, [])

		const permissionsSet = new Set()
		const permissions = roles.reduce((acc: any[], role: any) => {
			role.permissions?.forEach((permission: any) => {
				if (!permissionsSet.has(permission.id)) {
					permissionsSet.add(permission.id)
					acc.push(permission)
				}
			})
			return acc
		}, [])

		const menuTree = this.buildMenuTree(menus)

		return {
			id: userData.id,
			username: userData.username,
			nickname: userData.nickname,
			email: userData.email,
			phone: userData.phone,
			avatar: userData.avatar,
			roles: roles.map((role: RoleModel) => ({
				id: role.id,
				name: role.name,
				nickname: role.nickname
			})),
			menus: menuTree,
			permissions: permissions.map(
				(p: Partial<PermissionModel>) => p.code
			)
		}
	}

	private buildMenuTree(menus: any[], parentId: number | null = null): any[] {
		return menus
			.filter((menu) => menu.parentid === parentId)
			.map((menu) => ({
				...menu,
				children: this.buildMenuTree(menus, menu.id)
			}))
			.sort((a, b) => a.sort - b.sort)
	}

	async create(userData: {
		username: string
		password: string
		email?: string
		phone?: string
		nickname?: string
		roles: number[]
	}): Promise<UserModel> {
		return UserModel.create(userData)
	}
}

export default new AuthService()
