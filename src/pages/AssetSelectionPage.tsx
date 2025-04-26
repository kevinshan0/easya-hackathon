
import React from "react";
import { useNavigate } from "react-router-dom";
import { useWallet } from "@/context/WalletContext";
import { useYield, AssetType } from "@/context/YieldContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ArrowRight } from "lucide-react";

const assetData = [
  {
    id: "DOT" as AssetType,
    name: "Polkadot",
    symbol: "DOT",
    image: "https://cryptologos.cc/logos/polkadot-new-dot-logo.png",
    description: "The native token of the Polkadot network",
  },
  {
    id: "USDC" as AssetType,
    name: "USD Coin",
    symbol: "USDC",
    image: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png",
    description: "A fully collateralized US dollar stablecoin",
  },
  {
    id: "KSM" as AssetType,
    name: "Kusama",
    symbol: "KSM",
    image: "https://cryptologos.cc/logos/kusama-ksm-logo.png",
    description: "Polkadot's canary network token",
  },
];

export default function AssetSelectionPage() {
  const navigate = useNavigate();
  const { walletConnected } = useWallet();
  const { selectedAssets, toggleAssetSelection, calculateBestProtocols } = useYield();

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

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center mb-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/")}
          className="mr-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-bold text-polkadot-dark">Select Assets to Optimize</h1>
      </div>

      <Card className="mb-8 shadow-md border-none">
        <CardHeader className="pb-3">
          <CardTitle>Choose Your Assets</CardTitle>
          <CardDescription>
            Select which assets you want to find the best yield opportunities for
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {assetData.map((asset) => (
              <AssetCard
                key={asset.id}
                asset={asset}
                isSelected={selectedAssets.includes(asset.id)}
                onToggle={() => toggleAssetSelection(asset.id)}
              />
            ))}
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
    id: AssetType;
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
          <div className="w-6 h-6 flex items-center justify-center">
            {asset.symbol}
          </div>
        </div>
        <div>
          <h3 className="font-medium">{asset.name}</h3>
          <p className="text-sm text-gray-500">{asset.symbol}</p>
        </div>
      </div>
      <p className="text-sm text-gray-600 mb-3">{asset.description}</p>
      <div className={`h-1 w-full rounded-full ${
        isSelected ? "bg-polkadot-primary" : "bg-gray-200"
      }`}></div>
    </div>
  );
}
