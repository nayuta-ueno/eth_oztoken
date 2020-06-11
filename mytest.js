const CONTRACT_ADDR = '<YOUR CONTRACT ADDRESS>';
const SEND_ADDR = '<sender address>';
const PRIVATE_KEY = '<privateKey of SEND_ADDR>';
const RECV_ADDR = 'receiver address';
const ENDPOINT = 'http://127.0.0.1:9545';

const fs = require('fs');
const  Web3 = require('web3');

let web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider(ENDPOINT));

const fn = async () => {
    let chainId = await web3.eth.getChainId();
    console.log('chainId=' + chainId);

    let gasPrice = await web3.eth.getGasPrice();
    console.log('gasPrice=' + gasPrice);

	const ABI = JSON.parse(fs.readFileSync('./build/contracts/OzToken.json', 'utf8'))['abi'];
	let oztoken = new web3.eth.Contract(ABI, CONTRACT_ADDR);

	let balance = await oztoken.methods.balanceOf(SEND_ADDR).call();
	console.log('balance(sender)=' + balance);

	balance = await oztoken.methods.balanceOf(RECV_ADDR).call();
	console.log('balance(receiver)=' + balance);

    let method = oztoken.methods.transfer(RECV_ADDR, 100);
	let code = await method.encodeABI();
    let gas = await method.estimateGas({from: SEND_ADDR});
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
        .on('receipt', (receipt) => {
            console.log('receipt=' + JSON.stringify(receipt));
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
