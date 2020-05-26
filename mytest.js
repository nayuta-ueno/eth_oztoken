const PROVIDER = 'http://127.0.0.1:9545';
const CONTRACT_ADDR = '<YOUR CONTRACT ADDRESS>';

const fs = require('fs');
var Web3 = require('web3');
var web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider(PROVIDER));

const fn = async () => {
	console.log('Protocol Version: ' + await web3.eth.getProtocolVersion());
	console.log('gas Price: ' + await web3.eth.getGasPrice());
	console.log('balance of contract_addr=' + await web3.eth.getBalance(CONTRACT_ADDR));

	//ABI
	const ABI = JSON.parse(fs.readFileSync('./build/contracts/OzToken.json', 'utf8'))['abi'];
	//web3.eth.defaultAccount = web3.eth.accounts[0];
	var oztoken = new web3.eth.Contract(ABI, CONTRACT_ADDR);

	//token balance
	let accounts = await web3.eth.getAccounts();
	let balance_token = await oztoken.methods.balanceOf(accounts[0]).call();
	console.log('token=' + balance_token);
}
fn();
