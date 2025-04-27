# Polkadot Yield Optimizer with AI Strategy

## 🚀 Demo Video


> _Click the [this link](https://youtu.be/XjpFgmt4qbY) to watch the demo video._

---

## 🖼️ Screenshots

| Asset Selection                                | Results Page                       | AI Strategy Page                          |
| ---------------------------------------------- | ---------------------------------- | ----------------------------------------- |
| [Asset Selection](https://imgur.com/a/JhyxU1B) | [Results](https://imgur.com/a/uEF0Hp5) | [AI Results](https://imgur.com/a/onuM26I) |

---

## 📝 Project Description

**Polkadot Yield Optimizer with AI Strategy** offers an AI-powered yield optimizer to help Polkadot users find top DeFi opportunities and personalized strategies with cross-chain intelligence.

- **Audience:** Polkadot DeFi users seeking the best yield opportunities.
- **Problem Solved:** Cuts through information overload and risk confusion by surfacing the best protocols and providing actionable, AI-generated strategies.
- **Secret Sauce:** Combines real-time cross-chain data with OpenAI-powered DeFi advice, tailored to the user's asset selection.

---

## 🛠️ How the Smart Contract Works

This project includes a custom smart contract deployed on the Polkadot Asset Hub (EVM-compatible parachain on Polkadot). The contract is called **YIELDRATES** and is responsible for storing and managing yield rate entries for different chains.

- **Contract Name:** YIELDRATES
- **Contract Address:** `0xa0c289571683a8C17ACb5F0312d84084c43b30BD`
- **Network/Chain:** Polkadot Asset Hub (Westend)
- **Block Explorer Link:** [View the deployed contract on Asset Hub](https://assethub-westend.subscan.io/account/0xa0c289571683a8C17ACb5F0312d84084c43b30BD)

### Main Functions

- `addEntry(bytes32 chain, bytes32 data)`: Add a new yield rate entry for a specific chain.
- `updateEntry(uint256 index, bytes32 data)`: Update an existing yield rate entry by index.
- `entries(uint256 index)`: View a specific entry by index.
- `getEntriesCount()`: Get the total number of entries.
- `getEntry(uint256 index)`: Retrieve a specific entry's details.
- `owner()`: Returns the owner of the contract.

The contract interacts with the frontend to allow users to view and update yield rate data in a decentralized and transparent manner.

---

## 🗂️ Repository Structure & Walkthrough

[![Watch the repo walkthrough](screenshots/walkthrough-thumbnail.png)](YOUR_WALKTHROUGH_VIDEO_LINK_HERE)

> _Click the image above or [this link](https://youtu.be/mQCXE43CIow) to watch the full repo walkthrough and project explanation._

- **/src/pages/**: Main React pages (Landing, Asset Selection, Results, AI Results)
- **/src/context/**: React Contexts for wallet and yield data
- **/src/components/**: UI components (cards, buttons, dialogs, etc.)
- **/backend/**: Node.js/Express backend for AI integration and protocol aggregation
- **/public/screenshots/**: UI screenshots for documentation

---

## 🧑‍💻 How to Run Locally

```bash
git clone https://github.com/mrsinani/easya-hackathon.git
cd easya-hackathon
npm install
npm run dev:all
# For backend (AI): cd backend && npm install && npm start
```

- Connect your Polkadot wallet (e.g., Polkadot.js extension)
- Select assets, view results, and get your AI-powered strategy!

---

## 📦 Tech Stack

- React, TypeScript, Tailwind CSS
- Node.js/Express backend
- OpenAI GPT-4o for AI strategy
- Polkadot.js wallet integration
- Data from Llama.fi and Polkadot parachains

---

## 📬 Contact

For questions or support, open an issue or contact [YOUR_EMAIL_HERE].

---
