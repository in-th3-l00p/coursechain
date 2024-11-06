// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Importing the Course contract
import "./Course.sol";

// Import OpenZeppelin Contracts
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title CourseMarketplace
 * @dev A marketplace for purchasing courses. Each purchase deploys a new Course contract.
 */
contract CourseMarketplace is Ownable, ReentrancyGuard {
    using EnumerableSet for EnumerableSet.AddressSet;

    // Constants
    string private constant UNAUTHORIZED = "You are not authorized to perform this action";

    // Events
    event CoursePurchased(
        address indexed buyer,
        address courseAddress,
        string title,
        uint256 timestamp
    );
    event PriceUpdated(uint256 newPrice);
    event AdminAdded(address indexed admin);
    event AdminRemoved(address indexed admin);
    
    // New Events for ETH Reception
    event Received(address indexed sender, uint256 amount);
    event FallbackCalled(address indexed sender, uint256 amount, bytes data);

    uint256 private price; // Price in wei
    EnumerableSet.AddressSet private admins;
    mapping(address => Course[]) private userCourses;
    Course[] private allCourses;

    /**
     * @dev Modifier to restrict functions to admins or the owner.
     */
    modifier onlyAdmin() {
        require(
            admins.contains(msg.sender) || 
            owner() == msg.sender, OwnableUnauthorizedAccount(msg.sender)
        );
        _;
    }

    /**
     * @dev Constructor sets the initial price.
     * @param _owner Address of the owner.
     * @param _initialPrice Initial price of a course in wei.
     */
    constructor(address _owner, uint256 _initialPrice) Ownable(_owner) {
        require(_initialPrice > 0, "Initial price must be greater than zero");
        price = _initialPrice;
    }

    /**
     * @dev Add a new admin. Only the owner can add admins.
     * @param newAdmin Address to be granted admin privileges.
     */
    function addAdmin(address newAdmin) external onlyOwner {
        require(newAdmin != address(0), "Invalid address");
        bool added = admins.add(newAdmin);
        require(added, "Address is already an admin");
        emit AdminAdded(newAdmin);
    }

    /**
     * @dev Remove an admin. Only the owner can remove admins.
     * @param admin Address to have admin privileges revoked.
     */
    function removeAdmin(address admin) external onlyOwner {
        bool removed = admins.remove(admin);
        require(removed, "Address is not an admin");
        emit AdminRemoved(admin);
    }

    /**
     * @dev Check if an address is an admin.
     * @param account Address to check.
     * @return True if the address is an admin, false otherwise.
     */
    function isAdmin(address account) external view returns (bool) {
        return admins.contains(account);
    }

    /**
     * @dev Get all admin addresses.
     * @return Array of admin addresses.
     */
    function getAdmins() external view returns (address[] memory) {
        uint256 length = admins.length();
        address[] memory adminList = new address[](length);
        for (uint256 i = 0; i < length; i++) {
            adminList[i] = admins.at(i);
        }
        return adminList;
    }

    /**
     * @dev Get the current price of a course.
     * @return Current price in wei.
     */
    function getPrice() external view returns (uint256) {
        return price;
    }

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
     * @dev Purchase a course by sending the required ETH. Deploys a new Course contract.
     * @param _title Title of the course.
     */
    function purchaseCourse(string memory _title) external payable nonReentrant {
        require(msg.value >= price, "Insufficient ETH sent for course purchase");

        // Effects: Update state before external interactions
        Course newCourse = new Course(msg.sender, _title);
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
     * @dev Withdraw accumulated ETH from the marketplace to the owner's address.
     */
    function withdrawFunds() external onlyOwner nonReentrant {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");

        (bool success, ) = owner().call{value: balance}("");
        require(success, "Withdrawal failed");
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
