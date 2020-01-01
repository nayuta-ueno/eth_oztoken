const UToken = artifacts.require("./OzToken.sol");

contract("OzToken test", async accounts => {
  it("deploy amount", async () => {
    let instance = await UToken.deployed();
    let owner = accounts[0];

    let balance = await instance.balanceOf(owner);
    let expected = String(200000);
    assert.equal(balance.toString(), expected);
  });

  it("direct transfer", async () => {
    let instance = await UToken.deployed();

    let owner = accounts[0];
    let payee = accounts[1];
    let payAmt = 10000;
    await instance.transfer(payee, payAmt);
    
    let balanceOwner = await instance.balanceOf(owner);
    assert.equal(balanceOwner.toString(), String(200000 - payAmt), "balanceOwner");
    
    let balancePayee = await instance.balanceOf(payee);
    assert.equal(balancePayee.toString(), String(payAmt), "balancePayee");
  });

});
