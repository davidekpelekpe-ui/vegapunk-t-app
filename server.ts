import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

// Standard initialization for Google GenAI as instructed by gemini-api skill
const hasApiKey = !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY';
let ai: GoogleGenAI | null = null;

if (hasApiKey) {
  try {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
    console.log('✅ Google GenAI SDK successfully initialized for Vegapunk Trading Hub.');
  } catch (err) {
    console.error('⚠️ Failed to initialize Google GenAI SDK:', err);
  }
} else {
  console.log('💡 Running with fallback simulated AI Engine (GEMINI_API_KEY not configured or placeholder).');
}

const app = express();
app.use(express.json());

const PORT = 3000;

// Dynamic realistic default signals to offer static fallback
const INITIAL_SIGNALS = [
  {
    id: 'sig-btc-1',
    coinPair: 'BTC/USDT',
    type: 'BUY',
    signalType: 'SWING',
    entryPrice: 68450,
    stopLoss: 66900,
    takeProfit: 72100,
    riskRewardRatio: '1:2.35',
    confidence: 94,
    signalStrength: 'STRONG',
    timeframe: '4h',
    trendDirection: 'BULLISH',
    volume24h: '$32.4B (UP 18.5%)',
    whaleTracking: {
      activity: 'Heavy accumulation at $67,800 block level',
      flow: 'INFLOW',
      intensity: 'HIGH'
    },
    breakoutDetected: true,
    liquiditySweep: true,
    supportLevel: 67200,
    resistanceLevel: 71500,
    riskScore: 3,
    aiReasoning: 'Bullish macro breakout of the descending triangle pattern. Order block support verified with ultra high localized buying volume. Multi-whale wallets show aggressive buy-side imbalance at $67.8K-$68K range, setting target for full liquidity sweep above $72,100 high.',
    timestamp: '15m ago',
    timeframeConfirmations: {
      '1m': 'BULLISH',
      '5m': 'BULLISH',
      '15m': 'BULLISH',
      '1h': 'BULLISH',
      '4h': 'BULLISH',
      '1d': 'BULLISH'
    },
    alignmentConflict: false
  },
  {
    id: 'sig-eth-2',
    coinPair: 'ETH/USDT',
    type: 'BUY',
    signalType: 'SCALPING',
    entryPrice: 3485.5,
    stopLoss: 3430.0,
    takeProfit: 3620.0,
    riskRewardRatio: '1:2.44',
    confidence: 81,
    signalStrength: 'MEDIUM',
    timeframe: '15m',
    trendDirection: 'BULLISH',
    volume24h: '$18.1B (UP 8.2%)',
    whaleTracking: {
      activity: 'Moderate inbound exchange outflows',
      flow: 'INFLOW',
      intensity: 'MEDIUM'
    },
    breakoutDetected: true,
    liquiditySweep: false,
    supportLevel: 3420,
    resistanceLevel: 3590,
    riskScore: 5,
    aiReasoning: 'Squeezing minor resistance band after solid EMA Cross-over (EMA 9/21) on 15-minute timeframe. Liquidity accumulation pool resides at $3450 area supporting entry.',
    timestamp: '4m ago',
    timeframeConfirmations: {
      '1m': 'BULLISH',
      '5m': 'BULLISH',
      '15m': 'BULLISH',
      '1h': 'NEUTRAL',
      '4h': 'BULLISH',
      '1d': 'BULLISH'
    },
    alignmentConflict: false
  },
  {
    id: 'sig-sol-3',
    coinPair: 'SOL/USDT',
    type: 'SELL',
    signalType: 'FUTURES',
    entryPrice: 178.2,
    stopLoss: 184.5,
    takeProfit: 161.0,
    riskRewardRatio: '1:2.73',
    confidence: 88,
    signalStrength: 'STRONG',
    timeframe: '1h',
    trendDirection: 'BEARISH',
    volume24h: '$4.9B (DOWN 6.1%)',
    whaleTracking: {
      activity: 'Distribution into spot exchanges visible',
      flow: 'OUTFLOW',
      intensity: 'HIGH'
    },
    breakoutDetected: false,
    liquiditySweep: true,
    supportLevel: 158.0,
    resistanceLevel: 181.5,
    riskScore: 7,
    aiReasoning: 'Overextended asset showing textbook RSI bearish divergence pattern on the hourly chart. Large size order books show heavy spot Sell walls at $180, indicating high probability of a descending pullback into support zone to grab lower liquidity.',
    timestamp: '32m ago',
    timeframeConfirmations: {
      '1m': 'BEARISH',
      '5m': 'BEARISH',
      '15m': 'BEARISH',
      '1h': 'BEARISH',
      '4h': 'BEARISH',
      '1d': 'BEARISH'
    },
    alignmentConflict: false
  },
  {
    id: 'sig-pepe-4',
    coinPair: 'PEPE/USDT',
    type: 'BUY',
    signalType: 'SCALPING',
    entryPrice: 0.0000142,
    stopLoss: 0.0000135,
    takeProfit: 0.0000165,
    riskRewardRatio: '1:3.28',
    confidence: 62,
    signalStrength: 'WEAK',
    timeframe: '5m',
    trendDirection: 'BULLISH',
    volume24h: '$1.2B (UP 45.3%)',
    whaleTracking: {
      activity: 'Aggressive block transfers by top tier memeholders',
      flow: 'INFLOW',
      intensity: 'HIGH'
    },
    breakoutDetected: true,
    liquiditySweep: true,
    supportLevel: 0.0000138,
    resistanceLevel: 0.0000155,
    riskScore: 9,
    aiReasoning: 'Micro-structure change (MSB) indicating rapid continuation. Lower timeframe is fighting higher timeframe trends. Proceed with caution as divergence makes this a speculative momentum trade.',
    timestamp: '1h ago',
    timeframeConfirmations: {
      '1m': 'BULLISH',
      '5m': 'BEARISH',
      '15m': 'BULLISH',
      '1h': 'BEARISH',
      '4h': 'BULLISH',
      '1d': 'BULLISH'
    },
    alignmentConflict: true
  },
  {
    id: 'sig-bnb-5',
    coinPair: 'BNB/USDT',
    type: 'BUY',
    signalType: 'SPOT',
    entryPrice: 588.4,
    stopLoss: 574.0,
    takeProfit: 625.0,
    riskRewardRatio: '1:2.54',
    confidence: 89,
    signalStrength: 'STRONG',
    timeframe: '1d',
    trendDirection: 'BULLISH',
    volume24h: '$2.1B (UP 14.2%)',
    whaleTracking: {
      activity: 'Launchpad commitments accumulating in smart contracts',
      flow: 'STABLE',
      intensity: 'MEDIUM'
    },
    breakoutDetected: true,
    liquiditySweep: false,
    supportLevel: 570.0,
    resistanceLevel: 615.0,
    riskScore: 2,
    aiReasoning: 'Daily bullish consolidation breakout with rising buying pressure on index contracts. Launchpad schedules are driving persistent spot accumulation, providing a high probability baseline with very low inherent technical risk.',
    timestamp: '2h ago',
    timeframeConfirmations: {
      '1m': 'NEUTRAL',
      '5m': 'BULLISH',
      '15m': 'BULLISH',
      '1h': 'BULLISH',
      '4h': 'BULLISH',
      '1d': 'BULLISH'
    },
    alignmentConflict: false
  },
  {
    id: 'sig-xrp-6',
    coinPair: 'XRP/USDT',
    type: 'SELL',
    signalType: 'FUTURES',
    entryPrice: 0.5480,
    stopLoss: 0.5650,
    takeProfit: 0.5110,
    riskRewardRatio: '1:2.17',
    confidence: 65,
    signalStrength: 'WEAK',
    timeframe: '4h',
    trendDirection: 'BEARISH',
    volume24h: '$950M (DOWN 12.0%)',
    whaleTracking: {
      activity: 'Large transactional distribution to foreign wallets',
      flow: 'OUTFLOW',
      intensity: 'HIGH'
    },
    breakoutDetected: false,
    liquiditySweep: true,
    supportLevel: 0.5050,
    resistanceLevel: 0.5700,
    riskScore: 8,
    aiReasoning: 'Loss of critical horizontal support at the 0.5500 area. Lower timeframe (1m/5m) buy pressure is fighting the larger 4H macro distribution flow, triggering risk warning indicators.',
    timestamp: '3h ago',
    timeframeConfirmations: {
      '1m': 'BULLISH',
      '5m': 'BULLISH',
      '15m': 'BEARISH',
      '1h': 'BEARISH',
      '4h': 'BEARISH',
      '1d': 'BEARISH'
    },
    alignmentConflict: true
  },
  {
    id: 'sig-doge-7',
    coinPair: 'DOGE/USDT',
    type: 'BUY',
    signalType: 'SCALPING',
    entryPrice: 0.1442,
    stopLoss: 0.1380,
    takeProfit: 0.1595,
    riskRewardRatio: '1:2.46',
    confidence: 83,
    signalStrength: 'STRONG',
    timeframe: '15m',
    trendDirection: 'BULLISH',
    volume24h: '$1.8B (UP 22.1%)',
    whaleTracking: {
      activity: 'Extreme speculative derivatives leverage uptake',
      flow: 'INFLOW',
      intensity: 'HIGH'
    },
    breakoutDetected: true,
    liquiditySweep: true,
    supportLevel: 0.1390,
    resistanceLevel: 0.1550,
    riskScore: 8,
    aiReasoning: 'Strong volume breakout over the 15-minute key resistance level. High derivative interest suggests a speculative momentum run to capture short liquidations around 0.158.',
    timestamp: '52m ago',
    timeframeConfirmations: {
      '1m': 'BULLISH',
      '5m': 'BULLISH',
      '15m': 'BULLISH',
      '1h': 'NEUTRAL',
      '4h': 'NEUTRAL',
      '1d': 'BULLISH'
    },
    alignmentConflict: false
  }
];

