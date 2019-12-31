const UToken = artifacts.require("./OzToken.sol");

contract("OzToken test", async accounts => {
  it("deploy amount", async () => {
    let instance = await UToken.deployed();
    let balance = await instance.balanceOf(accounts[0]);
    let expected = String(200000);
    assert.equal(balance.toString(), expected);
  });
});
