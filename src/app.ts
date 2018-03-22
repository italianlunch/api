import server from './server';

async function start() {
    try {
        await server.start();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

if (require.main === module) {
    start();
}
