import {
  AutoIncrement,
  Column,
  Comment,
  DataType,
  Default,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

// 权限模型
@Table({tableName: 'permission'})
export default class PermissionModel extends Model {
  @PrimaryKey
  @AutoIncrement
  @Comment('id')
  @Column(DataType.BIGINT)
  declare id: number;
  @Comment('权限名称')
  @Column(DataType.STRING(255))
  declare name: string;
  @Comment('权限标识')
  @Column(DataType.STRING(255))
  declare code: string;
  @Comment('权限类型')
  @Column(DataType.INTEGER)
  declare type: number;
  @Comment('排序')
  @Default(1)
  @Column(DataType.INTEGER)
  declare sort: number;
  @Comment('状态')
  @Default(1)
  @Column(DataType.INTEGER)
  declare status: number;
  @Comment('权限描述')
  @Column(DataType.STRING)
  declare description: string;
}
