// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Importing the Course contract
import "./Course.sol";

// Import OpenZeppelin Contracts
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

// Other interfaces
import "./abstract/Marketplace.sol";

/**
 * @title CourseMarketplace
 * @dev A marketplace for purchasing courses. Each purchase deploys a new Course contract.
 */
contract CourseMarketplace is Marketplace {
    using EnumerableSet for EnumerableSet.AddressSet;

    // Events
    event CoursePurchased(
        address indexed buyer,
        address courseAddress,
        string title,
        uint256 timestamp
    );
    event Received(address indexed sender, uint256 amount); // fallback
    event FallbackCalled(address indexed sender, uint256 amount, bytes data);

    mapping(address => Course[]) private userCourses;
    Course[] private allCourses;

    /**
     * @dev Constructor sets the initial price.
     * @param _owner Address of the owner.
     * @param _initialPrice Initial price of a course in wei.
     */
    constructor(address _owner, uint256 _initialPrice) 
        Marketplace(_owner, _initialPrice)
    { }

    /**
     * @dev Purchase a course by sending the required ETH. Deploys a new Course contract.
     * @param _title Title of the course.
     */
    function purchaseCourse(
        string memory _title,
        string memory _slug,
        string memory _description,
        string memory _category,
        uint256 _price
    ) external payable nonReentrant {
        require(msg.value >= price, "Insufficient ETH sent for course purchase");

        // Effects: Update state before external interactions
        Course newCourse = new Course(
            msg.sender, 
            _title, 
            _slug, 
            _description, 
            _category, 
            _price
        );
        userCourses[msg.sender].push(newCourse);
        allCourses.push(newCourse); // Add to allCourses

        emit CoursePurchased(
            msg.sender,
            address(newCourse),
            _title,
            block.timestamp
        );

        // Interactions: External calls after state updates
        if (msg.value > price) {
            uint256 refundAmount = msg.value - price;
            (bool success, ) = msg.sender.call{value: refundAmount}("");
            require(success, "Refund failed");
        }
    }

    /**
     * @dev Get all courses owned by a user.
     * @param _user Address of the user.
     * @return Array of Course contract instances.
     */
    function getUserCourses(address _user) external view returns (Course[] memory) {
        return userCourses[_user];
    }

    /**
     * @dev Get all courses in the marketplace.
     * @return Array of all Course contract instances.
     */
    function getAllCourses() external view returns (Course[] memory) {
        return allCourses;
    }

    /**
     * @dev Get a batch of courses in the marketplace.
     * @param start Starting index.
     * @param end Ending index.
     * @return Array of Course contract instances.
     */
    function getCourses(uint256 start, uint256 end) external view returns (Course[] memory) {
        require(start < end, "Start must be less than end");
        require(end <= allCourses.length, "End index out of bounds");

        uint256 size = end - start;
        Course[] memory courses = new Course[](size);
        for (uint256 i = 0; i < size; i++) {
            courses[i] = allCourses[start + i];
        }
        return courses;
    }

    /**
     * @dev Fallback function to accept ETH without data. Emits a Received event.
     */
    receive() external payable {
        emit Received(msg.sender, msg.value);
    }

    /**
     * @dev Fallback function to accept ETH with data or when no other function matches.
     *      Emits a FallbackCalled event.
     */
    fallback() external payable {
        emit FallbackCalled(msg.sender, msg.value, msg.data);
    }
}
