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
import PermissionModel from './permissionModel'

// 角色权限模型
@Table({ tableName: 'role_permission' })
export default class RolePermissionModel extends Model {
  @AutoIncrement
  @PrimaryKey
  @Comment('id')
  @Column(DataType.BIGINT)
  declare id: number

  @Comment('角色id')
  @ForeignKey(() => RoleModel)
  @Column(DataType.BIGINT)
  declare role_id: number

  @Comment('权限id')
  @ForeignKey(() => PermissionModel)
  @Column(DataType.BIGINT)
  declare permission_id: number
}
