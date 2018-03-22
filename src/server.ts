import * as Koa from 'koa';
import * as Router from 'koa-router';

class Server {
    public server: Koa;
    public router: Router;

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
