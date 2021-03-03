const OzToken = artifacts.require("OzToken");
const TestCont = artifacts.require("TestCont");

contract("OzToken test", async accounts => {
  it("supply amount1", async () => {
    let instance = await OzToken.deployed();

    let supply = await instance.totalSupply();
    assert.equal(supply, 200000, "supply");
  });

  it("deploy amount", async () => {
    let instance = await OzToken.deployed();

    let owner = accounts[0];
    let balance = await instance.balanceOf(owner);
    assert.equal(balance, 200000, "balance");
  });

  it("direct transfer", async () => {
    let instance = await OzToken.deployed();

    let owner = accounts[0];
    let payee = accounts[1];
    let payAmt = 10000;
    await instance.transfer(payee, payAmt);

    let balanceOwner = await instance.balanceOf(owner);
    assert.equal(200000 - balanceOwner, payAmt, "balanceOwner");

    let balancePayee = await instance.balanceOf(payee);
    assert.equal(balancePayee, payAmt, "balancePayee");
  });

  it("approve transfer from owner", async () => {
    let instance = await OzToken.deployed();

    let owner = accounts[0];
    let payer = accounts[0];
    let payee = accounts[1];
    var balanceOwnerBegin = await instance.balanceOf(owner);
    var balancePayerBegin = await instance.balanceOf(payer);
    var balancePayeeBegin = await instance.balanceOf(payee);

    let payAmt = 10000;

    await instance.approve(payer, payAmt);
    let appr = await instance.allowance(owner, payer);
    assert.equal(appr, payAmt, "approval");

    await instance.transferFrom(payer, payee, payAmt);

    let balanceOwner = await instance.balanceOf(owner);
    assert.equal(balanceOwner - balanceOwnerBegin, -payAmt, "balanceOwner");

    let balancePayer = await instance.balanceOf(payer);
    assert.equal(balancePayer - balancePayerBegin, -payAmt, "balancePayer");

    let balancePayee = await instance.balanceOf(payee);
    assert.equal(balancePayee - balancePayeeBegin, payAmt, "balancePayee");
  });

  // おそらくownerのコンテキスト？になっていて、別の人がapprove()するテストができない
  // it("approve transfer from payer", async () => {
  //   let instance = await OzToken.deployed();

  //   let owner = accounts[0];
  //   let payer = accounts[1];
  //   let payee = accounts[2];
  //   var balanceOwnerBegin = await instance.balanceOf(owner);
  //   var balancePayerBegin = await instance.balanceOf(payer);
  //   var balancePayeeBegin = await instance.balanceOf(payee);

  //   let payAmt = 5000;

  //   assert.equal(balancePayerBegin > payAmt, true, "larger");

  //   await instance.approve(payer, 2 * payAmt);
  //   let balanceApprove = await instance.allowance(owner, payer);
  //   console.log("balanceApprove=" + balanceApprove.toString());

  //   await instance.transferFrom(payer, payee, payAmt);

  //   // let balanceOwner = await instance.balanceOf(owner);
  //   // assert.equal(balanceOwner - balanceOwnerBegin, 0, "balanceOwner");

  //   // let balancePayer = await instance.balanceOf(payer);
  //   // assert.equal(balancePayer - balancePayerBegin, -payAmt, "balancePayer");

  //   // let balancePayee = await instance.balanceOf(payee);
  //   // assert.equal(balancePayee - balancePayeeBegin, payAmt, "balancePayee");
  // });

  it("supply amount2", async () => {
    let instance = await OzToken.deployed();
    let owner = accounts[0];

    let supply = await instance.totalSupply();
    assert.equal(supply, 200000, "supply");
  });

  it("テスト用Solidity", async () => {
    // TestCont.solを使う
    let kk = await TestCont.new();
    console.log(await kk.hello());
    assert.equal((await kk.gets()).toString(), "400", "gets");
  });
});
