import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  Search, 
  RefreshCcw, 
  ArrowUpRight,
  Filter,
  BarChart3,
  List as ListIcon,
  LayoutDashboard
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  ScatterChart,
  Scatter,
  ZAxis
} from 'recharts';
import { fetchCompanyData, CompanyData } from './services/marketData';
import { cn } from './lib/utils';

// Design Specs: Technical Dashboard / Data Grid
// Mood: Professional, precise, information-dense.
// Typography: Mono for values, Italic Serif for headers (handled via Tailwind)

export default function Dashboard() {
  const [data, setData] = useState<CompanyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'chart'>('list');
  const [sortConfig, setSortConfig] = useState<{ key: 'marketCap' | 'forwardPE', direction: 'asc' | 'desc' }>({
    key: 'marketCap',
    direction: 'desc'
  });

  const fetchData = async () => {
    setLoading(true);
    const result = await fetchCompanyData();
    setData(result);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSort = (key: 'marketCap' | 'forwardPE') => {
    let direction: 'asc' | 'desc' = 'desc';
    if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = 'asc';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = [...data].sort((a, b) => {
    if (sortConfig.direction === 'asc') {
      return a[sortConfig.key] - b[sortConfig.key];
    }
    return b[sortConfig.key] - a[sortConfig.key];
  });

  const filteredData = sortedData.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    avgPE: data.length > 0 ? (data.reduce((sum, c) => sum + c.forwardPE, 0) / data.length).toFixed(1) : 0,
    totalCap: data.length > 0 ? (data.reduce((sum, c) => sum + c.marketCap, 0) / 1000).toFixed(2) : 0,
    count: data.length
  };

  const adrList = ['TSM', 'BABA', 'ASML', 'SAP', 'NVO', 'AZN', 'HSBC', 'PDD', 'HDB', 'SONY', 'TM', 'RIO', 'BHP', 'TTE', 'BP', 'SHEL', 'SNY'];

  return (
    <div className="min-h-screen bg-[#F3F4F6] text-[#111827] font-sans selection:bg-blue-600 selection:text-white flex flex-col">
      {/* Header Section */}
      <header className="px-4 md:px-8 py-8 md:py-12 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-end justify-between gap-6 md:gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-600 flex items-center justify-center text-white font-bold text-lg md:text-xl rounded-lg shadow-sm">M</div>
              <p className="text-blue-600 font-bold text-[10px] md:text-xs tracking-widest uppercase">Institutional Analytics</p>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-gray-900 leading-tight text-sans">
              Equity Dashboard
            </h1>
            <p className="text-sm md:text-base text-gray-500 max-w-xl">
              Real-time Global Equity Dashboard.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative group w-full md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              <input 
                type="text" 
                placeholder="Search symbol or company..."
                className="bg-gray-100 border-none py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all w-full rounded-xl"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button 
              onClick={fetchData}
              className="flex items-center gap-2 bg-white border border-gray-200 p-3.5 px-5 hover:bg-gray-50 transition-all text-gray-600 hover:text-blue-600 rounded-xl shadow-sm font-medium text-sm"
            >
              <RefreshCcw className={cn("w-4 h-4", loading && "animate-spin")} />
              Refresh
            </button>
          </div>
        </div>
      </header>

      {/* Stats Summary Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-gray-100">
          <div className="p-4 md:p-8 font-sans">
            <p className="text-[8px] md:text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-1 md:mb-2">Coverage Pool</p>
            <p className="text-xl md:text-3xl font-bold text-gray-900">{stats.count} <span className="text-xs md:text-sm font-normal text-gray-400">Assets</span></p>
          </div>
          <div className="p-4 md:p-8 font-sans">
            <p className="text-[8px] md:text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-1 md:mb-2">Avg Forward P/E</p>
            <p className="text-xl md:text-3xl font-bold text-gray-900">{stats.avgPE}<span className="text-xs md:text-sm font-normal text-gray-400">x</span></p>
          </div>
          <div className="p-4 md:p-8 font-sans">
            <p className="text-[8px] md:text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-1 md:mb-2">Aggregate Valuation</p>
            <p className="text-xl md:text-3xl font-bold text-blue-600">${stats.totalCap}<span className="text-sm md:text-base">T</span></p>
          </div>
          <div className="p-4 md:p-8 font-sans">
            <p className="text-[8px] md:text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-1 md:mb-2">Update Synchronized</p>
            <p className="text-sm md:text-2xl font-bold text-gray-900 uppercase">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-grow flex flex-col relative py-8 md:py-12 px-2 sm:px-4 md:px-8">
        <div className="max-w-7xl mx-auto w-full">
          {/* View Toggle */}
          <div className="flex bg-white rounded-2xl shadow-sm border border-gray-200 p-1.5 mb-10 w-fit">
            <button 
              onClick={() => setViewMode('list')}
              className={cn(
                "px-8 py-3 rounded-xl flex items-center gap-3 text-sm font-bold transition-all",
                viewMode === 'list' ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" : "text-gray-500 hover:bg-gray-50"
              )}
            >
              <ListIcon className="w-4 h-4" /> Tabular Matrix
            </button>
            <button 
              onClick={() => setViewMode('chart')}
              className={cn(
                "px-8 py-3 rounded-xl flex items-center gap-3 text-sm font-bold transition-all",
                viewMode === 'chart' ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" : "text-gray-500 hover:bg-gray-50"
              )}
            >
              <BarChart3 className="w-4 h-4" /> Valuation Scatter
            </button>
          </div>

          <AnimatePresence mode="wait">
            {viewMode === 'list' ? (
              <motion.div 
                key="list-view"
                initial={{ opacity: 0, scale: 0.99 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.99 }}
                className="w-full bg-white rounded-3xl shadow-2xl shadow-blue-900/5 border border-gray-200 overflow-hidden"
              >
                {/* Table Header */}
                <div className="grid grid-cols-[70px_1fr_80px_70px] sm:grid-cols-[100px_1fr_120px_100px] md:grid-cols-[140px_1fr_200px_200px] bg-gray-50/50 border-b border-gray-100 select-none">
                  <div className="p-3 md:p-6 text-[8px] md:text-[10px] uppercase tracking-[0.1em] md:tracking-[0.2em] text-gray-400 font-extrabold flex items-center">Ticker</div>
                  <div className="p-3 md:p-6 text-[8px] md:text-[10px] uppercase tracking-[0.1em] md:tracking-[0.2em] text-gray-400 font-extrabold flex items-center">Company</div>
                  <button 
                    onClick={() => handleSort('marketCap')}
                    className="p-3 md:p-6 text-[8px] md:text-[10px] uppercase tracking-[0.1em] md:tracking-[0.2em] text-gray-400 font-extrabold text-right hover:text-blue-600 transition-colors flex items-center justify-end gap-1 md:gap-3 group/btn"
                  >
                    <span className="hidden md:inline">Market </span>Cap ($B)
                    {sortConfig.key === 'marketCap' && (
                      sortConfig.direction === 'desc' ? <TrendingDown className="w-3 h-3 md:w-4 md:h-4 text-blue-600" /> : <TrendingUp className="w-3 h-3 md:w-4 md:h-4 text-blue-600" />
                    )}
                  </button>
                  <button 
                    onClick={() => handleSort('forwardPE')}
                    className="p-3 md:p-6 text-[8px] md:text-[10px] uppercase tracking-[0.1em] md:tracking-[0.2em] text-gray-400 font-extrabold text-right hover:text-blue-600 transition-colors flex items-center justify-end gap-1 md:gap-3 group/btn"
                  >
                    Fwd P/E
                    {sortConfig.key === 'forwardPE' && (
                      sortConfig.direction === 'desc' ? <TrendingDown className="w-3 h-3 md:w-4 md:h-4 text-blue-600" /> : <TrendingUp className="w-3 h-3 md:w-4 md:h-4 text-blue-600" />
                    )}
                  </button>
                </div>

                <div className="divide-y divide-gray-100">
                  {loading && data.length === 0 ? (
                    <div className="py-40 flex flex-col items-center justify-center gap-4 text-center">
                      <RefreshCcw className="w-8 h-8 text-blue-600 animate-spin" />
                      <p className="text-gray-500 text-sm font-bold uppercase tracking-[0.2em]">Synchronizing Real-Time Data from Yahoo Finance...</p>
                    </div>
                  ) : filteredData.length === 0 ? (
                    <div className="py-40 text-center">
                      <p className="text-gray-400 text-sm font-bold uppercase tracking-[0.3em]">Query returned zero assets</p>
                    </div>
                  ) : (
                    filteredData.map((company, i) => {
                      const isADR = adrList.includes(company.symbol);
                      return (
                        <motion.div 
                          key={company.symbol}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: i * 0.01 }}
                          className="grid grid-cols-[70px_1fr_80px_70px] sm:grid-cols-[100px_1fr_120px_100px] md:grid-cols-[140px_1fr_200px_200px] hover:bg-gray-50/70 transition-colors group cursor-pointer"
                        >
                          <div className="p-3 md:p-6 font-mono text-[10px] md:text-lg font-bold text-gray-900 flex flex-col md:flex-row items-start md:items-center gap-1 md:gap-3 justify-center md:justify-start">
                            <span className="text-blue-600">{company.symbol}</span>
                            <span className={cn(
                              "text-[8px] md:text-[10px] px-1 md:px-2 py-0.5 md:py-1 rounded font-sans uppercase tracking-wider font-bold",
                              isADR ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"
                            )}>
                              {isADR ? 'ADR' : 'US'}
                            </span>
                          </div>
                          <div className="p-3 md:p-6 flex flex-col justify-center overflow-hidden">
                            <span className="text-[11px] md:text-base font-bold text-gray-800 line-clamp-2 md:line-clamp-none leading-tight">{company.name}</span>
                            <span className="text-[8px] md:text-xs font-semibold text-gray-400 mt-1 uppercase tracking-wider block truncate">{company.sector}</span>
                          </div>
                          <div className="p-3 md:p-6 text-right font-mono text-[11px] md:text-lg font-bold text-gray-900 tabular-nums flex items-center justify-end">
                            <span className="text-[10px] md:text-sm font-normal text-gray-300 mr-1">$</span>
                            {company.marketCap.toLocaleString()}
                          </div>
                          <div className="p-3 md:p-6 text-right flex items-center justify-end gap-1 md:gap-4">
                            <span className="font-mono text-[11px] md:text-lg font-bold text-blue-600">{company.forwardPE.toFixed(1)}</span>
                            <span className="text-[8px] md:text-xs font-mono text-gray-300">x</span>
                            <ArrowUpRight className="w-3 h-3 md:w-4 md:h-4 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all text-blue-300 hidden md:block" />
                          </div>
                        </motion.div>
                      );
                    })
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="chart-view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full h-[700px] bg-white rounded-3xl shadow-2xl shadow-blue-900/5 border border-gray-200 p-10"
              >
                <div className="flex justify-between items-end mb-10">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Valuation Distribution</h3>
                    <p className="text-sm text-gray-400 font-medium">Correlation analysis of Market Capitalization versus Forward Multiples</p>
                  </div>
                  <div className="flex gap-6">
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-400"></div><span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Premium</span></div>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-400"></div><span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Median</span></div>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-emerald-400"></div><span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Value</span></div>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height="80%">
                  <ScatterChart margin={{ top: 20, right: 30, bottom: 40, left: 40 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis 
                       type="number" 
                       dataKey="marketCap" 
                       name="Market Cap" 
                       domain={['auto', 'auto']}
                       stroke="#cbd5e1" 
                       fontSize={11} 
                       tickFormatter={(v) => `$${v}B`}
                       label={{ value: 'MARKET CAPITALIZATION ($B)', position: 'bottom', offset: 25, fill: '#94a3b8', fontSize: 10, fontWeight: 800, letterSpacing: '0.15em' }}
                    />
                    <YAxis 
                      type="number" 
                      dataKey="forwardPE" 
                      name="Forward P/E" 
                      stroke="#cbd5e1" 
                      fontSize={11}
                      label={{ value: 'FORWARD P/E RATIO', angle: -90, position: 'left', offset: 10, fill: '#94a3b8', fontSize: 10, fontWeight: 800, letterSpacing: '0.15em' }}
                    />
                    <ZAxis type="number" dataKey="marketCap" range={[200, 2500]} />
                    <Tooltip 
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload as CompanyData;
                          return (
                            <div className="bg-white border border-gray-100 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-2xl ring-1 ring-gray-100">
                              <div className="flex justify-between items-center border-b border-gray-50 pb-4 mb-4">
                                <p className="text-blue-600 font-black text-2xl font-mono tracking-tighter">{data.symbol}</p>
                                <span className={cn(
                                  "text-[10px] px-2 py-1 rounded font-bold uppercase tracking-wider",
                                  adrList.includes(data.symbol) ? "bg-amber-50 text-amber-600" : "bg-blue-50 text-blue-600"
                                )}>{data.sector}</span>
                              </div>
                              <div className="space-y-4">
                                <p className="text-base font-extrabold text-gray-900 leading-tight">{data.name}</p>
                                <div className="grid grid-cols-2 gap-8">
                                  <div>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Cap</p>
                                    <p className="text-lg font-black text-gray-900">${data.marketCap}B</p>
                                  </div>
                                  <div>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Fwd PE</p>
                                    <p className="text-lg font-black text-blue-600">{data.forwardPE}x</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Scatter name="Entities" data={filteredData}>
                      {filteredData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.forwardPE > 40 ? "#f87171" : entry.forwardPE < 15 ? "#34d399" : "#60a5fa"} 
                          fillOpacity={0.8}
                          stroke="#fff"
                          strokeWidth={2}
                          className="hover:fill-opacity-100 transition-all cursor-pointer outline-none"
                        />
                      ))}
                    </Scatter>
                  </ScatterChart>
                </ResponsiveContainer>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Footer Section */}
      <footer className="p-10 bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex flex-col md:flex-row gap-10 items-center">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.4)]"></div>
              <span className="text-xs font-black text-gray-900 tracking-[0.2em] uppercase">Market Verified Feed</span>
            </div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold max-w-sm text-center md:text-left leading-loose">
              Data synchronized via Futu NiuNiu (Moomoo) & Finviz Professional Connectors. Estimates reflect FY26/27 consensus.
            </p>
          </div>
          <div className="flex items-center gap-4 bg-blue-50 px-6 py-3 rounded-2xl border border-blue-100/50">
            <div className="w-2 h-2 rounded-full bg-blue-600 animate-ping"></div>
            <span className="text-[10px] font-black text-blue-700 uppercase tracking-widest">Global Terminal Synchronized</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
