var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { app } from './app.js';
import * as http from 'http';
import * as util from 'util';
import config from './config.js';
let server;
startServer().catch((err) => {
    console.warn(err);
});
function startServer() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const port = yield startAppListen(app);
            console.log(`server listening on ${port} ✔️`);
        }
        catch (e) {
            console.log('Failed to start server', util.inspect(e));
            yield stopServer();
        }
    });
}
export function stopServer() {
    return __awaiter(this, void 0, void 0, function* () {
        yield stopAppListen();
        console.log('server stopped successfully ✔️');
    });
}
process.on('SIGINT', onSignal);
process.on('SIGTERM', onSignal);
function onSignal(code) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(`Received ${code} stopping server`);
        yield stopServer();
        process.exit(0);
    });
}
function startAppListen(app) {
    return __awaiter(this, void 0, void 0, function* () {
        const port = config.get('port');
        server = http.createServer(app);
        yield new Promise((resolve, reject) => {
            server === null || server === void 0 ? void 0 : server.on('error', reject);
            server === null || server === void 0 ? void 0 : server.listen(port, resolve);
        });
        return port;
    });
}
function stopAppListen() {
    return __awaiter(this, void 0, void 0, function* () {
        if (server) {
            yield new Promise((res) => (server ? server === null || server === void 0 ? void 0 : server.close(res) : res(null)));
            server = null;
        }
    });
}
