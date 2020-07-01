const fs = require('fs');
const Web3 = require('web3');

// const PRIVATE_SENDKEY = '<privateKey of SEND_ADDR>';
// const SEND_ADDR = '<sender address>';
// const RECV_ADDR = 'receiver address';
// const ENDPOINT = 'http://127.0.0.1:9545';

const PRIVATE_SENDKEY = '00112233445566778899aabbccddeeff00112233445566778899aabbccddeeff';
const SEND_ADDR = '0x87C018EF78005f118C53fa9cadf0a4Fd367a77A9';
const PRIVATE_RECVKEY = 'ca28013f3670b8a3b80be17ec1e774b16d0f8eb15f58a8a189f91166be358ca7';
const RECV_ADDR = '0xbb0b59396ba231c5122ccd9a6855ebd43286d431';
const ENDPOINT = 'ws://127.0.0.1:21020';

let web3 = new Web3();
let reconn = {
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
    const chainId = await web3.eth.getChainId();

    const contrToken = await getContract('OzToken', chainId);
    let nonce = await web3.eth.getTransactionCount(SEND_ADDR);

    // try {
    //     const method = contrToken.contract.methods.viewRevert();
    //     const ret = await method.call();
    //     console.log('view ret= ' + ret);
    // } catch (err) {
    //     console.log('catch viewRevert: ' + err);
    // }

    try {
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
        console.log('catch sendRevert: ' + err);
    }
}
fn();
