'use restrict';

const SEND_ADDR = '0x87C018EF78005f118C53fa9cadf0a4Fd367a77A9';
const PRIVATE_SENDKEY = '00112233445566778899aabbccddeeff00112233445566778899aabbccddeeff';
const RECV_ADDR = '0x40634a78307Cd0e773455F058715b636ad9d724B';
const PRIVATE_RECVKEY = 'ffeeddccbbaa99887766554433221100ffeeddccbbaa99887766554433221100';
const ENDPOINT = 'ws://127.0.0.1:21020';

const fs = require('fs');
const Web3 = require('web3');

const web3 = new Web3();
web3.setProvider(new web3.providers.WebsocketProvider(ENDPOINT));

async function getContract(contractName, chainId) {
    const abiFileName = './build/contracts/' + contractName + '.json';
    const abiFile = JSON.parse(fs.readFileSync(abiFileName, 'utf8'));
    const contrAddr = abiFile['networks'][String(chainId)]['address'];
    const contr = new web3.eth.Contract(abiFile['abi'], contrAddr);
    return { contr: contr, addr: contrAddr };
}

const fn = async () => {
    try {
        const chainId = await web3.eth.getChainId();
        console.log('chainId=' + chainId);

        const gasPrice = await web3.eth.getGasPrice();
        console.log('gasPrice=' + gasPrice);

        const contrToken = await getContract('OzToken', chainId);

        let balance = await contrToken.contr.methods.balanceOf(SEND_ADDR).call();
        console.log('balance(sender)=' + balance);

        balance = await contrToken.contr.methods.balanceOf(RECV_ADDR).call();
        console.log('balance(receiver)=' + balance);

        let method = contrToken.contr.methods.transfer(RECV_ADDR, 100);
        let code = await method.encodeABI();
        let gas = await method.estimateGas({ from: SEND_ADDR });
        console.log('estimateGas=' + gas);

        nonce = await web3.eth.getTransactionCount(SEND_ADDR);
        console.log('nonce=' + nonce);

        // transaction
        const tx = {
            nonce: nonce,
            chainId: chainId,
            to: contrToken.addr,
            value: '0',
            data: code,
            gasPrice: gasPrice,
            gas: gas
        };
        signtx = await web3.eth.accounts.signTransaction(tx, PRIVATE_SENDKEY);
        console.log('signed_tx= ' + signtx.rawTransaction);

        // send transaction
        web3.eth.sendSignedTransaction(signtx.rawTransaction)
            .on('transactionHash', (txhash) => {
                console.log('txhash=' + txhash);
            })
            .on('receipt', (receipt) => {
                console.log('receipt=' + JSON.stringify(receipt));
                web3.currentProvider.connection.close();
            })
            // .on('confirmation', (conf, receipt) => {
            //     console.log('conf1=' + conf);
            //     console.log('conf-receipt1=' + JSON.stringify(receipt));
            // })
            .on('error', (err) => {
                console.log('err=' + err);
            });
    } catch (err) {
        console.log('err=' + err);
        web3.currentProvider.connection.close();
    }
}
fn();
