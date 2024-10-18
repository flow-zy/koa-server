import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  Column,
  Comment,
  DataType,
  Model,
  NotNull,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import RoleModel from './roleModel';
import User from './userModel';

@Table({tableName: 'role_user'})
export default class RoleUserModel extends Model {
  @Comment('id')
  @AutoIncrement
  @PrimaryKey
  @AllowNull(false)
  @Column(DataType.BIGINT)
  declare id: number;

  @Comment('角色id')
  @Column(DataType.BIGINT)
  declare role_id: number;

  @BelongsTo(() => RoleModel, {foreignKey: 'role_id'})
  declare role: RoleModel;

  @Comment('用户id')
  @Column(DataType.BIGINT)
  declare user_id: number;

  @BelongsTo(() => User, {foreignKey: 'user_id'})
  declare user: User;
}
