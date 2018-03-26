import * as Koa from 'koa';
import * as bodyParser from 'koa-bodyparser';
import * as KoaCompose from 'koa-compose';
import * as Router from 'koa-router';
import * as StellarSdk from 'stellar-sdk';

const convert = require('koa-convert');

import { sendLumens } from './transactions';

class Server {
    public server: Koa;
    public router: Router;

    constructor() {
        this.server = new Koa();
        this.router = new Router();

        this.setRoutes(this.router);

        const setServer = async (ctx: Koa.Context, next: () => void) => {
            StellarSdk.Network.useTestNetwork();
            ctx.stellar = {
                server: new StellarSdk.Server(
                    'https://horizon-testnet.stellar.org'
                ),
            };
            await next();
        };

        const middleware = KoaCompose([
            convert(bodyParser()),
            setServer,
            this.router.routes(),
            this.router.allowedMethods(),
        ]);
        this.server.use(middleware);
    }

    public setRoutes(router: Router) {
        router.post('/send-lumens', sendLumens);
    }

    public start() {
        return new Promise<any>((resolve: any) => {
            this.server.listen(3000, () => {
                console.log('listening at 3000');
                resolve();
            });
        });
    }
}

const server = new Server();
export default server;
