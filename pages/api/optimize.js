const protocols = require('../../src/data/protocols');
const { optimizeProtocols } = require('../../src/data/optimizer');

export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { selectedAssets } = req.body;
  if (!Array.isArray(selectedAssets) || selectedAssets.length === 0) {
    res.status(400).json({ error: 'selectedAssets must be a non-empty array' });
    return;
  }

  const results = optimizeProtocols(selectedAssets, protocols);
  res.status(200).json(results);
} 