export type ThemeId =
  | 'arctic-white'
  | 'obsidian-black'
  | 'midnight-blue'
  | 'emerald-glass'
  | 'crimson-red'
  | 'purple-nebula'
  | 'cyber-teal'
  | 'gold-elite';

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  isDark: boolean;
  bgClass: string;          // Main background classes
  cardClass: string;        // Glassmorphic card styling
  textPrimary: string;
  textSecondary: string;
  accentColor: string;      // Used for primary actions, bullish signals, glows
  accentGlow: string;       // Drop shadow, text-glow color standard
  borderColor: string;      // Border subtle outline color
  glowIntensity: string;    // CSS opacity or glow sizes
}

export interface TradeSignal {
  id: string;
  coinPair: string;         // e.g. "BTC/USDT", "ETH/USDT"
  type: 'BUY' | 'SELL';
  signalType: 'SCALPING' | 'SWING' | 'FUTURES' | 'SPOT';
  entryPrice: number;
  stopLoss: number;
  takeProfit: number;
  riskRewardRatio: string;
  confidence: number;       // Confidence % e.g. 92
  signalStrength: 'STRONG' | 'MEDIUM' | 'WEAK';
  timeframe: string;        // e.g. "15m", "1h", "4h"
  trendDirection: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  volume24h: string;
  whaleTracking: {
    activity: string;
    flow: 'INFLOW' | 'OUTFLOW' | 'STABLE';
    intensity: 'HIGH' | 'MEDIUM' | 'LOW';
  };
  breakoutDetected: boolean;
  liquiditySweep: boolean;
  supportLevel: number;
  resistanceLevel: number;
  riskScore: number;        // On scale of 1-10
  aiReasoning: string;
  timestamp: string;        // Humanreadable or relative time
  timeframeConfirmations?: {
    '1m': 'BULLISH' | 'BEARISH' | 'NEUTRAL';
    '5m': 'BULLISH' | 'BEARISH' | 'NEUTRAL';
    '15m': 'BULLISH' | 'BEARISH' | 'NEUTRAL';
    '1h': 'BULLISH' | 'BEARISH' | 'NEUTRAL';
    '4h': 'BULLISH' | 'BEARISH' | 'NEUTRAL';
    '1d': 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  };
  alignmentConflict?: boolean;
}

export interface BybitCredentials {
  apiKey: string;
  apiSecret: string;
  passphrase?: string;
  isTestnet?: boolean;
}

export interface ExchangeState {
  connected: boolean;
  exchangeName: 'Bybit' | 'Binance' | 'OKX';
  balance: {
    total: number;
    futures: number;
    spot: number;
    currency: string;
  };
  openPositions: TradingPosition[];
}

export interface TradingPosition {
  id: string;
  symbol: string;
  side: 'LONG' | 'SHORT';
  size: number;
  entryPrice: number;
  markPrice: number;
  unrealizedPnl: number;
  leverage: number;
  liquidationPrice: number;
}

export interface GoogleUserProfile {
  connected: boolean;
  name: string;
  email: string;
  avatarUrl: string;
  syncState: 'IDLE' | 'SYNCING' | 'COMPLETED' | 'ERROR';
  lastSynced?: string;
}

export interface PortfolioStats {
  totalBalance: number;
  netProfitLoss: number;
  winRate: number; // Percentage e.g. 68.5
  roi: number;     // ROI % e.g. 14.2
  totalTrades: number;
  profitableTrades: number;
  holdingAllocation: {
    symbol: string;
    percentage: number;
    value: number;
    avgBuyPrice: number;
  }[];
  pnlHistory: {
    date: string;
    value: number;
  }[];
  tradeHistory: HistoricTrade[];
}

export interface HistoricTrade {
  id: string;
  symbol: string;
  type: 'BUY' | 'SELL';
  price: number;
  amount: number;
  pnl?: number;       // Return on closed positions
  timestamp: string;
  status: 'COMPLETED' | 'OPEN';
}

export interface SmartNotification {
  id: string;
  title: string;
  message: string;
  type: 'SIGNAL' | 'PRICE_ALERT' | 'TAKE_PROFIT' | 'STOP_LOSS' | 'WHALE' | 'VOLATILITY' | 'NEWS';
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  read: boolean;
  timestamp: string;
}

export interface MarketIntelligence {
  summary: string;
  sentiment: 'BULLISH' | 'BEARISH' | 'NEUTRAL' | 'EXREME_BULLISH' | 'EXTREME_BEARISH';
  fearGreedIndex: number; // 0-100
  newsImpact: 'HIGH' | 'MEDIUM' | 'LOW';
  dailyRecap: string;
  volatilityIndex: number; // e.g., 28.4
}

export interface AppNotificationSettings {
  signalAlerts: boolean;
  priceAlerts: boolean;
  tpSlAlerts: boolean;
  whaleAlerts: boolean;
  volatilityAlerts: boolean;
  newsAlerts: boolean;
}

export interface SecuritySettings {
  encryptionEnabled: boolean;
  twoFactorEnabled: boolean;
  loginHistory: {
    timestamp: string;
    device: string;
    ip: string;
    location: string;
  }[];
}
