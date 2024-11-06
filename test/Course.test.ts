// test/Course.test.ts
import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract, Signer } from "ethers";
import { Course__factory, Course } from "../typechain";

describe("Course Contract", function () {
  let course: Course;
  let CourseFactory: Course__factory;
  let owner: Signer;
  let addr1: Signer;
  let addr2: Signer;
  let addr3: Signer;

  beforeEach(async function () {
    // Get the ContractFactory and Signers here.
    CourseFactory = await ethers.getContractFactory("Course");
    [owner, addr1, addr2, addr3] = await ethers.getSigners();

    // Deploy a new Course contract for each test
    course = await CourseFactory.deploy(
      await owner.getAddress(),
      "Solidity Basics",
      "An introductory course on Solidity programming."
    );
    await course.deployed();
  });

  describe("Deployment", function () {
    it("Should set the correct owner", async function () {
      expect(await course.owner()).to.equal(await owner.getAddress());
    });

    it("Should set the correct title", async function () {
      expect(await course.getTitle()).to.equal("Solidity Basics");
    });

    it("Should set the correct description", async function () {
      expect(await course.getDescription()).to.equal("An introductory course on Solidity programming.");
    });
  });

  describe("Ownership", function () {
    it("Should transfer ownership to a new owner", async function () {
      await expect(course.transferCourseOwnership(await addr1.getAddress()))
        .to.emit(course, "OwnershipTransferred")
        .withArgs(await owner.getAddress(), await addr1.getAddress());
      expect(await course.owner()).to.equal(await addr1.getAddress());
    });

    it("Should revert if non-owner tries to transfer ownership", async function () {
      await expect(
        course.connect(addr1).transferCourseOwnership(await addr2.getAddress())
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should prevent transferring ownership to the zero address", async function () {
      await expect(
        course.transferCourseOwnership(ethers.constants.AddressZero)
      ).to.be.revertedWith("New owner is the zero address");
    });
  });

  describe("Metadata Management", function () {
    it("Should allow the owner to update the title", async function () {
      await expect(course.updateTitle("Advanced Solidity"))
        .to.emit(course, "TitleUpdated")
        .withArgs("Solidity Basics", "Advanced Solidity");
      expect(await course.getTitle()).to.equal("Advanced Solidity");
    });

    it("Should prevent non-owner from updating the title", async function () {
      await expect(
        course.connect(addr1).updateTitle("Advanced Solidity")
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should prevent updating the title to an empty string", async function () {
      await expect(
        course.updateTitle("")
      ).to.be.revertedWith("Title cannot be empty");
    });

    it("Should allow the owner to update the description", async function () {
      await expect(course.updateDescription("A deep dive into Solidity."))
        .to.emit(course, "DescriptionUpdated")
        .withArgs("An introductory course on Solidity programming.", "A deep dive into Solidity.");
      expect(await course.getDescription()).to.equal("A deep dive into Solidity.");
    });

    it("Should prevent non-owner from updating the description", async function () {
      await expect(
        course.connect(addr1).updateDescription("A deep dive into Solidity.")
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should prevent updating the description to an empty string", async function () {
      await expect(
        course.updateDescription("")
      ).to.be.revertedWith("Description cannot be empty");
    });
  });

  describe("ETH Transfers", function () {
    it("Should reject direct ETH transfers to the contract", async function () {
      await expect(
        owner.sendTransaction({
          to: course.address,
          value: ethers.utils.parseEther("1.0"),
        })
      ).to.be.revertedWith("Direct ETH transfers not allowed");
    });

    it("Should reject fallback calls with data and ETH", async function () {
      await expect(
        owner.sendTransaction({
          to: course.address,
          value: ethers.utils.parseEther("0.5"),
          data: "0x12345678", // Random data
        })
      ).to.be.revertedWith("Direct ETH transfers not allowed");
    });

    it("Should reject fallback calls with data but without ETH", async function () {
      await expect(
        owner.sendTransaction({
          to: course.address,
          data: "0xabcdef", // Random data
        })
      ).to.be.revertedWith("Direct ETH transfers not allowed");
    });
  });
});
