import React from "react";
import { useWallet } from "@/context/WalletContext";
import { Button } from "@/components/ui/button";

export function Header() {
  const { walletConnected, walletAddress, disconnectWallet } = useWallet();

  return (
    <header className="bg-polkadot-dark py-4 px-6 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="h-10 flex items-center">
            <img 
              src="\lovable-uploads\polkadot.png" 
              alt="Polkadot Logo" 
              className="h-10 w-auto"
            />
          </div>
          <h1 className="text-2xl font-bold text-white">Yield Compass</h1>
        </div>
        
        {walletConnected && walletAddress && (
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-300">
              <span className="text-white">Connected:</span>{" "}
              {walletAddress.substring(0, 6)}...{walletAddress.substring(walletAddress.length - 4)}
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={disconnectWallet}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Disconnect
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