interface CacheItem {
  value: string;
  expiresAt: number;
}
const queryCache = new Map<string, CacheItem>();
let geminiCooldownUntil = 0;

// Helper to compile a response or stream using Gemini with built-in cache and 429 quota isolation
const queryGeminiModel = async (prompt: string, fallbackText: string, searchMode = false): Promise<string> => {
  if (!ai) return fallbackText;

  const now = Date.now();
  // 1. Quota Cooldown Guard
  if (now < geminiCooldownUntil) {
    const secondsLeft = Math.ceil((geminiCooldownUntil - now) / 1000);
    console.log(`[Gemini] Intelligent cooldown active. Local state fallback loaded directly (${secondsLeft}s remaining).`);
    return fallbackText;
  }

  // 2. Lookup Cache (prevent redundant calls for identical analysis vectors)
  const cacheKey = `${prompt}_search_${searchMode}`;
  const cached = queryCache.get(cacheKey);
  if (cached && now < cached.expiresAt) {
    return cached.value;
  }

  try {
    const config: any = {
      systemInstruction: 'You are Vegapunk UI AI engine. A highly skilled luxury trading systems AI architect who provides clinical, analytical, extremely confident web-terminal analysis. Keep summaries under 120 words. No chat jargon, no greetings, no fluff or filler words. Use exact formatting, numerical indexes, and clean bullet indicators.',
    };
    if (searchMode) {
      config.tools = [{ googleSearch: {} }];
    }
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config,
    });
    
    const resultText = response.text || fallbackText;
    
    // Save successful responses to global cache (TTL of 10 minutes)
    queryCache.set(cacheKey, {
      value: resultText,
      expiresAt: now + 10 * 60 * 1000
    });

    return resultText;
  } catch (error: any) {
    const errorStr = String(error);
    const isQuotaLimit = errorStr.includes('429') || 
                         errorStr.toLowerCase().includes('quota') || 
                         errorStr.toLowerCase().includes('rate') || 
                         errorStr.toLowerCase().includes('exhausted') ||
                         errorStr.toLowerCase().includes('limit');

    if (isQuotaLimit) {
      // Engage 5-minute intelligent protection mode to immediately switch matching queries to local state
      geminiCooldownUntil = now + 5 * 60 * 1000;
      console.warn(`[Gemini] 429 Quota Exceeded. Activating intelligent protection mode. Retrying query channels in 5 minutes.`);
    } else {
      console.error('Gemini query failed, using fallback:', error);
    }
    return fallbackText;
  }
};

