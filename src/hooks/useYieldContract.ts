import { useEffect, useState } from "react";
import { ethers } from "ethers";

const CONTRACT_ADDRESS = "0xa0c289571683a8C17ACb5F0312d84084c43b30BD";
const ABI = [
  "function getEntriesCount() public view returns (uint)",
  "function entries(uint) public view returns (bytes32,bytes32,uint32,uint128,bytes32)",
];

const RPC_URL = "https://westend-asset-hub-eth-rpc.polkadot.io";

function parseBytes32(str: string) {
  try {
    return ethers.utils.parseBytes32String(str);
  } catch {
    return "";
  }
}

export interface YieldEntry {
  chain: string;
  project: string;
  apy: number;
  tvlUsd: number;
  risk: string;
}

export function useYieldEntries() {
  const [entries, setEntries] = useState<YieldEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEntries() {
      setLoading(true);
      const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);
      const count: number = (await contract.getEntriesCount()).toNumber();
      const fetched: YieldEntry[] = [];
      for (let i = 0; i < count; i++) {
        const entry = await contract.entries(i);
        fetched.push({
          chain: parseBytes32(entry[0]),
          project: parseBytes32(entry[1]),
          apy: Number(entry[2]) / 100, // stored as integer, e.g., 1234 => 12.34%
          tvlUsd: Number(entry[3]),
          risk: parseBytes32(entry[4]),
        });
      }
      setEntries(fetched);
      setLoading(false);
    }
    fetchEntries();
  }, []);

  return { entries, loading };
}
