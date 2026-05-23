import React from 'react';

interface CoinIconProps {
  pair: string;
  size?: number | string;
  className?: string;
}

export default function CoinIcon({ pair, size = 32, className = '' }: CoinIconProps) {
  // Extract coin base symbol (e.g., BTC/USDT -> BTC)
  const coin = pair.split('/')[0].toUpperCase();

  const sizeStyle = typeof size === 'number' ? { width: size, height: size } : {};

  // Customized SVGs for high-end luxury trading cockpit look
  switch (coin) {
    case 'BTC':
      return (
        <div 
          className={`rounded-full flex items-center justify-center shrink-0 border border-amber-500/30 shadow-[0_0_12px_rgba(247,147,26,0.25)] bg-gradient-to-br from-amber-500/20 to-amber-600/10 ${className}`} 
          style={sizeStyle}
        >
          <svg viewBox="0 0 24 24" className="w-[60%] h-[60%] fill-amber-400" xmlns="http://www.w3.org/2000/svg">
            <path d="M23.6 12.6c0-6.4-5.2-11.6-11.6-11.6S.4 6.2.4 12.6s5.2 11.6 11.6 11.6 11.6-5.2 11.6-11.6zm-13.9 3.1h1.7v1.8h1.1v-1.8c.3 0 .6 0 .9-.1v1.9h1.1v-1.9c1 .1 1.9-.2 2.2-.9.2-.6 0-1.3-.5-1.7.5-.4.7-.9.5-1.5-.1-.7-.8-1.1-1.6-1.2l-.1-.2v-1.9H13.8V8.6c-.3 0-.6 0-.9.1V6.9h-1.1v1.8c-.3 0-.6 0-.8-.1V6.8H9.9v1.8h-.8v1.6H10c.8 0 1.2.3 1.2.9v4.5c0 .6-.4.9-1.2.9h-.9v1.6zm2.4-5.3V9.2c.5 0 .9.2 1 .5.1.4-.2.8-.7.8zm0 3.2v-1.3c.6 0 1 .2 1.1.6 0 .4-.3.7-1.1.7z" />
          </svg>
        </div>
      );
    case 'ETH':
      return (
        <div 
          className={`rounded-full flex items-center justify-center shrink-0 border border-indigo-400/30 shadow-[0_0_12px_rgba(98,126,234,0.25)] bg-gradient-to-br from-indigo-500/20 to-purple-500/10 ${className}`} 
          style={sizeStyle}
        >
          <svg viewBox="0 0 24 24" className="w-[60%] h-[60%] fill-indigo-300" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 .5L4.5 13 12 17.5l7.5-4.5L12 .5zM4.5 14.5L12 23.5l7.5-9L12 19l-7.5-4.5z" />
          </svg>
        </div>
      );
    case 'SOL':
      return (
        <div 
          className={`rounded-full flex items-center justify-center shrink-0 border border-teal-400/30 shadow-[0_0_12px_rgba(20,241,149,0.25)] bg-gradient-to-br from-teal-500/20 to-purple-600/20 ${className}`} 
          style={sizeStyle}
        >
          <svg viewBox="0 0 24 24" className="w-[50%] h-[50%]" xmlns="http://www.w3.org/2000/svg">
            <path d="M3.7 18.5h16.6l3.7-3.7H7.4L3.7 18.5zm16.6-13H3.7L0 9.2h16.6l3.7-3.7zm0 6.5H3.7l-3.7 3.7h16.6l3.7-3.7z" fill="url(#sol_gradient)" />
            <defs>
              <linearGradient id="sol_gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#14F195" />
                <stop offset="100%" stopColor="#9945FF" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      );
    case 'BNB':
      return (
        <div 
          className={`rounded-full flex items-center justify-center shrink-0 border border-yellow-500/30 shadow-[0_0_12px_rgba(243,186,47,0.25)] bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 ${className}`} 
          style={sizeStyle}
        >
          <svg viewBox="0 0 24 24" className="w-[60%] h-[60%] fill-yellow-400" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 1.5l3.2 3.2-3.2 3.2L8.8 4.7 12 1.5zm6.5 6.5l3.2 3.2-3.2 3.2-3.2-3.2 3.2-3.2zM5.5 8l3.2 3.2-3.2 3.2L2.3 11.2 5.5 8zm6.5 6.5l3.2 3.2-3.2 3.2-3.2-3.2 3.2-3.2zM12 8l3.2 3.2-3.2 3.2-3.2-3.2L12 8z" />
          </svg>
        </div>
      );
    case 'XRP':
      return (
        <div 
          className={`rounded-full flex items-center justify-center shrink-0 border border-sky-400/30 shadow-[0_0_12px_rgba(56,189,248,0.25)] bg-gradient-to-br from-sky-500/20 to-sky-600/10 ${className}`} 
          style={sizeStyle}
        >
          <svg viewBox="0 0 24 24" className="w-[50%] h-[50%] fill-sky-300" xmlns="http://www.w3.org/2000/svg">
            <path d="M18.5 2.5L12 9.5 5.5 2.5H1l8.5 9.5L1 21.5h4.5L12 14.5l6.5 7h4.5L14.5 12l8.5-9.5h-4.5z" />
          </svg>
        </div>
      );
    case 'DOGE':
      return (
        <div 
          className={`rounded-full flex items-center justify-center shrink-0 border border-yellow-650/30 shadow-[0_0_12px_rgba(194,166,51,0.25)] bg-gradient-to-br from-yellow-500/20 to-amber-600/10 ${className}`} 
          style={sizeStyle}
        >
          <svg viewBox="0 0 24 24" className="w-[60%] h-[60%] fill-yellow-400" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 1C5.9 1 1 5.9 1 12s4.9 11 11 11 11-4.9 11-11S18.1 1 12 1zm3.8 15.1c-.8.8-1.9 1-3.1 1h-3h-1v-8.2h1h3c1.2 0 2.3.2 3.1 1 .9.9 1.3 2.1 1.3 3.1s-.4 2.2-1.3 3.1zm-1.8-4.7c0-.6-.2-1.1-.6-1.4-.4-.3-.9-.4-1.6-.4h-1.6v3.6h1.6c.7 0 1.2-.1 1.6-.4.4-.3.6-.8.6-1.4z M4 11h4v2H4v-2z" />
          </svg>
        </div>
      );
    case 'PEPE':
      return (
        <div 
          className={`rounded-full flex items-center justify-center shrink-0 border border-green-500/30 shadow-[0_0_12px_rgba(73,163,63,0.25)] bg-gradient-to-br from-green-500/20 to-emerald-600/10 ${className}`} 
          style={sizeStyle}
        >
          <svg viewBox="0 0 24 24" className="w-[60%] h-[60%] fill-green-400" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.06 14.53c-.35.35-.92.35-1.27 0l-1.59-1.59a.896.896 0 0 1 0-1.27c.35-.35.92-.35 1.27 0l.95.95v-4.04c0-.5.4-.9.9-.9s.9.4.9.9v4.04l.95-.95c.35-.35.92-.35 1.27 0a.896.896 0 0 1 0 1.27l-1.58 1.59zm3.44-8.03c-.5 0-.9-.4-.9-.9s.4-.9.9-.9.9.4.9.9-.4.9-.9.9zm-9 0c-.5 0-.9-.4-.9-.9s.4-.9.9-.9.9.4.9.9-.4.9-.9.9z" />
          </svg>
        </div>
      );
    default:
      return (
        <div 
          className={`rounded-full flex items-center justify-center shrink-0 border border-white/20 bg-white/5 ${className}`} 
          style={sizeStyle}
        >
          <span className="font-mono text-[9px] text-white/60 font-medium">{coin.slice(0, 3)}</span>
        </div>
      );
  }
}
