import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Compass, 
  TrendingUp, 
  Flame, 
  Activity, 
  ShieldAlert, 
  Eye, 
  Zap, 
  RotateCw, 
  ChevronRight, 
  Layers, 
  ArrowUpRight, 
  ArrowDownRight,
  Filter,
  BarChart2
} from 'lucide-react';
import { ThemeConfig } from '../types';
import CoinIcon from './CoinIcon';

interface TradingScannerProps {
  theme: ThemeConfig;
  onSelectCoin: (coin: string) => void;
  onTriggerNotification: (title: string, message: string, type: any) => void;
}

export default function TradingScanner({
  theme,
  onSelectCoin,
  onTriggerNotification
}: TradingScannerProps) {
  const [activeSegment, setActiveSegment] = useState<'ALL' | 'MEME' | 'DEFI' | 'L1' | 'AI'>('ALL');
  const [isScanning, setIsScanning] = useState(false);
  const [scannerTime, setScannerTime] = useState<string>('Just now');

  // Scanner dynamic state
  const [scannerData, setScannerData] = useState([
    { coin: 'BTC/USDT', price: 64129.20, change: 2.45, volume: '$28.4B', category: 'L1', whaleActivity: 'HIGH INFLOW', breakout: 'BOS Confirmed', structure: 'STRONG BULLISH', score: 91 },
    { coin: 'ETH/USDT', price: 3421.15, change: -0.82, volume: '$12.1B', category: 'L1', whaleActivity: 'STABLE OUTFLOW', breakout: 'Liquidity Sweep', structure: 'NEUTRAL CHOP', score: 68 },
    { coin: 'SOL/USDT', price: 144.60, change: 5.82, volume: '$4.2B', category: 'L1', whaleActivity: 'EXTREME LEVERAGE', breakout: 'SAR Flip Buy', structure: 'ACCELERATING', score: 88 },
    { coin: 'BNB/USDT', price: 588.40, change: 1.42, volume: '$2.1B', category: 'L1', whaleActivity: 'STEADY ACCUM', breakout: 'Consolidation Break', structure: 'MODERATE BULL', score: 84 },
    { coin: 'DOGE/USDT', price: 0.1442, change: 11.20, volume: '$1.8B', category: 'MEME', whaleActivity: 'RETAIL INFLOW', breakout: 'Resistance Sweep', structure: 'HIGH VOLATILITY', score: 82 },
    { coin: 'PEPE/USDT', price: 0.0000142, change: 22.40, volume: '$950M', category: 'MEME', whaleActivity: 'WHALE ACCUM', breakout: 'ATH Breakout', structure: 'PARABOLIC', score: 95 },
    { coin: 'RNDR/USDT', price: 8.42, change: 8.75, volume: '$840M', category: 'AI', whaleActivity: 'SMART WALLET INFLOW', breakout: 'BOS Support', structure: 'BULLISH MARKUP', score: 90 },
    { coin: 'FET/USDT', price: 1.84, change: 12.10, volume: '$620M', category: 'AI', whaleActivity: 'STEADY ACCUM', breakout: 'EMA 50 Bounce', structure: 'BULLISH', score: 87  },
    { coin: 'LINK/USDT', price: 15.10, change: -2.15, volume: '$440M', category: 'DEFI', whaleActivity: 'STEADY DISTRIBUTION', breakout: 'CHoCH Bearish', structure: 'DOWNTREND', score: 41 },
    { coin: 'AAVE/USDT', price: 92.40, change: 4.50, volume: '$310M', category: 'DEFI', whaleActivity: 'TREASURY REBAL', breakout: 'Range Accumulation', structure: 'ACCUMULATION', score: 76 }
  ]);

  const [sectorPerformances, setSectorPerformances] = useState([
    { name: 'AI Layer Systems', change: 10.95, strength: 'PARABOLIC', flow: 2.1 },
    { name: 'Meme Protocols', change: 16.80, strength: 'HYPER-SPECULATIVE', flow: 4.8 },
    { name: 'Layer 1 Cores', change: 2.21, strength: 'STABLE GROWTH', flow: 1.2 },
    { name: 'DeFi Liquidity Hubs', change: 1.15, strength: 'CHOPPING RANGE', flow: -0.4 }
  ]);

  const runSystemScan = () => {
    setIsScanning(true);
    onTriggerNotification(
      'Vegapunk Scanner Running',
      'Deploying telemetry probes directly into orderbook depth APIs.',
      'SIGNAL'
    );
    setTimeout(() => {
      // Intelligently randomize values with slight offsets to represent active scanning
      setScannerData(prev => 
        prev.map(item => {
          const delta = (Math.random() - 0.48) * 0.4;
          const scoreDelta = Math.floor((Math.random() - 0.5) * 4);
          return {
            ...item,
            price: Number((item.price * (1 + delta / 100)).toFixed(item.price < 1 ? 7 : 2)),
            change: Number((item.change + delta).toFixed(2)),
            score: Math.min(100, Math.max(10, item.score + scoreDelta))
          };
        })
      );
      setScannerTime(new Date().toLocaleTimeString());
      setIsScanning(false);
      onTriggerNotification(
        'Scanner Refreshed',
        'Telemetry confirmed. 14 critical liquidity pockets identified.',
        'NEWS'
      );
    }, 1200);
  };

  const filteredScanner = scannerData.filter(item => {
    if (activeSegment === 'ALL') return true;
    return item.category === activeSegment;
  });

  return (
    <div className="flex flex-col gap-6">
      
      {/* Dynamic Glass Hero Banner */}
      <div className={`p-6 rounded-3xl ${theme.cardClass} relative overflow-hidden border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-6`}>
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full blur-[100px] pointer-events-none bg-gradient-to-br from-indigo-500/10 to-purple-500/5" />
        
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="p-1 px-2.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-mono text-[9px] rounded-full uppercase tracking-wider animate-pulse">
              INTELLIGENT LIQUID PROBE
            </span>
            <span className="text-gray-500 font-mono text-[9px]">• LAST REALIGN: {scannerTime}</span>
          </div>
          <h2 className="font-display font-bold text-xl md:text-2xl text-white tracking-tight">
            VEGAPUNK COGNITIVE SCANNER
          </h2>
          <p className="text-xs text-white/60 leading-relaxed max-w-lg">
            A next-generation full-screen micro-structure sentinel. Automatically tracking real-time order flow imbalances, institutional spot accumulations, and sector rotations.
          </p>
        </div>

        <button 
          onClick={runSystemScan}
          disabled={isScanning}
          className="h-11 px-6 rounded-full font-mono text-xs flex items-center justify-center gap-2 border border-white/10 text-white hover:bg-white/5 transition-all self-start md:self-center cursor-pointer relative overflow-hidden"
        >
          {isScanning ? (
            <>
              <RotateCw className="w-3.5 h-3.5 animate-spin" />
              <span>ALIGNING APIS...</span>
            </>
          ) : (
            <>
              <Activity className="w-3.5 h-3.5" style={{ color: theme.accentColor }} />
              <span>RE-SCAN TOTAL ORDERBOOKS</span>
            </>
          )}
        </button>
      </div>

      {/* Grid Layout for Sectors and Whales */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Sector Rotation Matrix Card */}
        <div className={`lg:col-span-2 p-5 rounded-3xl ${theme.cardClass} border border-white/10 flex flex-col gap-4 relative`}>
          <div className="flex justify-between items-center pb-2 border-b border-white/[0.08]">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-400" />
              <span className="font-display font-semibold text-xs text-white uppercase tracking-wider">Sector Rotation Matrix</span>
            </div>
            <span className="font-mono text-[10px] text-purple-400">LIQUID ROTATION</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {sectorPerformances.map((sect, i) => (
              <div 
                key={i} 
                className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:border-white/10 hover:bg-white/[0.04] transition-all flex flex-col justify-between h-28"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h5 className="font-sans font-bold text-[13px] text-white leading-tight">{sect.name}</h5>
                    <span className="font-mono text-[9.5px] text-gray-400 font-semibold block mt-1">{sect.strength}</span>
                  </div>
                  <span className={`font-mono text-xs font-bold leading-none px-2 py-1 rounded-md ${sect.change >= 0 ? 'text-emerald-400 bg-emerald-500/10' : 'text-rose-400 bg-rose-500/10'}`}>
                    {sect.change >= 0 ? '+' : ''}{sect.change}%
                  </span>
                </div>

                <div className="flex justify-between items-end border-t border-white/5 pt-2.5">
                  <span className="text-[9px] font-mono text-gray-500 uppercase">TELEMETRY COMPOSITE</span>
                  <div className="flex items-center gap-1 font-mono text-[10px]">
                    <span className="text-gray-400">NET FLOW:</span>
                    <span className={sect.flow >= 0 ? 'text-emerald-400 font-semibold' : 'text-rose-400 font-semibold'}>
                      {sect.flow >= 0 ? '+$' : '-$'}{Math.abs(sect.flow)}M
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Whale Flow Sentinel Tracker */}
        <div className={`p-5 rounded-3xl ${theme.cardClass} border border-white/10 flex flex-col gap-4`}>
          <div className="flex justify-between items-center pb-2 border-b border-white/[0.08]">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span className="font-display font-semibold text-xs text-white uppercase tracking-wider">Whale Radar</span>
            </div>
            <span className="font-mono text-[9px] text-amber-400 animate-pulse">● RADAR LIVE</span>
          </div>

          <div className="flex-1 overflow-y-auto flex flex-col gap-3 max-h-[190px] pr-1 scrollbar-thin">
            {[
              { time: '1m ago', action: 'SWEPT LIQUIDITY', details: '680 BTC taken from leverage stops near $63.8K', level: 'HIGH' },
              { time: '8m ago', action: 'ACCUMULATION', details: '24,000 SOL transferred from Kraken pool to smart escrow', level: 'CRITICAL' },
              { time: '14m ago', action: 'LARGE MINING INFLOW', details: '10,000 ETH smart deposit injected to staking contract', level: 'MEDIUM' }
            ].map((whale, idx) => (
              <div key={idx} className="p-3 bg-white/[0.015] border border-white/5 rounded-xl flex flex-col gap-1.5 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-[9px] text-gray-500 uppercase font-semibold">{whale.time}</span>
                  <span className={`font-mono text-[8px] px-1.5 py-0.5 rounded ${whale.level === 'CRITICAL' ? 'bg-red-550/15 text-red-400 border border-red-550/20' : whale.level === 'HIGH' ? 'bg-amber-500/10 text-amber-400' : 'bg-gray-500/10 text-gray-300'}`}>
                    {whale.level} IMPACT
                  </span>
                </div>
                <div>
                  <h6 className="font-display font-bold text-white text-[11px] uppercase tracking-wide">{whale.action}</h6>
                  <p className="text-gray-400 text-[10.5px] leading-tight mt-0.5">{whale.details}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Advanced Telemetry Table Section */}
      <div className={`p-5 rounded-3xl ${theme.cardClass} border border-white/10 flex flex-col gap-4`}>
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-white/[0.08] pb-3">
          <div className="flex items-center gap-2.5">
            <Filter className="w-4 h-4 text-emerald-400" />
            <h3 className="font-display font-bold text-xs text-white uppercase tracking-wider">Order Flow Probes</h3>
          </div>

          {/* Segment Filtering */}
          <div className="flex bg-white/5 border border-white/10 p-1 rounded-xl items-center self-start sm:self-auto">
            {(['ALL', 'MEME', 'DEFI', 'L1', 'AI'] as const).map(seg => (
              <button
                key={seg}
                onClick={() => setActiveSegment(seg)}
                className={`px-3 py-1.5 rounded-lg text-[9px] font-mono tracking-wider font-bold transition-all ${activeSegment === seg ? 'bg-white text-black' : 'text-gray-400 hover:text-white'}`}
              >
                {seg}
              </button>
            ))}
          </div>
        </div>

        {/* Responsive Horizontal scroll container for tables */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[650px]">
            <thead>
              <tr className="border-b border-white/5 font-mono text-[9px] text-gray-500 uppercase tracking-widest">
                <th className="py-2.5">Coin Asset</th>
                <th className="py-2.5">Indices Spot Price</th>
                <th className="py-2.5">24H Velocity</th>
                <th className="py-2.5">Breakout Telemetry</th>
                <th className="py-2.5 font-bold">Whales flow</th>
                <th className="py-2.5 text-right">Imbalance Score</th>
                <th className="py-2.5 pr-2 text-right">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredScanner.map((row) => {
                const isBullish = row.change >= 0;
                return (
                  <tr 
                    key={row.coin} 
                    className="hover:bg-white/[0.02] transition-colors group cursor-pointer text-xs"
                  >
                    <td className="py-3">
                      <div className="flex items-center gap-2.5">
                        <CoinIcon pair={row.coin} size={28} />
                        <div>
                          <span className="font-display font-semibold text-white block">{row.coin}</span>
                          <span className="font-mono text-[9px] text-gray-500 block">{row.category} Core Architecture</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 font-mono text-white/90 font-semibold">
                      ${row.price < 0.01 ? row.price.toFixed(6) : row.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>

                    <td className={`py-3 font-mono font-bold ${isBullish ? 'text-emerald-400' : 'text-rose-400'}`}>
                      <span className="flex items-center">
                        {isBullish ? <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> : <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />}
                        {isBullish ? '+' : ''}{row.change}%
                      </span>
                    </td>

                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded font-mono text-[9px] bg-white/5 border border-white/10 text-gray-300">
                        {row.breakout}
                      </span>
                    </td>

                    <td className="py-3 font-mono text-[10px] text-indigo-300 font-semibold tracking-wide">
                      {row.whaleActivity}
                    </td>

                    <td className="py-3 text-right">
                      <div className="inline-flex items-center gap-1">
                        <span className="p-1 px-1.5 bg-indigo-500/10 text-indigo-400 font-mono font-bold text-[9px] rounded-md border border-indigo-500/20">
                          {row.score}%
                        </span>
                      </div>
                    </td>

                    <td className="py-3 text-right pr-2">
                      <button 
                        onClick={() => onSelectCoin(row.coin)}
                        className="p-1.5 px-3 rounded-lg border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 text-[10px] font-mono font-bold uppercase transition-all flex items-center gap-1 ml-auto text-white cursor-pointer"
                      >
                        Focus <ChevronRight className="w-3 h-3 text-gray-400 group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
