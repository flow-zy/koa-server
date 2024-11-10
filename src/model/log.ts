import {
	AutoIncrement,
	Column,
	Comment,
	DataType,
	Default,
	Model,
	PrimaryKey,
	Table
} from 'sequelize-typescript'

@Table({
	tableName: 'log'
})
export default class Log extends Model {
	@Comment('ID')
	@PrimaryKey
	@AutoIncrement
	@Column(DataType.BIGINT)
	declare id: number

	@Comment('用户名')
	@Column(DataType.STRING)
	declare username: string

	@Comment('请求IP')
	@Column(DataType.STRING)
	declare ip: string

	@Comment('请求方法')
	@Column(DataType.STRING)
	declare method: string

	@Comment('请求浏览器')
	@Column(DataType.STRING)
	declare browser: string

	@Comment('请求路径')
	@Column(DataType.STRING)
	declare url: string

	@Comment('操作内容')
	@Column(DataType.STRING)
	declare content: string

	@Comment('操作状态 1:成功 2:失败')
	@Default(1)
	@Column(DataType.INTEGER)
	declare status: number
}
