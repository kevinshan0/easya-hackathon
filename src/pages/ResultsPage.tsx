import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useWallet } from "@/context/WalletContext";
import { useYield } from "@/context/YieldContext";
import { useYieldEntries } from "@/hooks/useYieldContract";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Bot } from "lucide-react";

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

export default function ResultsPage() {
  const navigate = useNavigate();
  const { walletConnected } = useWallet();
  const { selectedAssets, bestProtocols } = useYield();
  const { entries: onChainProtocols, loading } = useYieldEntries();

  React.useEffect(() => {
    if (!walletConnected) {
      navigate("/");
    } else if (selectedAssets.length === 0) {
      navigate("/select-assets");
    }
  }, [walletConnected, selectedAssets, navigate]);

  // Filter protocols by whitelist and selected assets
  const filteredProtocols = onChainProtocols.filter(
    (protocol) =>
      whitelist.includes(protocol.chain) &&
      selectedAssets.includes(protocol.chain)
  );

  // Sort by APY descending
  const sortedProtocols = [...filteredProtocols].sort(
    (a, b) => (b.apy || 0) - (a.apy || 0)
  );

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
        <h1 className="text-2xl font-bold text-polkadot-dark">
          Best Yield Opportunities
        </h1>
      </div>

      <div className="grid grid-cols-1 gap-8 mb-8">
        {loading ? (
          <div>Loading on-chain data...</div>
        ) : (
          sortedProtocols.map((protocol, idx) => (
            <ProtocolCard
              key={protocol.chain + protocol.project + idx}
              asset={protocol.chain}
              protocol={protocol}
              best={idx === 0}
            />
          ))
        )}
      </div>

      <Card className="mb-8 border-polkadot-primary/20 bg-polkadot-light/50 shadow-md">
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <div className="flex items-center text-polkadot-dark">
            <div className="mr-2 p-2 rounded-full bg-polkadot-primary/10 flex items-center justify-center">
              <div className="w-5 h-5 text-polkadot-primary flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
            </div>
            AI Strategy Suggestion
          </div>
          <Button
            asChild
            variant="outline"
            className="ml-auto border-polkadot-primary text-polkadot-primary hover:bg-polkadot-light self-center"
            style={{ alignSelf: "center" }}
          >
            <Link to="/ai-results">Analyze with AI</Link>
          </Button>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700">
            Get a personalized strategy suggestion by analyzing your results
            with AI.
          </p>
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
          onClick={() =>
            window.open("https://app.acala.network/swap", "_blank")
          }
          className="bg-polkadot-primary hover:bg-polkadot-secondary text-white"
        >
          Invest
        </Button>
      </div>
    </div>
  );
}

interface ProtocolCardProps {
  asset: string;
  protocol: {
    chain: string;
    project: string;
    apy: number;
    tvlUsd: number;
    risk: string;
    score?: number;
    rewardTokens?: string[];
  } | null;
  best?: boolean;
}

function ProtocolCard({ asset, protocol, best }: ProtocolCardProps) {
  if (!protocol) return null;
  const meta = assetMeta[asset] || {
    name: asset,
    symbol: asset,
    image:
      "https://via.placeholder.com/40?text=" + encodeURIComponent(asset[0]),
    description: "No description available.",
  };
  // Risk color mapping
  const riskColors: Record<string, string> = {
    low: "bg-green-500",
    mid: "bg-yellow-500",
    high: "bg-red-500",
  };
  const riskColor = riskColors[protocol.risk] || "bg-gray-400";

  return (
    <Card className="overflow-hidden border-none shadow-lg">
      <div className={`h-2 w-full ${riskColor}`}></div>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white mr-3 bg-gray-200 overflow-hidden">
              <span className="text-lg font-bold text-polkadot-primary">
                {meta.name.charAt(0)}
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-500">{meta.name}</p>
              <h2 className="text-xl font-bold">{protocol.project}</h2>
            </div>
          </div>
          {best && (
            <div className="bg-polkadot-light px-3 py-1 rounded-full text-polkadot-primary font-medium">
              Best Choice
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <MetricCard
            label="APY"
            value={`${protocol.apy.toFixed(2)}%`}
            description="Annual yield"
            highlight
          />
          <MetricCard
            label="TVL"
            value={`$${protocol.tvlUsd.toLocaleString(undefined, {
              maximumFractionDigits: 0,
            })}`}
            description="Total value locked"
          />
          <MetricCard
            label="Risk"
            value={
              protocol.risk.charAt(0).toUpperCase() + protocol.risk.slice(1)
            }
            description="Risk assessment"
            customBadge={
              <div
                className={`h-2 w-16 rounded-full bg-gray-200 overflow-hidden`}
              >
                <div
                  className={`h-full ${riskColor}`}
                  style={{
                    width:
                      protocol.risk === "low"
                        ? "33%"
                        : protocol.risk === "mid"
                        ? "66%"
                        : "100%",
                  }}
                ></div>
              </div>
            }
          />
          <MetricCard
            label="Score"
            value={protocol.score?.toFixed(1) ?? "-"}
            description="Protocol score"
          />
        </div>
        <div className="flex justify-between items-center pt-2 border-t border-gray-100">
          <div className="text-sm text-gray-500">
            Project:{" "}
            <span className="font-medium text-polkadot-dark">
              {protocol.project}
            </span>
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

function MetricCard({
  label,
  value,
  description,
  highlight,
  customBadge,
}: MetricCardProps) {
  return (
    <div
      className={`p-3 rounded-lg ${
        highlight ? "bg-polkadot-light" : "bg-gray-50"
      }`}
    >
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <div className="flex justify-between items-center">
        <div
          className={`font-bold text-xl ${
            highlight ? "text-polkadot-primary" : "text-gray-800"
          }`}
        >
          {value}
        </div>
        {customBadge}
      </div>
      <p className="text-xs text-gray-500 mt-1">{description}</p>
    </div>
  );
}
