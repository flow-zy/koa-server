import {
  AllowNull,
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
import User from './userModel'

@Table({ tableName: 'role_user' })
export default class RoleUserModel extends Model {
  @Comment('id')
  @AutoIncrement
  @PrimaryKey
  @AllowNull(false)
  @Column(DataType.BIGINT)
  declare id: number

  @Comment('角色id')
  @ForeignKey(() => RoleModel)
  @Column(DataType.BIGINT)
  declare role_id: number

  @Comment('用户id')
  @ForeignKey(() => User)
  @Column(DataType.BIGINT)
  declare user_id: number
}
