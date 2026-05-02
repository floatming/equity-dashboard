import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs";

// Using the default import for yahoo-finance2
import YahooFinance from "yahoo-finance2";

const yahooFinance = new YahooFinance({ suppressNotices: ['yahooSurvey'] });

const HARDCODED_SECTORS: Record<string, string> = {
  "NVDA": "Technology", "GOOGL": "Communication Services", "AAPL": "Technology",
  "MSFT": "Technology", "AMZN": "Consumer Cyclical", "TSM": "Technology",
  "AVGO": "Technology", "META": "Communication Services", "TSLA": "Consumer Cyclical",
  "WMT": "Consumer Defensive", "BRK-B": "Financial Services", "LLY": "Healthcare",
  "JPM": "Financial Services", "XOM": "Energy", "V": "Financial Services",
  "TCEHY": "Communication Services", "ASML": "Technology", "JNJ": "Healthcare",
  "ORCL": "Technology", "COST": "Consumer Defensive", "MA": "Financial Services",
  "NFLX": "Communication Services", "CVX": "Energy", "BAC": "Financial Services",
  "ABBV": "Healthcare", "KO": "Consumer Defensive", "UNH": "Healthcare",
  "BABA": "Consumer Cyclical", "HD": "Consumer Cyclical", "HSBC": "Financial Services",
  "AZN": "Healthcare", "TM": "Consumer Cyclical", "PEP": "Consumer Defensive",
  "SAP": "Technology", "BHP": "Basic Materials", "NVO": "Healthcare",
  "RIO": "Basic Materials", "CRM": "Technology", "PDD": "Consumer Cyclical",
  "HDB": "Financial Services", "SONY": "Technology", "SNY": "Healthcare",
  "MU": "Technology", "AMD": "Technology", "INTC": "Technology", "QCOM": "Technology",
  "TXN": "Technology", "IBM": "Technology", "NOW": "Technology", "UBER": "Technology"
};

const symbols = Object.keys(HARDCODED_SECTORS);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Add the real-time API endpoint
  app.get("/api/market-data", async (req, res) => {
    try {
      const fetchPromises = symbols.map(async (sym) => {
        try {
          const quote = await yahooFinance.quote(sym);
          let marketCap = quote.marketCap ? quote.marketCap / 1e9 : null;
          let forwardPE = quote.forwardPE;
          
          if (!forwardPE && quote.trailingPE) {
              forwardPE = quote.trailingPE;
          }

          if (marketCap) {
            let name = quote.longName || quote.shortName || sym;
            return {
              symbol: sym === "BRK-B" ? "BRK.B" : sym,
              name,
              marketCap: Number(marketCap.toFixed(1)),
              forwardPE: forwardPE ? Number(forwardPE.toFixed(2)) : 0,
              sector: HARDCODED_SECTORS[sym] || "Unknown"
            };
          }
        } catch (e) {
          console.error(`Error fetching data for ${sym}:`, e);
        }
        return null;
      });

      const initialResults = await Promise.all(fetchPromises);
      const results = initialResults.filter(r => r !== null && r.marketCap >= 100);

      results.sort((a, b) => b.marketCap - a.marketCap);
      res.json(results);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch market data" });
    }
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // production mode
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
