import {
	AutoIncrement,
	BelongsTo,
	Column,
	Comment,
	DataType,
	Default,
	Model,
	PrimaryKey,
	Table,
	ForeignKey,
	BeforeCreate,
	BeforeUpdate,
	BelongsToMany
} from 'sequelize-typescript'
import bcrypt from 'bcryptjs'
import UserDepartModel from './userDepartModel'
import DepartmentModel from './departmentModel'
import RoleModel from './roleModel'
import RoleUserModel from './roleUserModel'
import { CryptoUtil } from '../utils/cryptoUtil'
@Table({ tableName: 'user' })
class UserModel extends Model<UserModel> {
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

	@Comment('性别：0-女 1-男 2-未知')
	@Default(2)
	@Column(DataType.INTEGER)
	declare gender: number

	@Comment('头像')
	@Column(DataType.STRING)
	declare avatar: string

	@Comment('状态：0-禁用 1-启用')
	@Default(1)
	@Column(DataType.INTEGER)
	declare status: number

	@Comment('排序')
	@Default(0)
	@Column(DataType.INTEGER)
	declare sort: number

	@Comment('备注')
	@Column(DataType.STRING)
	declare remark: string

	@Comment('部门ID')
	@ForeignKey(() => DepartmentModel)
	@Column({
		type: DataType.BIGINT,
		allowNull: true,
		field: 'department_id'
	})
	declare departmentId: number

	@BelongsTo(() => DepartmentModel)
	declare department: DepartmentModel

	// 密码验证方法
	async validatePassword(inputPassword: string): Promise<boolean> {
		// 直接比较加密后的密码
		return this.password === inputPassword
	}

	// 密码处理钩子
	@BeforeCreate
	@BeforeUpdate
	static async processPassword(instance: UserModel) {
		// 只在密码被修改时处理
		if (instance.changed('password')) {
			// 这里不需要额外加密，因为传入的密码已经是加密过的
			instance.password = instance.password
		}
	}

	@BelongsToMany(() => RoleModel, () => RoleUserModel)
	declare roles: RoleModel[]
}

export default UserModel