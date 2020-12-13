//
// truffle exec app/run.js
//
const OzToken = artifacts.require("OzToken");

const SEND_ADDR = '0x87C018EF78005f118C53fa9cadf0a4Fd367a77A9';
const RECV_ADDR = '0x40634a78307Cd0e773455F058715b636ad9d724B';

module.exports = function(callback) {
    const fn = async () => {
        const chainId = await web3.eth.getChainId();
        console.log('chainId=' + chainId);

        const gasPrice = await web3.eth.getGasPrice();
        console.log('gasPrice=' + gasPrice);

        let oz = await OzToken.deployed();

        let balance = await oz.balanceOf(SEND_ADDR);
        console.log('balance(sender)=' + balance);

        balance = await oz.balanceOf(RECV_ADDR);
        console.log('balance(receiver)=' + balance);

        await oz.transfer(RECV_ADDR, 100, {from: SEND_ADDR});

        balance = await oz.balanceOf(SEND_ADDR);
        console.log('balance(sender)=' + balance);

        balance = await oz.balanceOf(RECV_ADDR);
        console.log('balance(receiver)=' + balance);

        await oz.transfer(SEND_ADDR, 100, {from: RECV_ADDR});

        balance = await oz.balanceOf(SEND_ADDR);
        console.log('balance(sender)=' + balance);

        balance = await oz.balanceOf(RECV_ADDR);
        console.log('balance(receiver)=' + balance);

        callback();
    };
    fn();
}
