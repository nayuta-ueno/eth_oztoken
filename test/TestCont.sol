// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.6.0 <0.8.0;

import "../contracts/OzToken.sol";

contract TestCont {
    OzToken private _oz;

    constructor() public {
        _oz = new OzToken(400);
    }

    function hello() public pure returns (string memory) {
        return "hello";
    }

    function gets() public view returns (uint256) {
        return _oz.balanceOf(address(this));
    }
}
