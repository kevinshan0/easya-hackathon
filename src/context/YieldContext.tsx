
import React, { createContext, useContext, useState, ReactNode } from "react";

// Define asset types and protocol data structure
export type AssetType = "DOT" | "USDC" | "KSM";

export interface Protocol {
  name: string;
  apy: number;
  fee: number;
  lockup: number; // in days
  risk: number; // 1-5 scale
  score?: number; // computed score
}

export interface YieldContextType {
  selectedAssets: AssetType[];
  toggleAssetSelection: (asset: AssetType) => void;
  protocols: Record<AssetType, Protocol[]>;
  bestProtocols: Record<AssetType, Protocol | null>;
  calculateBestProtocols: () => void;
  aiSuggestion: string;
  resetSelections: () => void;
}

// Mock protocol data
const protocolData: Record<AssetType, Protocol[]> = {
  DOT: [
    { name: "Moonbeam Stake", apy: 12, fee: 0.1, lockup: 0, risk: 1 },
    { name: "Acala Swap", apy: 8, fee: 0.05, lockup: 7, risk: 2 },
    { name: "Parallel Finance", apy: 15, fee: 0.2, lockup: 30, risk: 3 },
    { name: "Equilibrium", apy: 10, fee: 0.08, lockup: 14, risk: 2 },
  ],
  USDC: [
    { name: "Astar Lend", apy: 5, fee: 0.02, lockup: 0, risk: 1 },
    { name: "Liquid Pool", apy: 7, fee: 0.15, lockup: 30, risk: 3 },
    { name: "Moonbeam USDC", apy: 6.5, fee: 0.07, lockup: 7, risk: 2 },
    { name: "Acala Stablecoin", apy: 4.8, fee: 0.01, lockup: 0, risk: 1 },
  ],
  KSM: [
    { name: "Karura Yield", apy: 18, fee: 0.2, lockup: 30, risk: 4 },
    { name: "Shiden Stake", apy: 14, fee: 0.12, lockup: 7, risk: 3 },
    { name: "Moonriver Vault", apy: 16, fee: 0.15, lockup: 14, risk: 3 },
    { name: "KSM Liquid", apy: 10, fee: 0.05, lockup: 0, risk: 2 },
  ],
};

// AI suggestions based on selected assets
const aiSuggestions: Record<string, string> = {
  "DOT": "Consider staking DOT directly on Moonbeam for steady, low-risk yield with no lockup period. Great for beginners.",
  "USDC": "Astar Lend offers the best balance of yield and safety for your USDC with immediate withdrawal options.",
  "KSM": "For KSM, the higher APY on Karura comes with increased risk - consider splitting between Karura and a lower-risk option.",
  "DOT,USDC": "Split your portfolio with 70% DOT on Moonbeam for higher yield and 30% USDC on Astar for stability and liquidity.",
  "DOT,KSM": "Leverage the correlation between DOT and KSM by pairing Moonbeam staking with KSM Liquid for a balanced risk profile.",
  "USDC,KSM": "Balance the volatility of KSM with stable USDC positions. Consider Moonriver for KSM and Astar for USDC.",
  "DOT,USDC,KSM": "Diversify across all three assets: stake DOT on Moonbeam (50%), provide USDC on Astar (30%), and place KSM in KSM Liquid (20%) for an optimized risk-reward balance.",
};

const YieldContext = createContext<YieldContextType | undefined>(undefined);

export function YieldProvider({ children }: { children: ReactNode }) {
  const [selectedAssets, setSelectedAssets] = useState<AssetType[]>([]);
  const [protocols] = useState<Record<AssetType, Protocol[]>>(protocolData);
  const [bestProtocols, setBestProtocols] = useState<Record<AssetType, Protocol | null>>({
    DOT: null,
    USDC: null,
    KSM: null,
  });
  const [aiSuggestion, setAiSuggestion] = useState<string>("");

  // Toggle asset selection
  const toggleAssetSelection = (asset: AssetType) => {
    setSelectedAssets((prev) =>
      prev.includes(asset)
        ? prev.filter((a) => a !== asset)
        : [...prev, asset]
    );
  };

  // Calculate the best protocol for each selected asset
  const calculateBestProtocols = () => {
    const best: Record<AssetType, Protocol | null> = {
      DOT: null,
      USDC: null,
      KSM: null,
    };

    selectedAssets.forEach((asset) => {
      const assetProtocols = [...protocols[asset]];
      
      // Calculate a score for each protocol (simple algorithm)
      // Higher APY is better, lower fee is better, lower lockup is better, lower risk is better
      assetProtocols.forEach((protocol) => {
        const apyScore = protocol.apy * 10; // Weight APY heavily
        const feeScore = (1 - protocol.fee) * 5; // Lower fee is better
        const lockupScore = (30 - protocol.lockup) / 10; // Lower lockup is better
        const riskScore = (6 - protocol.risk) * 8; // Lower risk is better
        
        protocol.score = apyScore + feeScore + lockupScore + riskScore;
      });

      // Sort by score (highest first)
      assetProtocols.sort((a, b) => (b.score || 0) - (a.score || 0));
      best[asset] = assetProtocols[0] || null;
    });

    setBestProtocols(best);

    // Generate AI suggestion based on selected assets
    const key = selectedAssets.sort().join(",");
    setAiSuggestion(aiSuggestions[key] || "Consider diversifying your assets across multiple protocols to balance risk and yield.");
  };

  // Reset selections
  const resetSelections = () => {
    setSelectedAssets([]);
    setBestProtocols({
      DOT: null,
      USDC: null,
      KSM: null,
    });
    setAiSuggestion("");
  };

  return (
    <YieldContext.Provider
      value={{
        selectedAssets,
        toggleAssetSelection,
        protocols,
        bestProtocols,
        calculateBestProtocols,
        aiSuggestion,
        resetSelections,
      }}
    >
      {children}
    </YieldContext.Provider>
  );
}

export function useYield() {
  const context = useContext(YieldContext);
  if (context === undefined) {
    throw new Error("useYield must be used within a YieldProvider");
  }
  return context;
}
