import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Cpu, 
  TrendingUp, 
  Radio, 
  PieChart, 
  BrainCircuit, 
  ShieldCheck, 
  ArrowRight, 
  Zap, 
  Navigation,
  Sparkles
} from 'lucide-react';
import { ThemeConfig } from '../types';

interface OnboardingProps {
  theme: ThemeConfig;
  onComplete: () => void;
}

export default function Onboarding({ theme, onComplete }: OnboardingProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: 'AI SIGNAL ENGINE',
      description: 'Institutional-grade Buy & Sell alert metrics powered by real-time Order Block breakout, Whale volume imbalance shifts, and liquid S/R mappings.',
      icon: Cpu,
      gradient: 'from-blue-500/20 to-teal-400/20',
      tag: 'ULTRA LOW-LATENCY'
    },
    {
      title: 'SMART TRADING CORE',
      description: 'Automate protective stop losses and take profit targets directly synced via premium secure Exchange corridors. Designed for high frequency scalp and swing traders.',
      icon: TrendingUp,
      gradient: 'from-teal-500/20 to-emerald-400/20',
      tag: 'ALGORITHMIC INTEGRATION'
    },
    {
      title: 'EXCHANGE SYNCING',
      description: 'Establish secure read-only bridges to Bybit, Binance, and OKX spots or futures accounts. Keep track of live open margins and balances effortlessly.',
      icon: Radio,
      gradient: 'from-indigo-500/20 to-purple-400/20',
      tag: 'API PASSKEY SHIELD'
    },
    {
      title: 'PORTFOLIO INTELLIGENCE',
      description: 'Analyze allocation flow, historic ROI trajectories, and continuous win-loss performance indicators within a single responsive visual dashboard.',
      icon: PieChart,
      gradient: 'from-purple-500/20 to-pink-400/20',
      tag: 'QUANT ANALYTICS'
    },
    {
      title: 'MARKET ASSISTANT',
      description: 'Converse with Vegapunks text-based high-intelligence market agent. Scan localized fear/greed levels, volatility scores, and daily macro news impacts.',
      icon: BrainCircuit,
      gradient: 'from-amber-500/20 to-orange-400/20',
      tag: 'COGNITIVE MARKET EYE'
    },
    {
      title: 'ELITE SECURE ENCLAVE',
      description: 'Advanced local localStorage API encryption, simulated biometric security clearances, anti-phishing warnings, and session logs to protect system preferences.',
      icon: ShieldCheck,
      gradient: 'from-red-500/20 to-purple-500/20',
      tag: 'HIGHLY SANCTIFIED CORE'
    }
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  const SlideIcon = slides[currentSlide].icon;

  return (
    <div className={`min-h-screen w-full flex flex-col justify-between p-6 md:p-12 relative overflow-hidden ${theme.bgClass}`}>
      {/* Background ambient lighting */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full blur-[120px] pointer-events-none transition-all duration-1000"
        style={{
          background: theme.accentColor,
          opacity: theme.isDark ? 0.08 : 0.04
        }}
      />

      {/* Top Header */}
      <div className="flex justify-between items-center z-10">
        <div className="flex items-center gap-2">
          <div 
            className="w-8 h-8 rounded-lg flex items-center justify-center border transition-all duration-300"
            style={{ 
              borderColor: `${theme.accentColor}33`,
              boxShadow: `0 0 15px ${theme.accentColor}22`
            }}
          >
            <Sparkles className="w-4 h-4" style={{ color: theme.accentColor }} />
          </div>
          <span className="font-display font-bold text-sm tracking-wider">VEGAPUNK TRADING</span>
        </div>
        <button 
          onClick={onComplete}
          className="text-xs font-mono uppercase tracking-widest hover:opacity-80 transition-opacity"
          style={{ color: theme.accentColor }}
        >
          Skip Intro
        </button>
      </div>

      {/* Slide Container */}
      <div className="flex-1 flex flex-col justify-center items-center my-8 max-w-lg mx-auto w-full z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -15 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className={`w-full p-8 rounded-3xl ${theme.cardClass} relative overflow-hidden flex flex-col items-center text-center`}
          >
            {/* Background premium pattern representation */}
            <div className={`absolute top-0 inset-x-0 h-40 bg-gradient-to-b ${slides[currentSlide].gradient} opacity-20 pointer-events-none blur-xl`} />
            
            <span className="px-3 py-1 rounded-full text-[10px] font-mono font-medium tracking-wider uppercase mb-8 border border-white/[0.08]"
                  style={{
                    borderColor: `${theme.accentColor}22`,
                    color: theme.accentColor,
                    boxShadow: `0 0 12px ${theme.accentColor}11`
                  }}>
              {slides[currentSlide].tag}
            </span>

            <div 
              className="w-20 h-20 rounded-2xl flex items-center justify-center mb-8 border backdrop-blur-md transition-all duration-500"
              style={{
                borderColor: `${theme.accentColor}2a`,
                background: `${theme.accentColor}0e`,
                boxShadow: `0 12px 30px -8px ${theme.accentColor}22`
              }}
            >
              <SlideIcon className="w-10 h-10 transition-transform duration-500 rotate-3" style={{ color: theme.accentColor }} />
            </div>

            <h2 className="font-display font-bold text-xl md:text-2xl tracking-normal mb-4">
              {slides[currentSlide].title}
            </h2>

            <p className="text-sm md:text-base leading-relaxed opacity-80 font-sans font-light px-2"
               style={{ color: theme.isDark ? '#D1D5DB' : '#4B5563' }}>
              {slides[currentSlide].description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Controls */}
      <div className="flex flex-col gap-6 max-w-lg mx-auto w-full z-10">
        {/* Pagination Dots */}
        <div className="flex justify-center gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className="h-1 rounded-full transition-all duration-300"
              style={{
                width: currentSlide === idx ? '24px' : '6px',
                backgroundColor: currentSlide === idx ? theme.accentColor : `${theme.accentColor}33`
              }}
            />
          ))}
        </div>

        {/* Proceed Button */}
        <button
          onClick={handleNext}
          className="w-full h-14 rounded-full flex items-center justify-center gap-2 text-sm font-display font-medium tracking-wide transition-all duration-300 relative group overflow-hidden"
          style={{
            backgroundColor: theme.accentColor,
            color: theme.id === 'arctic-white' ? '#FFFFFF' : '#000000',
            boxShadow: `0 8px 30px -6px ${theme.accentColor}66`
          }}
        >
          <span className="z-10">{currentSlide === slides.length - 1 ? 'Launch Trading Core' : 'Next Intelligence Module'}</span>
          <ArrowRight className="w-4 h-4 z-10 transition-transform duration-300 group-hover:translate-x-1" />
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
      </div>
    </div>
  );
}
