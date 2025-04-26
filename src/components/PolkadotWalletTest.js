import React from 'react';
import usePolkadotWallet from '../hooks/usePolkadotWallet';

export default function PolkadotWalletTest() {
  const {
    connectWallet,
    disconnectWallet,
    address,
    isConnected,
    balances,
    error,
  } = usePolkadotWallet();

  return (
    <div style={{ padding: 24, maxWidth: 400, margin: '0 auto', border: '1px solid #eee', borderRadius: 8 }}>
      <h2>Polkadot Wallet Test</h2>
      {isConnected ? (
        <>
          <div><strong>Address:</strong> {address}</div>
          <div style={{ margin: '12px 0' }}>
            <strong>Balances:</strong>
            <ul>
              {Object.entries(balances).map(([asset, value]) => (
                <li key={asset}>{asset}: {value}</li>
              ))}
            </ul>
          </div>
          <button onClick={disconnectWallet} style={{ background: '#f87171', color: '#fff', padding: '8px 16px', border: 'none', borderRadius: 4 }}>Disconnect</button>
        </>
      ) : (
        <button onClick={connectWallet} style={{ background: '#6366f1', color: '#fff', padding: '8px 16px', border: 'none', borderRadius: 4 }}>Connect Polkadot Wallet</button>
      )}
      {error && <div style={{ color: 'red', marginTop: 12 }}>{error}</div>}
    </div>
  );
} 