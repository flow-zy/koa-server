import Koa from 'koa';
import router from './router';
import jwt from 'koa-jwt';
import compose from 'koa-compose';
import authMiddleware from './middleware/authMiddleware';
import sendMiddleware from './middleware/sendMiddleware';
import logger from 'koa-logger';
import cors from '@koa/cors';
// 添加导入
import 'module-alias/register';
const app: Koa = new Koa();

import Debug from 'debug';
const debug = Debug('http');

import bodyParser from 'koa-bodyparser';
import serve from 'koa-static';
import {WHITE_LIST} from './config';
import {accessLogger, applicationLogger} from './utils/log';
import {db} from './db';

// body parser
app.use(
  bodyParser({
    enableTypes: ['json', 'form', 'text'],
  }),
);

app.use(serve(__dirname + '/public'));

// logger
app.use(async (ctx: Koa.Context, next: Function) => {
  const start: number = Date.now();
  await next();
  const now: number = Date.now();
  const ms = now - start;
  debug(`${ctx.method} ${ctx.url} - ${ms}ms`);
});
const jwtMiddleware = jwt({secret: process.env.SCREET_KEY!}).unless({
  path: WHITE_LIST,
});
app.use(async (ctx, next) => {
  accessLogger();
  return next();
});
const middlewares = compose([
  logger(),
  cors(),
  jwtMiddleware,
  sendMiddleware(),
  authMiddleware(),
]);
app.use(middlewares);
app.use(router.routes()).use(router.allowedMethods());
// error-handling
app.on('error', (err: Error, ctx: Koa.Context) => {
  applicationLogger.error(err.message);
  console.error('server error', err);
  return (ctx.body = {
    code: 500,
    msg: err.message,
    data: null,
  });
});
db();
export default app;
