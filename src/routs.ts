import Router from '@koa/router'
import { getJwt } from './getJwt.js'
import { getKs } from './getKs.js'
import config from './config.js'

const router = new Router({ prefix: '/embed-cnc' })
const { id: partnerId } = config.get('partner')

router.get('/init-data', async (ctx: any) => {
  const [ks, jwt] = await Promise.all([getKs(), getJwt()])
  ctx.body = { ks, jwt, success: true, partnerId }
})

export default router