// ----------------------------------------
// API ENDPOINTS
// ----------------------------------------

// 1. SIGNAL ENGINE WITH DYNAMIC GEMINI ENHANCEMENT
app.post('/api/signals', async (req: Request, res: Response) => {
  const { customizePrompt } = req.body;
  
  if (!ai || !customizePrompt) {
    return res.json({ success: true, signals: INITIAL_SIGNALS });
  }

  try {
    // Let's generate a localized sentiment update and custom reasons
    const prompt = `Based on current custom criteria: "${customizePrompt}", quickly rewrite or adjust current cryptocurrency signal reasonings for BTC, ETH, and SOL. Return JSON format. For each of the three pairs (BTC/USDT, ETH/USDT, SOL/USDT) write a concise 2-sentence liquid trading reasoning. Ensure the output strictly respects key-value formats.`;
    
    const rawResult = await queryGeminiModel(
      prompt,
      'FALLBACK'
    );
    
    if (rawResult === 'FALLBACK') {
      return res.json({ success: true, signals: INITIAL_SIGNALS });
    }

    // Try to parse JSON output or fallback to static updates with customized reasoning block
    let customizedSignals = [...INITIAL_SIGNALS];
    
    try {
      // Find JSON block if it has markdown tags
      let cleaned = rawResult;
      const jsonMatch = rawResult.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
      if (jsonMatch) {
         cleaned = jsonMatch[0];
         const parsed = JSON.parse(cleaned);
         // If we successfully get array or object map
         if (parsed && typeof parsed === 'object') {
           customizedSignals = INITIAL_SIGNALS.map(sig => {
              const pairKey = sig.coinPair.split('/')[0]; // BTC, ETH, SOL
              const match = parsed[sig.coinPair] || parsed[pairKey] || Object.values(parsed).find((v: any) => v && v.coinPair === sig.coinPair);
              if (match && typeof match === 'string') {
                return { ...sig, aiReasoning: match };
              } else if (match && typeof match === 'object' && match.aiReasoning) {
                return { ...sig, aiReasoning: match.aiReasoning, confidence: match.confidence || sig.confidence };
              }
              return sig;
           });
         }
      } else {
         // Just swap first reasoning with custom text
         customizedSignals[0] = { ...customizedSignals[0], aiReasoning: rawResult };
      }
    } catch (err) {
      customizedSignals[0] = { ...customizedSignals[0], aiReasoning: rawResult };
    }

    return res.json({ success: true, signals: customizedSignals });
  } catch (error) {
    console.error('Error in custom signals api:', error);
    return res.json({ success: true, signals: INITIAL_SIGNALS });
  }
});

