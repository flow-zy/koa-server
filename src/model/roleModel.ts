import {
  Table,
  Model,
  AutoIncrement,
  PrimaryKey,
  Comment,
  Column,
  DataType,
  Default,
} from 'sequelize-typescript';

@Table({tableName: 'role'})
export default class RoleModel extends Model {
  @AutoIncrement
  @PrimaryKey
  @Comment('id')
  @Column(DataType.BIGINT)
  declare id: number;

  @Comment('角色名称')
  @Column(DataType.STRING(30))
  declare name: string;

  @Comment('角色别名')
  @Column(DataType.STRING(30))
  declare nickname: string;

  @Comment('角色描述')
  @Column(DataType.STRING(30))
  declare description: string;

  @Comment('角色状态')
  @Column(DataType.INTEGER)
  declare status: number;

  @Comment('排序')
  @Default(1)
  @Column(DataType.INTEGER)
  declare sort: number;
}
