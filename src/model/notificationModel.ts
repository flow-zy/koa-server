import {
	AutoIncrement,
	Column,
	Comment,
	DataType,
	Default,
	Model,
	PrimaryKey,
	Table,
	BelongsTo,
	ForeignKey
} from 'sequelize-typescript'
import UserModel from './userModel'

export enum NotificationStatus {
	PENDING = 0, // 待处理
	PROCESSED = 1, // 已处理
	OVERDUE = 2 // 逾期
}

export enum NotificationType {
	SYSTEM = 1, // 系统通知
	TASK = 2, // 任务通知
	MESSAGE = 3 // 消息通知
}

@Table({ tableName: 'notification' })
export default class NotificationModel extends Model {
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

	@Comment('类型：1-系统通知 2-任务通知 3-消息通知')
	@Column(DataType.INTEGER)
	declare type: NotificationType

	@Comment('状态：0-待处理 1-已处理 2-逾期')
	@Default(NotificationStatus.PENDING)
	@Column(DataType.INTEGER)
	declare status: NotificationStatus

	@Comment('接收者ID')
	@ForeignKey(() => UserModel)
	@Column(DataType.BIGINT)
	declare receiver_id: number

	@Comment('发送者ID')
	@ForeignKey(() => UserModel)
	@Column(DataType.BIGINT)
	declare sender_id: number

	@Comment('过期时间')
	@Column(DataType.DATE)
	declare expire_time: Date

	@Comment('处理时间')
	@Column(DataType.DATE)
	declare process_time: Date

	@BelongsTo(() => UserModel, 'receiver_id')
	declare receiver: UserModel

	@BelongsTo(() => UserModel, 'sender_id')
	declare sender: UserModel
}
