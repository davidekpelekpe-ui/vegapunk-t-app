import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Gamepad2, 
  HelpCircle, 
  TrendingUp, 
  TrendingDown, 
  ShieldAlert, 
  Activity, 
  Play, 
  Sparkles, 
  ChevronRight, 
  RotateCcw, 
  Plus, 
  Minus,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { ThemeConfig } from '../types';

interface TradingGameProps {
  theme: ThemeConfig;
  onTriggerNotification: (title: string, message: string, type: any) => void;
}

interface SimulatedPosition {
  type: 'LONG' | 'SHORT';
  entryPrice: number;
  stopLoss: number;
  takeProfit: number;
  size: number;
  leverage: number;
}

export default function TradingGame({
  theme,
  onTriggerNotification
}: TradingGameProps) {
  // Game Configuration Parameters
  const [selectedMode, setSelectedMode] = useState<'BEGINNER' | 'CHALLENGE' | 'CRASH_SIM' | 'AI_BATTLE'>('BEGINNER');
  const [gameState, setGameState] = useState<'OFFLINE' | 'ACTIVE' | 'CLOSED'>('OFFLINE');
  
  // Simulated Funds
  const [virtualBalance, setVirtualBalance] = useState<number>(10000);
  const [initialCapital, setInitialCapital] = useState<number>(10000);
  const [simulatedPnl, setSimulatedPnl] = useState<number>(0);

  // Challenge Variables
  const [challengeGoal, setChallengeGoal] = useState<number>(12000);
  const [challengeExpiry, setChallengeExpiry] = useState<number>(300); // 5 minutes in ticks
  const [timeRemaining, setTimeRemaining] = useState<number>(300);

  // Multi-Timeframe and Technical indicator selections
  const [activeTimeframe, setActiveTimeframe] = useState<'5M' | '15M' | '1H'>('15M');
  const [showIndicators, setShowIndicators] = useState({
    sar: true,
    macd: false,
    bands: true
  });

  // Simulator candle tracking arrays representing a raw visual chart feed
  const [candles, setCandles] = useState<{ open: number; high: number; low: number; close: number; time: string }[]>([]);
  const [currentPrice, setCurrentPrice] = useState<number>(64000);
  const [trendFactor, setTrendFactor] = useState<number>(0);

  // Position setup controller state
  const [tradeType, setTradeType] = useState<'LONG' | 'SHORT'>('LONG');
  const [orderLeverage, setOrderLeverage] = useState<number>(20);
  const [orderQuantity, setOrderQuantity] = useState<number>(50); // percentage of balance

  // Key Trade Line levels (interactive sliders in sandbox mode)
  const [entryLinePrice, setEntryLinePrice] = useState<number>(64000);
  const [tpLinePrice, setTpLinePrice] = useState<number>(65200);
  const [slLinePrice, setSlLinePrice] = useState<number>(63100);

  // Active open position inside simulator
  const [openPosition, setOpenPosition] = useState<SimulatedPosition | null>(null);

  // Initialize interactive virtual candlesticks on mount using stable starting vectors
  useEffect(() => {
    generateInitialSimulationCandles();
  }, []);

  // System game ticks simulator representing market flows
  useEffect(() => {
    if (gameState !== 'ACTIVE') return;

    const timer = setInterval(() => {
      // 1. Tick Time Expire
      setTimeRemaining(prev => {
        if (prev <= 1) {
          endCurrentSession('TIME_UP');
          return 0;
        }
        return prev - 1;
      });

      // 2. Generate Next Candle Wave
      tickNextMarketPrice();
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState, candles, currentPrice, openPosition, trendFactor, tpLinePrice, slLinePrice]);

  const generateInitialSimulationCandles = () => {
    let startClose = 64000;
    const initialArr = [];
    for (let i = 0; i < 28; i++) {
      const open = startClose;
      const change = (Math.random() - 0.49) * 350;
      const close = open + change;
      const high = Math.max(open, close) + Math.random() * 180;
      const low = Math.min(open, close) - Math.random() * 180;
      initialArr.push({
        open,
        high,
        low,
        close,
        time: `${i + 1}m`
      });
      startClose = close;
    }
    setCandles(initialArr);
    setCurrentPrice(startClose);
    setEntryLinePrice(startClose);
    setTpLinePrice(Number((startClose * 1.02).toFixed(0)));
    setSlLinePrice(Number((startClose * 0.985).toFixed(0)));
  };

  const tickNextMarketPrice = () => {
    // Mode specific market factors
    let modeBias = 0;
    if (selectedMode === 'CRASH_SIM') {
      modeBias = -300; // heavy crash vector bias
    } else if (selectedMode === 'CHALLENGE') {
      modeBias = (Math.random() - 0.5) * 45; // high noise range
    } else {
      modeBias = (Math.random() - 0.47) * 75; // slight recovery trend
    }

    const startPrice = currentPrice;
    const change = modeBias + (Math.random() - 0.5) * 160;
    const newPrice = Math.max(1000, startPrice + change);

    // Update candle list state
    const newCandle = {
      open: startPrice,
      high: Math.max(startPrice, newPrice) + Math.random() * 60,
      low: Math.min(startPrice, newPrice) - Math.random() * 60,
      close: newPrice,
      time: 'now'
    };

    setCandles(prev => [...prev.slice(1), newCandle]);
    setCurrentPrice(newPrice);
    setEntryLinePrice(newPrice);

    // Update active P&L calculations
    if (openPosition) {
      const entry = openPosition.entryPrice;
      const currentVal = newPrice;
      let profitPct = 0;

      if (openPosition.type === 'LONG') {
        profitPct = ((currentVal - entry) / entry) * openPosition.leverage;
      } else {
        profitPct = ((entry - currentVal) / entry) * openPosition.leverage;
      }

      const activePnlValue = openPosition.size * profitPct;
      setSimulatedPnl(activePnlValue);

      // Check Stop Loss and Take Profit levels
      if (openPosition.type === 'LONG') {
        if (currentVal >= openPosition.takeProfit) {
          triggerPositionClose(activePnlValue, 'TAKE_PROFIT_TRIGGERED');
        } else if (currentVal <= openPosition.stopLoss) {
          triggerPositionClose(activePnlValue, 'STOP_LOSS_TRIGGERED');
        }
      } else { // SHORT
        if (currentVal <= openPosition.takeProfit) {
          triggerPositionClose(activePnlValue, 'TAKE_PROFIT_TRIGGERED');
        } else if (currentVal >= openPosition.stopLoss) {
          triggerPositionClose(activePnlValue, 'STOP_LOSS_TRIGGERED');
        }
      }
    }
  };

  const startNewSimulationGame = () => {
    generateInitialSimulationCandles();
    setVirtualBalance(10000);
    setInitialCapital(10000);
    setSimulatedPnl(0);
    setTimeRemaining(challengeExpiry);
    setOpenPosition(null);
    setGameState('ACTIVE');
    
    onTriggerNotification(
      'Trading Challenge Triggered',
      `Session configured under ${selectedMode} protocol parameters. Balance set to $10,000.`,
      'SIGNAL'
    );
  };

  const executePositionOpen = () => {
    if (gameState !== 'ACTIVE') {
      onTriggerNotification('Challenge Offline', 'Please activate the simulation engine first.', 'WARNING');
      return;
    }
    if (openPosition) {
      onTriggerNotification('Position Collision', 'You already have an active simulated execution running.', 'WARNING');
      return;
    }

    const riskCapital = (virtualBalance * (orderQuantity / 100));
    const positionDetails: SimulatedPosition = {
      type: tradeType,
      entryPrice: currentPrice,
      stopLoss: slLinePrice,
      takeProfit: tpLinePrice,
      size: riskCapital,
      leverage: orderLeverage
    };

    setOpenPosition(positionDetails);
    onTriggerNotification(
      `${tradeType} Trigger Confirmed`,
      `Opened ${orderLeverage}x position at $${currentPrice.toFixed(0)}. Virtual Capital allocated: $${riskCapital.toFixed(0)}.`,
      'SIGNAL'
    );
  };

  const triggerPositionClose = (finalPnl: number, reason: string) => {
    if (!openPosition) return;

    const newBal = virtualBalance + finalPnl;
    setVirtualBalance(newBal);
    setOpenPosition(null);
    setSimulatedPnl(0);

    let displayMsg = '';
    let notificationType: any = 'NEWS';

    if (reason === 'TAKE_PROFIT_TRIGGERED') {
      displayMsg = `Take profit safely met! Gained virtual PnL of +$${finalPnl.toFixed(0)}!`;
      notificationType = 'TAKE_PROFIT';
    } else if (reason === 'STOP_LOSS_TRIGGERED') {
      displayMsg = `Stop Loss liquidated node. Relieved a simulated deficit of $${finalPnl.toFixed(0)}.`;
      notificationType = 'STOP_LOSS';
    } else {
      displayMsg = `Manual closure executed. PnL: ${finalPnl >= 0 ? '+' : ''}$${finalPnl.toFixed(0)}`;
    }

    onTriggerNotification('Simulation Trade Closed', displayMsg, notificationType);

    // Evaluate Goal Status
    if (newBal >= challengeGoal) {
      endCurrentSession('GOAL_REACHED');
    } else if (newBal <= 100) {
      endCurrentSession('MARGIN_CALL');
    }
  };

  const endCurrentSession = (status: 'TIME_UP' | 'GOAL_REACHED' | 'MARGIN_CALL' | 'MANUAL') => {
    setGameState('CLOSED');
    if (status === 'GOAL_REACHED') {
      onTriggerNotification(
        'CHALLENGE COMPLETED SECURELY',
        `Spectacular! You surpassed the target goal with final simulated vaults at $${virtualBalance.toFixed(0)}.`,
        'VOLATILITY'
      );
    } else if (status === 'MARGIN_CALL') {
      onTriggerNotification(
        'SIMULATION LIQUIDATED',
        'Deficit triggered simulated margin liquidation limits.',
        'STOP_LOSS'
      );
    } else if (status === 'TIME_UP') {
      onTriggerNotification(
        'SESSION TIMEOUT',
        `Timer expired. Your final simulated assets stood at $${virtualBalance.toFixed(0)}.`,
        'NEWS'
      );
    }
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* Onboarding Game System Banner */}
      <div className={`p-5 rounded-3xl ${theme.cardClass} border border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden bg-gradient-to-br from-indigo-500/[0.02]`}>
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-[80px] pointer-events-none bg-indigo-500/10" />

        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="p-1 px-2.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-mono text-[9px] rounded-full uppercase tracking-wider">
              Vegapunk Academy Node
            </span>
            <span className="text-gray-500 font-mono text-[9px]">• IMMERSIVE TRAINING CORE</span>
          </div>
          <h2 className="font-display font-bold text-lg text-white">COSMIC SIMULATOR FIELD</h2>
          <p className="text-xs text-white/60 leading-relaxed max-w-lg">
            Train risk mitigation protocols safely without risking real capital reserves. Explore simulated market anomalies, trend dynamics, and volatile liquid sweeps in real time.
          </p>
        </div>

        {gameState === 'OFFLINE' ? (
          <button
            onClick={startNewSimulationGame}
            className="h-11 px-6 rounded-full font-mono text-xs flex items-center justify-center gap-2 border border-white/10 text-white hover:bg-white/5 transition-all self-start cursor-pointer font-bold shrink-0 bg-white/5"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>START ACTIVE SESSION</span>
          </button>
        ) : (
          <button
            onClick={() => endCurrentSession('MANUAL')}
            className="h-11 px-6 rounded-full font-mono text-xs flex items-center justify-center gap-2 border border-rose-500/30 text-rose-400 hover:bg-rose-500/15 transition-all self-start cursor-pointer font-bold shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>TERMINATE STAGE</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Column 1 & 2: Interactive Sandbox Candlestick Canvas & Draggable sliders */}
        <div className="lg:col-span-2 flex flex-col gap-5">
          
          <div className={`p-5 rounded-3xl ${theme.cardClass} border border-white/10 flex flex-col gap-4 relative`}>
            
            {/* Simulation Stats Header */}
            <div className="flex justify-between items-center pb-2 border-b border-white/[0.08]">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-mono text-gray-400 uppercase">TELEMETRY CANVAS</span>
                {gameState === 'ACTIVE' && (
                  <span className="text-[9.5px] font-mono text-emerald-400 animate-pulse bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/15 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> SIM RUNNING
                  </span>
                )}
              </div>

              <div className="flex items-center gap-4 text-xs font-mono">
                <div className="flex items-center gap-1">
                  <span className="text-gray-500">VIRT BALANCE:</span>
                  <span className="text-white font-bold">${virtualBalance.toLocaleString(undefined, { maximumFractionDigits: 1 })}</span>
                </div>
                <div className="flex items-center gap-1 border-l border-white/10 pl-4">
                  <span className="text-gray-500">PnL:</span>
                  <span className={`font-bold ${simulatedPnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {simulatedPnl >= 0 ? '+' : ''}${simulatedPnl.toFixed(0)}
                  </span>
                </div>
              </div>
            </div>

            {/* Simulated Live Candlestick Canvas Widget */}
            <div className="h-64 h-min-60 relative rounded-2xl bg-black/45 border border-white/5 overflow-hidden flex flex-col justify-end p-2 select-none">
              
              {/* Draggable sliders visual mock-up showing adjustable lines */}
              <div className="absolute inset-x-0 inset-y-8 pointer-events-none flex flex-col justify-between z-10">
                {/* Take Profit target level */}
                <div className="border-t border-dashed border-emerald-500/50 relative flex items-center justify-between px-4">
                  <span className="bg-emerald-500/80 text-black text-[8px] font-mono font-bold uppercase rounded px-1.5 py-0.5 mt-[-10px] shadow-lg pointer-events-auto">
                    Take Profit (TP): ${tpLinePrice}
                  </span>
                  <div className="flex gap-1.5 mt-[-10px] pointer-events-auto">
                    <button 
                      onClick={() => setTpLinePrice(prev => prev - 50)}
                      className="w-4 h-4 rounded bg-emerald-500/20 text-emerald-300 flex items-center justify-center text-[10px] hover:bg-emerald-500/40"
                    >
                      -
                    </button>
                    <button 
                      onClick={() => setTpLinePrice(prev => prev + 50)}
                      className="w-4 h-4 rounded bg-emerald-500/20 text-emerald-300 flex items-center justify-center text-[10px] hover:bg-emerald-500/40"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Simulated entry line price */}
                <div className="border-t border-dashed border-blue-400/50 relative flex items-center justify-between px-4">
                  <span className="bg-blue-400/80 text-black text-[8px] font-mono font-bold uppercase rounded px-1.5 py-0.5 mt-[-10px]">
                    Current Entry Guide: ${currentPrice.toFixed(0)}
                  </span>
                </div>

                {/* Stop Loss target level */}
                <div className="border-t border-dashed border-rose-400/50 relative flex items-center justify-between px-4">
                  <span className="bg-rose-500/80 text-black text-[8px] font-mono font-bold uppercase rounded px-1.5 py-0.5 mt-[-10px] shadow-lg pointer-events-auto">
                    Stop Loss (SL): ${slLinePrice}
                  </span>
                  <div className="flex gap-1.5 mt-[-10px] pointer-events-auto">
                    <button 
                      onClick={() => setSlLinePrice(prev => prev - 50)}
                      className="w-4 h-4 rounded bg-rose-500/20 text-rose-300 flex items-center justify-center text-[10px] hover:bg-rose-500/40"
                    >
                      -
                    </button>
                    <button 
                      onClick={() => setSlLinePrice(prev => prev + 50)}
                      className="w-4 h-4 rounded bg-rose-500/20 text-rose-300 flex items-center justify-center text-[10px] hover:bg-rose-500/40"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Minimal Chart grid lines */}
              <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 pointer-events-none opacity-5">
                {[...Array(16)].map((_, i) => <div key={i} className="border border-white" />)}
              </div>

              {/* Standard Candles representation bar list */}
              <div className="flex items-end justify-between gap-[5px] h-40 relative z-0">
                {candles.map((cand, idx) => {
                  const isGreen = cand.close >= cand.open;
                  const ratio = Math.max(0.1, Math.min(1, (cand.close - 30000) / 70000));
                  const heightVal = `${Math.floor(ratio * 100)}%`;
                  
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center justify-end h-full">
                      {/* High low shadows */}
                      <div className={`w-[1.2px] absolute z-0 h-16 ${isGreen ? 'bg-emerald-500/60' : 'bg-rose-500/60'}`} style={{ bottom: `${idx * 1.5 + 20}px` }} />
                      
                      {/* Candle body */}
                      <div 
                        className={`w-full rounded-sm relative z-10 transition-all duration-300 border ${isGreen ? 'bg-emerald-500/40 border-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.15)]' : 'bg-rose-500/40 border-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.15)]'}`}
                        style={{ height: `${Math.max(8, Math.floor(Math.abs(cand.close - cand.open) / 55 + 5))}px` }}
                      ></div>
                    </div>
                  );
                })}
              </div>

            </div>

            {/* Live Chart Navigation Filters */}
            <div className="flex justify-between items-center text-xs font-mono">
              <div className="flex bg-white/5 border border-white/10 p-1 rounded-xl">
                {(['5M', '15M', '1H'] as const).map(tf => (
                  <button
                    key={tf}
                    onClick={() => setActiveTimeframe(tf)}
                    className={`px-2.5 py-1.5 rounded-lg text-[9px] font-bold ${activeTimeframe === tf ? 'bg-white text-black' : 'text-gray-400'}`}
                  >
                    {tf}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setShowIndicators(p => ({ ...p, sar: !p.sar }))}
                  className={`text-[9px] px-2 py-1 rounded border transition-colors ${showIndicators.sar ? 'border-indigo-500/30 text-indigo-300 bg-indigo-500/10' : 'border-white/10 text-gray-400'}`}
                >
                  Indicator: Parabolic SAR
                </button>
                <button 
                  onClick={() => setShowIndicators(p => ({ ...p, bands: !p.bands }))}
                  className={`text-[9px] px-2 py-1 rounded border transition-colors ${showIndicators.bands ? 'border-indigo-500/30 text-indigo-300 bg-indigo-500/10' : 'border-white/10 text-gray-400'}`}
                >
                  Indicator: Bollinger Bands
                </button>
              </div>
            </div>

          </div>

          {/* Sandbox Position Setup Controls */}
          <div className={`p-5 rounded-3xl ${theme.cardClass} border border-white/10 flex flex-col sm:flex-row gap-5`}>
            
            <div className="flex-1 flex flex-col gap-3.5">
              <span className="text-[10px] font-mono text-gray-400 uppercase block">SIMULATOR POSITION PARAMETERS</span>
              
              <div className="flex gap-2 bg-white/5 p-1 rounded-xl">
                <button
                  onClick={() => setTradeType('LONG')}
                  className={`flex-1 h-9 rounded-lg font-mono text-[10.5px] font-bold flex items-center justify-center gap-1 transition-all ${tradeType === 'LONG' ? 'bg-emerald-500 text-black' : 'text-gray-400'}`}
                >
                  <TrendingUp className="w-3.5 h-3.5" /> BUY LONG NOW
                </button>
                <button
                  onClick={() => setTradeType('SHORT')}
                  className={`flex-1 h-9 rounded-lg font-mono text-[10.5px] font-bold flex items-center justify-center gap-1 transition-all ${tradeType === 'SHORT' ? 'bg-rose-500 text-black' : 'text-gray-400'}`}
                >
                  <TrendingDown className="w-3.5 h-3.5" /> SELL SHORT NOW
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-mono text-gray-500">LIQUID LEVERAGE</label>
                  <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl h-11 px-3 text-xs font-mono">
                    <button onClick={() => setOrderLeverage(prev => Math.max(1, prev - 5))} className="p-1 text-gray-400 hover:text-white">-</button>
                    <span className="text-white font-bold">{orderLeverage}x</span>
                    <button onClick={() => setOrderLeverage(prev => Math.min(100, prev + 5))} className="p-1 text-gray-400 hover:text-white">+</button>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-mono text-gray-500">QUANTITY BIAS</label>
                  <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl h-11 px-3 text-xs font-mono">
                    <button onClick={() => setOrderQuantity(prev => Math.max(10, prev - 10))} className="p-1 text-gray-400 hover:text-white">-</button>
                    <span className="text-white font-bold">{orderQuantity}%</span>
                    <button onClick={() => setOrderQuantity(prev => Math.min(100, prev + 10))} className="p-1 text-gray-400 hover:text-white">+</button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 flex flex-col justify-end gap-3 pb-0.5">
              {openPosition ? (
                <button
                  onClick={() => triggerPositionClose(simulatedPnl, 'MANUAL')}
                  className="w-full h-12 bg-rose-500/25 text-rose-300 border border-rose-500/30 hover:bg-rose-500/35 rounded-xl font-display font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Minus className="w-4 h-4" />
                  <span>EMERGENCY DISCHARGE PORT: ${simulatedPnl >= 0 ? '+' : ''}${simulatedPnl.toFixed(0)}</span>
                </button>
              ) : (
                <button
                  onClick={executePositionOpen}
                  disabled={gameState !== 'ACTIVE'}
                  className="w-full h-12 rounded-xl font-display font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  style={{
                    backgroundColor: gameState === 'ACTIVE' 
                      ? (tradeType === 'LONG' ? '#10B981' : '#F43F5E') 
                      : 'rgba(255,255,255,0.05)',
                    color: gameState === 'ACTIVE' ? '#000000' : 'rgba(255,255,255,0.2)'
                  }}
                >
                  <Plus className="w-4 h-4" />
                  <span>{gameState === 'ACTIVE' ? `DEPLOY SIMULATED ${tradeType} REQUISITION` : 'START SIM Core FIRST'}</span>
                </button>
              )}

              <div className="text-center text-[10px] font-mono text-gray-500 leading-tight">
                Leveraged simulations represent identical loss factors to spot limits. Watch risk markers.
              </div>
            </div>

          </div>

        </div>

        {/* Column 3: Game Configurations, AI Game Assistant coaching & mode list selectors */}
        <div className="flex flex-col gap-6">
          
          {/* Challenge Modes Selectors Card */}
          <div className={`p-5 rounded-3xl ${theme.cardClass} border border-white/10 flex flex-col gap-3.5`}>
            <span className="text-[10px] font-mono text-gray-400 uppercase">Training Stage Parameters</span>
            
            <div className="flex flex-col gap-2.5">
              {[
                { id: 'BEGINNER', title: 'Beginner Simulator Mode', desc: 'No-timer sandbox containing high visual trade prompts.', icon: CheckCircle },
                { id: 'CHALLENGE', title: 'Tactical Challenge Trial', desc: 'Targeting a +$2000 simulated gain in 5 minutes.', icon: Gamepad2 },
                { id: 'CRASH_SIM', title: 'System Liquidity Crash', desc: 'Simulating severe market breakdowns & sell-offs.', icon: ShieldAlert },
                { id: 'AI_BATTLE', title: 'Quantum AI Matchup', desc: 'Faceoff against virtual AI agents trading orders.', icon: Sparkles }
              ].map(mode => {
                const Icon = mode.icon;
                const isSel = selectedMode === mode.id;
                
                return (
                  <button
                    key={mode.id}
                    onClick={() => {
                      if (gameState === 'ACTIVE') return;
                      setSelectedMode(mode.id as any);
                    }}
                    disabled={gameState === 'ACTIVE'}
                    className={`p-3 rounded-2xl text-left border transition-all flex gap-3 ${isSel ? 'bg-indigo-600/15 border-indigo-500/30 text-white' : 'border-white/5 bg-white/[0.01] text-gray-400 hover:bg-white/[0.03]'} ${gameState === 'ACTIVE' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <Icon className={`w-5 h-5 mt-0.5 shrink-0 ${isSel ? 'text-indigo-400' : 'text-gray-500'}`} />
                    <div>
                      <h4 className="font-display font-semibold text-xs text-white leading-tight">{mode.title}</h4>
                      <p className="text-[10px] text-gray-500 leading-tight mt-1">{mode.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* AI Game Technical Assistant Card */}
          <div className={`p-5 rounded-3xl ${theme.cardClass} border border-white/10 flex flex-col gap-3.5 relative overflow-hidden bg-gradient-to-b from-purple-500/[0.02]`}>
            <div className="absolute top-0 right-0 w-24 h-24 rounded-full blur-[45px] pointer-events-none bg-purple-500/10" />

            <div className="flex justify-between items-center pb-2 border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span className="font-display font-semibold text-xs text-white uppercase tracking-wider">AI Coach Node</span>
              </div>
              <span className="font-mono text-[9px] text-purple-400">DECISION FEED</span>
            </div>

            <div className="flex flex-col gap-3">
              <div className="p-3.5 rounded-2xl bg-black/25 border border-white/5 flex gap-2.5 items-start text-xs leading-relaxed">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div className="text-gray-300">
                  {selectedMode === 'CRASH_SIM' ? (
                    <span><strong>High Volatility Breakdown Threat:</strong> Parabolic sell vectors are currently active. Rely on strict tight short hedges or manual puts. Avoid long buy leverage.</span>
                  ) : openPosition ? (
                    <span><strong>Position Exposure:</strong> Executed {openPosition.type} on {openPosition.leverage}x leverage limits. Recommend tight SL boundaries near support nodes ($63.3K range).</span>
                  ) : (
                    <span><strong>Pre-Order Scanning:</strong> No positions currently active. Sector scanners show a steady horizontal accumulation state. Excellent setups forming for range breakout triggers.</span>
                  )}
                </div>
              </div>

              <div className="bg-white/[0.02] border border-white/5 p-3 rounded-xl flex flex-col gap-1.5 text-[10px] font-mono leading-tight">
                <span className="text-gray-500 uppercase">ACADEMY RECOMMENDATIONS:</span>
                <span className="text-white">• Watch high-volume sweeps before choosing entries.</span>
                <span className="text-white">• Never exceed 20x leverage limits during volatile crashes.</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