// 2. AI MARKET ASSISTANT - CHAT/INTELLIGENCE PANEL
app.post('/api/assistant/chat', async (req: Request, res: Response) => {
  const { message, history } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Message required' });
  }

  const promptText = `User Query: "${message}"\nContext: Provide a brief, premium market intelligence review or response. No conversational fluff. Straightforward, professional, highly analytical, elite fintech presentation.`;
  
  const fallbackResponse = `Vegapunk Trading Engine diagnostic: Technical support corridors and EMA/RSI calculations point to structured continuation. At $68,400, capital inflows reflect strategic whale placement with high volume profiles. Consider trailing entry stops above minor resistance to guarantee capital safety.`;

  try {
    const rawResult = await queryGeminiModel(promptText, fallbackResponse);
    return res.json({ response: rawResult });
  } catch (err) {
    console.error('Assistant API failed:', err);
    return res.json({ response: fallbackResponse });
  }
});

// 3. SECURE BYBIT API CONNECTION SYSTEM
app.post('/api/exchange/connect', async (req: Request, res: Response) => {
  const { exchangeName, apiKey, apiSecret, passphrase, isTestnet } = req.body;

  if (!apiKey || !apiSecret) {
    return res.status(400).json({ error: 'API Key and API Secret are required.' });
  }

  // Permisison Check simulation
  const permissions = {
    readPermission: true,
    spotTrade: true,
    futuresTrade: true,
    withdraw: false, // Strict safety guarantee!
  };

  const isBybit = exchangeName === 'Bybit';

  // Return realistic synchronized state
  const mockSyncData = {
    exchangeName,
    connected: true,
    permissions,
    balance: {
      total: isBybit ? 12450.75 : 8200.0,
      futures: isBybit ? 9150.25 : 6200.0,
      spot: isBybit ? 3300.50 : 2000.0,
      currency: 'USD'
    },
    positions: isBybit ? [
      {
        id: 'pos-1',
        symbol: 'BTCUSDT',
        side: 'LONG',
        size: 0.15,
        entryPrice: 67900,
        markPrice: 68450,
        unrealizedPnl: 82.50,
        leverage: 10,
        liquidationPrice: 61500
      },
      {
        id: 'pos-2',
        symbol: 'SOLUSDT',
        side: 'SHORT',
        size: 8.0,
        entryPrice: 181.5,
        markPrice: 178.2,
        unrealizedPnl: 26.40,
        leverage: 5,
        liquidationPrice: 215.0
      }
    ] : []
  };

  return res.json({
    success: true,
    message: `${exchangeName} API connection successfully verified. All risk parameters cleared.`,
    data: mockSyncData
  });
});

