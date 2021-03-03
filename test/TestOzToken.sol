// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.6.0 <0.8.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/OzToken.sol";

contract TestOzToken {
    function testConstructor() public {
        OzToken oz = OzToken(DeployedAddresses.OzToken());

        uint256 expected = 200000;
        Assert.equal(oz.balanceOf(msg.sender), expected, "testConstructor");
    }

    function testConstructor2() public {
        OzToken oz = new OzToken(400);

        uint256 expected = 400;
        Assert.equal(oz.balanceOf(address(this)), expected, "testConstructor2");
    }
}
