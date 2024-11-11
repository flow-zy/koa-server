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
	@Column(DataType.BIGINT)
	declare parentid: number

	@Comment('负责人ID')
	@Column(DataType.BIGINT)
	declare leader_id: number

	@Comment('负责人')
	@Column(DataType.STRING)
	declare leader: string

	@Comment('联系电话')
	@Column(DataType.STRING)
	declare phone: string

	@Comment('邮箱')
	@Column(DataType.STRING)
	declare email: string

	@Comment('排序')
	@Default(1)
	@Column(DataType.INTEGER)
	declare sort: number

	@Comment('状态：0-禁用 1-启用')
	@Default(1)
	@Column(DataType.INTEGER)
	declare status: number

	@Comment('备注')
	@Column(DataType.STRING)
	declare remark: string

	@HasMany(() => UserModel)
	declare users: UserModel[]
}
