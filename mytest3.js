'use restrict';

const SEND_ADDR = '0x87C018EF78005f118C53fa9cadf0a4Fd367a77A9';
const PRIVATE_SENDKEY = '00112233445566778899aabbccddeeff00112233445566778899aabbccddeeff';
const RECV_ADDR = '0x40634a78307Cd0e773455F058715b636ad9d724B';
const PRIVATE_RECVKEY = 'ffeeddccbbaa99887766554433221100ffeeddccbbaa99887766554433221100';
const ENDPOINT = 'ws://127.0.0.1:21020';

const fs = require('fs');
const Web3 = require('web3');

const web3 = new Web3();
const reconn = {
};
web3.setProvider(new web3.providers.WebsocketProvider(ENDPOINT, reconn));

async function getContract(contractName, chainId) {
    const abiFileName = './build/contracts/' + contractName + '.json';
    const abiFile = JSON.parse(fs.readFileSync(abiFileName, 'utf8'));
    const contAddr = abiFile['networks'][String(chainId)]['address'];
    let contr = new web3.eth.Contract(abiFile['abi'], contAddr);

    return { addr: contAddr, contract: contr, chainId: chainId, method: '' };
}

async function signTx(nonce, contr, key) {
    const code = await contr.method.encodeABI();
    console.log('code=' + code);
    const tx = {
        nonce: nonce,
        chainId: contr.chainId,
        to: contr.addr,
        value: '0',
        data: code,
        gasPrice: 0,
        gas: 500000
    };
    console.log('tx=%o', tx);
    signtx = await web3.eth.accounts.signTransaction(tx, key);
    return signtx;
}

const fn = async () => {
    try {
        const chainId = await web3.eth.getChainId();

        const contrToken = await getContract('OzToken', chainId);
        let nonce = await web3.eth.getTransactionCount(SEND_ADDR);

        contrToken.method = contrToken.contract.methods.sendRevert();
        const signtx = await signTx(nonce, contrToken, PRIVATE_SENDKEY);
        console.log('signtx=%o', signtx);
        web3.eth.sendSignedTransaction(signtx.rawTransaction)
            .on('transactionHash', (txhash) => {
                console.log('txhash=' + txhash);
            })
            .on('receipt', async (receipt) => {
                console.log('receipt=' + JSON.stringify(receipt));
            })
            .on('error', (err) => {
                console.log('err=' + err);
            });
    } catch (err) {
        console.log('err: ' + err);
    }
}
fn();
