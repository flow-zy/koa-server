import {
	AutoIncrement,
	Column,
	Comment,
	DataType,
	ForeignKey,
	Model,
	PrimaryKey,
	Table
} from 'sequelize-typescript'
import UserModel from './userModel'
import DepartmentModel from './departmentModel'

@Table({ tableName: 'user_department' })
export default class UserDepartModel extends Model {
	@PrimaryKey
	@AutoIncrement
	@Comment('ID')
	@Column(DataType.BIGINT)
	declare id: number

	@ForeignKey(() => UserModel)
	@Comment('用户ID')
	@Column(DataType.BIGINT)
	declare user_id: number

	@ForeignKey(() => DepartmentModel)
	@Comment('部门ID')
	@Column(DataType.BIGINT)
	declare department_id: number

	@Comment('状态：0-禁用 1-启用')
	@Column({
		type: DataType.INTEGER,
		defaultValue: 1
	})
	declare status: number

	@Comment('备注')
	@Column(DataType.STRING)
	declare remark: string
}
