import * as logger from 'log4js';
import path from 'path';
logger.configure({
  appenders: {
    access: {
      type: 'dateFile',
      pattern: '-yyyy-MM-dd.log', //生成文件的规则
      filename: path.resolve('logs', 'access.log'),
    },
    application: {
      type: 'dateFile',
      pattern: '-yyyy-MM-dd.log', //生成文件的规则
      filename: path.resolve('logs', 'application.log'),
    },
    out: {
      type: 'console',
    },
    db: {
      type: 'dateFile',
      pattern: '-yyyy-MM-dd.log', //生成文件的规则
      filename: path.resolve('logs', 'db.log'),
    },
  },
  categories: {
    default: {appenders: ['out'], level: 'info'},
    access: {
      appenders: ['access'],
      level: 'info',
    },
    application: {
      appenders: ['application'],
      level: 'warn',
    },
    db: {
      appenders: ['db'],
      level: 'info',
    },
  },
});
export const accessLogger = () => logger.getLogger('access');
export const applicationLogger = logger.getLogger('application');
export const dbLogger = logger.getLogger('db');
