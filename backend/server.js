const express = require("express");
const cors = require("cors");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const dotenv = require('dotenv');
dotenv.config(); // Add this at the top to load .env

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
    // Whitelist of Polkadot parachains and ecosystem chains
    const whitelist = [
      "Acala",
      "Moonbeam",
      "Astar",
      "Parallel Finance",
      "Centrifuge",
      "Phala Network",
      "Interlay",
      "Bifrost",
      "Bifrost Network",
      "HydraDX",
      "Equilibrium",
      "Karura",
      "Moonriver",
      "Kusama",
      "Polkadot",
      "Manta",
    ];
    // Filter for only whitelisted chains
    const filtered = llamaData.data.filter((pool) =>
      whitelist.includes(pool.chain)
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

app.post("/api/ai-suggest", async (req, res) => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "OpenAI API key not set on server." });
  }
  const { selectedAssets } = req.body;
  if (!Array.isArray(selectedAssets) || selectedAssets.length === 0) {
    return res.status(400).json({ error: "Missing or invalid selectedAssets in request body." });
  }
  try {
    // Fetch protocol data (same as /api/protocols)
    const llamaRes = await fetch("https://yields.llama.fi/pools");
    const llamaData = await llamaRes.json();
    const whitelist = [
      "Acala",
      "Moonbeam",
      "Astar",
      "Parallel Finance",
      "Centrifuge",
      "Phala Network",
      "Interlay",
      "Bifrost",
      "Bifrost Network",
      "HydraDX",
      "Equilibrium",
      "Karura",
      "Moonriver",
      "Kusama",
      "Polkadot",
      "Manta",
    ];
    const filtered = llamaData.data.filter((pool) => whitelist.includes(pool.chain));
    // Compute best protocol for each selected asset (same scoring as frontend)
    function scoreProtocol(protocol) {
      const apyScore = (protocol.apy || 0) * 10;
      const tvlScore = (protocol.tvlUsd || 0) / 1000000;
      const riskScore = protocol.risk === "low" ? 3 : protocol.risk === "mid" ? 2 : 1;
      return apyScore + tvlScore + riskScore * 10;
    }
    const bestProtocols = selectedAssets.map(asset => {
      const assetProtocols = filtered.filter(p => p.chain === asset);
      assetProtocols.forEach(p => {
        // Risk is already assigned in /api/protocols logic
        p._score = scoreProtocol(p);
      });
      assetProtocols.sort((a, b) => (b._score || 0) - (a._score || 0));
      return assetProtocols[0] || null;
    });
    // Format context for AI
    const context = bestProtocols.map((protocol, idx) => {
      const asset = selectedAssets[idx];
      if (!protocol) return `Asset: ${asset} (no protocol found)`;
      return `Asset: ${asset}\n  Protocol: ${protocol.project}\n  Chain: ${protocol.chain}\n  APY: ${protocol.apy}%\n  TVL: $${protocol.tvlUsd}\n  Risk: ${protocol.risk}`;
    }).join("\n\n");
    const prompt = `You are an expert DeFi strategist. Given the following user-selected assets and their best protocol matches, provide a concise, actionable strategy suggestion for the user.\n\n${context}`;
    // Call OpenAI
    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          { role: "system", content: "You are an expert DeFi strategist for Polkadot and its parachains." },
          { role: "user", content: prompt },
        ],
        max_tokens: 300,
        temperature: 0.7,
      }),
    });
    if (!openaiRes.ok) {
      const errorText = await openaiRes.text();
      throw new Error(`OpenAI API error: ${errorText}`);
    }
    const data = await openaiRes.json();
    let suggestion = data.choices?.[0]?.message?.content?.trim() || "No suggestion returned.";
    // Replace **bold** markdown with <b>bold</b> HTML
    suggestion = suggestion.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
    res.json({ suggestion });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || "Failed to fetch AI suggestion" });
  }
});

app.listen(port, () => {
  console.log(`Backend server listening on http://localhost:${port}`);
});
