const OzToken = artifacts.require("OzToken");

module.exports = function(deployer) {
  deployer.deploy(OzToken, 200000);
};
