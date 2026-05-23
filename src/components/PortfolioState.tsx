import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart2, 
  DollarSign, 
  Percent, 
  Wallet, 
  Clock, 
  ArrowUpRight, 
  ArrowDownRight,
  RefreshCw,
  PieChart,
  LineChart
} from 'lucide-react';
import { ThemeConfig, PortfolioStats } from '../types';

interface PortfolioStateProps {
  theme: ThemeConfig;
  onTriggerNotification: (title: string, msg: string, type: any) => void;
  bybitConnected: boolean;
}

const DEFAULT_STATS: PortfolioStats = {
  totalBalance: 24780.50,
  netProfitLoss: 3840.40,
  winRate: 74.2,
  roi: 18.35,
  totalTrades: 42,
  profitableTrades: 31,
  holdingAllocation: [
    { symbol: 'BTC', percentage: 45, value: 11151.22, avgBuyPrice: 62400 },
    { symbol: 'ETH', percentage: 25, value: 6195.12, avgBuyPrice: 3200 },
    { symbol: 'SOL', percentage: 18, value: 4460.49, avgBuyPrice: 154 },
    { symbol: 'PEPE', percentage: 12, value: 2973.66, avgBuyPrice: 0.000012 }
  ],
  pnlHistory: [
    { date: 'Mon', value: 23200 },
    { date: 'Tue', value: 23450 },
    { date: 'Wed', value: 24100 },
    { date: 'Thu', value: 24350 },
    { date: 'Fri', value: 24780.50 }
  ],
  tradeHistory: [
    { id: 'tr-1', symbol: 'BTC/USDT', type: 'BUY', price: 68100, amount: 0.08, pnl: 28, status: 'COMPLETED', timestamp: '2h ago' },
    { id: 'tr-2', symbol: 'ETH/USDT', type: 'BUY', price: 3450, amount: 1.25, pnl: 44.5, status: 'COMPLETED', timestamp: '5h ago' },
    { id: 'tr-3', symbol: 'SOL/USDT', type: 'SELL', price: 179.2, amount: 15.0, pnl: -12.4, status: 'COMPLETED', timestamp: '1d ago' },
    { id: 'tr-4', symbol: 'PEPE/USDT', type: 'BUY', price: 0.000014, amount: 150000000, pnl: 118, status: 'COMPLETED', timestamp: '2d ago' },
    { id: 'tr-5', symbol: 'BTC/USDT', type: 'BUY', price: 67200, amount: 0.15, pnl: 340, status: 'COMPLETED', timestamp: '4d ago' }
  ]
};

