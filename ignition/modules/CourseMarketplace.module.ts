import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { ethers } from "hardhat";

const LOCALHOST_PRIVATE_KEY = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
const INITIAL_PRICE = ethers.parseEther("0.1");

export default buildModule("CourseMarketplace", (m) => {
    const owner = m.getAccount(0);
    const courseMarketplace = m.contract(
        "CourseMarketplace", 
        [m.getParameter("_owner", owner), m.getParameter("_initialPrice", INITIAL_PRICE)], 
        { from: owner, }
    );

    m.call(courseMarketplace, "setPrice", [
        m.getParameter("newPrice", ethers.parseEther("0.004"))
    ]);

    return { courseMarketplace };
});