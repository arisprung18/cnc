var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import kaltura from 'kaltura-client';
import config from './config.js';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import jsonwebtoken from 'jsonwebtoken';
const serviceUrl = config.get('kalturaUrl');
const { id: partnerId, adminSecret, adminUserId } = config.get('partner');
const eventId = config.get('eventId');
const cncUserId = config.get('cnc.userId');
const clientConfig = new kaltura.Configuration({ serviceUrl });
const CnCExpirationMinutes = 24 * 60;
export function getJwt() {
    return __awaiter(this, void 0, void 0, function* () {
        const token = yield getAppToken();
        return signJwt(token);
    });
}
function signJwt(secret) {
    const exp = Math.floor(Date.now() / 1000) + 60 * CnCExpirationMinutes;
    const user = {
        partnerId,
        uid: cncUserId,
        groups: [],
        exp,
        isAdmin: false,
        virtualEventId: eventId,
        isScopedUser: true,
    };
    return jsonwebtoken.sign(user, secret, { header: { kid: partnerId } });
}
function getAppToken() {
    return __awaiter(this, void 0, void 0, function* () {
        const client = yield getSessionClient();
        const filter = new kaltura.objects.AppTokenFilter({ statusEqual: kaltura.enums.AppTokenStatus.ACTIVE });
        const pager = new kaltura.objects.FilterPager();
        const result = yield kaltura.services.appToken.listAction(filter, pager).execute(client);
        const appToken = result.objects.filter(({ sessionPrivileges }) => sessionPrivileges === 'cncAuth:true');
        if (appToken.length !== 1) {
            throw new Error(`Failed to find one an app token, found ${appToken.length}`);
        }
        return appToken === null || appToken === void 0 ? void 0 : appToken[0].token;
    });
}
function getSessionClient() {
    return __awaiter(this, void 0, void 0, function* () {
        const client = new kaltura.Client(clientConfig);
        return yield new Promise((res, rej) => {
            kaltura.services.session
                .start(adminSecret, adminUserId, kaltura.enums.SessionType.ADMIN, partnerId)
                .completion((success, ks) => {
                if (!success) {
                    return rej(ks.message);
                }
                client.setKs(ks);
                res(client);
            })
                .execute(client);
        });
    });
}
