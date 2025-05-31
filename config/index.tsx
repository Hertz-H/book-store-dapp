import { cookieStorage, createStorage, http } from "@wagmi/core";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { mainnet, sepolia, scrollSepolia } from "@reown/appkit/networks";

// Get projectId from https://cloud.reown.com
export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;
if (!projectId) {
  throw new Error("Project ID is not defined");
}

// Define Scroll Sepolia testnet
// const scrollSepolia = {
//   id: 534351,
//   name: "Scroll Sepolia",
//   network: "scroll-sepolia",
//   nativeCurrency: {
//     decimals: 18,
//     name: "Ether",
//     symbol: "ETH",
//   },
//   rpcUrls: {
//     public: { http: ["https://sepolia-rpc.scroll.io"] },
//     default: { http: ["https://sepolia-rpc.scroll.io"] },
//   },
//   blockExplorers: {
//     default: { name: "Scrollscan", url: "https://sepolia.scrollscan.com" },
//   },
//   testnet: true,
// };
// // const scrollSepolia = {
// //   id: 534351,
// //   name: "Scroll Sepolia",
// //   network: "scroll-sepolia",
// //   nativeCurrency: {
// //     decimals: 18,
// //     name: "Ether",
// //     symbol: "ETH",
// //   },
// //   rpcUrls: {
// //     public: { http: ["https://sepolia-rpc.scroll.io"] },
// //     default: { http: ["https://sepolia-rpc.scroll.io"] },
// //   },
// //   blockExplorers: {
// //     etherscan: { name: "Scrollscan", url: "https://sepolia.scrollscan.com" },
// //     default: { name: "Scrollscan", url: "https://sepolia.scrollscan.com" },
// //   },
// //   contracts: {
// //     multicall3: {
// //       address: "0xcA11bde05977b3631167028862bE2a173976CA11",
// //       blockCreated: 9473,
// //     },
// //   },
// //   testnet: true,
// // };
// // Explicitly define transports for each chain
// const transports = {
//   [mainnet.id]: http(),
//   [sepolia.id]: http(),
//   [scrollSepolia.id]: http("https://sepolia-rpc.scroll.io/"), // Explicit RPC
// };
// Add Scroll Sepolia network configuration
// const scrollSepolia = {
//   id: 534351, // Chain ID for Scroll Sepolia
//   name: "Scroll Sepolia",
//   network: "scroll-sepolia",
//   nativeCurrency: {
//     decimals: 18,
//     name: "Ether",
//     symbol: "ETH",
//   },
//   rpcUrls: {
//     default: { http: ["https://sepolia-rpc.scroll.io"] },
//     public: { http: ["https://sepolia-rpc.scroll.io"] },
//   },
//   blockExplorers: {
//     default: { name: "Scrollscan", url: "https://sepolia.scrollscan.com" },
//   },
//   contracts: {
//     multicall3: {
//       address: "0xcA11bde05977b3631167028862bE2a173976CA11",
//       blockCreated: 9473,
//     },
//   },
//   testnet: true,
// };

// Include Scroll Sepolia in the networks array
export const networks = [mainnet, sepolia, scrollSepolia];
// export const networks = [mainnet, sepolia, scrollSepolia];

//Set up the Wagmi Adapter (Config)
export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage,
  }),
  ssr: true,
  projectId,
  networks,
});

export const config = wagmiAdapter.wagmiConfig;
