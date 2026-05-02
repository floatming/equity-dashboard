export interface CompanyData {
  symbol: string;
  name: string;
  marketCap: number; // in Billions
  forwardPE: number;
  sector: string;
}

export async function fetchCompanyData(): Promise<CompanyData[]> {
  try {
    const response = await fetch('/api/market-data');
    if (!response.ok) {
        throw new Error(`API returned ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching live market data, falling back:", error);
    return fallbackData;
  }
}

const fallbackData: CompanyData[] = [
    { symbol: "NVDA", name: "NVIDIA Corporation", marketCap: 3524.5, forwardPE: 45.2, sector: "Technology" },
    { symbol: "GOOGL", name: "Alphabet Inc.", marketCap: 2080.4, forwardPE: 22.5, sector: "Communication Services" },
    { symbol: "AAPL", name: "Apple Inc.", marketCap: 3412.8, forwardPE: 30.4, sector: "Technology" },
    { symbol: "MSFT", name: "Microsoft Corporation", marketCap: 3120.2, forwardPE: 32.1, sector: "Technology" },
    { symbol: "AMZN", name: "Amazon.com, Inc.", marketCap: 1945.1, forwardPE: 38.8, sector: "Consumer Cyclical" }
];
