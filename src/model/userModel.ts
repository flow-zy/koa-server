import {
	AutoIncrement,
	BeforeCreate,
	BeforeUpdate,
	BelongsTo,
	BelongsToMany,
	Column,
	Comment,
	DataType,
	Default,
	ForeignKey,
	Model,
	PrimaryKey,
	Table
} from 'sequelize-typescript'
import RoleModel from './roleModel'
import RoleUserModel from './roleUserModel'
import DepartmentModel from './departmentModel'
import bcrypt from 'bcryptjs'

@Table({ tableName: 'user' })
export default class UserModel extends Model {
	@PrimaryKey
	@AutoIncrement
	@Comment('ID')
	@Column(DataType.BIGINT)
	declare id: number

	@Comment('用户名')
	@Column(DataType.STRING)
	declare username: string

	@Comment('密码')
	@Column(DataType.STRING)
	declare password: string

	@Comment('昵称')
	@Column(DataType.STRING)
	declare nickname: string

	@Comment('邮箱')
	@Column(DataType.STRING)
	declare email: string

	@Comment('手机号')
	@Column(DataType.STRING)
	declare phone: string

	@Comment('头像')
	@Column(DataType.STRING)
	declare avatar: string

	@Comment('性别：0-未知 1-男 2-女')
	@Default(0)
	@Column(DataType.INTEGER)
	declare gender: number

	@Comment('状态：0-禁用 1-启用')
	@Default(1)
	@Column(DataType.INTEGER)
	declare status: number

	// 添加部门关联
	@ForeignKey(() => DepartmentModel)
	@Column(DataType.BIGINT)
	declare department_id: number

	@BelongsTo(() => DepartmentModel)
	declare department: DepartmentModel

	@BelongsToMany(() => RoleModel, () => RoleUserModel)
	declare roles: RoleModel[]

	// 密码验证方法
	async validatePassword(password: string): Promise<boolean> {
		return bcrypt.compare(password, this.password)
	}

	// 密码加密钩子
	@BeforeCreate
	@BeforeUpdate
	static async hashPassword(instance: UserModel) {
		if (instance.changed('password')) {
			const salt = await bcrypt.genSalt(10)
			instance.password = await bcrypt.hash(instance.password, salt)
		}
	}
}
