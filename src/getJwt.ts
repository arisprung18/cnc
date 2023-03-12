// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import kaltura from 'kaltura-client'
import config from './config.js'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import jsonwebtoken from 'jsonwebtoken'

const serviceUrl = config.get('kalturaUrl')
const { id: partnerId, adminSecret, adminUserId } = config.get('partner')
const eventId = config.get('eventId')
const cncUserId = config.get('cnc.userId')
const clientConfig = new kaltura.Configuration({ serviceUrl })
const CnCExpirationMinutes = 24 * 60

export async function getJwt(): Promise<string> {
  const token = await getAppToken()
  return signJwt(token)
}

function signJwt(secret: string): string {
  const exp = Math.floor(Date.now() / 1000) + 60 * CnCExpirationMinutes
  const user = {
    partnerId,
    uid: cncUserId,
    groups: [],
    exp,
    isAdmin: false,
    virtualEventId: eventId,
    isScopedUser: true,
  }
  return jsonwebtoken.sign(user, secret, { header: { kid: partnerId } })
}

async function getAppToken(): Promise<string> {
  const client = await getSessionClient()
  const filter = new kaltura.objects.AppTokenFilter({ statusEqual: kaltura.enums.AppTokenStatus.ACTIVE })
  const pager = new kaltura.objects.FilterPager()
  const result = await kaltura.services.appToken.listAction(filter, pager).execute(client)
  const appToken = result.objects.filter(({ sessionPrivileges }: any) => sessionPrivileges === 'cncAuth:true')
  if (appToken.length !== 1) {
    throw new Error(`Failed to find one an app token, found ${appToken.length}`)
  }
  return appToken?.[0].token
}

async function getSessionClient(): Promise<any> {
  const client = new kaltura.Client(clientConfig)
  return await new Promise((res, rej) => {
    kaltura.services.session
      .start(adminSecret, adminUserId, kaltura.enums.SessionType.ADMIN, partnerId)
      .completion((success: boolean, ks: string | Error) => {
        if (!success) {
          return rej((<Error>ks).message)
        }
        client.setKs(ks)
        res(client)
      })
      .execute(client)
  })
}
