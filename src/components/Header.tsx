import React from "react";
import { useWallet } from "@/context/WalletContext";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";

export function Header() {
  const { walletConnected, walletAddress, disconnectWallet } = useWallet();
  const navigate = useNavigate();

  const handleTitleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    disconnectWallet();
    navigate("/");
  };

  return (
    <header className="bg-polkadot-dark py-4 px-6 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="h-10 flex items-center">
              <img
                src="\lovable-uploads\polkadot.png"
                alt="Polkadot Logo"
                className="h-10 w-auto group-hover:opacity-80 transition-opacity"
              />
            </div>
            <h1
              className="text-2xl font-bold text-white group-hover:text-polkadot-primary transition-colors cursor-pointer"
              onClick={handleTitleClick}
            >
              Yield Compass
            </h1>
          </Link>
        </div>

        {walletConnected && walletAddress && (
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-300">
              <span className="text-white">Connected:</span>{" "}
              {walletAddress.substring(0, 6)}...
              {walletAddress.substring(walletAddress.length - 4)}
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
