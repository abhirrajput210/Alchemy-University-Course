// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

contract FuncCall{
    function callAttempt(address contractWinner) external{
        bytes memory payload = abi.encodeWithSignature("attempt()");
        (bool success, ) = contractWinner.call(payload);
        require(success);
    }
}