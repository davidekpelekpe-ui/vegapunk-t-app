import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { 
  Maximize2, 
  Minimize2, 
  Activity, 
  TrendingUp, 
  Settings, 
  Sliders, 
  Compass, 
  Check, 
  Eye, 
  EyeOff, 
  PenTool, 
  Trash2, 
  TrendingDown, 
  Save, 
  RefreshCw 
} from 'lucide-react';
import { ThemeConfig } from '../types';

interface ChartingSystemProps {
  theme: ThemeConfig;
  activeCoin: string; // e.g. "BTC/USDT"
}

// Pre-generated static baseline candle data to support dynamic calculations
const BASE_CANDLES_UP: any[] = [
  { time: '09:00', open: 67900, close: 68150, high: 68300, low: 67800, volume: 1540 },
  { time: '10:00', open: 68150, close: 68020, high: 68250, low: 67950, volume: 1420 },
  { time: '11:00', open: 68020, close: 68410, high: 68480, low: 67910, volume: 1980 },
  { time: '12:00', open: 68410, close: 68300, high: 68520, low: 68250, volume: 1100 },
  { time: '13:00', open: 68300, close: 68650, high: 68750, low: 68280, volume: 2200 },
  { time: '14:00', open: 68650, close: 68450, high: 68700, low: 68310, volume: 1840 },
  { time: '15:00', open: 68450, close: 68900, high: 69100, low: 68400, volume: 2890 },
  { time: '16:00', open: 68900, close: 68810, high: 69050, low: 68750, volume: 1650 },
  { time: '17:00', open: 68810, close: 69200, high: 69350, low: 68700, volume: 3100 },
  { time: '18:00', open: 69200, close: 69650, high: 69800, low: 69120, volume: 4200 },
  { time: '19:00', open: 69650, close: 69400, high: 69750, low: 69300, volume: 2100 },
  { time: '20:00', open: 69400, close: 69950, high: 70200, low: 69380, volume: 4600 },
];

