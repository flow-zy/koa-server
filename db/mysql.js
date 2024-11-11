"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = db;
const node_path_1 = __importDefault(require("node:path"));
const sequelize_typescript_1 = require("sequelize-typescript");
const config_default_1 = __importDefault(require("../config/config.default"));
const log4js_1 = require("../config/log4js");
const dateUtil_1 = require("../utils/dateUtil");
const { MYSQL_DB, MYSQL_HOST, MYSQL_USER, MYSQL_PWD, MYSQL_SERVICE_USER, MYSQL_SERVICE_PWD, MYSQL_SERVICE_DB, MYSQL_SERVICE_HOST, NODE_ENV } = config_default_1.default;
// 本地数据库
const sequelize = NODE_ENV === 'development'
    ? // 本地数据库
        new sequelize_typescript_1.Sequelize(MYSQL_DB, MYSQL_USER, MYSQL_PWD, {
            host: MYSQL_HOST,
            dialect: 'mysql',
            models: [
                `${node_path_1.default.resolve(__dirname, '../model')}/*.ts`,
                `${node_path_1.default.resolve(__dirname, '../model')}/*.js`
            ], // 数据库模板存放地址
            define: {
                freezeTableName: false, // sequelize会给表名自动添加为复数，
                timestamps: true, // 开启时间戳 create_at delete_at update_at
                paranoid: true, // 开启假删除
                createdAt: 'created_at',
                updatedAt: 'updated_at',
                deletedAt: 'deleted_at',
                charset: 'utf8mb4', // 字符集
                collate: 'utf8mb4_bin' // 排序规则
            }
        })
    : //   服务器数据库
        new sequelize_typescript_1.Sequelize(MYSQL_SERVICE_DB, MYSQL_SERVICE_USER, MYSQL_SERVICE_PWD, {
            host: MYSQL_SERVICE_HOST,
            dialect: 'mysql',
            models: [
                `${node_path_1.default.resolve(__dirname, '../model')}/*.ts`,
                `${node_path_1.default.resolve(__dirname, '../model')}/*.js`
            ], // 数据库模板存放地址
            define: {
                freezeTableName: false, // sequelize会给表名自动添加为复数，
                timestamps: true, // 开启时间戳 create_at delete_at update_at
                paranoid: true, // 开启假删除
                createdAt: 'created_at',
                updatedAt: 'updated_at',
                deletedAt: 'deleted_at',
                charset: 'utf8mb4', // 字符集
                collate: 'utf8mb4_bin' // 排序规则
            },
            logging: (sql, timing) => {
                // 记录 SQL 语句和执行时间
                log4js_1.logger.sql({
                    sql,
                    executionTime: timing ? `${timing}ms` : 'N/A',
                    timestamp: dateUtil_1.DateUtil.getCurrentDateTime()
                });
            }, // 日志，不打印则可设置为 false
            benchmark: true // 启用 SQL 执行时间统计
        });
// sequelize.sync({ force: true });
// sequelize.sync();
function db() {
    sequelize
        .authenticate()
        .then(() => __awaiter(this, void 0, void 0, function* () {
        yield sequelize.sync();
        // const initRole = [
        // 	{
        // 		name: '超级管理员',
        // 		nickname: 'super',
        // 		description: '最高权限'
        // 	},
        // 	{
        // 		name: '管理员',
        // 		nickname: 'admin',
        // 		description: '普通管理员'
        // 	},
        // 	{
        // 		name: '普通用户',
        // 		nickname: 'user',
        // 		description: '普通用户'
        // 	}
        // ]
        // {
        // 	force: true;
        // }
        // await RoleModel.bulkCreate(initRole, { ignoreDuplicates: true })
        console.log('数据库连接成功');
    }))
        .catch((err) => {
        console.log('数据库连接失败', err);
    });
}
exports.default = sequelize;
