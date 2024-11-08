import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre from "hardhat";

describe("Course", function () {
  const INITIAL_TITLE = "Initial Course Title";

  async function deployCourseFixture() {
    const [owner, otherAccount] = await hre.ethers.getSigners();
    const Course = await hre.ethers.getContractFactory("Course");
    const course = await Course.deploy(owner.address, INITIAL_TITLE);

    return { course, owner, otherAccount };
  }

  it("set the initial title correctly", async function () {
    const { course } = await loadFixture(deployCourseFixture);

    expect(await course.title()).to.equal(INITIAL_TITLE);
  });

  it("update the title when called by the owner", async function () {
    const { course, owner } = await loadFixture(deployCourseFixture);

    const newTitle = "Updated Course Title";
    await expect(course.connect(owner).setTitle(newTitle))
      .to.emit(course, "TitleUpdated")
      .withArgs(INITIAL_TITLE, newTitle);

    expect(await course.title()).to.equal(newTitle);
  });

  it("revert if non-owner tries to update the title", async function () {
    const { course, otherAccount } = await loadFixture(deployCourseFixture);

    await expect(
      course.connect(otherAccount).setTitle("Unauthorized Title")
    ).to.be.revertedWithCustomError(course, "OwnableUnauthorizedAccount");
  });

  it("revert if title update is attempted with an empty title", async function () {
    const { course, owner } = await loadFixture(deployCourseFixture);

    await expect(course.connect(owner).setTitle("")).to.be.revertedWith(
      "Title cannot be empty"
    );
  });

  it("revert on direct ETH transfers", async function () {
    const { course, otherAccount } = await loadFixture(deployCourseFixture);

    await expect(
      otherAccount.sendTransaction({ 
        to: await course.getAddress(), 
        value: 1 
      })
    ).to.be.revertedWith("Direct ETH transfers not allowed");
  });

  it("revert on creating course with zero address as owner", async function () {
    const Course = await hre.ethers.getContractFactory("Course");
    await expect(
      Course.deploy(hre.ethers.ZeroAddress, INITIAL_TITLE)
    ).to.be.revertedWithCustomError(Course, "OwnableInvalidOwner");
  });

  it("keep the title unchanged if update fails", async function () {
    const { course, owner } = await loadFixture(deployCourseFixture);

    const newTitle = "New Title";
    await course.connect(owner).setTitle(newTitle);
    expect(await course.title()).to.equal(newTitle);

    // Attempt to set an empty title (this should revert)
    await expect(course.connect(owner).setTitle("")).to.be.revertedWith("Title cannot be empty");

    // Ensure the title is still the updated one
    expect(await course.title()).to.equal(newTitle);
  });

  it("revert when calling fallback function with value", async function () {
    const { course, otherAccount } = await loadFixture(deployCourseFixture);

    await expect(
      otherAccount.sendTransaction({
        to: await course.getAddress(),
        value: hre.ethers.parseEther("1"),
      })
    ).to.be.revertedWith("Direct ETH transfers not allowed");
  });
});
