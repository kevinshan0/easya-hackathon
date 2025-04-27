// Scoring formula:
// score = APY - (fee * 100) - (lockup_days * 0.1) - (risk_score * 1)

function calculateScore(protocol) {
  return (
    protocol.APY -
    (protocol.fee * 100) -
    (protocol.lockup_days * 0.1) -
    (protocol.risk_score * 1)
  );
}

/**
 * Finds the best protocol for each selected asset.
 * @param {string[]} selectedAssets - Array of asset symbols (e.g., ['DOT', 'KSM'])
 * @param {Array} protocols - Array of protocol objects
 * @returns {Array} Array of best protocol objects for each asset, with score
 */
function optimizeProtocols(selectedAssets, protocols) {
  return selectedAssets.map(asset => {
    // Filter protocols for this asset
    const assetProtocols = protocols.filter(p => p.asset === asset);
    if (assetProtocols.length === 0) return null;
    // Calculate scores
    const scored = assetProtocols.map(p => ({ ...p, score: calculateScore(p) }));
    // Find the best
    const best = scored.reduce((a, b) => (a.score > b.score ? a : b));
    return best;
  }).filter(Boolean); // Remove nulls if no protocols for asset
}

module.exports = { optimizeProtocols }; 