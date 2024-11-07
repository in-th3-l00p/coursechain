import { defineConfig } from '@wagmi/cli'
import { react } from "@wagmi/cli/plugins";

import ADDRESS_JSON from "../ignition/deployments/chain-31337/deployed_addresses.json";
import coursesMarketplaceAbi from "./src/abi/coursesMarketplaceAbi";
const coursesMarketplaceAddress = ADDRESS_JSON["CourseMarketplace#CourseMarketplace"];

export default defineConfig({
  out: 'src/wagmiGenerated.ts',
  contracts: [
    {
      name: "CoursesMarketplace",
      address: coursesMarketplaceAddress as `0x${string}`,
      abi: coursesMarketplaceAbi
    }
  ],
  plugins: [
    react()
  ],
});
