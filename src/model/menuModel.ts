import {
  AllowNull,
  AutoIncrement,
  Column,
  Comment,
  DataType,
  Default,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript'
import { logger } from '../config/log4js'

// 菜单模型
@Table({ tableName: 'menu' })
export default class MenuModel extends Model {
	@AutoIncrement
	@PrimaryKey
	@AllowNull(false)
	@Comment('id')
	@Column(DataType.BIGINT)
	declare id: number

	@AllowNull(false)
	@Comment('菜单名称')
	@Column(DataType.STRING(50))
	declare name: string

	@Comment('菜单编码')
	@Column(DataType.STRING(50))
	declare code: string

	@Comment('菜单路劲')
	@Column(DataType.STRING(50))
	declare path: string

	@Comment('菜单组件')
	@Column(DataType.STRING(50))
	declare component: string

	@Comment('菜单图标')
	@Column(DataType.STRING(50))
	declare icon: string

	@Comment('菜单重定向')
	@Column(DataType.STRING(50))
	declare redirect: string

	@Comment('菜单排序')
	@Column(DataType.INTEGER)
	declare sort: number

	@Comment('菜单类型')
	@Column(DataType.INTEGER)
	declare type: number

	@Comment('菜单状态')
	@Default(1)
	@Column(DataType.INTEGER)
	declare status: number

	@Comment('父级菜单id')
	@Column(DataType.BIGINT)
	declare parentid: number

	@Comment('外链')
	@Default(0)
	@Column(DataType.INTEGER)
	declare allowShow: number

	@Comment('是否启用')
	@Default(1)
	@Column(DataType.INTEGER)
	declare allowUse: number

	@Comment('备注')
	@Column(DataType.STRING(50))
	declare remark: string
}
