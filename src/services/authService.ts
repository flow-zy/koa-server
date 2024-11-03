import MenuModel from '../model/menuModel'
import PermissionModel from '../model/permissionModel'
import RoleModel from '../model/roleModel'
import userModel from '../model/userModel'
import { encrypt } from '../utils/auth'
import { Op } from 'sequelize'
class AdminService {
	// 登录
	userLogin = async (params: Partial<userModel>) => {
		const res = await userModel.findOne({
			where: {
				username: params.username,
				status: 1
			},
			attributes: {
				exclude: ['password', 'deleted_at']
			},
			include: [{ model: RoleModel }]
		})
		if (!res) {
			throw new Error('用户不存在或已被禁用')
		}

		const roleIds = res?.dataValues?.roles.map(
			(role: Partial<RoleModel>) => role.id
		)
		// 获取用户权限
		const permissionList =roleIds.length? await PermissionModel.findAll({
			where: {
				role_id: {
					[Op.in]: roleIds
				}
			}
		}):[]
		// 获取用户菜单
		const menu_list =roleIds.length? await MenuModel.findAll({
			where: {
				role_id: {
					[Op.in]:roleIds
				}
			}
		}):[]
		return {
			...res?.dataValues,
			permission_list: permissionList,
			menu_list
		}
	}
	// 注册
	useRegister = async (params: userModel) => {
			// 加密密码
		params.password = encrypt(params.password);
		return await userModel.create({ ...params });
	}

}
export default new AdminService()
