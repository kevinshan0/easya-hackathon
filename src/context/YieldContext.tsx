import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo,
} from "react";
import { useProtocols } from "@/hooks/useProtocols";

export interface Protocol {
  chain: string;
  project: string;
  apy: number;
  tvlUsd: number;
  rewardTokens?: string[];
  risk: string; // "low" | "mid" | "high"
  score?: number;
}

export interface YieldContextType {
  selectedAssets: string[];
  toggleAssetSelection: (asset: string) => void;
  protocols: Record<string, Protocol[]>;
  bestProtocols: Record<string, Protocol | null>;
  calculateBestProtocols: () => void;
  aiSuggestion: string;
  resetSelections: () => void;
  isLoading: boolean;
  error: string | null;
  assetList: string[];
}

const aiSuggestions: Record<string, string> = {
  Polkadot:
    "Consider staking DOT directly on Moonbeam for steady, low-risk yield with no lockup period. Great for beginners.",
  Moonbeam:
    "Moonbeam offers a variety of DeFi protocols. Consider the highest APY with low risk.",
  Acala: "Acala pools can offer competitive yields, but check risk and lockup.",
  // Add more or make this dynamic as needed
};

const YieldContext = createContext<YieldContextType | undefined>(undefined);

export function YieldProvider({ children }: { children: ReactNode }) {
  const [selectedAssets, setSelectedAssets] = useState<string[]>([]);
  const [bestProtocols, setBestProtocols] = useState<
    Record<string, Protocol | null>
  >({});
  const [aiSuggestion, setAiSuggestion] = useState<string>("");

  const { data, isLoading, error } = useProtocols();

  // Group protocols by asset/chain
  const protocols: Record<string, Protocol[]> = useMemo(() => {
    if (!data?.data) return {};
    const grouped: Record<string, Protocol[]> = {};
    data.data.forEach((protocol: Protocol) => {
      const asset = protocol.chain;
      if (!grouped[asset]) grouped[asset] = [];
      grouped[asset].push(protocol);
    });
    return grouped;
  }, [data]);

  // Asset list derived from protocol data
  const assetList = useMemo(() => Object.keys(protocols), [protocols]);

  // Toggle asset selection
  const toggleAssetSelection = (asset: string) => {
    setSelectedAssets((prev) =>
      prev.includes(asset) ? prev.filter((a) => a !== asset) : [...prev, asset]
    );
  };

  // Calculate the best protocol for each selected asset
  const calculateBestProtocols = () => {
    const best: Record<string, Protocol | null> = {};
    selectedAssets.forEach((asset) => {
      const assetProtocols = [...(protocols[asset] || [])];
      assetProtocols.forEach((protocol) => {
        // Score: higher APY, higher TVL, lower risk (low=3, mid=2, high=1)
        const apyScore = (protocol.apy || 0) * 10;
        const tvlScore = (protocol.tvlUsd || 0) / 1000000; // scale TVL
        const riskScore =
          protocol.risk === "low" ? 3 : protocol.risk === "mid" ? 2 : 1;
        protocol.score = apyScore + tvlScore + riskScore * 10;
      });
      assetProtocols.sort((a, b) => (b.score || 0) - (a.score || 0));
      best[asset] = assetProtocols[0] || null;
    });
    setBestProtocols(best);
    // AI suggestion (simple): use first selected asset's suggestion or generic
    const key = selectedAssets[0];
    setAiSuggestion(
      aiSuggestions[key] ||
        "Consider diversifying your assets across multiple protocols to balance risk and yield."
    );
  };

  // Reset selections
  const resetSelections = () => {
    setSelectedAssets([]);
    setBestProtocols({});
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
        isLoading,
        error: error ? (error as Error).message : null,
        assetList,
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
