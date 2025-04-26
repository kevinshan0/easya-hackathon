
import React from "react";
import { useNavigate } from "react-router-dom";
import { useWallet } from "@/context/WalletContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Star, Hexagon, Diamond } from "lucide-react";

export default function LandingPage() {
  const navigate = useNavigate();
  const { walletConnected, connectWallet, isPolkadotExtensionAvailable } = useWallet();

  React.useEffect(() => {
    if (walletConnected) {
      navigate("/select-assets");
    }
  }, [walletConnected, navigate]);

  return (
    <div className="relative min-h-[calc(100vh-theme(spacing.32))] flex flex-col items-center justify-center">
      {/* Background decorative elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-polkadot-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-polkadot-secondary/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>
      
      {/* Floating icons */}
      <div className="absolute inset-0 -z-5 overflow-hidden">
        <Hexagon className="absolute top-20 left-20 text-polkadot-primary/10 w-12 h-12 animate-bounce" />
        <Star className="absolute top-40 right-32 text-polkadot-secondary/10 w-8 h-8 animate-pulse" />
        <Diamond className="absolute bottom-32 left-1/3 text-polkadot-primary/10 w-10 h-10 animate-bounce delay-700" />
      </div>

      <div className="max-w-3xl mx-auto px-4 py-12 relative z-10">
        <div className="text-center mb-10 animate-fade-in">
          <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-polkadot-primary to-polkadot-secondary">
            Maximize Your Polkadot Yields
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Find the best yield farming opportunities for your DOT, USDC, and KSM assets
            with our AI-powered optimizer.
          </p>
        </div>

        <Card className="w-full mb-12 bg-white/90 backdrop-blur-sm border-none shadow-2xl hover:shadow-3xl transition-all duration-300">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center p-8 text-center">
              <Button 
                onClick={connectWallet}
                className="bg-gradient-to-r from-polkadot-primary to-polkadot-secondary hover:opacity-90 text-white font-medium px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                size="lg"
              >
                Connect Polkadot Wallet
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          <FeatureCard 
            title="Find Best Yields"
            description="Compare APYs, risks, and fees across different protocols"
            icon={<Star className="w-8 h-8 mb-4 text-polkadot-primary" />}
          />
          <FeatureCard 
            title="Smart Recommendations"
            description="Get AI-powered suggestions tailored to your assets"
            icon={<Diamond className="w-8 h-8 mb-4 text-polkadot-primary" />}
          />
          <FeatureCard 
            title="Risk Assessment"
            description="Understand the risk profile of each yield option"
            icon={<Hexagon className="w-8 h-8 mb-4 text-polkadot-primary" />}
          />
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ title, description, icon }: { title: string, description: string, icon: React.ReactNode }) {
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:translate-y-[-4px]">
      {icon}
      <h3 className="font-bold text-xl mb-3 text-polkadot-dark">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
