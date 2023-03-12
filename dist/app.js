var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Koa from 'koa';
import router from './routs.js';
import bodyParser from 'koa-bodyparser';
import logger from 'koa-logger';
const koaApp = new Koa();
koaApp.use(logger());
koaApp.use((ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield next();
    }
    catch (error) {
        console.error(`API error for ${ctx.request.path}:`, error);
        ctx.body = error;
    }
}));
koaApp.use(bodyParser());
koaApp.use(router.routes());
koaApp.use(router.allowedMethods());
export const app = koaApp.callback();
