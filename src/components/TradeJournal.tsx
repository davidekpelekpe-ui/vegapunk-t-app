import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  PlusCircle, 
  Plus, 
  TrendingUp, 
  TrendingDown, 
  Heart, 
  Activity, 
  Brain, 
  ShieldAlert, 
  Check, 
  Trash2, 
  BarChart2, 
  ChevronRight,
  Smile,
  AlertCircle
} from 'lucide-react';
import { ThemeConfig } from '../types';

interface TradeJournalProps {
  theme: ThemeConfig;
  onTriggerNotification: (title: string, message: string, type: any) => void;
}

interface JournalEntry {
  id: string;
  coinPair: string;
  type: 'BUY' | 'SELL';
  entryPrice: number;
  exitPrice: number;
  pnl: number;
  strategy: string;
  emotion: 'CALM' | 'FOMO' | 'FEAR' | 'GREEDY' | 'REVENGE';
  notes: string;
  timestamp: string;
}

export default function TradeJournal({
  theme,
  onTriggerNotification
}: TradeJournalProps) {
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([
    {
      id: 'jou-1',
      coinPair: 'BTC/USDT',
      type: 'BUY',
      entryPrice: 62450,
      exitPrice: 64120,
      pnl: 1670,
      strategy: 'Breakout Sweep',
      emotion: 'CALM',
      notes: 'Broke out of daily balance corridor. Aligned with 4H bullish macro context.',
      timestamp: 'Today, 10:24'
    },
    {
      id: 'jou-2',
      coinPair: 'SOL/USDT',
      type: 'BUY',
      entryPrice: 132.80,
      exitPrice: 144.50,
      pnl: 1170,
      strategy: 'HTF Trend Alignment',
      emotion: 'FOMO',
      notes: 'Followed volatile momentum upward. Entered late but hit TP targets swiftly.',
      timestamp: 'Yesterday, 14:15'
    },
    {
      id: 'jou-3',
      coinPair: 'ETH/USDT',
      type: 'SELL',
      entryPrice: 3480,
      exitPrice: 3510,
      pnl: -300,
      strategy: 'EMA support rejection',
      emotion: 'REVENGE',
      notes: 'Attempted to short minor 5m dips. Violated higher timeframe trend rules.',
      timestamp: '3 days ago'
    }
  ]);

  // Form State parameters
  const [showAddForm, setShowAddForm] = useState(false);
  const [coinPair, setCoinPair] = useState('BTC/USDT');
  const [tradeType, setTradeType] = useState<'BUY' | 'SELL'>('BUY');
  const [entryPrice, setEntryPrice] = useState('');
  const [exitPrice, setExitPrice] = useState('');
  const [pnl, setPnl] = useState('');
  const [strategy, setStrategy] = useState('HTF Trend Alignment');
  const [emotion, setEmotion] = useState<'CALM' | 'FOMO' | 'FEAR' | 'GREEDY' | 'REVENGE'>('CALM');
  const [notes, setNotes] = useState('');

  // Save new journal entry
  const handleSubmitEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!entryPrice || !exitPrice || !pnl) {
      onTriggerNotification('Verification Deficit', 'Please populate key financial numbers first.', 'WARNING');
      return;
    }

    const newEntry: JournalEntry = {
      id: `jou-${Date.now()}`,
      coinPair: coinPair.toUpperCase(),
      type: tradeType,
      entryPrice: Number(entryPrice),
      exitPrice: Number(exitPrice),
      pnl: Number(pnl),
      strategy,
      emotion,
      notes: notes || 'No analytical details inputted.',
      timestamp: 'Just now'
    };

    setJournalEntries(prev => [newEntry, ...prev]);
    setShowAddForm(false);
    
    // Clear elements
    setEntryPrice('');
    setExitPrice('');
    setPnl('');
    setNotes('');

    onTriggerNotification(
      'Journal Alignment Updated',
      `Trade logged for ${newEntry.coinPair}. AI behavioral profiling updating...`,
      'SIGNAL'
    );
  };

  const deleteEntryLog = (id: string) => {
    setJournalEntries(prev => prev.filter(e => e.id !== id));
    onTriggerNotification('Journal Entry Purged', 'Analytical record dismissed.', 'STOP_LOSS');
  };

  // Performance calculations
  const totalGainLoss = journalEntries.reduce((sum, item) => sum + item.pnl, 0);
  const winCount = journalEntries.filter(item => item.pnl > 0).length;
  const winRate = journalEntries.length > 0 ? (winCount / journalEntries.length) * 100 : 0;

  // Mock-AI Behavioral Analytics detection triggers
  const detectRevengeTriggers = journalEntries.some(item => item.emotion === 'REVENGE');
  const detectFomoRatio = journalEntries.filter(item => item.emotion === 'FOMO').length;

  return (
    <div className="flex flex-col gap-6">
      
      {/* Smart Analysis Banner */}
      <div className={`p-5 rounded-3xl ${theme.cardClass} border border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden bg-gradient-to-br from-indigo-500/[0.02]`}>
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-[80px] pointer-events-none bg-indigo-500/10" />

        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="p-1 px-2.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-mono text-[9px] rounded-full uppercase tracking-wider">
              Vegapunk Behavioral Ledger
            </span>
            <span className="text-gray-500 font-mono text-[9px]">• COGNITIVE BIO-STATISTICS</span>
          </div>
          <h2 className="font-display font-bold text-lg text-white">SMART TRADE JOURNAL</h2>
          <p className="text-xs text-white/60 leading-relaxed max-w-lg">
            Track your trades alongside psychological traits. Automatically identify trading biases, FOMO traps, and structural deviations from high-probability setups.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="h-11 px-6 rounded-full font-mono text-xs flex items-center justify-center gap-2 bg-white text-black hover:bg-white/90 font-bold shrink-0 cursor-pointer shadow-lg"
        >
          <Plus className="w-4 h-4" />
          <span>LOG UNIQUE TRADE</span>
        </button>
      </div>

      {/* Grid containing Quick Performance Metrics and AI Audit Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Performance Matrix Panel */}
        <div className={`lg:col-span-2 p-5 rounded-3xl ${theme.cardClass} border border-white/10 flex flex-col gap-4`}>
          <div className="flex justify-between items-center pb-2 border-b border-white/[0.08]">
            <div className="flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-emerald-400" />
              <span className="font-display font-semibold text-xs text-white uppercase tracking-wider">Performance Metrics</span>
            </div>
            <span className="font-mono text-[10px] text-emerald-400">LEDGER METRICS</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-3 bg-white/[0.02] border border-white/5 rounded-2xl flex flex-col gap-1">
              <span className="text-[9px] font-mono text-gray-500">ACCUMULATED PNL</span>
              <span className={`font-mono text-base font-bold ${totalGainLoss >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {totalGainLoss >= 0 ? '+' : ''}${totalGainLoss}
              </span>
            </div>

            <div className="p-3 bg-white/[0.02] border border-white/5 rounded-2xl flex flex-col gap-1">
              <span className="text-[9px] font-mono text-gray-400">HIST WIN RATE</span>
              <span className="font-mono text-base font-bold text-white">{winRate.toFixed(1)}%</span>
            </div>

            <div className="p-3 bg-white/[0.02] border border-white/5 rounded-2xl flex flex-col gap-1">
              <span className="text-[9px] font-mono text-gray-400">TOTAL LEDGERS</span>
              <span className="font-mono text-base font-bold text-white">{journalEntries.length} Trades</span>
            </div>

            <div className="p-3 bg-white/[0.02] border border-white/5 rounded-2xl flex flex-col gap-1">
              <span className="text-[9px] font-mono text-gray-400">DOMINATING STRATEGY</span>
              <span className="font-sans text-xs font-bold text-indigo-300 truncate mt-1">HTF Trend Align</span>
            </div>
          </div>
        </div>

        {/* AI Behavioral Audit Panel */}
        <div className={`p-5 rounded-3xl ${theme.cardClass} border border-white/10 flex flex-col gap-3.5 relative overflow-hidden bg-gradient-to-b from-purple-500/[0.02]`}>
          <div className="absolute top-0 right-0 w-24 h-24 rounded-full blur-[45px] pointer-events-none bg-purple-500/10" />

          <div className="flex justify-between items-center pb-2 border-b border-white/[0.08]">
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-purple-400" />
              <span className="font-display font-semibold text-xs text-white uppercase tracking-wider">AI Psychological Profile</span>
            </div>
            <span className="font-mono text-[9px] text-purple-400">COGNITION</span>
          </div>

          <div className="flex flex-col gap-3 text-xs leading-relaxed text-gray-300">
            {detectRevengeTriggers && (
              <div className="p-3 rounded-xl bg-orange-500/5 border border-orange-500/15 flex gap-2">
                <ShieldAlert className="w-4.5 h-4.5 text-orange-400 shrink-0" />
                <div>
                  <h5 className="font-bold text-white text-[11px] uppercase tracking-wide">Revenge Impulses Detected</h5>
                  <p className="text-gray-400 text-[10.5px] mt-0.5">Deficit mitigation trades detected during high-volatility sessions. Strictly align entries to pre-set SAR and structural zones.</p>
                </div>
              </div>
            )}

            {detectFomoRatio > 0 ? (
              <div className="p-3 rounded-xl bg-purple-500/5 border border-purple-500/15 flex gap-2">
                <AlertCircle className="w-4.5 h-4.5 text-purple-400 shrink-0" />
                <div>
                  <h5 className="font-bold text-white text-[11px] uppercase tracking-wide">FOMO Bias Identified ({detectFomoRatio})</h5>
                  <p className="text-gray-400 text-[10.5px] mt-0.5">High entry velocities logged without 4H Higher Timeframe validations. Recommend 1H EMA crossovers for safe setups.</p>
                </div>
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/15 flex gap-2">
                <Smile className="w-4.5 h-4.5 text-emerald-400 shrink-0" />
                <div>
                  <h5 className="font-bold text-white text-[11px] uppercase tracking-wider">Mental State - Steady</h5>
                  <p className="text-gray-400 text-[10.5px] mt-0.5">Your setups maintain strict emotional discipline. Win rates are maximized inside structured consolidation breakouts.</p>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Dynamic Slide Down form for logging a trade */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`overflow-hidden border border-white/10 rounded-3xl p-5 ${theme.cardClass} flex flex-col gap-4`}
          >
            <h3 className="font-display font-bold text-sm text-white uppercase tracking-wider">Log System Operational execution</h3>
            
            <form onSubmit={handleSubmitEntry} className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono text-gray-500 uppercase">Coin Identifier</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. BTC/USDT"
                  value={coinPair}
                  onChange={e => setCoinPair(e.target.value)}
                  className="w-full h-11 px-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-white/20 text-white font-mono"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono text-gray-500 uppercase">Side Direction</label>
                <div className="flex bg-white/5 border border-white/10 p-1 rounded-xl h-11">
                  <button
                    type="button"
                    onClick={() => setTradeType('BUY')}
                    className={`flex-1 rounded-lg font-mono font-bold text-[10px] ${tradeType === 'BUY' ? 'bg-emerald-500 text-black' : 'text-gray-400'}`}
                  >
                    LONG BUY
                  </button>
                  <button
                    type="button"
                    onClick={() => setTradeType('SELL')}
                    className={`flex-1 rounded-lg font-mono font-bold text-[10px] ${tradeType === 'SELL' ? 'bg-rose-500 text-black' : 'text-gray-400'}`}
                  >
                    SHORT SELL
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono text-gray-500 uppercase">Interactive Strategy</label>
                <select
                  value={strategy}
                  onChange={e => setStrategy(e.target.value)}
                  className="w-full h-11 px-3 bg-[#0F1014] border border-white/10 rounded-xl focus:outline-none text-white font-mono"
                >
                  <option value="HTF Trend Alignment">HTF Trend Alignment</option>
                  <option value="Breakout Sweep">Breakout Sweep</option>
                  <option value="Pullback Fibonacci">Pullback Fibonacci</option>
                  <option value="Scalping Momentum">Scalping Momentum</option>
                  <option value="Revenge Recovery">Revenge Recovery</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono text-gray-500 uppercase">Entry Price ($)</label>
                <input
                  type="number"
                  required
                  placeholder="64000"
                  value={entryPrice}
                  onChange={e => setEntryPrice(e.target.value)}
                  className="w-full h-11 px-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-white/20 text-white font-mono"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono text-gray-500 uppercase">Exit Price ($)</label>
                <input
                  type="number"
                  required
                  placeholder="65100"
                  value={exitPrice}
                  onChange={e => setExitPrice(e.target.value)}
                  className="w-full h-11 px-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-white/20 text-white font-mono"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono text-gray-500 uppercase">Net Realized PNL ($)</label>
                <input
                  type="number"
                  required
                  placeholder="1100"
                  value={pnl}
                  onChange={e => setPnl(e.target.value)}
                  className="w-full h-11 px-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-white/20 text-white font-mono"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono text-gray-500 uppercase">Operational Emotion</label>
                <select
                  value={emotion}
                  onChange={e => setEmotion(e.target.value as any)}
                  className="w-full h-11 px-3 bg-[#0F1014] border border-white/10 rounded-xl focus:outline-none text-white font-mono"
                >
                  <option value="CALM">CALM (Intended Setup)</option>
                  <option value="FOMO">FOMO (Impulse Entry)</option>
                  <option value="FEAR">FEAR (Early close)</option>
                  <option value="GREEDY">GREEDY (Extended target)</option>
                  <option value="REVENGE">REVENGE (Deficit chase)</option>
                </select>
              </div>

              <div className="sm:col-span-2 flex flex-col gap-1.5">
                <label className="text-[10px] font-mono text-gray-500 uppercase">Reflective Notes</label>
                <input
                  type="text"
                  placeholder="Log any lessons, errors or specific indicator setups triggered."
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  className="w-full h-11 px-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-white/20 text-white"
                />
              </div>

              <div className="sm:col-span-3 flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="h-10 px-5 rounded-xl border border-white/10 hover:bg-white/5 text-gray-400 font-mono transition-colors cursor-pointer"
                >
                  DISMISS
                </button>
                <button
                  type="submit"
                  className="h-10 px-6 rounded-xl font-mono text-xs font-bold bg-white text-black hover:bg-white/90 transition-all cursor-pointer"
                >
                  SAVE RECORD
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Journal Lists */}
      <div className={`p-5 rounded-3xl ${theme.cardClass} border border-white/10 flex flex-col gap-4`}>
        <div className="flex justify-between items-center pb-2 border-b border-white/[0.08]">
          <span className="font-display font-semibold text-xs text-white uppercase tracking-wider">Historical System Log Entries</span>
          <span className="font-mono text-[9px] text-gray-500 uppercase">{journalEntries.length} RECORDS ACTIVE</span>
        </div>

        <div className="flex flex-col gap-4">
          {journalEntries.map(entry => {
            const isProfit = entry.pnl >= 0;
            return (
              <div 
                key={entry.id} 
                className="p-4 bg-white/[0.015] border border-white/5 rounded-2xl flex flex-col sm:flex-row justify-between gap-4 hover:border-white/10 transition-colors"
              >
                <div className="flex-1 flex flex-col gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-display font-bold text-white text-sm">{entry.coinPair}</span>
                    <span className={`font-mono text-[9px] font-bold px-2 py-0.5 rounded ${entry.type === 'BUY' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                      {entry.type === 'BUY' ? 'LONG' : 'SHORT'}
                    </span>
                    <span className="font-mono text-[9.5px] bg-white/5 border border-white/10 px-2 py-0.5 rounded text-gray-300">
                      {entry.strategy}
                    </span>
                    <span className={`font-mono text-[9px] px-2 py-0.5 rounded font-semibold ${entry.emotion === 'CALM' ? 'bg-indigo-500/10 text-indigo-300' : entry.emotion === 'FOMO' ? 'bg-purple-500/10 text-purple-300' : 'bg-amber-500/10 text-amber-300'}`}>
                      {entry.emotion} STATE
                    </span>
                  </div>

                  <p className="text-xs text-gray-400 leading-relaxed font-sans">{entry.notes}</p>

                  <div className="flex items-center gap-4 text-[10px] font-mono text-gray-500">
                    <span>ENTRY: ${entry.entryPrice.toLocaleString()}</span>
                    <span>EXIT: ${entry.exitPrice.toLocaleString()}</span>
                    <span>LOG TIMELINE: {entry.timestamp}</span>
                  </div>
                </div>

                <div className="flex sm:flex-col justify-between items-end shrink-0 gap-2">
                  <div className="text-right">
                    <span className="text-[10px] font-mono text-gray-500 uppercase block">PnL realized</span>
                    <span className={`font-mono text-sm font-bold block mt-0.5 ${isProfit ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {isProfit ? '+' : ''}${entry.pnl}
                    </span>
                  </div>

                  <button 
                    onClick={() => deleteEntryLog(entry.id)}
                    className="p-1.5 rounded-lg border border-white/5 hover:border-red-500/20 hover:bg-red-550/10 text-gray-500 hover:text-red-400 transition-colors cursor-pointer self-start sm:self-auto"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
