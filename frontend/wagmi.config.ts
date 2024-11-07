import { defineConfig } from '@wagmi/cli'
import ADDRESS_JSON from "../ignition/deployments/chain-31337/deployed_addresses.json";
import ABI from "../ignition/deployments/chain-31337/artifacts/CourseMarketplace#CourseMarketplace.json";
const ADDRESS = ADDRESS_JSON["CourseMarketplace#CourseMarketplace"];

export default defineConfig({
  out: 'src/wagmiGenerated.ts',
  contracts: [
    {
      name: "CourseMarketplace",
      address: ADDRESS as `0x${string}`,
      abi: ABI as any
    }
  ],
  plugins: [],
});
