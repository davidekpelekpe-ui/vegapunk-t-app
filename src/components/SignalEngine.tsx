import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Sparkles, 
  TrendingUp, 
  TrendingDown, 
  TrendingUpDown,
  RefreshCw, 
  Compass, 
  ShieldAlert, 
  CheckCircle, 
  Bell, 
  Lock, 
  ChevronRight, 
  Search,
  Check,
  Zap,
  Radio,
  SlidersHorizontal
} from 'lucide-react';
import { ThemeConfig, TradeSignal } from '../types';
import CoinIcon from './CoinIcon';
import { getApiUrl } from '../lib/api';

interface SignalEngineProps {
  theme: ThemeConfig;
  onSelectCoin: (coin: string) => void;
  activeCoin: string;
  onTriggerNotification: (title: string, msg: string, type: any) => void;
  apiConnected: boolean;
}

export default function SignalEngine({ 
  theme, 
  onSelectCoin, 
  activeCoin, 
  onTriggerNotification,
  apiConnected 
}: SignalEngineProps) {
  const [signals, setSignals] = useState<TradeSignal[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userPrompt, setUserPrompt] = useState('');
  const [signalFilter, setSignalFilter] = useState<'ALL' | 'BUY' | 'SELL' | 'SCALPING' | 'SWING'>('ALL');
  
  // Custom synced watchlists locally
  const [watchlist, setWatchlist] = useState<string[]>(['BTC/USDT', 'ETH/USDT']);
  const [refreshTimer, setRefreshTimer] = useState<number>(30);

  // Fetch initial signals on mount
  const fetchSignals = async (customPrompt?: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/signals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customizePrompt: customPrompt || '' })
      });
      const data = await response.json();
      if (data.success && data.signals) {
        setSignals(data.signals);
        if (customPrompt) {
          onTriggerNotification(
            'VP Quantum Signal Refined',
            'Sovereign AI successfully generated customized trading reasonings for active signals.',
            'SIGNAL'
          );
        }
      }
    } catch (err) {
      console.error('Failed to align signals:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSignals();
  }, []);

  // 30 seconds count down refreshing loops
  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshTimer(prev => {
        if (prev <= 1) {
          fetchSignals();
          return 30;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleCustomRefine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userPrompt.trim()) return;
    fetchSignals(userPrompt);
  };

  const toggleWatchlist = (coin: string) => {
    if (watchlist.includes(coin)) {
      setWatchlist(prev => prev.filter(c => c !== coin));
      onTriggerNotification('Watchlist Aligned', `${coin} has been removed from customized tracking.`, 'SIGNAL');
    } else {
      setWatchlist(prev => [...prev, coin]);
      onTriggerNotification('Watchlist Aligned', `${coin} successfully mapped into active watchlist monitoring.`, 'SIGNAL');
    }
  };

  // Process filters
  const filteredSignals = signals.filter(sig => {
    if (signalFilter === 'ALL') return true;
    if (signalFilter === 'BUY') return sig.type === 'BUY';
    if (signalFilter === 'SELL') return sig.type === 'SELL';
    if (signalFilter === 'SCALPING') return sig.signalType === 'SCALPING';
    if (signalFilter === 'SWING') return sig.signalType === 'SWING';
    return true;
  });

  return (
    <div className="flex flex-col gap-5">
      
      {/* Search Prompt Custom AI refinement section */}
      <form onSubmit={handleCustomRefine} className={`p-4 rounded-3xl ${theme.cardClass} flex flex-col gap-3 relative overflow-hidden border border-white/[0.04]`}>
        <div className="flex items-center gap-2">
          <Sparkles className="w-4.5 h-4.5 text-purple-400 animate-pulse" />
          <span className="text-[11px] font-mono tracking-wider text-purple-400 font-semibold uppercase">AI VOLATILITY CRITERIA TUNER</span>
        </div>
        
        <p className="text-xs text-gray-500 font-sans leading-relaxed">
          Calibrate the sovereign AI cognitive engine. Request specialized setups (e.g. "Scan for high volatility scalp grids with solid resistance sweeps").
        </p>

        <div className="flex gap-2 relative">
          <input
            type="text"
            placeholder="Type your trading hypothesis..."
            value={userPrompt}
            onChange={(e) => setUserPrompt(e.target.value)}
            className="flex-1 h-11 px-4 pr-10 rounded-xl bg-black/30 border border-white/[0.08] text-xs focus:outline-none placeholder:text-gray-500 text-white font-sans focus:border-purple-500/50 transition-colors"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="h-11 px-4 rounded-xl bg-purple-600 text-white hover:bg-purple-700 font-mono text-xs flex items-center gap-1.5 transition-colors font-medium cursor-pointer"
          >
            {isLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5" />}
            {isLoading ? 'Calibrating...' : 'Tune'}
          </button>
        </div>
      </form>

      {/* Title & Filter Options */}
      <div className="flex justify-between items-center flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <h3 className="font-display font-bold text-base">QUANTUM AI SIGNALS</h3>
          <span className="font-mono text-[9px] text-gray-400 bg-white/[0.05] px-2 py-0.5 rounded flex items-center gap-1 border border-white/[0.03]">
            <Radio className="w-2.5 h-2.5 animate-pulse text-red-500" /> Auto-sync in {refreshTimer}s
          </span>
        </div>

        {/* Filters */}
        <div className="flex bg-black/25 rounded-lg p-0.5 border border-white/[0.04] overflow-x-auto max-w-full">
          {(['ALL', 'BUY', 'SELL', 'SCALPING', 'SWING'] as const).map(f => (
            <button
              key={f}
              onClick={() => setSignalFilter(f)}
              className={`px-2.5 py-1 text-[10px] font-mono rounded-md transition-all uppercase whitespace-nowrap ${
                signalFilter === f ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'
              }`}
              style={signalFilter === f ? { color: theme.accentColor } : {}}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Signals Grid rendering */}
      <div className="flex flex-col gap-4">
        {isLoading && signals.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center gap-3">
            <RefreshCw className="w-6 h-6 animate-spin" style={{ color: theme.accentColor }} />
            <span className="font-mono text-xs text-gray-500">Recalibrating Quantum Alignment Engine...</span>
          </div>
        ) : filteredSignals.length === 0 ? (
          <div className="h-32 rounded-2xl border border-white/[0.04] bg-black/10 flex flex-col justify-center items-center text-center p-6 text-gray-500">
            <ShieldAlert className="w-5 h-5 mb-2" />
            <span className="text-xs font-mono">No matching signals matching current filters.</span>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {filteredSignals.map(sig => {
              const isActive = activeCoin === sig.coinPair;
              const isBuy = sig.type === 'BUY';
              const indicatorColor = isBuy ? '#10B981' : '#EF4444';
              const indicatorBg = isBuy ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)';
              
              return (
                <motion.div
                  key={sig.id}
                  layout
                  initial={{ opacity: 0, scale: 0.98, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className={`p-5 rounded-3xl ${theme.cardClass} border relative overflow-hidden transition-all duration-300 flex flex-col gap-4 ${
                    isActive ? 'ring-1 border-white/20' : 'border-white/[0.04]'
                  }`}
                  style={isActive ? { borderColor: theme.accentColor } : {}}
                >
                  
                  {/* Glass layout decorative glow indicator */}
                  <div className="absolute top-0 right-0 w-24 h-24 rounded-full blur-[40px] pointer-events-none opacity-20"
                       style={{ background: indicatorColor }} />

                  {/* Top card block */}
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2.5">
                      <div className="flex items-center gap-2">
                        <CoinIcon pair={sig.coinPair} size={32} />
                        <button 
                          onClick={() => onSelectCoin(sig.coinPair)}
                          className="text-left cursor-pointer group"
                        >
                          <h4 className="font-display font-semibold text-sm group-hover:underline flex items-center gap-1 text-white">
                            {sig.coinPair}
                            <ChevronRight className="w-3.5 h-3.5 text-gray-400 group-hover:translate-x-0.5 transition-transform" />
                          </h4>
                          <span className="font-mono text-[9px] text-gray-400 uppercase leading-none block mt-0.5">{sig.signalType} • {sig.timeframe}</span>
                        </button>
                      </div>
                      
                      {/* Watchlist Star Toggle */}
                      <button 
                        onClick={() => toggleWatchlist(sig.coinPair)}
                        className="p-1.5 rounded-lg border border-white/10 hover:bg-white/5 transition-colors"
                      >
                        <Check className={`w-3.5 h-3.5 ${watchlist.includes(sig.coinPair) ? 'text-amber-400' : 'text-gray-600'}`} />
                      </button>
                    </div>

                    <div className="flex flex-col items-end">
                      <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold tracking-wider leading-none"
                            style={{ backgroundColor: indicatorBg, color: indicatorColor }}>
                        {sig.type}
                      </span>
                      <span className="font-mono text-[9px] text-gray-500 mt-1">{sig.timestamp}</span>
                    </div>
                  </div>

                  {/* Signal quantitative table info */}
                  <div className="grid grid-cols-3 gap-3 bg-black/15 p-3 rounded-2xl border border-white/[0.03]">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-mono text-gray-500 uppercase">ENTRY TARGET</span>
                      <span className="text-sm font-mono font-bold tracking-tight text-white">
                        ${sig.entryPrice.toLocaleString(undefined, { maximumFractionDigits: sig.coinPair.startsWith('PEPE') ? 8 : 2 })}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-mono text-gray-500 uppercase">STOP LOSS</span>
                      <span className="text-sm font-mono font-semibold tracking-tight text-red-400">
                        ${sig.stopLoss.toLocaleString(undefined, { maximumFractionDigits: sig.coinPair.startsWith('PEPE') ? 8 : 2 })}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-mono text-gray-500 uppercase">TAKE PROFIT</span>
                      <span className="text-sm font-mono font-semibold tracking-tight text-emerald-400">
                        ${sig.takeProfit.toLocaleString(undefined, { maximumFractionDigits: sig.coinPair.startsWith('PEPE') ? 8 : 2 })}
                      </span>
                    </div>
                  </div>

                  {/* Metadata and AI reasoning blocks */}
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center text-[10px] font-mono">
                      <span className="text-gray-500 uppercase">CONFIDENCE SCORE</span>
                      <span style={{ color: indicatorColor }} className="font-bold">{sig.confidence}%</span>
                    </div>
                    
                    {/* Progress Bar of confidence */}
                    <div className="h-1.5 w-full bg-white/[0.03] rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-500" 
                           style={{ width: `${sig.confidence}%`, backgroundColor: indicatorColor }} />
                    </div>

                    {/* MULTI-TIMEFRAME ANALYSIS MATRIX (1m, 5m, 15m, 1h, 4h, 1d) */}
                    <div className="mt-1 bg-black/20 p-2.5 rounded-xl border border-white/5 flex flex-col gap-2 select-none">
                      <div className="flex justify-between items-center text-[9px] font-mono text-gray-400">
                        <span>MULTI-TIMEFRAME ALIGNMENT Matrix</span>
                        <span className="text-[8px] text-gray-500">PROBE DEPTH : 6 LAYERS</span>
                      </div>
                      <div className="grid grid-cols-6 gap-2 text-center text-[9.5px] font-mono">
                        {(['1m', '5m', '15m', '1h', '4h', '1d'] as const).map(tf => {
                          const val = sig.timeframeConfirmations?.[tf] || 'NEUTRAL';
                          const valColor = val === 'BULLISH' ? 'text-emerald-400 bg-emerald-500/10' : val === 'BEARISH' ? 'text-rose-450 bg-rose-500/10' : 'text-gray-400 bg-white/5';
                          return (
                            <div key={tf} className={`p-1 rounded flex flex-col gap-0.5 border border-white/[0.03] ${valColor}`}>
                              <span className="text-[8px] text-gray-400 font-bold block">{tf.toUpperCase()}</span>
                              <span className="font-bold leading-none block text-[8px]">{val.slice(0, 4)}</span>
                            </div>
                          );
                        })}
                      </div>

                      {/* Alignment conflict warning indicators */}
                      {sig.alignmentConflict && (
                        <div className="p-2 rounded-lg bg-red-400/5 border border-red-500/15 text-[9px] text-red-300 font-sans flex items-center gap-1.5 leading-snug">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                          <span><strong>Timeframe Conflict!</strong> Lower timeframe indicators are opposing the Daily macro target trend. Marked as High Risk scenario.</span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap justify-between items-center gap-2 mt-1 text-[10px] font-mono">
                      <span className="text-gray-500">RISK / REWARD: <span className="text-gray-300">{sig.riskRewardRatio}</span></span>
                      <span className="text-gray-500">RISK LEVEL: <span className="text-orange-400">{sig.riskScore}/10</span></span>
                    </div>
                  </div>

                  {/* AI reasonings with premium formatting */}
                  <div className="border-t border-white/[0.04] pt-3 flex flex-col gap-1.5">
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                      <span className="text-[10px] font-mono text-gray-400 tracking-wider font-semibold uppercase">AI COGNITIVE RATIO HYPOTHESIS</span>
                    </div>
                    <p className="text-[11px] font-sans text-gray-400 leading-relaxed font-light">
                      {sig.aiReasoning}
                    </p>
                  </div>

                  {/* Advanced Indicators */}
                  <div className="grid grid-cols-2 gap-2 pt-2 text-[10px] font-mono border-t border-white/[0.03] text-gray-500">
                    <div className="flex items-center gap-1">
                      <Compass className="w-3.5 h-3.5" />
                      <span>S: <span className="text-gray-300 font-semibold">${sig.supportLevel}</span></span>
                      <span>R: <span className="text-gray-300 font-semibold">${sig.resistanceLevel}</span></span>
                    </div>
                    <div className="flex justify-end items-center gap-1.5 text-right">
                      {sig.breakoutDetected && <span className="text-emerald-400 bg-emerald-500/10 px-1 rounded">BREAKOUT</span>}
                      {sig.liquiditySweep && <span className="text-purple-400 bg-purple-500/10 px-1 rounded">LIQUID-SWEEP</span>}
                    </div>
                  </div>

                  {/* Whale activity indicator tracker inside card */}
                  <div className="bg-white/[0.01] p-2.5 rounded-xl border border-white/[0.02] flex justify-between items-center text-[10px] font-mono text-gray-500">
                    <span>WHALE FLOW: <span className="text-white uppercase font-bold">{sig.whaleTracking.flow}</span></span>
                    <span>ACTIVITY: <span className="text-gray-300">{sig.whaleTracking.activity}</span></span>
                  </div>

                  {/* Synchronize Bybit Order Drawer Trigger */}
                  <button
                    onClick={() => {
                      if (!apiConnected) {
                        onTriggerNotification('Connecting Gateway Required', 'Sync Bybit API key parameters within Settings layout before executing orders.', 'SIGNAL');
                      } else {
                        onTriggerNotification('Gateway Order Created', `Secured ${sig.type} instruction for ${sig.coinPair} aligned. Total risk ${sig.riskScore}/10 margin verified.`, 'SIGNAL');
                      }
                    }}
                    className="w-full h-10 rounded-xl flex items-center justify-center gap-1.5 hover:bg-white/5 border border-white/[0.06] hover:border-white/10 text-xs font-medium font-display transition-all"
                  >
                    {!apiConnected ? (
                      <>
                        <Lock className="w-3.5 h-3.5 text-gray-500" />
                        <span>Establish Bybit API Node to Trade</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-3.5 h-3.5" style={{ color: theme.accentColor }} />
                        <span style={{ color: theme.accentColor }}>Instantly Transmit Order to Bybit</span>
                      </>
                    )}
                  </button>

                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>

    </div>
  );
}
