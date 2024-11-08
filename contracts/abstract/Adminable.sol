// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

abstract contract Adminable is Ownable {
    using EnumerableSet for EnumerableSet.AddressSet;

    EnumerableSet.AddressSet private admins;

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

    // events
    event AdminAdded(address indexed admin);
    event AdminRemoved(address indexed admin);

    // methods
    constructor(address _owner) Ownable(_owner) {
        
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

}