// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract YieldRates {
    address public owner;

    struct YieldEntry {
        bytes32 chain;
        bytes32 project;
        uint32 apy; // 1234 = 12.34%
        uint128 tvlUsd;
        bytes32 risk;
    }

    YieldEntry[] public entries;

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function addEntry(
        bytes32 chain,
        bytes32 project,
        uint32 apy,
        uint128 tvlUsd,
        bytes32 risk
    ) public onlyOwner {
        entries.push(YieldEntry(chain, project, apy, tvlUsd, risk));
    }

    function updateEntry(
        uint index,
        bytes32 chain,
        bytes32 project,
        uint32 apy,
        uint128 tvlUsd,
        bytes32 risk
    ) public onlyOwner {
        require(index < entries.length, "Index out of bounds");
        entries[index] = YieldEntry(chain, project, apy, tvlUsd, risk);
    }

    function getEntriesCount() public view returns (uint) {
        return entries.length;
    }

    function getEntry(uint index) public view returns (
        bytes32 chain,
        bytes32 project,
        uint32 apy,
        uint128 tvlUsd,
        bytes32 risk
    ) {
        require(index < entries.length, "Index out of bounds");
        YieldEntry storage entry = entries[index];
        return (entry.chain, entry.project, entry.apy, entry.tvlUsd, entry.risk);
    }
}

