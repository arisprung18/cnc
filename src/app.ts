import Koa from 'koa'
import router from './routs.js'
import bodyParser from 'koa-bodyparser'
import logger from 'koa-logger'

const koaApp = new Koa()
koaApp.use(logger())
koaApp.use(async (ctx, next) => {
  try {
    await next()
  } catch (error) {
    console.error(`API error for ${ctx.request.path}:`, error)
    ctx.body = error
  }
})
koaApp.use(bodyParser())
koaApp.use(router.routes())
koaApp.use(router.allowedMethods())

export const app = koaApp.callback()
