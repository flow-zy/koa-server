import { DepartmentModel, RoleModel, UserModel } from '../model'
import { logger } from '../config/log4js'
import bcrypt from 'bcryptjs'
import { CryptoUtil } from '../utils/cryptoUtil'

export class InitService {
	private readonly DEFAULT_PASSWORD = '123456'

	/**
	 * 初始化部门数据
	 */
	async initDepartments() {
		try {
			const departments = [
				{
					name: '总公司',
					code: 'HQ',
					parentid: null,
					sort: 1,
					status: 1
				},
				{
					name: '技术部',
					code: 'TECH',
					parentid: 1, // 总公司下的技术部
					sort: 1,
					status: 1
				},
				{
					name: '人事部',
					code: 'HR',
					parentid: 1, // 总公司下的人事部
					sort: 2,
					status: 1
				},
				{
					name: '财务部',
					code: 'FIN',
					parentid: 1, // 总公司下的财务部
					sort: 3,
					status: 1
				}
			]

			for (const dept of departments) {
				await DepartmentModel.findOrCreate({
					where: { code: dept.code },
					defaults: dept
				})
			}

			logger.info('部门数据初始化完成')
		} catch (error) {
			logger.error('部门数据初始化失败:', error)
		}
	}

	/**
	 * 初始化角色数据
	 */
	async initRoles() {
		try {
			const roles = [
				{
					name: '超级管理员',
					code: 'SUPER_ADMIN',
					sort: 1,
					status: 1,
					remark: '系统超级管理员'
				},
				{
					name: '管理员',
					code: 'ADMIN',
					sort: 2,
					status: 1,
					remark: '系统管理员'
				},
				{
					name: '普通用户',
					code: 'USER',
					sort: 3,
					status: 1,
					remark: '普通用户'
				},
				{
					name: '访客',
					code: 'GUEST',
					sort: 4,
					status: 1,
					remark: '系统访客'
				}
			]

			for (const role of roles) {
				await RoleModel.findOrCreate({
					where: { code: role.code },
					defaults: role
				})
			}

			logger.info('角色数据初始化完成')
		} catch (error) {
			logger.error('角色数据初始化失败:', error)
		}
	}

	/**
	 * 初始化用户数据
	 */
	async initUsers() {
		try {
			// 创建超级管理员
			const superAdmin = {
				username: 'super',
				password: this.DEFAULT_PASSWORD,
				nickname: '超级管理员',
				email: 'super@example.com',
				phone: '13800138000',
				status: 1,
				avatar: 'https://avatars.githubusercontent.com/u/1?v=4'
			}

			// 创建管理员
			const admin = {
				username: 'admin',
				password: this.DEFAULT_PASSWORD,
				nickname: '管理员',
				email: 'admin@example.com',
				phone: '13800138001',
				status: 1,
				avatar: 'https://avatars.githubusercontent.com/u/2?v=4'
			}

			// 加密密码
			superAdmin.password = CryptoUtil.aesEncrypt(this.DEFAULT_PASSWORD)
			admin.password = CryptoUtil.aesEncrypt(this.DEFAULT_PASSWORD)

			// 创建或查找用户
			const [superUser] = await UserModel.findOrCreate({
				where: { username: superAdmin.username },
				defaults: superAdmin as UserModel
			})

			const [adminUser] = await UserModel.findOrCreate({
				where: { username: admin.username },
				defaults: admin as UserModel
			})

			// 查找角色
			const superRole = await RoleModel.findOne({
				where: { code: 'SUPER_ADMIN' }
			})

			const adminRole = await RoleModel.findOne({
				where: { code: 'ADMIN' }
			})

			// 分配角色
			if (superRole) {
				await superUser.$set('roles', [superRole.id])
			}

			if (adminRole) {
				await adminUser.$set('roles', [adminRole.id])
			}

			logger.info('用户数据初始化完成')
			logger.info(`初始账号：
			超级管理员 - username: super, password: ${this.DEFAULT_PASSWORD}
			管理员 - username: admin, password: ${this.DEFAULT_PASSWORD}
			`)
		} catch (error) {
			logger.error('用户数据初始化失败:', error)
			throw error
		}
	}

	/**
	 * 初始化所有数据
	 */
	async initAll() {
		try {
			// 先初始化角色
			await this.initRoles()
			// 再初始化用户
			await this.initUsers()
			// 最后初始化部门
			await this.initDepartments()

			logger.info('所有数据初始化完成')
		} catch (error) {
			logger.error('数据初始化失败:', error)
			throw error
		}
	}
}

export const initService = new InitService()
