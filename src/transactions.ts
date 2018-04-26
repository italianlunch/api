import * as Koa from 'koa';
import * as StellarSdk from 'stellar-sdk';

const sendLumens = async (ctx: Koa.Context, next: () => void) => {
    console.log(ctx);
    const server = ctx.stellar.server as StellarSdk.Server;
    const { sourcePrivateKey, destinationPublicKey, amount } = ctx.request.body;

    const sourceKeys = StellarSdk.Keypair.fromSecret(sourcePrivateKey);

    try {
        await server.loadAccount(destinationPublicKey);
    } catch (e) {
        throw new Error('The desintation account does not exist!');
    }

    let sourceAccount: StellarSdk.Account;

    try {
        sourceAccount = await server.loadAccount(sourceKeys.publicKey());
    } catch (e) {
        throw new Error('The source account does not exist!');
    }

    const transaction = new StellarSdk.TransactionBuilder(sourceAccount)
        .addOperation(
            StellarSdk.Operation.payment({
                destination: destinationPublicKey,
                asset: StellarSdk.Asset.native(),
                amount,
            })
        )
        .addMemo(StellarSdk.Memo.text('Testing stuff'))
        .build();

    transaction.sign(sourceKeys);

    try {
        await server.submitTransaction(transaction);
    } catch (e) {
        console.error('Something went wrong', e);
    }

    ctx.body = 'ok';
    next();
};

export { sendLumens };
