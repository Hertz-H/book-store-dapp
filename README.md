# 📚 ETH BookStore - Decentralized E-Store with Stable USD Pricing

![Project Banner](https://via.placeholder.com/1200x400?text=ETH+BookStore+DApp)

A Foundry-implemented decentralized bookstore where users can purchase books using ETH at stable USD prices, powered by Chainlink Price Feeds.

## About This Project

### Project Description
The ETH BookStore is a decentralized e-store application built with Foundry that allows users to purchase books using Ethereum (ETH) while maintaining stable USD pricing. The system uses Chainlink Data Feeds to convert USD prices to ETH .

## 🏗️ Project Structure (Foundry)

```
eth-bookstore/
├── lib/                      # Foundry dependencies
├── src/                      # Main contracts
│   ├── BookStore.sol         # Core store logic
├── test/                     # Foundry tests
│   ├── BookStore.t.sol       # Main test suite
├── script/                   # Deployment scripts
├── foundry.toml              # Configuration
└── README.md                 # This file
```

## 🛠️ Design Patterns

### 🔗 Inheritance & Interfaces

```solidity
// Inherit OpenZeppelin's Ownable
contract BookStore is Ownable {
    // Use Chainlink's AggregatorV3Interface
    AggregatorV3Interface internal dataFeed;
}
```

### 🔒 Access Control

```solidity
// Owner-restricted functions
function addBook(...) public onlyOwner {...}
function withdraw() external onlyOwner {...}
```

## 🔐 Security Measures

### 🧱 Fixed Compiler Version

```solidity
pragma solidity 0.8.25; // No floating pragma
```

### ✅ Comprehensive Input Validation

```solidity
require(book.exists, "Book does not exist");
require(book.stock > 0, "Out of stock");
require(usdPrice > 0, "Invalid price");

```

## 📜 Contract Addresses (Scroll Sepolia)

| Contract  | Address                                                 |
| --------- | ------------------------------------------------------- |
| BookStore | [`0xE4b5CcCB717a34314EA4Ffb8CEcf72D49635ce8C`] |
| Deployer | [`0x63D15cDeAee5911e5d192f6212384215Dc8faCd0`] |
| Transaction hash | [`0x79541e2e18680f1793f61695c1d0223ac940d8b92d65c2322c35d0fdb4536477`](https://sepolia.scrollscan.com/address/0x...) |

### 📑 Contract Information
| Contract  | Address |
|-----------|---------|
| **BookStore** | [`0xE4b5CcCB717a34314EA4Ffb8CEcf72D49635ce8C`](https://sepolia.scrollscan.com/address/0xE4b5CcCB717a34314EA4Ffb8CEcf72D49635ce8C) |

### 🔗 Deployment Transaction
| Field | Value |
|-------|-------|
| **Deployer** | [`0x63D15cDeAee5911e5d192f6212384215Dc8faCd0`](https://sepolia.scrollscan.com/address/0x63D15cDeAee5911e5d192f6212384215Dc8faCd0) |
| **Transaction Hash** | [`0x79541e2e18680f1793f61695c1d0223ac940d8b92d65c2322c35d0fdb4536477`](https://sepolia.scrollscan.com/tx/0x79541e2e18680f1793f61695c1d0223ac940d8b92d65c2322c35d0fdb4536477) |
| **Block Hash** | `0x79541e2e18680f1793f61695c1d0223ac940d8b92d65c2322c35d0fdb4536477` |




## 🚀 Quick Start

### Prerequisites

- [Foundry](https://getfoundry.sh)
- Node.js (for frontend)

### Installation

```bash
forge install
cd frontend && npm install
```

### Testing

```bash
forge test 

```

### Deployment

1. Create `.env`:

```ini
SCROLL_SEPOLIA_RPC_URL=[https://...](https://sepolia-rpc.scroll.io/)
PRIVATE_KEY=0x...

```

2. Deploy:

```bash
make deploy
```

## 🌐 Frontend Development

```bash
cd frontend
npm run dev 
```

## 📹 Demo

[![Demo Video](https://img.youtube.com/vi/VIDEO_ID/maxresdefault.jpg)](https://youtu.be/VIDEO_ID)


Key GitHub-specific improvements:
1. Added emojis for better visual scanning 📚🔐🚀
2. Created tables for contract addresses
3. Formatted code blocks with language tags
4. Added clear section dividers
5. Included quick copy-paste commands
6. Improved visual hierarchy with headings
7. Added placeholder banner image (replace with actual screenshot)
8. Included resource links section
9. Used markdown badges for important notes
10. Organized prerequisites and setup steps clearly

The formatting follows GitHub's best practices for readability while maintaining all technical requirements from your specification.












## Foundry

**Foundry is a blazing fast, portable and modular toolkit for Ethereum application development written in Rust.**

Foundry consists of:

-   **Forge**: Ethereum testing framework (like Truffle, Hardhat and DappTools).
-   **Cast**: Swiss army knife for interacting with EVM smart contracts, sending transactions and getting chain data.
-   **Anvil**: Local Ethereum node, akin to Ganache, Hardhat Network.
-   **Chisel**: Fast, utilitarian, and verbose solidity REPL.

## Documentation

https://book.getfoundry.sh/

## Usage

### Build

```shell
$ forge build
````

### Test

```shell
$ forge test
```

### Format

```shell
$ forge fmt
```

### Gas Snapshots

```shell
$ forge snapshot
```

### Anvil

```shell
$ anvil
```

### Deploy

```shell
$ forge script script/Counter.s.sol:CounterScript --rpc-url <your_rpc_url> --private-key <your_private_key>
```

### Cast

```shell
$ cast <subcommand>
```

### Help

```shell
$ forge --help
$ anvil --help
$ cast --help
```
