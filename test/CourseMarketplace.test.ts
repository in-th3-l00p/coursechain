import { expect } from "chai";
import hre from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { any } from "hardhat/internal/core/params/argumentTypes";

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

    expect(await marketplace.getPrice()).to.equal(INITIAL_PRICE);
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

    expect(await marketplace.getPrice()).to.equal(newPrice);
  });

  it("revert if a non-admin tries to update the price", async function () {
    const { marketplace, otherAccount } = await loadFixture(deployMarketplaceFixture);
    const newPrice = hre.ethers.parseEther("0.2");

    await expect(
      marketplace.connect(otherAccount).setPrice(newPrice)
    ).to.be.revertedWith("You are not authorized to perform this action");
  });

  it("allow a user to purchase a course", async function () {
    const { marketplace, buyer } = await loadFixture(deployMarketplaceFixture);
    const title = "Blockchain 101";

    await expect(marketplace.connect(buyer).purchaseCourse(title, { value: INITIAL_PRICE }))
      .to.emit(marketplace, "CoursePurchased");
  });

  it("revert if insufficient ETH is sent during course purchase", async function () {
    const { marketplace, buyer } = await loadFixture(deployMarketplaceFixture);
    const title = "Blockchain 101";
    const insufficientAmount = hre.ethers.parseEther("0.05");

    await expect(
      marketplace.connect(buyer).purchaseCourse(title, { value: insufficientAmount })
    ).to.be.revertedWith("Insufficient ETH sent for course purchase");
  });

  it("refund excess ETH if more than the price is sent", async function () {
    const { marketplace, buyer } = await loadFixture(deployMarketplaceFixture);
    const title = "Blockchain 101";
    const excessAmount = hre.ethers.parseEther("0.15");

    const initialBalance = await hre.ethers.provider.getBalance(buyer.address);
    const tx = await marketplace.connect(buyer).purchaseCourse(title, { value: excessAmount });
    const receipt = await tx.wait();
    const gasUsed = (receipt?.gasUsed || 0n) * (receipt?.gasPrice || 0n);
    const finalBalance = await hre.ethers.provider.getBalance(buyer.address);

    expect(finalBalance + gasUsed).to.equal(initialBalance - INITIAL_PRICE);
  });

  it("only allow the owner to withdraw funds", async function () {
    const { marketplace, owner, buyer, otherAccount } = await loadFixture(deployMarketplaceFixture);

    await marketplace
      .connect(buyer)
      .purchaseCourse("Blockchain 101", { value: INITIAL_PRICE });
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
});
