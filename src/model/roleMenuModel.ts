import {
  AutoIncrement,
  Column,
  Comment,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript'

import RoleModel from './roleModel'
import MenuModel from './menuModel'

// 角色权限模型
@Table({ tableName: 'role_menu' })
export default class RoleMenuModel extends Model {
  @AutoIncrement
  @PrimaryKey
  @Comment('id')
  @Column(DataType.BIGINT)
  declare id: number

  @Comment('角色id')
  @ForeignKey(() => RoleModel)
  @Column(DataType.BIGINT)
  declare role_id: number

  @Comment('菜单id')
  @ForeignKey(() => MenuModel)
  @Column(DataType.BIGINT)
  declare menu_id: number
}
