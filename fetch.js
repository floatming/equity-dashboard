import YahooFinance from 'yahoo-finance2';
import fs from 'fs';

const yahooFinance = new YahooFinance();

const symbols = [
  "NVDA", "AAPL", "MSFT", "GOOGL", "AMZN", "META", "TSLA",
  "BRK-B", "LLY", "TSM", "AVGO", "JPM", "V", "WMT", "UNH", "NVO",
  "MA", "XOM", "ASML", "ORCL", "COST", "HD", "ABBV", "NFLX",
  "KO", "PEP", "CRM", "JNJ", "BAC", "CVX", "TM", "SAP",
  "BABA", "PDD", "SNY", "AZN", "HSBC", "SONY", "HDB", "BHP", "RIO", "TCEHY"
];

const results = [];

async function run() {
  for (const sym of symbols) {
    try {
      const quote = await yahooFinance.quote(sym);
      const summary = await yahooFinance.quoteSummary(sym, { modules: ['defaultKeyStatistics', 'summaryProfile'] });
      
      let marketCap = quote.marketCap ? quote.marketCap / 1e9 : null; 
      const forwardPE = summary?.defaultKeyStatistics?.forwardPE || 
                        summary?.defaultKeyStatistics?.trailingPE || 
                        quote.trailingPE || quote.forwardPE || quote.epsForward || 0;
      
      const sector = summary?.summaryProfile?.sector || "Unknown";

      if (marketCap) {
        let name = quote.longName || quote.shortName || sym;
        results.push({
          symbol: sym === "BRK-B" ? "BRK.B" : sym,
          name,
          marketCap: Number(marketCap.toFixed(1)),
          forwardPE: Number(forwardPE.toFixed(2)),
          sector
        });
        console.log(`Fetched ${sym}: ${marketCap.toFixed(1)}B, PE: ${forwardPE.toFixed(2)}`);
      }
    } catch (e) {
      console.error("Error for", sym, e.message);
    }
  }

  results.sort((a,b) => b.marketCap - a.marketCap);

  fs.writeFileSync('yahoo_data.json', JSON.stringify(results, null, 2));
  console.log("Done. Wrote to yahoo_data.json");
}

run();