export default function PortfolioState({ theme, onTriggerNotification, bybitConnected }: PortfolioStateProps) {
  const [stats, setStats] = useState<PortfolioStats>(DEFAULT_STATS);
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'HOLDINGS' | 'HISTORY'>('OVERVIEW');
  const [isUpdating, setIsUpdating] = useState(false);

  const triggerPortfolioRefresh = () => {
    setIsUpdating(true);
    setTimeout(() => {
      // Simulate profit tick
      setStats(prev => ({
        ...prev,
        totalBalance: prev.totalBalance + (Math.random() > 0.5 ? 45.2 : -22.1),
        netProfitLoss: prev.netProfitLoss + (Math.random() > 0.5 ? 12.8 : -8.5),
        tradeHistory: [
          {
            id: `tr-added-${Date.now()}`,
            symbol: 'BTC/USDT',
            type: Math.random() > 0.5 ? 'BUY' : 'SELL',
            price: 68450,
            amount: 0.04,
            pnl: Math.random() > 0.5 ? 15 : -3,
            status: 'COMPLETED',
            timestamp: 'Just now'
          },
          ...prev.tradeHistory
        ]
      }));
      onTriggerNotification(
        'Portfolio Balanced Sync',
        'Direct cryptographic balance synchronization mapped successfully with test addresses.',
        'NEWS'
      );
      setIsUpdating(false);
    }, 1000);
  };

  const isProfitable = stats.netProfitLoss >= 0;

  // X dimensions for simple historical drawing vector
  const width = 500;
  const height = 120;
  const padding = 20;

  const minVal = Math.min(...stats.pnlHistory.map(h => h.value)) * 0.99;
  const maxVal = Math.max(...stats.pnlHistory.map(h => h.value)) * 1.01;
  const deltaVal = maxVal - minVal;

  const getPolyPoints = () => {
    return stats.pnlHistory.map((h, i) => {
      const x = padding + (i * (width - 2 * padding) / (stats.pnlHistory.length - 1));
      const y = height - padding - ((h.value - minVal) * (height - 2 * padding) / deltaVal);
      return `${x},${y}`;
    }).join(' ');
  };

  return (
    <div className="flex flex-col gap-4">
      
      {/* Portfolio overview selectors */}
      <div className="flex p-0.5 rounded-xl border border-white/[0.04] bg-black/20 overflow-x-auto max-w-full">
        {(['OVERVIEW', 'HOLDINGS', 'HISTORY'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-xs font-mono font-medium rounded-lg transition-all uppercase whitespace-nowrap flex-1 ${
              activeTab === tab
                ? 'bg-white/10 text-white'
                : 'text-gray-500 hover:text-gray-300'
            }`}
            style={activeTab === tab ? { color: theme.accentColor } : {}}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'OVERVIEW' && (
        <div className="flex flex-col gap-4">
          
          {/* Main Portfolio balance card */}
          <div className={`p-5 rounded-3xl ${theme.cardClass} border border-white/[0.04] relative overflow-hidden flex flex-col gap-4`}>
            
            <div className="flex justify-between items-start">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-mono text-gray-500 uppercase flex items-center gap-1">
                  <Wallet className="w-3.5 h-3.5" /> Total Vault Net Worth
                </span>
                <span className="text-3xl font-mono font-bold tracking-tight text-white">
                  ${(bybitConnected ? stats.totalBalance + 12450.75 : stats.totalBalance).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>

              <button 
                onClick={triggerPortfolioRefresh}
                disabled={isUpdating}
                className="p-2 rounded-xl border border-white/[0.05] hover:bg-white/5 text-gray-400 hover:text-white transition-all cursor-pointer"
              >
                <RefreshCw className={`w-4 h-4 ${isUpdating ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {/* Sub performance indicators row */}
            <div className="grid grid-cols-2 gap-3 border-t border-white/[0.04] pt-4 text-xs font-mono">
              <div>
                <span className="text-gray-500 block">NET ACCUMULATION</span>
                <span className={`text-sm font-semibold flex items-center gap-0.5 mt-0.5 ${isProfitable ? 'text-emerald-400' : 'text-red-400'}`}>
                  {isProfitable ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                  +${stats.netProfitLoss.toLocaleString(undefined, { minimumFractionDigits: 2 })} ({stats.roi}%)
                </span>
              </div>

              <div>
                <span className="text-gray-500 block">WIN RATIO MATRIX</span>
                <span className="text-sm font-semibold text-purple-400 flex items-center gap-1 mt-0.5">
                  <Percent className="w-3.5 h-3.5" /> {stats.winRate}% ({stats.profitableTrades}/{stats.totalTrades})
                </span>
              </div>
            </div>

            {/* Simple Dynamic ROI Trend Line Vector Graph */}
            <div className="relative border border-white/[0.03] bg-black/10 rounded-2xl p-2 h-24 overflow-hidden mt-1">
              <div className="absolute left-3 top-3 text-[9px] font-mono text-gray-500 uppercase">ROI Performance Trajectory</div>
              <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible" preserveAspectRatio="none">
                <polyline
                  fill="none"
                  stroke={theme.accentColor}
                  strokeWidth="2"
                  strokeLinecap="round"
                  points={getPolyPoints()}
                />
              </svg>
            </div>
          </div>

          {/* Key Holdings allocation overview list */}
          <div className={`p-4 rounded-3xl ${theme.cardClass} border border-white/[0.04] flex flex-col gap-3`}>
            <div className="flex items-center gap-2 text-xs font-mono text-gray-500">
              <PieChart className="w-3.5 h-3.5" />
              <span>DASHBOARD ASSETS ALLOCATION</span>
            </div>

            <div className="flex flex-col gap-2">
              {stats.holdingAllocation.map(h => (
                <div key={h.symbol} className="flex flex-col gap-1 text-xs">
                  <div className="flex justify-between font-mono">
                    <span className="font-bold text-white uppercase">{h.symbol}</span>
                    <span className="text-gray-400">${h.value.toLocaleString(undefined, { maximumFractionDigits: 2 })} ({h.percentage}%)</span>
                  </div>
                  {/* Miniature progress meter */}
                  <div className="h-1 w-full bg-white/[0.03] rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${h.percentage}%`, backgroundColor: theme.accentColor }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {activeTab === 'HOLDINGS' && (
        /* Expanded allocations card grid */
        <div className={`p-5 rounded-3xl ${theme.cardClass} border border-white/[0.04] flex flex-col gap-4`}>
          <div className="flex items-center gap-2 pb-3 border-b border-white/[0.04]">
            <BarChart2 className="w-4.5 h-4.5 text-indigo-400" />
            <h3 className="font-display font-semibold text-sm">HOLDINGS PORTFOLIO ANALYSIS</h3>
          </div>

          <div className="flex flex-col gap-3">
            {stats.holdingAllocation.map(alloc => (
              <div key={alloc.symbol} className="p-3 bg-white/[0.01] border border-white/[0.04] rounded-2xl flex justify-between items-center text-xs font-mono">
                <div>
                  <h4 className="font-bold text-white uppercase">{alloc.symbol}/USDT</h4>
                  <span className="text-[9px] text-gray-550 block mt-0.5">AVG BUY PRICE: ${alloc.avgBuyPrice.toLocaleString()}</span>
                </div>

                <div className="text-right flex flex-col items-end">
                  <span className="text-white font-semibold">${alloc.value.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                  <span className="text-[9px] text-purple-400 font-medium">{alloc.percentage}% of allocation</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'HISTORY' && (
        /* Complete transaction logs */
        <div className={`p-5 rounded-3xl ${theme.cardClass} border border-white/[0.04] flex flex-col gap-4`}>
          <div className="flex justify-between items-center pb-3 border-b border-white/[0.04] text-xs font-mono">
            <span className="flex items-center gap-1.5 font-semibold text-white">
              <Clock className="w-3.5 h-3.5 text-gray-550" /> System Transaction Logs
            </span>
            <span className="text-gray-500">LATEST {stats.tradeHistory.length} ENTRIES</span>
          </div>

          <div className="flex flex-col gap-2 max-h-[280px] overflow-y-auto pr-1">
            {stats.tradeHistory.map(tr => (
              <div key={tr.id} className="p-3 bg-white/[0.01] border border-white/[0.04] rounded-xl flex justify-between items-center text-xs font-mono">
                <div>
                  <div className="flex items-center gap-1.5">
                    <b className="text-white uppercase">{tr.symbol}</b>
                    <span className={`px-1 py-0.2 rounded text-[8px] font-bold ${tr.type === 'BUY' ? 'text-emerald-400 bg-emerald-500/10' : 'text-red-400 bg-red-500/10'}`}>
                      {tr.type}
                    </span>
                  </div>
                  <span className="text-[9px] text-gray-550 mt-1 block">A: {tr.amount} • P: ${tr.price}</span>
                </div>

                <div className="text-right flex flex-col items-end">
                  <span className={`font-semibold ${tr.pnl && tr.pnl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {tr.pnl && tr.pnl >= 0 ? '+' : ''}${tr.pnl?.toFixed(1)}
                  </span>
                  <span className="text-[9.5px] text-gray-500">{tr.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
