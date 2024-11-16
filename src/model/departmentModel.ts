import {
	AutoIncrement,
	Column,
	Comment,
	DataType,
	Default,
	Model,
	PrimaryKey,
	Table,
	HasMany
} from 'sequelize-typescript'
import UserModel from './userModel'

@Table({ tableName: 'department' })
export default class DepartmentModel extends Model {
	@PrimaryKey
	@AutoIncrement
	@Comment('ID')
	@Column(DataType.BIGINT)
	declare id: number

	@Comment('部门名称')
	@Column(DataType.STRING)
	declare name: string

	@Comment('部门编码')
	@Column(DataType.STRING)
	declare code: string

	@Comment('父级ID')
	@Column({
		type: DataType.BIGINT,
		allowNull: true
	})
	declare parentid: number

	@Comment('排序')
	@Default(1)
	@Column(DataType.INTEGER)
	declare sort: number

	@Comment('备注')
	@Column(DataType.STRING)
	declare remark: string

	@Comment('状态：0-禁用 1-启用')
	@Default(1)
	@Column(DataType.INTEGER)
	declare status: number

	@HasMany(() => UserModel)
	declare users: UserModel[]
}
