const express = require("express");
const cors = require("cors");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const app = express();
const port = process.env.PORT || 4000; // Use port 4000 for backend

// Middleware
app.use(cors()); // Enable CORS for requests from frontend (e.g., localhost:8080)
app.use(express.json()); // Parse JSON request bodies

// API Routes
app.get("/api/protocols", async (req, res) => {
  try {
    const llamaRes = await fetch("https://yields.llama.fi/pools");
    const llamaData = await llamaRes.json();
    // Filter for only Polkadot, Moonbeam, or Acala pools
    const filtered = llamaData.data.filter((pool) =>
      ["Polkadot", "Moonbeam", "Acala"].includes(pool.chain)
    );

    // Sort by TVL descending
    const sorted = [...filtered].sort(
      (a, b) => (b.tvlUsd || 0) - (a.tvlUsd || 0)
    );
    const n = sorted.length;
    const lowCut = Math.floor(n / 3);
    const midCut = Math.floor((2 * n) / 3);

    // Assign risk based on TVL quantiles
    const mapped = sorted.map((pool, idx) => {
      let risk = "mid";
      if (idx < lowCut) risk = "low";
      else if (idx < midCut) risk = "mid";
      else risk = "high";
      return {
        chain: pool.chain,
        project: pool.project,
        apy: pool.apy,
        tvlUsd: pool.tvlUsd,
        rewardTokens: pool.rewardTokens,
        risk,
      };
    });

    res.json({ data: mapped, count: mapped.length });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch protocol data" });
  }
});

app.listen(port, () => {
  console.log(`Backend server listening on http://localhost:${port}`);
});
