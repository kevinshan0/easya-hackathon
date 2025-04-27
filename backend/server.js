const express = require('express');
const cors = require('cors');
const protocols = require('./data/protocols');
const { optimizeProtocols } = require('./data/optimizer');

const app = express();
const port = process.env.PORT || 4000; // Use port 4000 for backend

// Middleware
app.use(cors()); // Enable CORS for requests from frontend (e.g., localhost:8080)
app.use(express.json()); // Parse JSON request bodies

// API Routes
app.get('/api/protocols', (req, res) => {
  res.json(protocols);
});

app.post('/api/optimize', (req, res) => {
  const { selectedAssets } = req.body;

  if (!Array.isArray(selectedAssets) || selectedAssets.length === 0) {
    return res.status(400).json({ error: 'selectedAssets must be a non-empty array' });
  }

  try {
    const results = optimizeProtocols(selectedAssets, protocols);
    res.json(results);
  } catch (error) {
    console.error("Optimization error:", error);
    res.status(500).json({ error: 'Failed to calculate optimization' });
  }
});

app.listen(port, () => {
  console.log(`Backend server listening on http://localhost:${port}`);
}); 