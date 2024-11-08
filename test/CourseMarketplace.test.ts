import { expect } from "chai";
import hre from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";

describe("CourseMarketplace", function () {
  const INITIAL_PRICE = hre.ethers.parseEther("0.1");

  async function deployMarketplaceFixture() {
    const [owner, admin, buyer, otherAccount] = await hre.ethers.getSigners();
    const CourseMarketplace = await hre.ethers.getContractFactory("CourseMarketplace");
    const marketplace = await CourseMarketplace.deploy(owner.address, INITIAL_PRICE);

    return { marketplace, owner, admin, buyer, otherAccount };
  }

  it("set the initial price correctly", async function () {
    const { marketplace } = await loadFixture(deployMarketplaceFixture);

    expect(await marketplace.price()).to.equal(INITIAL_PRICE);
  });

  it("add and remove an admin", async function () {
    const { marketplace, owner, admin } = await loadFixture(deployMarketplaceFixture);

    await expect(marketplace.connect(owner).addAdmin(admin.address))
      .to.emit(marketplace, "AdminAdded")
      .withArgs(admin.address);

    expect(await marketplace.isAdmin(admin.address)).to.be.true;

    await expect(marketplace.connect(owner).removeAdmin(admin.address))
      .to.emit(marketplace, "AdminRemoved")
      .withArgs(admin.address);

    expect(await marketplace.isAdmin(admin.address)).to.be.false;
  });

  it("update the price when called by an admin", async function () {
    const { marketplace, owner, admin } = await loadFixture(deployMarketplaceFixture);

    await marketplace.connect(owner).addAdmin(admin.address);
    const newPrice = hre.ethers.parseEther("0.2");

    await expect(marketplace.connect(admin).setPrice(newPrice))
      .to.emit(marketplace, "PriceUpdated")
      .withArgs(newPrice);

    expect(await marketplace.price()).to.equal(newPrice);
  });

  it("revert if a non-admin tries to update the price", async function () {
    const { marketplace, otherAccount } = await loadFixture(deployMarketplaceFixture);
    const newPrice = hre.ethers.parseEther("0.2");

    await expect(
      marketplace.connect(otherAccount).setPrice(newPrice)
    ).to.be.revertedWithCustomError(marketplace, "OwnableUnauthorizedAccount");
  });

  it("allow a user to purchase a course", async function () {
    const { marketplace, buyer } = await loadFixture(deployMarketplaceFixture);
    const title = "Blockchain 101";
    const slug = "blockchain-101";
    const category = "Blockchain";
    const description = "Learn the basics of blockchain technology";
    const price = hre.ethers.parseEther("0.1");

    await expect(marketplace.connect(buyer).purchaseCourse(
      title, 
      slug,
      description,
      category,
      price,
      { value: INITIAL_PRICE }
    ))
      .to.emit(marketplace, "CoursePurchased");
  });

  it("revert if insufficient ETH is sent during course purchase", async function () {
    const { marketplace, buyer } = await loadFixture(deployMarketplaceFixture);
    const title = "Blockchain 101";
    const slug = "blockchain-101";
    const category = "Blockchain";
    const description = "Learn the basics of blockchain technology";
    const price = hre.ethers.parseEther("0.1");
    const insufficientAmount = hre.ethers.parseEther("0.05");

    await expect(
      marketplace.connect(buyer).purchaseCourse(
        title, 
        slug,
        description,
        category,
        price,
        { value: insufficientAmount }
      )
    ).to.be.revertedWith("Insufficient ETH sent for course purchase");
  });

  it("refund excess ETH if more than the price is sent", async function () {
    const { marketplace, buyer } = await loadFixture(deployMarketplaceFixture);
    const title = "Blockchain 101";
    const slug = "blockchain-101";
    const category = "Blockchain";
    const description = "Learn the basics of blockchain technology";
    const price = hre.ethers.parseEther("0.1");
    const excessAmount = hre.ethers.parseEther("0.15");

    const initialBalance = await hre.ethers.provider.getBalance(buyer.address);
    const tx = await marketplace.connect(buyer).purchaseCourse(
      title, 
      slug,
      description,
      category,
      price,
      { value: excessAmount }
    );
    const receipt = await tx.wait();
    const gasUsed = (receipt?.gasUsed || 0n) * (receipt?.gasPrice || 0n);
    const finalBalance = await hre.ethers.provider.getBalance(buyer.address);

    expect(finalBalance + gasUsed).to.equal(initialBalance - INITIAL_PRICE);
  });

  it("only allow the owner to withdraw funds", async function () {
    const { marketplace, owner, buyer, otherAccount } = await loadFixture(deployMarketplaceFixture);
    const title = "Blockchain 101";
    const slug = "blockchain-101";
    const category = "Blockchain";
    const description = "Learn the basics of blockchain technology";
    const price = hre.ethers.parseEther("0.1");
    const excessAmount = hre.ethers.parseEther("0.15");

    await marketplace
      .connect(buyer)
      .purchaseCourse(
        title,
        slug,
        description,
        category,
        price,
        { value: INITIAL_PRICE }
      );
    const balanceBefore = await hre.ethers.provider.getBalance(owner.address);

    await expect(marketplace.connect(owner)
      .withdrawFunds()
    )
      .to.changeEtherBalance(owner, INITIAL_PRICE);

    await expect(marketplace.connect(otherAccount).withdrawFunds())
      .to.be.revertedWithCustomError(marketplace, "OwnableUnauthorizedAccount")
  });

  it("handle direct ETH transfers via receive and fallback functions", async function () {
    const { marketplace, otherAccount } = await loadFixture(deployMarketplaceFixture);

    await expect(otherAccount.sendTransaction({ to: await marketplace.getAddress(), value: hre.ethers.parseEther("0.1") }))
      .to.emit(marketplace, "Received")
      .withArgs(otherAccount.address, hre.ethers.parseEther("0.1"));

    await expect(otherAccount.sendTransaction({
      to: await marketplace.getAddress(),
      value: hre.ethers.parseEther("0.1"),
      data: "0x1234"
    }))
      .to.emit(marketplace, "FallbackCalled")
      .withArgs(otherAccount.address, hre.ethers.parseEther("0.1"), "0x1234");
  });

  it("return the list of admins", async function () {
      const { marketplace, owner, admin } = await loadFixture(deployMarketplaceFixture);

      await marketplace.connect(owner).addAdmin(admin.address);
      const admins = await marketplace.getAdmins();

      expect(admins).to.include(admin.address);
    });

  it("return user courses", async function () {
    const { marketplace, buyer } = await loadFixture(deployMarketplaceFixture);
    const title = "Blockchain 101";
    const slug = "blockchain-101";
    const category = "Blockchain";
    const description = "Learn the basics of blockchain technology";
    const price = hre.ethers.parseEther("0.1");

    await marketplace.connect(buyer).purchaseCourse(
      title, 
      slug,
      description,
      category,
      price,
      { value: INITIAL_PRICE }
    );

    const userCourses = await marketplace.getUserCourses(buyer.address);
    expect(userCourses).to.have.lengthOf(1);
  });

  it("return all purchased courses", async function () {
    const { marketplace, buyer } = await loadFixture(deployMarketplaceFixture);
    const title1 = "Blockchain 101";
    const slug1 = "blockchain-101";
    const category1 = "Blockchain";
    const description1 = "Learn the basics of blockchain technology";
    const price1 = hre.ethers.parseEther("0.1");
    const title2 = "Ethereum Basics";
    const slug2 = "ethereum-basics";
    const category2 = "Ethereum";
    const description2 = "Learn the basics of Ethereum";
    const price2 = hre.ethers.parseEther("0.1");

    await marketplace.connect(buyer).purchaseCourse(
      title1, 
      slug1,
      description1,
      category1,
      price1,
      { value: INITIAL_PRICE }
    );
    await marketplace.connect(buyer).purchaseCourse(
      title2, 
      slug2,
      description2,
      category2,
      price2,
      { value: INITIAL_PRICE }
    );

    const allCourses = await marketplace.getAllCourses();
    expect(allCourses).to.have.lengthOf(2);
  });

  it("return a batch of courses", async function () {
    const { marketplace, buyer } = await loadFixture(deployMarketplaceFixture);
    const title1 = "Blockchain 101";
    const slug1 = "blockchain-101";
    const category1 = "Blockchain";
    const description1 = "Learn the basics of blockchain technology";
    const price1 = hre.ethers.parseEther("0.1");
    const title2 = "Ethereum Basics";
    const slug2 = "ethereum-basics";
    const category2 = "Ethereum";
    const description2 = "Learn the basics of Ethereum";
    const price2 = hre.ethers.parseEther("0.1");

    await marketplace.connect(buyer).purchaseCourse(
      title1, 
      slug1,
      description1,
      category1,
      price1,
      { value: INITIAL_PRICE }
    );
    await marketplace.connect(buyer).purchaseCourse(
      title2, 
      slug2,
      description2,
      category2,
      price2,
      { value: INITIAL_PRICE }
    );

    const coursesBatch = await marketplace.getCourses(0, 2);
    expect(coursesBatch).to.have.lengthOf(2);
  });

  it("revert when getting courses with invalid indices", async function () {
    const { marketplace } = await loadFixture(deployMarketplaceFixture);

    await expect(marketplace.getCourses(1, 0)).to.be.revertedWith("Start must be less than end");
    await expect(marketplace.getCourses(0, 3)).to.be.revertedWith("End index out of bounds");
  });

  it("revert when adding a duplicate admin", async function () {
    const { marketplace, owner, admin } = await loadFixture(deployMarketplaceFixture);

    await marketplace.connect(owner).addAdmin(admin.address);

    await expect(marketplace.connect(owner).addAdmin(admin.address))
      .to.be.revertedWith("Address is already an admin");
  });

  it("revert when removing a non-existent admin", async function () {
    const { marketplace, owner, admin } = await loadFixture(deployMarketplaceFixture);

    await expect(marketplace.connect(owner).removeAdmin(admin.address))
      .to.be.revertedWith("Address is not an admin");
  });

  it("enforce new price during course purchase", async function () {
    const { marketplace, owner, admin, buyer } = await loadFixture(deployMarketplaceFixture);
    const newPrice = hre.ethers.parseEther("0.2");
    const title = "Blockchain 101";
    const slug = "blockchain-101";
    const category = "Blockchain";
    const description = "Learn the basics of blockchain technology";
    const price = hre.ethers.parseEther("0.1");

    await marketplace.connect(owner).addAdmin(admin.address);
    await marketplace.connect(admin).setPrice(newPrice);

    await expect(marketplace.connect(buyer).purchaseCourse(
      title,
      slug,
      description,
      category,
      price,
      { value: INITIAL_PRICE }
    ))
      .to.be.revertedWith("Insufficient ETH sent for course purchase");
  });
});
