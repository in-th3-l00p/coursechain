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
    string public slug;
    string public description;
    string public category;
    uint256 public price;

    struct CourseDto {
        string title;
        string slug;
        string description;
        string category;
        uint256 price;
    }

    event TitleUpdated(string oldTitle, string newTitle);
    event SlugUpdated(string oldSlug, string newSlug);
    event DescriptionUpdated(string oldDescription, string newDescription);
    event CategoryUpdated(string oldCategory, string newCategory);
    event PriceUpdated(uint256 oldPrice, uint256 newPrice);

    /**
     * @dev Initializes the contract setting the deployer as the initial owner and setting course metadata.
     * @param _owner Address of the course owner.
     * @param _title Title of the course.
     */
    constructor(
        address _owner,
        string memory _title,
        string memory _slug,
        string memory _description,
        string memory _category,
        uint256 _price
    ) Ownable(_owner) {
        require(_owner != address(0), "Invalid owner address");
        title = _title;
        slug = _slug;
        description = _description;
        category = _category;
        price = _price;
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
     * @dev Updates the slug of the course. Only the owner can call this function.
     * @param _slug New slug for the course.
     */
    function setSlug(string memory _slug) external onlyOwner {
        require(bytes(_slug).length > 0, "Slug cannot be empty");
        string memory oldSlug = slug;
        slug = _slug;
        emit SlugUpdated(oldSlug, _slug);
    }

    /**
     * @dev Updates the description of the course. Only the owner can call this function.
     * @param _description New description for the course.
     */
    function setDescription(string memory _description) external onlyOwner {
        string memory oldDescription = description;
        description = _description;
        emit DescriptionUpdated(oldDescription, _description);
    }

    /**
     * @dev Updates the category of the course. Only the owner can call this function.
     * @param _category New category for the course.
     */
    function setCategory(string memory _category) external onlyOwner {
        string memory oldCategory = category;
        category = _category;
        emit CategoryUpdated(oldCategory, _category);
    }

    /**
     * @dev Updates the price of the course. Only the owner can call this function.
     * @param _price New price for the course.
     */
    function setPrice(uint256 _price) external onlyOwner {
        uint256 oldPrice = price;
        price = _price;
        emit PriceUpdated(oldPrice, _price);
    }

    /**
     * @dev Returns the course data.
     * @return Course data.
     */
    function get() public view returns (CourseDto memory) {
        return CourseDto(title, slug, description, category, price);
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
