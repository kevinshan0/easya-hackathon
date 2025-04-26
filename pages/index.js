import dynamic from 'next/dynamic';

const PolkadotWalletTest = dynamic(
  () => import('../src/components/PolkadotWalletTest'),
  { ssr: false }
);

export default function Home() {
  return (
    <div>
      <PolkadotWalletTest />
    </div>
  );
} 