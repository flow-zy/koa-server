import RoleModel from '../model/roleModel'
import User from '../model/userModel'

class AuthService {
	async findByUsername(username: string): Promise<User | null> {
		return User.findOne({
			where: { username }
		})
	}

	async findById(id: number): Promise<User | null> {
		return User.findByPk(id)
	}

	async userLogin(username: string) {
		const user = await User.findOne({
			where: { username },
			attributes: {
				exclude: ['password', 'deleted_at']
			},
			raw: true,
			include: {
				model: RoleModel,
				attributes: ['id', 'name'],
				through: { attributes: [] }
			}
		})
		// 更新最后登录时间
		if (user) {
			await User.update(
				{ lastLogin: new Date() },
				{ where: { id: user.id } }
			)
			return user
		}
		return null
	}
	async create(userData: {
		username: string
		password: string
		email?: string
		phone?: string
		nickname?: string
		roles: number[]
	}): Promise<User> {
		return User.create(userData)
	}
}

export default new AuthService()
