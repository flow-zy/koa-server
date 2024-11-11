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

@Table({ tableName: 'notice' })
export default class NoticeModel extends Model {
	@PrimaryKey
	@AutoIncrement
	@Comment('ID')
	@Column(DataType.BIGINT)
	declare id: number

	@Comment('标题')
	@Column(DataType.STRING)
	declare title: string

	@Comment('内容')
	@Column(DataType.TEXT)
	declare content: string

	@Comment('类型：1-通知 2-公告')
	@Default(1)
	@Column(DataType.INTEGER)
	declare type: number

	@Comment('状态：0-草稿 1-发布 2-撤回')
	@Default(0)
	@Column(DataType.INTEGER)
	declare status: number

	@Comment('是否置顶：0-否 1-是')
	@Default(0)
	@Column(DataType.INTEGER)
	declare istop: number

	@Comment('发布人ID')
	@Column(DataType.BIGINT)
	declare publisher_id: number

	@Comment('发布人')
	@Column(DataType.STRING)
	declare publisher: string

	@Comment('发布时间')
	@Column(DataType.DATE)
	declare publish_time: Date

	@Comment('排序')
	@Default(1)
	@Column(DataType.INTEGER)
	declare sort: number

	@Comment('备注')
	@Column(DataType.STRING)
	declare remark: string
}
