import {Sequelize} from 'sequelize-typescript';
import config from '../config';
import {dbLogger} from '../utils/log';
import path from 'node:path';
import User from '../model/userModel';
import RoleModel from '../model/roleModel';
import RoleUserModel from '../model/roleUserModel';
const {
  db: {db_host, db_name, db_password, db_port, db_user},
} = config;

const sequelize = new Sequelize(db_name!, db_user!, db_password, {
  dialect: 'mysql',
  host: db_host!,
  port: Number(db_port)!,
  pool: {
    // 连接池设置
    max: 5, // 最大连接数
    idle: 30000,
    acquire: 60000,
  },
  logging: (msg) => dbLogger.info(msg), // 日志，不打印则可设置为 false
  models: [path.resolve(__dirname, '../model/*.ts')],
  define: {
    freezeTableName: false, // sequelize会给表名自动添加为复数，
    timestamps: true, // 开启时间戳 create_at delete_at update_at
    paranoid: true, // 开启假删除
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    charset: 'utf8mb4', // 字符集
    collate: 'utf8mb4_bin', // 排序规则
  },
  timezone: '+08:00', // 改为标准时区
});
export const db = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    // {force: true}
    const initRole = [
      {
        name: '超级管理员',
        nickname: 'super',
        description: '最高权限',
      },
      {
        name: '管理员',
        nickname: 'admin',
        description: '普通管理员',
      },
      {
        name: '普通用户',
        nickname: 'user',
        description: '普通用户',
      },
    ];
    {
      force: true;
    }
    await RoleModel.bulkCreate(initRole, {ignoreDuplicates: true});

    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};
export default sequelize;
