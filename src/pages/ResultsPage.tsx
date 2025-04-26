
import React from "react";
import { useNavigate } from "react-router-dom";
import { useWallet } from "@/context/WalletContext";
import { useYield, AssetType } from "@/context/YieldContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

export default function ResultsPage() {
  const navigate = useNavigate();
  const { walletConnected } = useWallet();
  const { selectedAssets, bestProtocols, aiSuggestion } = useYield();

  React.useEffect(() => {
    if (!walletConnected) {
      navigate("/");
    } else if (selectedAssets.length === 0) {
      navigate("/select-assets");
    }
  }, [walletConnected, selectedAssets, navigate]);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center mb-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/select-assets")}
          className="mr-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Selection
        </Button>
        <h1 className="text-2xl font-bold text-polkadot-dark">Best Yield Opportunities</h1>
      </div>

      <div className="grid grid-cols-1 gap-8 mb-8">
        {selectedAssets.map((asset) => (
          <ProtocolCard 
            key={asset}
            asset={asset}
            protocol={bestProtocols[asset]}
          />
        ))}
      </div>

      <Card className="mb-8 border-polkadot-primary/20 bg-polkadot-light/50 shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center text-polkadot-dark">
            <div className="mr-2 p-2 rounded-full bg-polkadot-primary/10">
              <div className="w-5 h-5 text-polkadot-primary">AI</div>
            </div>
            AI Strategy Suggestion
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700">{aiSuggestion}</p>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={() => navigate("/select-assets")}
          className="border-polkadot-primary text-polkadot-primary hover:bg-polkadot-light"
        >
          Optimize Different Assets
        </Button>
        <Button 
          onClick={() => window.open("https://app.acala.network/swap", "_blank")}
          className="bg-polkadot-primary hover:bg-polkadot-secondary text-white"
        >
          Take Action Now
        </Button>
      </div>
    </div>
  );
}

interface ProtocolCardProps {
  asset: AssetType;
  protocol: {
    name: string;
    apy: number;
    fee: number;
    lockup: number;
    risk: number;
    score?: number;
  } | null;
}

function ProtocolCard({ asset, protocol }: ProtocolCardProps) {
  if (!protocol) return null;

  const assetInfo = {
    "DOT": { name: "Polkadot", color: "bg-polkadot-primary" },
    "USDC": { name: "USD Coin", color: "bg-blue-500" },
    "KSM": { name: "Kusama", color: "bg-purple-500" },
  };

  const info = assetInfo[asset];
  
  const riskLevels = [
    { level: 1, label: "Very Low", color: "bg-green-500" },
    { level: 2, label: "Low", color: "bg-blue-500" },
    { level: 3, label: "Medium", color: "bg-yellow-500" },
    { level: 4, label: "High", color: "bg-orange-500" },
    { level: 5, label: "Very High", color: "bg-red-500" },
  ];

  const riskInfo = riskLevels.find(r => r.level === protocol.risk) || riskLevels[2];

  return (
    <Card className="overflow-hidden border-none shadow-lg">
      <div className={`h-2 w-full ${info.color}`}></div>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white mr-3 ${info.color}`}>
              {asset}
            </div>
            <div>
              <p className="text-sm text-gray-500">{info.name}</p>
              <h2 className="text-xl font-bold">{protocol.name}</h2>
            </div>
          </div>
          <div className="bg-polkadot-light px-3 py-1 rounded-full text-polkadot-primary font-medium">
            Best Choice
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <MetricCard 
            label="APY"
            value={`${protocol.apy}%`}
            description="Annual yield"
            highlight
          />
          <MetricCard 
            label="Fee"
            value={`${protocol.fee * 100}%`}
            description="Transaction fee"
          />
          <MetricCard 
            label="Lockup"
            value={protocol.lockup === 0 ? "None" : `${protocol.lockup} days`}
            description="Withdrawal period"
          />
          <MetricCard 
            label="Risk"
            value={riskInfo.label}
            description="Risk assessment"
            customBadge={
              <div className={`h-2 w-16 rounded-full bg-gray-200 overflow-hidden`}>
                <div className={`h-full ${riskInfo.color}`} style={{ width: `${protocol.risk * 20}%` }}></div>
              </div>
            }
          />
        </div>
        <div className="flex justify-between items-center pt-2 border-t border-gray-100">
          <div className="text-sm text-gray-500">
            Protocol Score: <span className="font-medium text-polkadot-dark">{protocol.score?.toFixed(1)}</span>
          </div>
          <Button 
            variant="link"
            className="text-polkadot-primary p-0"
            onClick={() => window.open("https://polkadot.network/", "_blank")}
          >
            Learn More
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

interface MetricCardProps {
  label: string;
  value: string;
  description: string;
  highlight?: boolean;
  customBadge?: React.ReactNode;
}

function MetricCard({ label, value, description, highlight, customBadge }: MetricCardProps) {
  return (
    <div className={`p-3 rounded-lg ${highlight ? 'bg-polkadot-light' : 'bg-gray-50'}`}>
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <div className="flex justify-between items-center">
        <div className={`font-bold text-xl ${highlight ? 'text-polkadot-primary' : 'text-gray-800'}`}>
          {value}
        </div>
        {customBadge}
      </div>
      <p className="text-xs text-gray-500 mt-1">{description}</p>
    </div>
  );
}
