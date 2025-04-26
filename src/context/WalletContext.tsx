import React, { createContext, useContext, useState, ReactNode } from "react";
// import { useToast } from "@/hooks/use-toast";

interface WalletContextType {
  walletConnected: boolean;
  walletAddress: string | null;
  connectWallet: () => void;
  disconnectWallet: () => void;
  isPolkadotExtensionAvailable: boolean;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isPolkadotExtensionAvailable, setIsPolkadotExtensionAvailable] = useState(false);
  // const { toast } = useToast();

  // Check if Polkadot extension is available on mount
  React.useEffect(() => {
    const checkExtension = () => {
      // For demo purposes, always set to true so we can proceed with the demo
      // In production, we would check for actual extension availability
      setIsPolkadotExtensionAvailable(true);
      
      // Logging for debugging
      console.log("Extension detection set to true for demo purposes");
    };
    
    checkExtension();
  }, []);

  const connectWallet = async () => {
    try {
      // In a real app, we'd use the Polkadot.js API to connect
      // For demo purposes, we'll simulate a connection with a mock address
      setTimeout(() => {
        const mockAddress = "15oF4uVJwmo4TdGW7VfQxNLavjCXviqxT9S1MgbjMNHr6Sp5";
        setWalletAddress(mockAddress);
        setWalletConnected(true);
        // toast({
        //   title: "Wallet Connected",
        //   description: `Connected to ${mockAddress.substring(0, 6)}...${mockAddress.substring(mockAddress.length - 4)}`,
        // });
      }, 1000);
    } catch (error) {
      console.error("Error connecting wallet:", error);
      // toast({
      //   title: "Connection Failed",
      //   description: "Could not connect to your wallet",
      //   variant: "destructive",
      // });
    }
  };

  const disconnectWallet = () => {
    setWalletAddress(null);
    setWalletConnected(false);
    // toast({
    //   title: "Wallet Disconnected",
    //   description: "Your wallet has been disconnected",
    // });
  };

  return (
    <WalletContext.Provider
      value={{
        walletConnected,
        walletAddress,
        connectWallet,
        disconnectWallet,
        isPolkadotExtensionAvailable,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
}
