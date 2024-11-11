import {
	AutoIncrement,
	Column,
	Comment,
	DataType,
	Model,
	PrimaryKey,
	Table
} from 'sequelize-typescript'

@Table({ tableName: 'monitor' })
export default class MonitorModel extends Model {
	@PrimaryKey
	@AutoIncrement
	@Comment('ID')
	@Column(DataType.BIGINT)
	declare id: number

	@Comment('CPU使用率(%)')
	@Column(DataType.FLOAT)
	declare cpu_usage: number

	@Comment('内存使用率(%)')
	@Column(DataType.FLOAT)
	declare memory_usage: number

	@Comment('磁盘使用率(%)')
	@Column(DataType.FLOAT)
	declare disk_usage: number

	@Comment('系统负载')
	@Column(DataType.STRING)
	declare system_load: string

	@Comment('网络IO(KB/s)')
	@Column(DataType.STRING)
	declare network_io: string

	@Comment('在线用户数')
	@Column(DataType.INTEGER)
	declare online_users: number

	@Comment('系统运行时间(秒)')
	@Column(DataType.BIGINT)
	declare uptime: number
}
