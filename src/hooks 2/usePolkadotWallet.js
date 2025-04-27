import { useState, useEffect, useCallback } from 'react';
import { web3Enable, web3Accounts, web3FromSource } from '@polkadot/extension-dapp';
import { ApiPromise, WsProvider } from '@polkadot/api';

// Mock balances for MVP
const MOCK_BALANCES = {
  DOT: '12.34',
  KSM: '56.78',
  USDC: '100.00',
};

export default function usePolkadotWallet() {
  const [address, setAddress] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [balances, setBalances] = useState(MOCK_BALANCES);
  const [error, setError] = useState(null);
  const [api, setApi] = useState(null);

  // Initialize Polkadot API (optional, for real balance fetching later)
  useEffect(() => {
    if (typeof window === 'undefined') return; // Only run in browser
    const initApi = async () => {
      try {
        const provider = new WsProvider('wss://rpc.polkadot.io');
        const api = await ApiPromise.create({ provider });
        setApi(api);
      } catch (err) {
        setError('Failed to connect to Polkadot RPC');
      }
    };
    initApi();
  }, []);

  // Connect to polkadot.js extension
  const connectWallet = useCallback(async () => {
    setError(null);
    if (typeof window === 'undefined') {
      setError('Wallet connection only available in browser.');
      return;
    }
    try {
      const extensions = await web3Enable('Crypto Yield Optimizer');
      if (extensions.length === 0) {
        setError('Polkadot.js extension not found or not authorized.');
        return;
      }
      const accounts = await web3Accounts();
      if (accounts.length === 0) {
        setError('No Polkadot accounts found.');
        return;
      }
      setAccounts(accounts);
      setAddress(accounts[0].address);
      setIsConnected(true);
      // For MVP, use mock balances
      setBalances(MOCK_BALANCES);
    } catch (err) {
      setError('Failed to connect wallet.');
    }
  }, []);

  // Disconnect wallet (just clears state)
  const disconnectWallet = useCallback(() => {
    setAddress(null);
    setAccounts([]);
    setIsConnected(false);
    setBalances(MOCK_BALANCES);
    setError(null);
  }, []);

  // (Optional) Fetch real balances here in the future
  // const fetchBalances = useCallback(async () => {
  //   if (!api || !address) return;
  //   // Fetch balances using api.query.system.account(address)
  // }, [api, address]);

  return {
    connectWallet,
    disconnectWallet,
    address,
    accounts,
    isConnected,
    balances,
    error,
  };
} 
 