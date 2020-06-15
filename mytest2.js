const fs = require('fs');
const Web3 = require('web3');

// const PRIVATE_KEY = '<privateKey of SEND_ADDR>';
// const SEND_ADDR = '<sender address>';
// const RECV_ADDR = 'receiver address';
// const ENDPOINT = 'http://127.0.0.1:9545';

const PRIVATE_KEY = '00112233445566778899aabbccddeeff00112233445566778899aabbccddeeff';
const SEND_ADDR = '0x87C018EF78005f118C53fa9cadf0a4Fd367a77A9';
//const PRIVATE_RECVKEY = 'ca28013f3670b8a3b80be17ec1e774b16d0f8eb15f58a8a189f91166be358ca7';
const RECV_ADDR = '0xbb0b59396ba231c5122ccd9a6855ebd43286d431';
const ENDPOINT = 'ws://127.0.0.1:21020';
const ABI_FILE = './build/contracts/OzToken.json';

let web3 = new Web3();
let reconn = {
};
web3.setProvider(new web3.providers.WebsocketProvider(ENDPOINT, reconn));

const fn = async () => {
    let chainId = await web3.eth.getChainId();
    console.log('chainId=' + chainId);

    let gasPrice = await web3.eth.getGasPrice();
    console.log('gasPrice=' + gasPrice);

    const CONTRACT_ADDR = JSON.parse(fs.readFileSync(ABI_FILE, 'utf8'))['networks'][String(chainId)]['address'];
    console.log('contract=' + CONTRACT_ADDR);

    const ABI = JSON.parse(fs.readFileSync(ABI_FILE, 'utf8'))['abi'];
    let contr = new web3.eth.Contract(ABI, CONTRACT_ADDR);

    let balance = await contr.methods.balanceOf(SEND_ADDR).call();
    console.log('balance(sender)=' + balance);

    balance = await contr.methods.balanceOf(RECV_ADDR).call();
    console.log('balance(receiver)=' + balance);

    let method = contr.methods.transfer(RECV_ADDR, 100);
    let code = await method.encodeABI();
    let gas = await method.estimateGas({ from: SEND_ADDR });
    console.log('estimateGas=' + gas);

    nonce = await web3.eth.getTransactionCount(SEND_ADDR);
    console.log('nonce=' + nonce);

    // transaction
    const tx = {
        nonce: nonce,
        chainId: chainId,
        to: CONTRACT_ADDR,
        value: '0',
        data: code,
        gasPrice: gasPrice,
        gas: gas + 50000
    };
    signtx = await web3.eth.accounts.signTransaction(tx, PRIVATE_KEY);
    console.log('signed_tx= ' + signtx.rawTransaction);

    // send transaction
    try {
        web3.eth.sendSignedTransaction(signtx.rawTransaction)
            .on('transactionHash', (txhash) => {
                console.log('txhash=' + txhash);
            })
            .on('receipt', async (receipt) => {
                console.log('receipt=' + JSON.stringify(receipt));

                balance = await contr.methods.balanceOf(SEND_ADDR).call();
                console.log('balance(sender)=' + balance);

                balance = await contr.methods.balanceOf(RECV_ADDR).call();
                console.log('balance(receiver)=' + balance);
            })
            // .on('confirmation', (conf, receipt) => {
            //     console.log('conf1=' + conf);
            //     console.log('conf-receipt1=' + JSON.stringify(receipt));
            // })
            .on('error', (err) => {
                console.log('err=' + err);
            });
    } catch (err) {
        console.log('err sendSignedTransaction=' + err);
    }
}
fn();
