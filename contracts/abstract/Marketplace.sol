// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

import "./Adminable.sol";
import "./Sellable.sol";

abstract contract Marketplace is Sellable, Adminable, ReentrancyGuard  {
    constructor(address _owner, uint256 _initialPrice) 
        Adminable(_owner) 
        Sellable(_initialPrice) 
    { }

    /**
     * @dev Set a new price for courses. Only admins or the owner can set the price.
     * @param newPrice New price in wei.
     */
    function setPrice(uint256 newPrice) external onlyAdmin {
        require(newPrice > 0, "Price must be greater than zero");
        price = newPrice;
        emit PriceUpdated(newPrice);
    }

    /**
     * @dev Withdraw accumulated ETH from the marketplace to the owner's address.
     */
    function withdrawFunds() external onlyOwner nonReentrant {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");

        (bool success, ) = owner().call{value: balance}("");
        require(success, "Withdrawal failed");
    }
}