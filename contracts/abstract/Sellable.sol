// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title Sellable contract interface
 */
abstract contract Sellable {
    uint256 public price;

    event PriceUpdated(uint256 newPrice);

    // initial price
    constructor(uint256 _price) {
        price = _price;
    }

}