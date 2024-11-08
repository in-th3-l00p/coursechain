// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Import OpenZeppelin's Ownable contract for ownership management
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

/**
 * @title Course
 * @dev Represents an individual course with metadata and ownership control.
 */
contract Course is Ownable {
    string public title;

    event TitleUpdated(string oldTitle, string newTitle);

    /**
     * @dev Initializes the contract setting the deployer as the initial owner and setting course metadata.
     * @param _owner Address of the course owner.
     * @param _title Title of the course.
     */
    constructor(
        address _owner,
        string memory _title
    ) Ownable(_owner) {
        require(_owner != address(0), "Invalid owner address");
        require(bytes(_title).length > 0, "Title cannot be empty");
        title = _title;
    }

    /**
     * @dev Updates the title of the course. Only the owner can call this function.
     * @param _newTitle New title for the course.
     */
    function setTitle(string memory _newTitle) external onlyOwner {
        require(bytes(_newTitle).length > 0, "Title cannot be empty");
        string memory oldTitle = title;
        title = _newTitle;
        emit TitleUpdated(oldTitle, _newTitle);
    }

    /**
     * @dev Fallback function to prevent accidental ETH transfers to the contract.
     */
    receive() external payable {
        revert("Direct ETH transfers not allowed");
    }

    fallback() external payable {
        revert("Direct ETH transfers not allowed");
    }
}
