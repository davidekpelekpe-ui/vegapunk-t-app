import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Send, 
  Activity, 
  Smile, 
  Frown, 
  Compass, 
  TrendingUp, 
  TrendingDown, 
  Zap, 
  RefreshCw, 
  Volume2, 
  Clock, 
  Tv, 
  Lightbulb, 
  ShieldAlert 
} from 'lucide-react';
import { ThemeConfig } from '../types';
import { getApiUrl } from '../lib/api';

interface AIMarketAssistantProps {
  theme: ThemeConfig;
  onTriggerNotification: (title: string, msg: string, type: any) => void;
}

interface Message {
  sender: 'user' | 'assistant';
  text: string;
  time: string;
}

export default function AIMarketAssistant({ theme, onTriggerNotification }: AIMarketAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'assistant',
      text: 'Vegapunk AI Market Intelligent Agent initialized. State: ONLINE. Input any trading logic inquiry or tap standard preset parameters below.',
      time: 'Just now'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Market metrics states
  const [fearGreedValue, setFearGreedValue] = useState(68);
  const [volatilityIndex, setVolatilityIndex] = useState(22.4);
  const [generalRecap, setGeneralRecap] = useState('Gathering cognitive analysis metrics...');
  const [generalSummary, setGeneralSummary] = useState('Initiating system scans...');

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Fetch metrics from fullstack server
  const fetchMarketIntelligence = async () => {
    try {
      const resp = await fetch(getApiUrl('/api/market/intelligence'));
      const data = await resp.json();
      setFearGreedValue(data.fearGreedIndex || 68);
      setVolatilityIndex(data.volatilityIndex || 22.4);
      setGeneralSummary(data.summary || '');
      setGeneralRecap(data.dailyRecap || '');
    } catch (err) {
      console.error('Failed to resolve intelligence nodes:', err);
    }
  };

  useEffect(() => {
    fetchMarketIntelligence();
  }, []);

  useEffect(() => {
    // Scroll to latest chat bubble
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isAiLoading) return;

    const userMsg: Message = {
      sender: 'user',
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsAiLoading(true);

    try {
      const response = await fetch(getApiUrl('/api/assistant/chat'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          history: messages.map(m => ({
            role: m.sender === 'user' ? 'user' : 'model',
            content: m.text
          }))
        })
      });

      const data = await response.json();
      const assistantMsg: Message = {
        sender: 'assistant',
        text: data.response || 'Unresolved diagnostic pipeline return. Re-verify API core.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        {
          sender: 'assistant',
          text: 'Delay in communication tunnel. Fallback logic: orderbooks are balanced at support intervals, RSI is stabilizing.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handlePresetTrigger = (preset: string) => {
    handleSendMessage(preset);
  };

  // Determine Fear & Greed label and color representation
  const getFearGreedLabel = (val: number) => {
    if (val < 25) return { text: 'EXTREME FEAR', color: '#EF4444', bg: 'bg-red-500/10' };
    if (val < 45) return { text: 'FEAR', color: '#F87171', bg: 'bg-red-400/10' };
    if (val < 55) return { text: 'NEUTRAL', color: '#E9C46A', bg: 'bg-yellow-500/10' };
    if (val < 75) return { text: 'GREED', color: '#10B981', bg: 'bg-emerald-500/10' };
    return { text: 'EXTREME GREED', color: '#34D399', bg: 'bg-emerald-400/10' };
  };

  const fgInfo = getFearGreedLabel(fearGreedValue);

  return (
    <div className="flex flex-col gap-5">
      
      {/* Visual Sentiment Meters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Interactive Fear & Greed bubble Liquid Meter */}
        <div className={`p-4 rounded-3xl ${theme.cardClass} border border-white/[0.04] flex flex-col gap-3 relative overflow-hidden bg-gradient-to-b from-purple-500/[0.01]`}>
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-gray-500 uppercase flex items-center gap-1">
              <Smile className="w-3.5 h-3.5 text-emerald-400" /> Sentiment Balance Index
            </span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${fgInfo.bg}`} style={{ color: fgInfo.color }}>
              {fgInfo.text}
            </span>
          </div>

          <div className="flex justify-between items-end my-2">
            <span className="text-4xl font-mono font-bold tracking-tight text-white">{fearGreedValue}</span>
            <span className="text-[10px] font-mono text-gray-500">MAX INDEX: 100</span>
          </div>

          {/* Liquid Glass Progress slider bar */}
          <div className="h-4 w-full bg-white/[0.02] border border-white/[0.05] rounded-full overflow-hidden relative">
            <div 
              className="h-full rounded-full bg-gradient-to-r transition-all duration-1000 ease-out flex items-center justify-end pr-2"
              style={{
                width: `${fearGreedValue}%`,
                background: `linear-gradient(90deg, #EF4444 0%, #E9C46A 50%, #10B981 100%)`,
                boxShadow: `0 0 15px ${fgInfo.color}44`
              }}
            >
              <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
            </div>
          </div>

          <div className="flex justify-between text-[9px] font-mono text-gray-500 mt-0.5">
            <span>0 (EXTREME FEAR)</span>
            <span>100 (EXTREME GREED)</span>
          </div>
        </div>

        {/* Volatility Index and general scan indicator */}
        <div className={`p-4 rounded-3xl ${theme.cardClass} border border-white/[0.04] flex flex-col gap-3 relative overflow-hidden`}>
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-gray-500 uppercase flex items-center gap-1">
              <Activity className="w-3.5 h-3.5 text-purple-400 animate-pulse" /> Volatility Matrix Slider
            </span>
            <span className="text-[10px] text-gray-400 font-mono font-bold bg-white/[0.04] px-1.5 py-0.2 rounded">
              CVX MATRIX
            </span>
          </div>

          <div className="flex justify-between items-end my-2">
            <span className="text-4xl font-mono font-bold tracking-tight text-white">{volatilityIndex}%</span>
            <span className="text-[10px] font-mono text-amber-500 bg-amber-500/10 px-1.5 rounded">MID-BAND SHIFT</span>
          </div>

          {/* Slider visual element */}
          <div className="h-1.5 w-full bg-white/[0.02] rounded-full overflow-hidden">
            <div className="h-full bg-orange-400 rounded-full transition-all duration-700" style={{ width: `${volatilityIndex * 2}%` }} />
          </div>

          <p className="text-[10px] font-mono text-gray-500 leading-tight">
            VIX metrics reflect minor options-hedging actions pointing at consolidative price movements within current ranges.
          </p>
        </div>

      </div>

      {/* AI Market General Updates Textboxes */}
      <div className={`p-5 rounded-3xl ${theme.cardClass} border border-white/[0.04] flex flex-col gap-3 relative overflow-hidden bg-gradient-to-r from-purple-500/[0.01]`}>
        <div className="flex items-center gap-2 text-xs font-mono text-purple-400 font-semibold uppercase">
          <Sparkles className="w-4 h-4 animate-spin" /> Vegapunk Cognitive Macro Summary
        </div>
        
        <p className="text-xs text-gray-300 leading-relaxed font-sans font-light">
          {generalSummary || 'Refreshing AI summaries data...'}
        </p>

        <div className="border-t border-white/[0.03] pt-3 flex flex-col gap-1">
          <span className="text-[9px] font-mono text-gray-500 uppercase">SYSTEM RECOMMENDATIONS</span>
          <p className="text-[11px] font-sans text-gray-400 italic">
            "{generalRecap || 'Scanning recommendation guidelines...'}"
          </p>
        </div>
      </div>

      {/* Futuristic chat interface */}
      <div className={`p-5 rounded-3xl ${theme.cardClass} border border-white/[0.04] flex flex-col gap-4 relative overflow-hidden h-[360px] max-h-[420px]`}>
        
        {/* Chat Header inside card */}
        <div className="flex justify-between items-center pb-3 border-b border-white/[0.04] text-xs font-mono text-gray-500">
          <span className="flex items-center gap-1.5 text-white font-semibold">
            <Tv className="w-3.5 h-3.5 text-purple-400 animate-pulse" /> Core Analyst Chat Tunnel
          </span>
          <button 
            onClick={fetchMarketIntelligence}
            className="p-1 rounded hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Conversations Feed */}
        <div className="flex-1 overflow-y-auto flex flex-col gap-3.5 pr-1 py-1 text-xs">
          {messages.map((m, idx) => {
            const isUser = m.sender === 'user';
            return (
              <div key={idx} className={`flex flex-col max-w-[85%] ${isUser ? 'self-end items-end' : 'self-start items-start'}`}>
                <div 
                  className={`p-3 rounded-2xl leading-relaxed text-xs transition-all ${
                    isUser 
                      ? 'bg-purple-600 text-white rounded-br-none' 
                      : 'bg-white/[0.03] text-gray-200 border border-white/[0.04] rounded-bl-none'
                  }`}
                >
                  {m.text}
                </div>
                <span className="text-[8px] font-mono text-gray-500 mt-1">{m.time} • {isUser ? 'Operator' : 'AI Engine'}</span>
              </div>
            );
          })}
          {isAiLoading && (
            <div className="p-3 rounded-2xl bg-white/[0.01] border border-white/[0.03] text-gray-500 flex items-center gap-2 self-start">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span className="font-mono text-[10px]">Thinking...</span>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Prompt suggestion triggers */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 max-w-full">
          {[
            'Explain current whale dynamics',
            'S&R support targets?',
            'RSI status summary?',
            'Provide 24h market recap'
          ].map((preset, idx) => (
            <button
              key={idx}
              onClick={() => handlePresetTrigger(preset)}
              className="px-2.5 py-1 bg-white/[0.02] hover:bg-white/5 border border-white/[0.04] text-[9px] font-mono rounded-lg text-gray-400 whitespace-nowrap scroll-smooth cursor-pointer"
            >
              {preset}
            </button>
          ))}
        </div>

        {/* Input area */}
        <div className="flex gap-2 relative mt-1 border-t border-white/[0.04] pt-3">
          <input
            type="text"
            placeholder="Ask anything about crypto or macro scenarios..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSendMessage(inputText);
            }}
            className="flex-1 h-11 px-4 pr-11 bg-black/30 border border-white/[0.08] rounded-xl text-xs text-white focus:outline-none focus:border-purple-500/40 transition-colors placeholder:text-gray-500"
          />
          <button
            onClick={() => handleSendMessage(inputText)}
            disabled={isAiLoading || !inputText.trim()}
            className="w-10 h-10 rounded-xl bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center transition-colors absolute right-1 top-[15px] cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
}
