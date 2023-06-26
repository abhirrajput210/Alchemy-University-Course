//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract ModifyVariable {
//   uint public x;
  string public str1;

//   constructor(uint _x) {
//     x = _x;
//   }

  constructor(string memory _str1) {
    str1 = _str1;
  }

//   function modifyToLeet() public {
//     x = 1337;
//   }

function modifyToLeet() public {
    str1 = "Hello World";
  }
}