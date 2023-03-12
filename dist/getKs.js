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
const serviceUrl = config.get('kalturaUrl');
const { id: partnerId, adminSecret, adminUserId } = config.get('partner');
const clientConfig = new kaltura.Configuration({ serviceUrl });
const client = new kaltura.Client(clientConfig);
const type = kaltura.enums.SessionType.ADMIN;
const expiry = 86400;
const privileges = 'disableentitlement';
export function getKs() {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield kaltura.services.session
            .start(adminSecret, adminUserId, type, partnerId, expiry, privileges)
            .execute(client);
        return response;
    });
}