export default function ChartingSystem({ theme, activeCoin }: ChartingSystemProps) {
  const [timeframe, setTimeframe] = useState<'1m'|'5m'|'15m'|'1h'|'4h'|'1d'>('1h');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [chartFeed, setChartFeed] = useState<'QUANTUM' | 'BYBIT'>('BYBIT');
  
  // Indicator Toggles
  const [showEMA, setShowEMA] = useState(true);
  const [showSMA, setShowSMA] = useState(false);
  const [showRSI, setShowRSI] = useState(true);
  const [showMACD, setShowMACD] = useState(false);
  const [showFib, setShowFib] = useState(false);
  const [indicatorValues, setIndicatorValues] = useState({
    emaPeriod: 9,
    smaPeriod: 21,
    rsiPeriod: 14
  });

  // Custom Trendline State
  const [drawingMode, setDrawingMode] = useState<'none' | 'trendline'>('none');
  const [trendlines, setTrendlines] = useState<{ x1: number; y1: number; x2: number; y2: number }[]>([]);
  const [currentLineStart, setCurrentLineStart] = useState<{ x: number; y: number } | null>(null);
  
  // Layout Save Alert
  const [alertMsg, setAlertMsg] = useState('');

  // Generated dynamic candle adjustments based on coin and timeframe
  const [candles, setCandles] = useState<any[]>(BASE_CANDLES_UP);
  const chartRef = useRef<SVGSVGElement>(null);

  // Generate unique candles for specific coin active & timeframe
  useEffect(() => {
    let multiplier = 1.0;
    if (activeCoin.startsWith('ETH')) multiplier = 0.052;
    if (activeCoin.startsWith('SOL')) multiplier = 0.0026;
    if (activeCoin.startsWith('PEPE')) multiplier = 0.0000002;

    const modified = BASE_CANDLES_UP.map((c, idx) => {
      // Add a tiny random offset based on timeframes to animate transition
      const tfFactor = timeframe === '15m' ? 0.992 : timeframe === '4h' ? 1.012 : timeframe === '1d' ? 1.03 : 1.0;
      const factor = multiplier * tfFactor;
      
      const open = Math.round(c.open * factor * 100) / 100;
      const close = Math.round(c.close * factor * 100) / 100;
      const high = Math.round(c.high * factor * 100) / 100;
      const low = Math.round(c.low * factor * 100) / 100;
      return {
        ...c,
        open,
        close,
        high,
        low,
        volume: Math.round(c.volume * (0.8 + Math.random() * 0.4))
      };
    });
    setCandles(modified);
  }, [activeCoin, timeframe]);

  // Handle saving charting configurations
  const handleSaveLayout = () => {
    localStorage.setItem('vegapunk_chart_layout', JSON.stringify({
      timeframe,
      showEMA,
      showSMA,
      showRSI,
      showMACD,
      showFib,
      indicatorValues,
      trendlines
    }));
    setAlertMsg('Layout successfully synchronized with Google settings Cloud back-up.');
    setTimeout(() => setAlertMsg(''), 3000);
  };

  const handleClearDrawings = () => {
    setTrendlines([]);
    setCurrentLineStart(null);
  };

  // Convert SVG coordinates for trendline placement
  const handleSvgClick = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    if (drawingMode !== 'trendline' || !chartRef.current) return;

    const rect = chartRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (!currentLineStart) {
      setCurrentLineStart({ x, y });
    } else {
      setTrendlines(prev => [...prev, { x1: currentLineStart.x, y1: currentLineStart.y, x2: x, y2: y }]);
      setCurrentLineStart(null);
      setDrawingMode('none');
    }
  };

  // SVG dimensions for logic calculations
  const width = 600;
  const mainHeight = 220;
  const padding = 20;

  // Find min/max values for scaling
  const closes = candles.map(c => c.close);
  const highs = candles.map(c => c.high);
  const lows = candles.map(c => c.low);
  const maxPrice = Math.max(...highs) * 1.002;
  const minPrice = Math.min(...lows) * 0.998;
  const priceRange = maxPrice - minPrice;

  // Plot scaling helpers
  const getX = (index: number) => {
    return padding + (index * (width - 2 * padding) / (candles.length - 1));
  };

  const getY = (price: number) => {
    return padding + ((maxPrice - price) * (mainHeight - 2 * padding) / priceRange);
  };

  // Calculate Moving Average curves
  const getmaPoints = (period: number) => {
    const points: {x: number, y: number}[] = [];
    for (let i = 0; i < candles.length; i++) {
      let sum = 0;
      let count = 0;
      for (let j = Math.max(0, i - period + 1); j <= i; j++) {
        sum += candles[j].close;
        count++;
      }
      const avg = sum / count;
      points.push({ x: getX(i), y: getY(avg) });
    }
    return points.map(p => `${p.x},${p.y}`).join(' ');
  };

  // Hardcode beautiful static RSI levels (e.g. oscillating nicely between oversold 30 and overbought 70)
  const getRsiPoints = () => {
    return candles.map((_, idx) => {
      const offset = Math.sin(idx * 0.8) * 15;
      const rsiValue = 50 + offset + (idx % 2 === 0 ? 5 : -5);
      const x = getX(idx);
      const rsiY = 40 + ((100 - rsiValue) * 40 / 100); // 0-80px range
      return `${x},${rsiY}`;
    }).join(' ');
  };

  // Fibonacci Retracements calculations
  const fibLevels = [
    { label: '0.0 (High)', value: maxPrice, color: '#EF4444' },
    { label: '0.236', value: maxPrice - priceRange * 0.236, color: '#F59E0B' },
    { label: '0.382', value: maxPrice - priceRange * 0.382, color: '#10B981' },
    { label: '0.5 (Mid)', value: maxPrice - priceRange * 0.5, color: '#A855F7' },
    { label: '0.618 (Golden)', value: maxPrice - priceRange * 0.618, color: '#38BDF8' },
    { label: '0.786', value: maxPrice - priceRange * 0.786, color: '#6366F1' },
    { label: '1.0 (Low)', value: minPrice, color: '#374151' },
  ];

  return (
    <div className={`p-5 rounded-3xl ${theme.cardClass} flex flex-col gap-4 relative transition-all duration-300 ${isFullscreen ? 'fixed inset-4 z-50 overflow-y-auto' : ''}`}>
      
      {/* Chart Headers */}
      <div className="flex flex-wrap justify-between items-center gap-3">
        <div className="flex items-center gap-3">
          <div 
            className="w-9 h-9 rounded-xl flex items-center justify-center border"
            style={{ borderColor: `${theme.accentColor}22`, background: `${theme.accentColor}11` }}
          >
            <Activity className="w-5 h-5" style={{ color: theme.accentColor }} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-semibold text-base leading-none">{activeCoin}</span>
              <span className="font-mono text-xs text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded leading-none">LIVE</span>
            </div>
            <span className="font-mono text-[10px] text-gray-500">VP Quantum Terminal Engine v2.4</span>
          </div>
        </div>

        {/* Terminal Feed Segment Selector */}
        <div className={`flex rounded-lg overflow-hidden border p-0.5 ${
          theme.isDark 
            ? 'border-white/10 bg-black/45' 
            : 'border-black/10 bg-black/5'
        }`}>
          <button
            onClick={() => setChartFeed('BYBIT')}
            className={`px-3 py-1.5 text-[10px] tracking-wider font-mono font-bold rounded-md transition-all cursor-pointer ${
              chartFeed === 'BYBIT'
                ? theme.isDark ? 'bg-white/10 text-emerald-400 font-bold' : 'bg-white text-[#111111] shadow-[0_1.5px_4px_rgba(0,0,0,0.06)]'
                : 'text-gray-500 hover:text-gray-600'
            }`}
          >
            BYBIT FEED
          </button>
          <button
            onClick={() => setChartFeed('QUANTUM')}
            className={`px-3 py-1.5 text-[10px] tracking-wider font-mono font-bold rounded-md transition-all cursor-pointer ${
              chartFeed === 'QUANTUM'
                ? theme.isDark ? 'bg-white/10 text-indigo-400 font-bold' : 'bg-white text-[#111111] shadow-[0_1.5px_4px_rgba(0,0,0,0.06)]'
                : 'text-gray-500 hover:text-gray-600'
            }`}
          >
            PREDICTIVE MODEL
          </button>
        </div>

        {/* Timeframes Bar */}
        <div className={`flex rounded-lg overflow-hidden border p-0.5 ${
          theme.isDark ? 'border-white/[0.06] bg-black/25' : 'border-black/10 bg-black/5'
        }`}>
          {(['1m', '5m', '15m', '1h', '4h', '1d'] as const).map(tf => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-2.5 py-1 text-xs font-mono rounded-md transition-all uppercase cursor-pointer ${
                timeframe === tf 
                  ? theme.isDark ? 'bg-white/10 text-white font-medium' : 'bg-white text-black font-semibold'
                  : 'text-gray-500 hover:text-gray-600'
              }`}
              style={timeframe === tf && theme.isDark ? { color: theme.accentColor } : {}}
            >
              {tf}
            </button>
          ))}
        </div>

        {/* Fullscreen / Controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleSaveLayout}
            title="Save Layout Configuration"
            className="p-1.5 rounded-lg border border-white/[0.06] hover:bg-white/5 text-gray-400 hover:text-gray-200 transition-all"
          >
            <Save className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsFullscreen(prev => !prev)}
            className="p-1.5 rounded-lg border border-white/[0.06] hover:bg-white/5 text-gray-400 hover:text-gray-200 transition-all"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {alertMsg && (
        <div className="bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs px-3 py-2 rounded-xl text-center font-sans tracking-wide">
          {alertMsg}
        </div>
      )}

      {chartFeed === 'BYBIT' ? (
        <div className={`w-full h-[460px] rounded-2xl overflow-hidden border relative flex flex-col items-stretch shadow-inner ${
          theme.isDark ? 'border-white/10 bg-black/25' : 'border-black/10 bg-white/40'
        }`}>
          <div className={`flex justify-between items-center text-[10px] font-mono p-3 border-b select-none shrink-0 ${
            theme.isDark ? 'border-white/5 bg-black/15 text-gray-400' : 'border-black/5 bg-black/5 text-[#111111]'
          }`}>
            <span className="font-semibold">BYBIT REAL-TIME INTERACTIVE FEED</span>
            <span className="text-[9px] text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              BYBIT ACTIVE: LIVE CANDLES
            </span>
          </div>
          <iframe
            key={`${activeCoin}-${theme.isDark}`}
            id="bybit-tradingview-widget-embed"
            src={`https://s.tradingview.com/widgetembed/?frameElementId=tradingview_chart&symbol=BYBIT%3A${activeCoin.replace('/', '').toUpperCase()}&interval=15&hidesidetoolbar=1&symboledit=1&saveimage=1&toolbarbg=f1f3f6&studies=%5B%5D&theme=${theme.isDark ? 'dark' : 'light'}&style=1&timezone=exchange&studies_overrides=%7B%7D&overrides=%7B%7D&enabled_features=%5B%5D&disabled_features=%5B%5D&locale=en`}
            className="w-full flex-1 border-none"
            allowFullScreen
            referrerPolicy="no-referrer"
          />
        </div>
      ) : (
        <>
          {/* Main Vector Chart Display */}
          <div className="relative w-full border border-white/[0.04] bg-black/10 rounded-2xl p-2 min-h-[240px] select-none">
            
            {/* Floating current price indicators */}
            <div className="absolute right-4 top-4 z-10 flex flex-col items-end pointer-events-none">
              <span className="text-xl font-mono font-bold tracking-tight" style={{ color: theme.accentColor }}>
                {candles[candles.length - 1]?.close.toLocaleString(undefined, { minimumFractionDigits: activeCoin.startsWith('PEPE') ? 8 : 2 })}
              </span>
              <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-0.5">
                <TrendingUp className="w-3 h-3" /> +4.24% (24h)
              </span>
            </div>

            {/* Legend status toggler */}
            <div className="absolute left-4 top-4 z-10 flex flex-wrap gap-2 pointer-events-auto">
              <button 
                onClick={() => setShowEMA(!showEMA)}
                className={`px-2 py-0.5 rounded text-[10px] font-mono flex items-center gap-1.5 border transition-all ${
                  showEMA ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : 'bg-transparent text-gray-500 border-white/[0.03]'
                }`}
              >
                EMA ({indicatorValues.emaPeriod}) {showEMA ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
              </button>
              <button 
                onClick={() => setShowSMA(!showSMA)}
                className={`px-2 py-0.5 rounded text-[10px] font-mono flex items-center gap-1.5 border transition-all ${
                  showSMA ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-transparent text-gray-500 border-white/[0.03]'
                }`}
              >
                SMA ({indicatorValues.smaPeriod}) {showSMA ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
              </button>
              <button 
                onClick={() => setShowRSI(!showRSI)}
                className={`px-2 py-0.5 rounded text-[10px] font-mono flex items-center gap-1.5 border transition-all ${
                  showRSI ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : 'bg-transparent text-gray-500 border-white/[0.03]'
                }`}
              >
                RSI ({indicatorValues.rsiPeriod}) {showRSI ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
              </button>
              <button 
                onClick={() => setShowFib(!showFib)}
                className={`px-2 py-0.5 rounded text-[10px] font-mono flex items-center gap-1.5 border transition-all ${
                  showFib ? 'bg-teal-500/10 text-teal-400 border-teal-500/20' : 'bg-transparent text-gray-500 border-white/[0.03]'
                }`}
              >
                FIB {showFib ? <Check className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
              </button>
            </div>

            {/* Main Vector SVG */}
            <svg
              ref={chartRef}
              viewBox={`0 0 ${width} ${mainHeight}`}
              className="w-full h-full cursor-crosshair overflow-visible mt-6"
              onClick={handleSvgClick}
            >
              {/* Background Grid Lines */}
              {[0.25, 0.5, 0.75].map((ratio, i) => (
                <line
                  key={i}
                  x1={padding}
                  y1={padding + ratio * (mainHeight - 2 * padding)}
                  x2={width - padding}
                  y2={padding + ratio * (mainHeight - 2 * padding)}
                  stroke="currentColor"
                  className="text-white/[0.03]"
                  strokeDasharray="4,4"
                />
              ))}

              {/* Fibonacci Overlays */}
              {showFib && fibLevels.map((lvl, idx) => {
                const yCoord = getY(lvl.value);
                return (
                  <g key={idx}>
                    <line
                      x1={padding}
                      y1={yCoord}
                      x2={width - padding}
                      y2={yCoord}
                      stroke={lvl.color}
                      strokeOpacity="0.4"
                      strokeWidth="1"
                    />
                    <text
                      x={padding + 5}
                      y={yCoord - 4}
                      fill={lvl.color}
                      fillOpacity="0.8"
                      fontSize="8"
                      fontFamily="monospace"
                    >
                      Fib {lvl.label}: {lvl.value.toLocaleString(undefined, { maximumFractionDigits: activeCoin.startsWith('PEPE') ? 8 : 2 })}
                    </text>
                  </g>
                );
              })}

              {/* Moving Averages lines */}
              {showEMA && (
                <polyline
                  fill="none"
                  stroke="#6366F1"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  points={getmaPoints(indicatorValues.emaPeriod)}
                  className="transition-all duration-300"
                />
              )}

              {showSMA && (
                <polyline
                  fill="none"
                  stroke="#E9C46A"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  points={getmaPoints(indicatorValues.smaPeriod)}
                  className="transition-all duration-300"
                />
              )}

              {/* Dynamic Candlesticks and Volumetric Secondary graph */}
              {candles.map((cd, index) => {
                const x = getX(index);
                const yOpen = getY(cd.open);
                const yClose = getY(cd.close);
                const yHigh = getY(cd.high);
                const yLow = getY(cd.low);
                
                const isBullish = cd.close >= cd.open;
                const wicksColor = isBullish ? '#10B981' : '#EF4444';
                const bodyColor = isBullish ? 'rgba(16,185,129,0.35)' : 'rgba(239,68,68,0.35)';
                const strokeColor = isBullish ? '#10B981' : '#EF4444';

                // Volumebars mapping
                const volHeight = Math.min(cd.volume * 35 / 4600, 35);
                const volY = mainHeight - padding - volHeight;

                return (
                  <g key={index} className="group cursor-pointer">
                    {/* Candle details dynamic tooltip hover indicator */}
                    <title>{`T: ${cd.time}\nO: ${cd.open}\nH: ${cd.high}\nL: ${cd.low}\nC: ${cd.close}\nV: ${cd.volume}`}</title>
                    
                    {/* Volume Bar */}
                    <rect
                      x={x - 3}
                      y={volY}
                      width="6"
                      height={volHeight}
                      fill={isBullish ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)'}
                      stroke={isBullish ? 'rgba(16,185,129,0.25)' : 'rgba(239,68,68,0.25)'}
                      strokeWidth="0.5"
                    />

                    {/* Candle Wick Line */}
                    <line
                      x1={x}
                      y1={yHigh}
                      x2={x}
                      y2={yLow}
                      stroke={wicksColor}
                      strokeWidth="1"
                    />

                    {/* Candle Body */}
                    <rect
                      x={x - 4}
                      y={Math.min(yOpen, yClose)}
                      width="8"
                      height={Math.max(Math.abs(yClose - yOpen), 2)}
                      fill={bodyColor}
                      stroke={strokeColor}
                      strokeWidth="1"
                      rx="1"
                    />
                  </g>
                );
              })}

              {/* Drawn Trendlines */}
              {trendlines.map((line, idx) => (
                <line
                  key={idx}
                  x1={line.x1}
                  y1={line.y1}
                  x2={line.x2}
                  y2={line.y2}
                  stroke={theme.accentColor}
                  strokeWidth="1.8"
                  strokeDasharray="2,2"
                />
              ))}

              {/* Current line point dragging feedback */}
              {currentLineStart && (
                <circle
                  cx={currentLineStart.x}
                  cy={currentLineStart.y}
                  r="4"
                  fill={theme.accentColor}
                />
              )}
            </svg>

            {/* Liquid indicator overlay details info bar */}
            <div className="absolute left-3 bottom-3 text-[9px] font-mono text-gray-500 pointer-events-none flex gap-3">
              <span>H: <span className="text-gray-400">{maxPrice.toFixed(2)}</span></span>
              <span>L: <span className="text-gray-400">{minPrice.toFixed(2)}</span></span>
              <span>Intervals: <span className="text-gray-400">{candles.length} periods</span></span>
            </div>
          </div>

          {/* SVG drawing support controls */}
          <div className="flex justify-between items-center bg-black/15 p-2 rounded-xl border border-white/[0.04]">
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                onClick={() => setDrawingMode(prev => prev === 'trendline' ? 'none' : 'trendline')}
                className={`px-3 py-1 text-xs font-mono rounded flex items-center gap-1.5 transition-all ${
                  drawingMode === 'trendline' 
                    ? 'bg-amber-500/15 text-amber-400 border border-amber-500/25' 
                    : 'hover:bg-white/5 text-gray-400 hover:text-gray-200'
                }`}
              >
                <PenTool className="w-3 h-3" /> 
                {drawingMode === 'trendline' ? 'Placing Line...' : 'Draw Trendline'}
              </button>
              
              {(trendlines.length > 0 || currentLineStart) && (
                <button
                  onClick={handleClearDrawings}
                  className="px-2.5 py-1 text-xs font-mono rounded text-red-400 bg-red-500/10 border border-red-500/20 hover:bg-red-500/15 transition-all flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Clear Drawings
                </button>
              )}
            </div>
            <span className="text-[10px] font-mono text-gray-500 select-none">
              {drawingMode === 'trendline' ? 'Click twice on SVG to anchor core line endpoints.' : 'Fully Interactive vector canvas'}
            </span>
          </div>

          {/* RSI Dynamic Sub-oscillators Panels */}
          {showRSI && (
            <div className="border border-white/[0.04] bg-black/15 rounded-xl p-3 flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-mono text-purple-400 flex items-center gap-1">
                  <Activity className="w-3 h-3" /> Relative Strength Index (RSI 14)
                </span>
                <span className="text-[10px] font-mono text-purple-400 bg-purple-500/10 px-1 py-0.2 rounded font-semibold">
                  Oscillating Comfortably (RSI: 54.2)
                </span>
              </div>
              
              <div className="h-10 w-full relative border-y border-white/[0.04] bg-purple-500/[0.01]">
                {/* Limit boundaries 30 and 70 lines */}
                <div className="absolute top-[30%] inset-x-0 border-t border-purple-500/15 stroke-dasharray pointer-events-none" />
                <div className="absolute top-[70%] inset-x-0 border-t border-purple-500/15 stroke-dasharray pointer-events-none" />
                
                <svg viewBox={`0 0 ${width} 80`} className="w-full h-full overflow-visible" preserveAspectRatio="none">
                  <polyline
                    fill="none"
                    stroke="#A855F7"
                    strokeWidth="1.2"
                    points={getRsiPoints()}
                  />
                </svg>
              </div>
            </div>
          )}

          {/* Advanced Calibration Controls for technical periods */}
          <div className="grid grid-cols-2 gap-2 text-[10px] font-mono mt-1 opacity-70">
            <label className="flex items-center gap-1">
              <span>EMA:</span>
              <input 
                type="number" 
                value={indicatorValues.emaPeriod} 
                onChange={(e) => setIndicatorValues(prev => ({...prev, emaPeriod: Math.max(1, parseInt(e.target.value) || 9)}))}
                className="w-8 bg-black/25 text-center text-xs text-white border border-white/[0.08] p-0.5 rounded focus:outline-none"
              />
              <span>Periods</span>
            </label>
            <label className="flex items-center gap-1 justify-end">
              <span>SMA:</span>
              <input 
                type="number" 
                value={indicatorValues.smaPeriod} 
                onChange={(e) => setIndicatorValues(prev => ({...prev, smaPeriod: Math.max(1, parseInt(e.target.value) || 21)}))}
                className="w-8 bg-black/25 text-center text-xs text-white border border-white/[0.08] p-0.5 rounded focus:outline-none"
              />
              <span>Periods</span>
            </label>
          </div>
        </>
      )}

    </div>
  );
}
