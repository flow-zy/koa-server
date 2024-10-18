import {
  AutoIncrement,
  BelongsTo,
  Column,
  Comment,
  DataType,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import RoleModel from './roleModel';
import PermissionModel from './permissionModel';

// 角色权限模型
@Table({tableName: 'role_permission'})
export default class RolePermissionModel extends Model {
  @AutoIncrement
  @PrimaryKey
  @Comment('id')
  @Column(DataType.BIGINT)
  declare id: number;

  @Comment('角色id')
  @Column(DataType.BIGINT)
  declare role_id: number;

  @BelongsTo(() => RoleModel, {foreignKey: 'role_id'})
  declare role: RoleModel;

  @Comment('权限id')
  @Column(DataType.BIGINT)
  declare permission_id: number;

  @BelongsTo(() => PermissionModel, {foreignKey: 'permission_id'})
  declare perimission: PermissionModel;
}
