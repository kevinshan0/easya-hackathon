require("dotenv").config();
const { ethers } = require("ethers");
// Use global fetch (Node.js v18+)

// 1. Connect to Westend Asset Hub (use your RPC endpoint)
const provider = new ethers.providers.JsonRpcProvider(
  "https://westend-asset-hub-eth-rpc.polkadot.io"
);

// 2. Use your wallet's private key from environment variable (keep this safe!)
// Create a .env file with PRIVATE_KEY=your_private_key and do NOT commit it.
const privateKey = process.env.PRIVATE_KEY;
if (!privateKey) {
  throw new Error("PRIVATE_KEY not set in environment variables");
}
const wallet = new ethers.Wallet(privateKey, provider);

// 3. Contract ABI and address
const abi = [
  "function addEntry(bytes32,bytes32,uint32,uint128,bytes32) public",
  "function getEntriesCount() public view returns (uint)",
];
const contractAddress = "0xa0c289571683a8C17ACb5F0312d84084c43b30BD";
const contract = new ethers.Contract(contractAddress, abi, wallet);

// 4. Helper to convert string to bytes32
function toBytes32(str) {
  if (!str || typeof str !== "string") {
    return ethers.utils.formatBytes32String("");
  }
  return ethers.utils.formatBytes32String(str.slice(0, 31)); // bytes32 max length is 32 bytes (including null terminator)
}

// 5. Fetch your API data (example)
async function fetchYieldData() {
  const res = await fetch("https://yields.llama.fi/pools");
  const data = await res.json();
  // Whitelist of Polkadot parachains and ecosystem chains
  const whitelist = [
    "Acala",
    "Moonbeam",
    "Astar",
    "Parallel Finance",
    "Centrifuge",
    "Phala Network",
    "Interlay",
    "Bifrost",
    "Bifrost Network",
    "HydraDX",
    "Equilibrium",
    "Karura",
    "Moonriver",
    "Kusama",
    "Polkadot",
    "Manta",
  ];
  // Filter for only whitelisted chains
  const filtered = data.data.filter((pool) => whitelist.includes(pool.chain));
  // Sort by TVL descending
  const sorted = [...filtered].sort(
    (a, b) => (b.tvlUsd || 0) - (a.tvlUsd || 0)
  );
  const n = sorted.length;
  const lowCut = Math.floor(n / 3);
  const midCut = Math.floor((2 * n) / 3);
  // Assign risk based on TVL quantiles
  const mapped = sorted.map((pool, idx) => {
    let risk = "mid";
    if (idx < lowCut) risk = "low";
    else if (idx < midCut) risk = "mid";
    else risk = "high";
    return {
      chain: pool.chain,
      project: pool.project,
      apy: pool.apy,
      tvlUsd: pool.tvlUsd,
      rewardTokens: pool.rewardTokens,
      risk,
    };
  });
  return mapped;
}

// 6. Push data to contract
async function updateContract() {
  const entries = await fetchYieldData();
  for (const entry of entries) {
    const chain = toBytes32(entry.chain);
    const project = toBytes32(entry.project);
    const apy = Math.floor(entry.apy * 100); // e.g., 12.34% => 1234
    const tvlUsd = Math.floor(entry.tvlUsd);
    const risk = toBytes32(entry.risk);

    const tx = await contract.addEntry(chain, project, apy, tvlUsd, risk);
    await tx.wait();
    console.log(`Added entry: ${entry.chain} - ${entry.project}`);
  }
}

// Run the updater once
updateContract().catch(console.error);
