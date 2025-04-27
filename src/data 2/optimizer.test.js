const protocols = require('./protocols');
const { optimizeProtocols } = require('./optimizer');

// Example selected assets
const selectedAssets = ['DOT', 'KSM', 'USDC'];

const results = optimizeProtocols(selectedAssets, protocols);

console.log('Optimization Results:');
results.forEach(result => {
  console.log(`Asset: ${result.asset}`);
  console.log(`  Best Protocol: ${result.name}`);
  console.log(`  APY: ${result.APY}%`);
  console.log(`  Fee: ${result.fee * 100}%`);
  console.log(`  Lockup: ${result.lockup_days} days`);
  console.log(`  Risk Score: ${result.risk_score}`);
  console.log(`  Score: ${result.score.toFixed(2)}`);
  console.log('---');
}); 