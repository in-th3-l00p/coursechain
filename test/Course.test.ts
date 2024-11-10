import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre from "hardhat";

describe("Course", function () {
  const INITIAL_TITLE = "Initial Course Title";
  const INITIAL_SLUG = "initial-course-title";
  const INITIAL_DESCRIPTION = "Initial Course Description";
  const INITIAL_CATEGORY = "Initial Course Category";
  const INITIAL_PRICE = hre.ethers.parseEther("0.01");

  async function deployCourseFixture() {
    const [owner, otherAccount] = await hre.ethers.getSigners();
    const Course = await hre.ethers.getContractFactory("Course");
    const course = await Course.deploy(
      owner.address, 
      INITIAL_TITLE,
      INITIAL_SLUG,
      INITIAL_DESCRIPTION,
      INITIAL_CATEGORY,
      INITIAL_PRICE
    );

    return { course, owner, otherAccount };
  }

  it("revert on direct ETH transfers", async function () {
    const { course, otherAccount } = await loadFixture(deployCourseFixture);

    await expect(
      otherAccount.sendTransaction({ 
        to: await course.getAddress(), 
        value: 1 
      })
    ).to.be.revertedWith("Direct ETH transfers not allowed");
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

  it("set the initial slug correctly", async function () {
    const { course } = await loadFixture(deployCourseFixture);

    expect(await course.slug()).to.equal(INITIAL_SLUG);
  });

  it("update the slug when called by the owner", async function () {
    const { course, owner } = await loadFixture(deployCourseFixture);

    const newSlug = "Updated Course slug";
    await expect(course.connect(owner).setSlug(newSlug))
      .to.emit(course, "SlugUpdated")
      .withArgs(INITIAL_SLUG, newSlug);

    expect(await course.slug()).to.equal(newSlug);
  });

  it("revert if non-owner tries to update the slug", async function () {
    const { course, otherAccount } = await loadFixture(deployCourseFixture);

    await expect(
      course.connect(otherAccount).setSlug("Unauthorized slug")
    ).to.be.revertedWithCustomError(course, "OwnableUnauthorizedAccount");
  });

  it("set the initial description correctly", async function () {
    const { course } = await loadFixture(deployCourseFixture);

    expect(await course.description()).to.equal(INITIAL_DESCRIPTION);
  });

  it("update the description when called by the owner", async function () {
    const { course, owner } = await loadFixture(deployCourseFixture);

    const newDescription = "Updated Course Description";
    await expect(course.connect(owner).setDescription(newDescription))
      .to.emit(course, "DescriptionUpdated")
      .withArgs(INITIAL_DESCRIPTION, newDescription);

    expect(await course.description()).to.equal(newDescription);
  });

  it("revert if non-owner tries to update the description", async function () {
    const { course, otherAccount } = await loadFixture(deployCourseFixture);

    await expect(
      course.connect(otherAccount).setDescription("Unauthorized Description")
    ).to.be.revertedWithCustomError(course, "OwnableUnauthorizedAccount");
  });

  it("set the initial category correctly", async function () {
    const { course } = await loadFixture(deployCourseFixture);

    expect(await course.category()).to.equal(INITIAL_CATEGORY);
  });

  it("update the category when called by the owner", async function () {
    const { course, owner } = await loadFixture(deployCourseFixture);

    const newCategory = "Updated Course Category";
    await expect(course.connect(owner).setCategory(newCategory))
      .to.emit(course, "CategoryUpdated")
      .withArgs(INITIAL_CATEGORY, newCategory);

    expect(await course.category()).to.equal(newCategory);
  });

  it("revert if non-owner tries to update the category", async function () {
    const { course, otherAccount } = await loadFixture(deployCourseFixture);

    await expect(
      course.connect(otherAccount).setCategory("Unauthorized Category")
    ).to.be.revertedWithCustomError(course, "OwnableUnauthorizedAccount");
  });

  it("set the initial price correctly", async function () {
    const { course } = await loadFixture(deployCourseFixture);

    expect(await course.price()).to.equal(INITIAL_PRICE);
  });

  it("update the price when called by the owner", async function () {
    const { course, owner } = await loadFixture(deployCourseFixture);

    const newPrice = hre.ethers.parseEther("0.02");
    await expect(course.connect(owner).setPrice(newPrice))
      .to.emit(course, "PriceUpdated")
      .withArgs(INITIAL_PRICE, newPrice);

    expect(await course.price()).to.equal(newPrice);
  });

  it("revert if non-owner tries to update the price", async function () {
    const { course, otherAccount } = await loadFixture(deployCourseFixture);

    await expect(
      course.connect(otherAccount).setPrice(hre.ethers.parseEther("0.02"))
    ).to.be.revertedWithCustomError(course, "OwnableUnauthorizedAccount");
  });

  it("returns the correct course data using the get function", async function () {
    const { course } = await loadFixture(deployCourseFixture);
  
    const courseData = await course.get();
  
    expect(courseData.title).to.equal(INITIAL_TITLE);
    expect(courseData.slug).to.equal(INITIAL_SLUG);
    expect(courseData.description).to.equal(INITIAL_DESCRIPTION);
    expect(courseData.category).to.equal(INITIAL_CATEGORY);
    expect(courseData.price).to.equal(INITIAL_PRICE);
  });
});
