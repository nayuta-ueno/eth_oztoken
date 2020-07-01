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

    return { addr: contAddr, contract: contr };
}

const fn = async () => {
    let chainId = await web3.eth.getChainId();
    console.log('chainId=' + chainId);

    const gasPrice = await web3.eth.getGasPrice();
    console.log('gasPrice=' + gasPrice);

    const contrToken = await getContract('OzToken', chainId);

    let balance = await contrToken.contract.methods.balanceOf(SEND_ADDR).call();
    console.log('balance(sender)=' + balance);

    balance = await contrToken.contract.methods.balanceOf(RECV_ADDR).call();
    console.log('balance(receiver)=' + balance);

    const method = contrToken.contract.methods.transfer(RECV_ADDR, 100);
    const code = await method.encodeABI();
    const gas = await method.estimateGas({ from: SEND_ADDR });
    console.log('estimateGas=' + gas);

    let nonce = await web3.eth.getTransactionCount(SEND_ADDR);
    console.log('nonce=' + nonce);

    const tx = {
        nonce: nonce,
        chainId: chainId,
        to: contrToken.addr,
        value: '0',
        data: code,
        gasPrice: gasPrice,
        gas: gas + 50000
    };
    signtx = await web3.eth.accounts.signTransaction(tx, PRIVATE_SENDKEY);
    console.log('signed_tx= ' + signtx.rawTransaction);

    // send transaction
    web3.eth.sendSignedTransaction(signtx.rawTransaction)
        .on('transactionHash', (txhash) => {
            console.log('txhash=' + txhash);
        })
        .on('receipt', async (receipt) => {
            console.log('receipt=' + JSON.stringify(receipt));

            balance = await contrToken.contract.methods.balanceOf(SEND_ADDR).call();
            console.log('balance(sender)=' + balance);

            balance = await contrToken.contract.methods.balanceOf(RECV_ADDR).call();
            console.log('balance(receiver)=' + balance);
        })
        // .on('confirmation', (conf, receipt) => {
        //     console.log('conf1=' + conf);
        //     console.log('conf-receipt1=' + JSON.stringify(receipt));
        // })
        .on('error', (err) => {
            console.log('err=' + err);
        });
}
fn();
