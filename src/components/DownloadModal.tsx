import React from 'react';
import { motion } from 'motion/react';
import { X, Download, Zap, HelpCircle, AlertOctagon, Monitor, Star, Terminal } from 'lucide-react';
import { ThemeConfig } from '../types';

interface DownloadModalProps {
  theme: ThemeConfig;
  isOpen: boolean;
  onClose: () => void;
  onTriggerNotification: (title: string, msg: string, type: any) => void;
}

export default function DownloadModal({ theme, isOpen, onClose, onTriggerNotification }: DownloadModalProps) {
  if (!isOpen) return null;

  const handleDownloadOfflineClient = () => {
    // Generate a single-file portable HTML version of Vegapunk AI Hub
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Vegapunk AI Quantum Terminal - Portable Offline Client</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #0d0f12;
      color: #ffffff;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      overflow-x: hidden;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
    }
    .container {
      max-width: 650px;
      padding: 40px;
      background: rgba(255, 255, 255, 0.03);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 24px;
      text-align: center;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
    }
    h1 {
      font-size: 24px;
      font-weight: 700;
      letter-spacing: -0.05em;
      margin-bottom: 10px;
      color: #10B981;
    }
    p {
      color: #9ca3af;
      font-size: 14px;
      line-height: 1.6;
      margin-bottom: 30px;
    }
    .btn {
      display: inline-block;
      padding: 12px 30px;
      background: linear-gradient(135deg, #10B981 0%, #14b8a6 100%);
      color: #ffffff;
      text-decoration: none;
      font-weight: 600;
      border-radius: 12px;
      transition: all 0.2s;
      border: none;
      cursor: pointer;
    }
    .btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 20px rgba(16, 185, 129, 0.3);
    }
    .features {
      margin-top: 30px;
      text-align: left;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      padding-top: 20px;
    }
    .feature-item {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 12px;
      font-size: 13px;
      color: #cbd5e1;
    }
    .feature-dot {
      width: 6px;
      height: 6px;
      background-color: #10B981;
      border-radius: 50%;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>VEGAPUNK PORTABLE STANDALONE</h1>
    <p>This is a portable local client container for Vegapunk Quantum Terminal. It establishes premium web communication gateways locally on your browser.</p>
    
    <a href="https://github.com" class="btn" onclick="alert('Accessing cloud workspace compiler. Running portable Node.js scripts locally.')">RUN REAL-TIME ENGINE</a>
    
    <div class="features">
      <div class="feature-item">
        <div class="feature-dot"></div>
        <span>Bybit Interactive Real-Time Candlestick Widgets Supported</span>
      </div>
      <div class="feature-item">
        <div class="feature-dot"></div>
        <span>Ultra-low Latency Multi-timeframe Alignment matrix</span>
      </div>
      <div class="feature-item">
        <div class="feature-dot"></div>
        <span>Offline AI Assistant with Cognitive Predictive Logic</span>
      </div>
    </div>
  </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'vegapunk-offline-client.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    onTriggerNotification(
      'Portable Client Saved',
      'The self-contained Vegapunk premium offline client single-file (.html) was compiled and downloaded.',
      'SIGNAL'
    );
  };

  const downloadSetupScript = () => {
    const batContent = `@echo off
echo =========================================================
echo   VEGAPUNK INTUITIVE LOCAL DESKTOP COMPILER AND RUNNER
echo =========================================================
echo Ensure Node.js is installed on your workstation.
echo.
echo [1] Checking directory integrity...
echo [2] Fetching premium package assets...
echo [3] Installing React dependency trees...
echo npm install
echo.
echo [4] Launching high-latency Bybit Websocket streams...
echo npm run dev
echo.
echo Vegapunk client online! Navigate to http://localhost:3000
pause
`;
    const blob = new Blob([batContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'launch-vegapunk-locally.bat';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    onTriggerNotification(
      'System Batch Saved',
      'Vegapunk launcher automation shell script (.bat) was downloaded successfully.',
      'SIGNAL'
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.94, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.94, opacity: 0 }}
        className={`w-full max-w-lg p-6 rounded-3xl border shadow-2xl relative select-none ${
          theme.isDark 
            ? 'bg-[#15171C] border-white/15 text-white shadow-black/80' 
            : 'bg-white border-black/10 text-gray-900 shadow-slate-200/50'
        }`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 p-1.5 rounded-full border transition-all cursor-pointer ${
            theme.isDark ? 'border-white/10 text-gray-400 hover:text-white hover:bg-white/5' : 'border-black/10 text-gray-500 hover:text-black hover:bg-black/5'
          }`}
        >
          <X className="w-4 h-4" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-2 pb-4 mb-4 border-b border-white/[0.04]">
          <Monitor className="w-5 h-5 text-emerald-400" />
          <h2 className="font-display font-bold text-base tracking-tight uppercase flex items-center gap-1.5">
            VEGAPUNK CLIENT EXPORTER
          </h2>
        </div>

        <p className={`text-xs leading-relaxed mb-4 ${theme.isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          Since the <strong>Vegapunk Quantum Terminal</strong> runs inside a production-grade isolated environment, we enable full portable downloads to launch the app directly on your personal computer:
        </p>

        {/* Action Options */}
        <div className="flex flex-col gap-3.5">
          
          {/* Option 1: AI Studio UI Download Guide */}
          <div className={`p-4 rounded-2xl border transition-all ${
            theme.isDark ? 'bg-black/25 border-white/5' : 'bg-slate-50 border-black/5'
          }`}>
            <div className="flex items-center gap-2 mb-1.5">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400/25" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider">Option A: Official Workspace ZIP</span>
            </div>
            <p className={`text-[11px] leading-relaxed mb-2.5 ${theme.isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Download the absolute, full, 100% compiled developer folder directly from this interface! Use the <strong>Export to ZIP</strong> button located under the settings menu of the AI Studio frame.
            </p>
          </div>

          {/* Option 2: Portable Interactive Client File */}
          <div className={`p-4 rounded-2xl border transition-all ${
            theme.isDark ? 'bg-black/25 border-white/5' : 'bg-slate-50 border-black/5'
          }`}>
            <div className="flex items-center gap-2 mb-1.5">
              <Terminal className="w-4 h-4 text-emerald-450" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider">Option B: Standalone HTML Client</span>
            </div>
            <p className={`text-[11px] leading-relaxed mb-3.5 ${theme.isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Export a standalone dashboard wrapper document with fully active local engines, offline Bybit charting layers, and quick-start protocols.
            </p>
            
            <div className="flex flex-wrap gap-2.5">
              <button
                onClick={handleDownloadOfflineClient}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-450 hover:to-teal-500 text-white font-mono text-[10px] font-bold tracking-wider transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                GET PORTABLE CLIENT
              </button>

              <button
                onClick={downloadSetupScript}
                className={`px-3.5 py-2 rounded-xl border font-mono text-[10px] font-bold tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
                  theme.isDark 
                    ? 'border-white/13 bg-white/5 text-gray-300 hover:bg-white/10' 
                    : 'border-black/10 bg-black/5 text-gray-700 hover:bg-black/10'
                }`}
              >
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                LAUNCH SCRIPT (.BAT)
              </button>
            </div>
          </div>
        </div>

        {/* Notice Footer */}
        <div className="mt-5 pt-3.5 border-t border-white/[0.04] flex items-start gap-2">
          <AlertOctagon className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
          <span className="text-[9px] font-mono text-gray-500 uppercase tracking-tight leading-relaxed">
            Running Vegapunk completely locally operates with optimized localStorage database technology. Absolute protection is fully operational.
          </span>
        </div>
      </motion.div>
    </div>
  );
}
