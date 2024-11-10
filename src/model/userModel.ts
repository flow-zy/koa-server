import {
  AllowNull,
  AutoIncrement,
  BelongsToMany,
  Column,
  Comment,
  DataType,
  Default,
  Model,
  PrimaryKey,
  Table,
  Unique,
} from 'sequelize-typescript'
import bcrypt from 'bcryptjs'
import RoleModel from './roleModel'
import RoleUserModel from './roleUserModel'
import { decrypt } from '../utils/auth'

@Table({ tableName: 'user' })
export default class User extends Model {
	@PrimaryKey
	@AutoIncrement
	@Comment('id')
	@Column(DataType.BIGINT)
	declare id: number // id

	// 用户名
	@AllowNull(false)
	@Unique
	@Comment('用户名')
	@Column(DataType.STRING)
	declare username: string

	// 密码
	@AllowNull(false)
	@Comment('密码')
	@Column(DataType.STRING)
	declare password: string

	// 邮箱
	@Comment('邮箱')
	@Column(DataType.STRING)
	declare email: string

	// 昵称
	@Comment('昵称')
	@Column(DataType.STRING)
	declare nickname: string

	// 手机号
	@Comment('手机号')
	@Column(DataType.STRING)
	declare phone: string

	// 头像
	@Comment('头像')
	@Column(DataType.STRING)
	declare avatar: string

	// 性别
	@Default(0)
	@Comment('用户性别 0: 未知, 1: 男 2: 女')
	@Column(DataType.INTEGER)
	declare gender: number

	// 状态
	@Comment('用户状态 0:注销1:正常')
	@Default(1)
	@Column(DataType.INTEGER)
	declare status: number

	// 用户描述
	@Comment('用户描述')
	@Column(DataType.STRING)
	declare description: string

	// 排序
	@Comment('用户排序')
	@Default(1)
	@Column(DataType.INTEGER)
	declare sort: number

	// 最后登录时间
	@Comment('最后登录时间')
	@Column(DataType.DATE)
	declare lastLogin: Date

	@BelongsToMany(() => RoleModel, () => RoleUserModel)
	declare roles: RoleModel

	// 密码验证方法
	async validatePassword(password: string): Promise<boolean> {
		return password === decrypt(this.password)
	}
}
