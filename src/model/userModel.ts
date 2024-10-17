import {
  AutoIncrement,
  Column,
  Comment,
  DataType,
  Default,
  Model,
  NotNull,
  PrimaryKey,
  Table,
  Unique,
} from 'sequelize-typescript';

@Table
export default class User extends Model {
  @NotNull
  @PrimaryKey
  @Column(DataType.NUMBER)
  @AutoIncrement
  @Comment('id')
  declare id: number; // id

  // 用户名
  @NotNull
  @Unique
  @Column(DataType.STRING)
  @Comment('用户名')
  declare username: string;

  // 密码
  @NotNull
  @Column(DataType.STRING)
  @Comment('密码')
  declare password: string;

  //邮箱
  @Column(DataType.STRING)
  @Comment('邮箱')
  declare email: string;

  // 昵称
  @Comment('昵称')
  @Column(DataType.STRING)
  declare nickname: string;

  // 手机号
  @Column(DataType.STRING)
  @Comment('手机号')
  declare phone: string;

  // 头像
  @Column(DataType.STRING)
  @Comment('头像')
  declare avatar: string;

  // 性别
  @Default(0)
  @Column(DataType.NUMBER)
  @Comment('用户性别 0: 未知, 1: 男 2: 女')
  declare gender: number;

  // 状态
  @Column(DataType.NUMBER)
  @Comment('用户状态 0:注销1:正常')
  @Default(0)
  declare status: number;

  // 排序
  @Column(DataType.NUMBER)
  @Comment('用户排序')
  @Default(1)
  declare sort: number;
}
