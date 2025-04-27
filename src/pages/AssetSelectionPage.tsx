import React from "react";
import { useNavigate } from "react-router-dom";
import { useWallet } from "@/context/WalletContext";
import { useYield } from "@/context/YieldContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

// Fallback asset metadata for known assets
const assetMeta: Record<
  string,
  { name: string; symbol: string; image: string; description: string }
> = {
  Polkadot: {
    name: "Polkadot",
    symbol: "DOT",
    image: "https://cryptologos.cc/logos/polkadot-new-dot-logo.png",
    description: "The native token of the Polkadot network",
  },
  Moonbeam: {
    name: "Moonbeam",
    symbol: "GLMR",
    image: "https://cryptologos.cc/logos/moonbeam-glmr-logo.png",
    description: "Moonbeam is a smart contract platform on Polkadot.",
  },
  Acala: {
    name: "Acala",
    symbol: "ACA",
    image: "https://cryptologos.cc/logos/acala-aca-logo.png",
    description: "Acala is a DeFi platform and liquidity hub of Polkadot.",
  },
};

export default function AssetSelectionPage() {
  const navigate = useNavigate();
  const { walletConnected } = useWallet();
  const {
    selectedAssets,
    toggleAssetSelection,
    calculateBestProtocols,
    assetList,
    isLoading,
  } = useYield();

  React.useEffect(() => {
    if (!walletConnected) {
      navigate("/");
    }
  }, [walletConnected, navigate]);

  const handleOptimize = () => {
    if (selectedAssets.length === 0) return;
    calculateBestProtocols();
    navigate("/results");
  };

  if (isLoading) {
    return <div className="text-center py-12">Loading assets...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto">

      <Card className="mb-8 shadow-md border-none">
        <CardHeader className="pb-3">
          <CardTitle>Choose Your Assets</CardTitle>
          <CardDescription>
            Select which assets you want to find the best yield opportunities
            for
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {assetList.map((asset) => {
              const meta = assetMeta[asset] || {
                name: asset,
                symbol: asset,
                image:
                  "https://via.placeholder.com/40?text=" +
                  encodeURIComponent(asset[0]),
                description: "No description available.",
              };
              return (
                <AssetCard
                  key={asset}
                  asset={{
                    id: asset,
                    ...meta,
                  }}
                  isSelected={selectedAssets.includes(asset)}
                  onToggle={() => toggleAssetSelection(asset)}
                />
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button
          onClick={handleOptimize}
          disabled={selectedAssets.length === 0}
          className="bg-polkadot-primary hover:bg-polkadot-secondary text-white"
          size="lg"
        >
          Find Best Yields
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

interface AssetCardProps {
  asset: {
    id: string;
    name: string;
    symbol: string;
    image: string;
    description: string;
  };
  isSelected: boolean;
  onToggle: () => void;
}

function AssetCard({ asset, isSelected, onToggle }: AssetCardProps) {
  return (
    <div
      className={`border rounded-xl p-4 cursor-pointer transition-all ${
        isSelected
          ? "bg-polkadot-light border-polkadot-primary shadow-md"
          : "bg-white border-gray-100 hover:border-polkadot-primary/50"
      }`}
      onClick={onToggle}
    >
      <div className="flex items-center space-x-3 mb-2">
        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
          <span className="text-lg font-bold text-polkadot-primary">
            {asset.name.charAt(0)}
          </span>
        </div>
        <div>
          <h3 className="font-medium">{asset.name}</h3>
          <p className="text-sm text-gray-500">{asset.symbol}</p>
        </div>
      </div>
      <div
        className={`h-1 w-full rounded-full ${
          isSelected ? "bg-polkadot-primary" : "bg-gray-200"
        }`}
      ></div>
    </div>
  );
}
