// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Import OpenZeppelin's Ownable contract for ownership management
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Course
 * @dev Represents an individual course with metadata and ownership control.
 */
contract Course is Ownable {
    // State Variables
    string private title;
    string private description;

    // Events
    event TitleUpdated(string oldTitle, string newTitle);
    event DescriptionUpdated(string oldDescription, string newDescription);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    /**
     * @dev Initializes the contract setting the deployer as the initial owner and setting course metadata.
     * @param _owner Address of the course owner.
     * @param _title Title of the course.
     * @param _description Description of the course.
     */
    constructor(
        address _owner,
        string memory _title,
        string memory _description,
    ) {
        require(_owner != address(0), "Invalid owner address");
        _transferOwnership(_owner); // Transfer ownership to the specified owner

        title = _title;
        description = _description;
    }

    /**
     * @dev Returns the title of the course.
     * @return Title as a string.
     */
    function getTitle() external view returns (string memory) {
        return title;
    }

    /**
     * @dev Returns the description of the course.
     * @return Description as a string.
     */
    function getDescription() external view returns (string memory) {
        return description;
    }

    /**
     * @dev Updates the title of the course. Only the owner can call this function.
     * @param _newTitle New title for the course.
     */
    function updateTitle(string memory _newTitle) external onlyOwner {
        require(bytes(_newTitle).length > 0, "Title cannot be empty");
        string memory oldTitle = title;
        title = _newTitle;
        emit TitleUpdated(oldTitle, _newTitle);
    }

    /**
     * @dev Updates the description of the course. Only the owner can call this function.
     * @param _newDescription New description for the course.
     */
    function updateDescription(string memory _newDescription) external onlyOwner {
        require(bytes(_newDescription).length > 0, "Description cannot be empty");
        string memory oldDescription = description;
        description = _newDescription;
        emit DescriptionUpdated(oldDescription, _newDescription);
    }

    /**
     * @dev Transfers ownership of the course to a new address. Overrides OpenZeppelin's Ownable to emit a custom event.
     * @param newOwner Address of the new owner.
     */
    function transferCourseOwnership(address newOwner) external override onlyOwner {
        require(newOwner != address(0), "New owner is the zero address");
        address previousOwner = owner();
        super.transferOwnership(newOwner);
        emit OwnershipTransferred(previousOwner, newOwner);
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
