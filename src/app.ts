import Koa from 'koa';
import router from './router';
import swaggerAutogen from 'swagger-autogen';
// 添加导入
import 'module-alias/register';
const app: Koa = new Koa();

import Debug from 'debug';
const debug = Debug('http');

import bodyParser from 'koa-bodyparser';
import serve from 'koa-static';

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

// app.use(router.routes()).use(router.allowedMethods());
// error-handling
app.on('error', (err: Error, ctx: Koa.Context) => {
  console.error('server error', err, ctx);
});

export default app;
