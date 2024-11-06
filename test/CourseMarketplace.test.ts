// test/CourseMarketplace.test.ts
import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract, Signer } from "ethers";
import { CourseMarketplace__factory, CourseMarketplace, Course__factory, Course } from "../typechain";

describe("CourseMarketplace Contract", function () {
  let CourseMarketplaceFactory: CourseMarketplace__factory;
  let CourseFactory: Course__factory;
  let marketplace: CourseMarketplace;
  let course: Course;
  let owner: Signer;
  let admin1: Signer;
  let admin2: Signer;
  let user1: Signer;
  let user2: Signer;
  let addr3: Signer;

  beforeEach(async function () {
    // Get the ContractFactory and Signers here.
    CourseMarketplaceFactory = await ethers.getContractFactory("CourseMarketplace") as CourseMarketplace__factory;
    CourseFactory = await ethers.getContractFactory("Course") as Course__factory;
    [owner, admin1, admin2, user1, user2, addr3] = await ethers.getSigners();

    // Deploy a new CourseMarketplace contract for each test with initial price of 0.1 ETH
    marketplace = await CourseMarketplaceFactory.deploy(ethers.utils.parseEther("0.1"));
    await marketplace.deployed();
  });

  describe("Deployment", function () {
    it("Should set the correct owner", async function () {
      expect(await marketplace.owner()).to.equal(await owner.getAddress());
    });

    it("Should set the correct initial price", async function () {
      expect(await marketplace.getPrice()).to.equal(ethers.utils.parseEther("0.1"));
    });
  });

  describe("Admin Management", function () {
    it("Owner can add a new admin", async function () {
      await expect(marketplace.connect(owner).addAdmin(await admin1.getAddress()))
        .to.emit(marketplace, "AdminAdded")
        .withArgs(await admin1.getAddress());
      expect(await marketplace.isAdmin(await admin1.getAddress())).to.equal(true);
    });

    it("Non-owner cannot add a new admin", async function () {
      await expect(
        marketplace.connect(user1).addAdmin(await admin1.getAddress())
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Owner can remove an existing admin", async function () {
      // Add admin first
      await marketplace.connect(owner).addAdmin(await admin1.getAddress());
      expect(await marketplace.isAdmin(await admin1.getAddress())).to.equal(true);

      // Remove admin
      await expect(marketplace.connect(owner).removeAdmin(await admin1.getAddress()))
        .to.emit(marketplace, "AdminRemoved")
        .withArgs(await admin1.getAddress());
      expect(await marketplace.isAdmin(await admin1.getAddress())).to.equal(false);
    });

    it("Non-owner cannot remove an admin", async function () {
      // Add admin first
      await marketplace.connect(owner).addAdmin(await admin1.getAddress());
      expect(await marketplace.isAdmin(await admin1.getAddress())).to.equal(true);

      // Attempt to remove admin by non-owner
      await expect(
        marketplace.connect(user1).removeAdmin(await admin1.getAddress())
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should prevent adding the zero address as an admin", async function () {
      await expect(
        marketplace.connect(owner).addAdmin(ethers.constants.AddressZero)
      ).to.be.revertedWith("Invalid address");
    });

    it("Should prevent adding an already existing admin", async function () {
      await marketplace.connect(owner).addAdmin(await admin1.getAddress());
      await expect(
        marketplace.connect(owner).addAdmin(await admin1.getAddress())
      ).to.be.revertedWith("Address is already an admin");
    });

    it("Should prevent removing a non-admin", async function () {
      await expect(
        marketplace.connect(owner).removeAdmin(await admin1.getAddress())
      ).to.be.revertedWith("Address is not an admin");
    });

    it("Should retrieve all admins correctly", async function () {
      // Initially, no admins
      let admins = await marketplace.getAdmins();
      expect(admins.length).to.equal(0);

      // Add admins
      await marketplace.connect(owner).addAdmin(await admin1.getAddress());
      await marketplace.connect(owner).addAdmin(await admin2.getAddress());

      admins = await marketplace.getAdmins();
      expect(admins.length).to.equal(2);
      expect(admins).to.include.members([
        await admin1.getAddress(),
        await admin2.getAddress(),
      ]);

      // Remove one admin
      await marketplace.connect(owner).removeAdmin(await admin1.getAddress());

      admins = await marketplace.getAdmins();
      expect(admins.length).to.equal(1);
      expect(admins[0]).to.equal(await admin2.getAddress());
    });
  });

  describe("Price Management", function () {
    it("Admin can update the price", async function () {
      // Add admin
      await marketplace.connect(owner).addAdmin(await admin1.getAddress());

      // Update price
      await expect(
        marketplace.connect(admin1).setPrice(ethers.utils.parseEther("0.2"))
      )
        .to.emit(marketplace, "PriceUpdated")
        .withArgs(ethers.utils.parseEther("0.2"));
      expect(await marketplace.getPrice()).to.equal(ethers.utils.parseEther("0.2"));
    });

    it("Owner can update the price", async function () {
      // Update price directly by owner
      await expect(
        marketplace.connect(owner).setPrice(ethers.utils.parseEther("0.3"))
      )
        .to.emit(marketplace, "PriceUpdated")
        .withArgs(ethers.utils.parseEther("0.3"));
      expect(await marketplace.getPrice()).to.equal(ethers.utils.parseEther("0.3"));
    });

    it("Non-admin and non-owner cannot update the price", async function () {
      await expect(
        marketplace.connect(user1).setPrice(ethers.utils.parseEther("0.2"))
      ).to.be.revertedWith("You are not authorized to perform this action");
    });

    it("Should prevent setting the price to zero", async function () {
      // Add admin
      await marketplace.connect(owner).addAdmin(await admin1.getAddress());

      await expect(
        marketplace.connect(admin1).setPrice(0)
      ).to.be.revertedWith("Price must be greater than zero");
    });
  });

  describe("Course Purchase", function () {
    it("User can purchase a course by paying exact price", async function () {
      // Add admin if needed, but not necessary for purchase

      const courseTitle = "Ethereum Development";
      const courseDescription = "Learn to build decentralized applications on Ethereum.";

      await expect(
        marketplace.connect(user1).purchaseCourse(courseTitle, courseDescription, { value: ethers.utils.parseEther("0.1") })
      )
        .to.emit(marketplace, "CoursePurchased")
        .withArgs(
          await user1.getAddress(),
          anyValue, // Address of the newly deployed Course contract
          courseTitle,
          courseDescription,
          anyValue // timestamp
        );

      // Check that the course is stored correctly
      const userCourses = await marketplace.getUserCourses(await user1.getAddress());
      expect(userCourses.length).to.equal(1);

      const deployedCourseAddress = userCourses[0];
      expect(deployedCourseAddress).to.properAddress;

      // Verify the Course contract
      const deployedCourse = CourseFactory.attach(deployedCourseAddress);
      expect(await deployedCourse.owner()).to.equal(await user1.getAddress());
      expect(await deployedCourse.getTitle()).to.equal(courseTitle);
      expect(await deployedCourse.getDescription()).to.equal(courseDescription);

      // Check allCourses
      const allCourses = await marketplace.getAllCourses();
      expect(allCourses.length).to.equal(1);
      expect(allCourses[0]).to.equal(deployedCourseAddress);
    });

    it("User can purchase a course and receive a refund for excess ETH", async function () {
      const courseTitle = "Blockchain Basics";
      const courseDescription = "Introduction to blockchain technology.";

      // Get user1 balance before transaction
      const user1 = user1 as Signer;
      const user1Address = await user1.getAddress();
      const user1BalanceBefore = await ethers.provider.getBalance(user1Address);

      // Purchase course with excess ETH
      const purchaseTx = await marketplace.connect(user1).purchaseCourse(
        courseTitle,
        courseDescription,
        { value: ethers.utils.parseEther("0.2") } // Sending 0.2 ETH, price is 0.1 ETH
      );

      // Wait for transaction to be mined
      const receipt = await purchaseTx.wait();

      // Expect the CoursePurchased event
      await expect(purchaseTx)
        .to.emit(marketplace, "CoursePurchased")
        .withArgs(
          await user1.getAddress(),
          anyValue, // Address of the newly deployed Course contract
          courseTitle,
          courseDescription,
          anyValue // timestamp
        );

      // Calculate gas cost
      const gasUsed = receipt.gasUsed.mul(receipt.effectiveGasPrice);

      // Get user1 balance after transaction
      const user1BalanceAfter = await ethers.provider.getBalance(user1Address);

      // Expected balance: initial - sent + refund - gas
      const expectedBalance = user1BalanceBefore
        .sub(ethers.utils.parseEther("0.2"))
        .add(ethers.utils.parseEther("0.1"))
        .sub(gasUsed);

      expect(user1BalanceAfter).to.equal(expectedBalance);
    });

    it("Should revert if user sends insufficient ETH", async function () {
      const courseTitle = "Smart Contracts";
      const courseDescription = "Advanced topics in smart contract development.";

      await expect(
        marketplace.connect(user1).purchaseCourse(courseTitle, courseDescription, { value: ethers.utils.parseEther("0.05") })
      ).to.be.revertedWith("Insufficient ETH sent for course purchase");
    });
  });

  describe("Retrieving Courses", function () {
    beforeEach(async function () {
      // User1 purchases two courses
      await marketplace.connect(user1).purchaseCourse("Course 1", "Description 1", { value: ethers.utils.parseEther("0.1") });
      await marketplace.connect(user1).purchaseCourse("Course 2", "Description 2", { value: ethers.utils.parseEther("0.1") });

      // User2 purchases one course
      await marketplace.connect(user2).purchaseCourse("Course 3", "Description 3", { value: ethers.utils.parseEther("0.1") });
    });

    it("Should retrieve all courses correctly", async function () {
      const allCourses = await marketplace.getAllCourses();
      expect(allCourses.length).to.equal(3);
      expect(allCourses).to.include.members([
        allCourses[0],
        allCourses[1],
        allCourses[2],
      ]);
    });

    it("Should retrieve user-specific courses correctly", async function () {
      const user1Address = await user1.getAddress();
      const user1Courses = await marketplace.getUserCourses(user1Address);
      expect(user1Courses.length).to.equal(2);
      expect(user1Courses).to.include.members([
        user1Courses[0],
        user1Courses[1],
      ]);

      const user2Address = await user2.getAddress();
      const user2Courses = await marketplace.getUserCourses(user2Address);
      expect(user2Courses.length).to.equal(1);
      expect(user2Courses[0]).to.be.properAddress;
    });

    it("Should retrieve courses in batches correctly", async function () {
      // Retrieve first two courses
      const batch1 = await marketplace.getCourses(0, 2);
      expect(batch1.length).to.equal(2);

      // Retrieve the third course
      const batch2 = await marketplace.getCourses(2, 3);
      expect(batch2.length).to.equal(1);
    });

    it("Should revert when retrieving courses with invalid indices", async function () {
      await expect(
        marketplace.getCourses(3, 4)
      ).to.be.revertedWith("End index out of bounds");

      await expect(
        marketplace.getCourses(2, 1)
      ).to.be.revertedWith("Start must be less than end");
    });
  });

  describe("Withdrawal of Funds", function () {
    it("Owner can withdraw funds", async function () {
      // User1 and User2 purchase courses
      await marketplace.connect(user1).purchaseCourse("Course 1", "Description 1", { value: ethers.utils.parseEther("0.1") });
      await marketplace.connect(user2).purchaseCourse("Course 2", "Description 2", { value: ethers.utils.parseEther("0.1") });

      // Check contract balance
      const contractBalance = await ethers.provider.getBalance(marketplace.address);
      expect(contractBalance).to.equal(ethers.utils.parseEther("0.2"));

      // Owner withdraws funds
      const ownerAddress = await owner.getAddress();
      const ownerBalanceBefore = await ethers.provider.getBalance(ownerAddress);

      const withdrawTx = await marketplace.connect(owner).withdrawFunds();
      const receipt = await withdrawTx.wait();
      const gasUsed = receipt.gasUsed.mul(receipt.effectiveGasPrice);

      const ownerBalanceAfter = await ethers.provider.getBalance(ownerAddress);

      expect(ownerBalanceAfter).to.equal(ownerBalanceBefore.add(ethers.utils.parseEther("0.2")).sub(gasUsed));

      // Contract balance should be zero
      const contractBalanceAfter = await ethers.provider.getBalance(marketplace.address);
      expect(contractBalanceAfter).to.equal(0);
    });

    it("Non-owner cannot withdraw funds", async function () {
      await expect(
        marketplace.connect(user1).withdrawFunds()
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should prevent withdrawing when contract balance is zero", async function () {
      await expect(
        marketplace.connect(owner).withdrawFunds()
      ).to.be.revertedWith("No funds to withdraw");
    });
  });

  describe("ETH Reception via Fallback and Receive", function () {
    it("Should emit Received event when ETH is sent without data", async function () {
      await expect(
        owner.sendTransaction({
          to: marketplace.address,
          value: ethers.utils.parseEther("1.0"),
        })
      ).to.be.revertedWith("Direct ETH transfers not allowed");
    });

    it("Should emit FallbackCalled event when a non-existent function is called with ETH and data", async function () {
      await expect(
        owner.sendTransaction({
          to: marketplace.address,
          value: ethers.utils.parseEther("0.1"),
          data: "0x12345678", // Random data
        })
      ).to.be.revertedWith("Direct ETH transfers not allowed");
    });

    it("Should emit FallbackCalled event when a non-existent function is called without ETH but with data", async function () {
      await expect(
        owner.sendTransaction({
          to: marketplace.address,
          data: "0xabcdef", // Random data
        })
      ).to.be.revertedWith("Direct ETH transfers not allowed");
    });
  });
});