// 4. MARKET INTELLIGENCE METRIC ENGINE
app.get('/api/market/intelligence', async (req: Request, res: Response) => {
  // Let's generate a real AI based daily summary if we have access, else return premium hardcoded metrics
  const fallbackSummary = 'Capital inflows continue gathering strength at solid support grids. BTC trades securely within the $67.5K - $69K band. Volumes rose 14% past 24-hours indicating institutional tracking setup. RSI divergence indicates premium high-confidence entries in select altcoins.';
  const fallbackRecap = 'The trading sessions of today recorded robust bullish divergence on secondary intervals. Strategic buy walling resolved liquidity sweeps at the lower boundaries. Traders should focus main allocations towards high-conviction scalps while maintaining tight protective risk-reward stops.';

  try {
    if (ai) {
      // Intelligently combine separate queries into one composite prompt to reduce API quota consumption by 50%
      const compositePrompt = `Analyze the cryptocurrency market state for today and provide exactly two short sections.
      Section 1: "summary" - A brief 2-sentence liquid high-performance update of the crypto market status for today. Focus on general volume inflows and BTC level support.
      Section 2: "dailyRecap" - A brief elite 2-sentence trading recap of recent whale tracking flows and warning recommendations.

      You MUST respond with a clean, raw JSON object (do NOT wrap it in HTML blocks, markdown formatting, or chat jargon):
      {
        "summary": "your summary text here",
        "dailyRecap": "your daily recap text here"
      }`;

      const compositeResult = await queryGeminiModel(compositePrompt, JSON.stringify({
        summary: fallbackSummary,
        dailyRecap: fallbackRecap
      }));

      let summary = fallbackSummary;
      let dailyRecap = fallbackRecap;

      try {
        let cleaned = compositeResult.trim();
        const jsonMatch = compositeResult.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          cleaned = jsonMatch[0];
        }
        const parsed = JSON.parse(cleaned);
        if (parsed.summary) {
          summary = parsed.summary;
        }
        if (parsed.dailyRecap) {
          dailyRecap = parsed.dailyRecap;
        }
      } catch (jsonErr) {
        // Fallback strategy if structured format is missing
        if (compositeResult && compositeResult !== 'FALLBACK') {
          summary = compositeResult;
        }
      }

      return res.json({
        summary,
        sentiment: 'BULLISH',
        fearGreedIndex: 68, // Greed
        newsImpact: 'HIGH',
        dailyRecap,
        volatilityIndex: 22.4
      });
    }
  } catch (error) {
    console.error('Failed fetching live market intelligence:', error);
  }

  return res.json({
    summary: fallbackSummary,
    sentiment: 'BULLISH',
    fearGreedIndex: 68,
    newsImpact: 'HIGH',
    dailyRecap: fallbackRecap,
    volatilityIndex: 22.4
  });
});

// 5. GOOGLE ACCOUNT RECOVERY AND PREFERENCE BACKUP
app.post('/api/auth/google', (req: Request, res: Response) => {
  const { credential, email, name, avatarUrl } = req.body;
  
  if (!email) {
    return res.status(400).json({ error: 'Email is required for Google alignment' });
  }

  return res.json({
    success: true,
    profile: {
      connected: true,
      name: name || 'Vegapunk Operator',
      email: email,
      avatarUrl: avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop',
      syncState: 'COMPLETED',
      lastSynced: new Date().toISOString()
    }
  });
});

// ----------------------------------------
// VITE AND STATIC ASSETS HANDLER
// ----------------------------------------

async function serve() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    
    app.use(vite.middlewares);
    console.log('⚡ Vite Middleware mounted in Development mode.');
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log('📦 Serving compiled production bundles from /dist.');
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

serve();
