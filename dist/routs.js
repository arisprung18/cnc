var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Router from '@koa/router';
import { getJwt } from './getJwt.js';
import { getKs } from './getKs.js';
const router = new Router({ prefix: '/embed-cnc' });
router.get('/init-data', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const [ks, jwt] = yield Promise.all([getKs(), getJwt()]);
    ctx.body = { ks, jwt, success: true };
}));
export default router;
