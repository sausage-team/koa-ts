
import * as Koa from 'koa'
import { Context } from 'koa'
import router from './router'

const app = new Koa()

app.use(async (ctx: Context, next: Function) => {
  await next()
  const rt = ctx.response.get('X-Response-Time');
  console.log(`${ctx.method} ${ctx.url} - ${rt}`);
})

app.use(async (ctx: Context, next: Function) => {
  const start = Date.now()
  await next()
  const ms = Date.now() - start
  ctx.set('X-Response-Time', `${ms}ms`);
})

// router['get']('/ping', async (ctx: Context, next: Function) => {
//   await next()
//   ctx.body = 'pong'
// })

app.use(router.routes())
app.use(router.allowedMethods())

app.on('error', (err) => {
  console.log('server error', err)
});

app.listen(3000)