import {
  AllowNull,
  AutoIncrement,
  Column,
  Comment,
  DataType,
  Model,
  PrimaryKey,
  Table,
  Unique,
} from 'sequelize-typescript';

@Table({tableName: 'dictionary'})
export default class DictionaryModel extends Model {
  @PrimaryKey
  @AutoIncrement
  @AllowNull(false)
  @Comment('id')
  @Column(DataType.BIGINT)
  declare id: number;

  @Comment('字典名称')
  @Unique
  @Column(DataType.STRING(255))
  declare name: string;

  @Comment('字典值')
  @Column(DataType.STRING(255))
  declare ditcode: string;

  @Comment('字典类型')
  @Column(DataType.STRING(255))
  declare type: string;

  @Comment('字典描述')
  @Column(DataType.STRING(255))
  declare description: string;

  @Comment('字典排序')
  @Column(DataType.INTEGER)
  declare sort: number;

  @Comment('字典状态')
  @Column(DataType.INTEGER)
  declare status: number;

  @Comment('字典备注')
  @Column(DataType.STRING)
  declare remark: string;
}
