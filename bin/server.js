"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Koa = require("koa");
const Router = require("koa-router");
class Server {
    constructor() {
        this.server = new Koa();
        this.router = new Router();
        this.router.get('/hello', (ctx, next) => {
            ctx.body = 'world';
            next();
        });
        this.server.use(this.router.routes());
        this.server.use(this.router.allowedMethods());
    }
    start() {
        return new Promise((resolve) => {
            this.server.listen(3000, () => {
                console.log('listening at 3000');
                resolve();
            });
        });
    }
}
const server = new Server();
exports.default = server;
//# sourceMappingURL=server.js.map