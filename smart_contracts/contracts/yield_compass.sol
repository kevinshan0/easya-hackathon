// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract MyContract {
    string public message = "Hello, Polkadot Asset Hub!";

    function setMessage(string calldata newMessage) external {
        message = newMessage;
    }
} 