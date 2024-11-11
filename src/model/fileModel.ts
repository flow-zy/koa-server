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

@Table({ tableName: 'file' })
export default class FileModel extends Model {
	@PrimaryKey
	@AutoIncrement
	@Comment('ID')
	@Column(DataType.BIGINT)
	declare id: number

	@Comment('文件名称')
	@Column(DataType.STRING)
	declare filename: string

	@Comment('原始文件名')
	@Column(DataType.STRING)
	declare original_name: string

	@Comment('文件路径')
	@Column(DataType.STRING)
	declare filepath: string

	@Comment('文件类型')
	@Column(DataType.STRING)
	declare mimetype: string

	@Comment('文件大小(字节)')
	@Column(DataType.BIGINT)
	declare size: number

	@Comment('文件分类：1-图片 2-文档 3-视频 4-音频 5-其他')
	@Default(5)
	@Column(DataType.INTEGER)
	declare category: number

	@Comment('存储位置：1-本地 2-云存储')
	@Default(1)
	@Column(DataType.INTEGER)
	declare storage: number

	@Comment('上传人ID')
	@Column(DataType.BIGINT)
	declare uploader_id: number

	@Comment('上传人')
	@Column(DataType.STRING)
	declare uploader: string

	@Comment('状态：0-禁用 1-启用')
	@Default(1)
	@Column(DataType.INTEGER)
	declare status: number

	@Comment('备注')
	@Column(DataType.STRING)
	declare remark: string
}
