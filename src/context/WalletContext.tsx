import React, { createContext, useContext, ReactNode } from "react";
import usePolkadotWallet from "@/hooks/usePolkadotWallet";
// import { useToast } from "@/hooks/use-toast";

interface WalletContextType {
  walletConnected: boolean;
  walletAddress: string | null;
  connectWallet: () => void;
  disconnectWallet: () => void;
  isPolkadotExtensionAvailable: boolean;
  error: string | null;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const {
    connectWallet,
    disconnectWallet,
    address,
    isConnected,
    error,
    // accounts, // Not currently used in context
    // balances, // Not currently used in context
    // api,      // Not currently used in context
  } = usePolkadotWallet();

  // For now, retain the demo logic for extension availability
  // TODO: Potentially replace with real check if needed
  const [isPolkadotExtensionAvailable, setIsPolkadotExtensionAvailable] = React.useState(true);
  React.useEffect(() => {
      console.log("Extension detection set to true for demo/dev purposes");
      setIsPolkadotExtensionAvailable(true);
  }, []);

  return (
    <WalletContext.Provider
      value={{
        walletConnected: isConnected,
        walletAddress: address,
        connectWallet,
        disconnectWallet,
        isPolkadotExtensionAvailable,
        error,
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
