import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Radio, 
  Activity, 
  BrainCircuit, 
  PieChart, 
  ShieldCheck, 
  Cpu, 
  Compass, 
  Sparkles, 
  Bell, 
  Check, 
  ChevronRight, 
  X,
  Volume2,
  Clock,
  RotateCcw,
  Zap,
  Lock,
  Menu,
  Gamepad2,
  BookOpen,
  Download,
  DownloadCloud
} from 'lucide-react';

import Onboarding from './components/Onboarding';
import ChartingSystem from './components/ChartingSystem';
import SignalEngine from './components/SignalEngine';
import ExchangeConnection from './components/ExchangeConnection';
import GoogleAccount from './components/GoogleAccount';
import AIMarketAssistant from './components/AI_MarketAssistant';
import PortfolioState from './components/PortfolioState';
import SettingsSecurity from './components/SettingsSecurity';
import CoinIcon from './components/CoinIcon';
import TradingScanner from './components/TradingScanner';
import TradingGame from './components/TradingGame';
import TradeJournal from './components/TradeJournal';
import DownloadModal from './components/DownloadModal';

import { 
  ThemeId, 
  ThemeConfig, 
  ExchangeState, 
  GoogleUserProfile, 
  AppNotificationSettings, 
  SecuritySettings, 
  SmartNotification 
} from './types';
import { THEME_PRESETS } from './themes';

// Standard static notification history to populate the feed
const INITIAL_NOTIFICATIONS: SmartNotification[] = [
  {
    id: 'not-1',
    title: 'AI Signal Generated',
    message: 'High-probability BUY configuration registered for ETH/USDT on 15m timeframe.',
    type: 'SIGNAL',
    severity: 'INFO',
    read: false,
    timestamp: '5m'
  },
  {
    id: 'not-2',
    title: 'Volatile Impulse Volatility',
    message: 'BTC/USDT options-implied volatility spike of 4.2% within 5 minutes.',
    type: 'VOLATILITY',
    severity: 'WARNING',
    read: false,
    timestamp: '18m'
  },
  {
    id: 'not-3',
    title: 'Whale Flow Inflow',
    message: 'Institutional address transferred 1,200 BTC inflow to leading spot address.',
    type: 'WHALE',
    severity: 'CRITICAL',
    read: true,
    timestamp: '1h'
  }
];

export default function App() {
  // Theme state
  const [activeThemeId, setActiveThemeId] = useState<ThemeId>('arctic-white');
  const theme = THEME_PRESETS[activeThemeId];

  // Landing Onboarding
  const [showOnboarding, setShowOnboarding] = useState<boolean>(() => {
    const cached = localStorage.getItem('vegapunk_onboarded');
    return cached !== 'true';
  });

  // Tab navigation states
  const [activeTab, setActiveTab] = useState<'scanner' | 'signals' | 'game' | 'journal' | 'charts' | 'intelligence' | 'portfolio' | 'gateways'>('scanner');
  
  // Interactive variables
  const [activeCoin, setActiveCoin] = useState('BTC/USDT');

  // Integrations state
  const [exchangeState, setExchangeState] = useState<ExchangeState | null>(() => {
    const cached = localStorage.getItem('vegapunk_exchange');
    return cached ? JSON.parse(cached) : null;
  });

  const [googleProfile, setGoogleProfile] = useState<GoogleUserProfile | null>(() => {
    const cached = localStorage.getItem('vegapunk_google');
    return cached ? JSON.parse(cached) : null;
  });

  // Settings configs
  const [notificationSettings, setNotificationSettings] = useState<AppNotificationSettings>({
    signalAlerts: true,
    priceAlerts: true,
    tpSlAlerts: false,
    whaleAlerts: true,
    volatilityAlerts: true,
    newsAlerts: false
  });

  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    encryptionEnabled: true,
    twoFactorEnabled: false,
    loginHistory: []
  });

  // Real-time flash notification popups lists
  const [notificationsList, setNotificationsList] = useState<SmartNotification[]>(INITIAL_NOTIFICATIONS);
  const [activePopupAlert, setActivePopupAlert] = useState<SmartNotification | null>(null);
  const [showAlertLogDrawer, setShowAlertLogDrawer] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);

  // Sync to localStorage
  const handleConnectExchange = (data: ExchangeState) => {
    setExchangeState(data);
    localStorage.setItem('vegapunk_exchange', JSON.stringify(data));
  };

  const handleDisconnectExchange = () => {
    setExchangeState(null);
    localStorage.removeItem('vegapunk_exchange');
    triggerCustomNotification('API Node Terminated', 'Secure Bybit endpoints disconnected.', 'STOP_LOSS');
  };

  const handleGoogleLogin = (profile: GoogleUserProfile) => {
    setGoogleProfile(profile);
    localStorage.setItem('vegapunk_google', JSON.stringify(profile));
  };

  const handleGoogleLogout = () => {
    setGoogleProfile(null);
    localStorage.removeItem('vegapunk_google');
    triggerCustomNotification('Google Dissolved', 'Cloud synchronize backups unlinked.', 'NEWS');
  };

  // Onboarding completion
  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    localStorage.setItem('vegapunk_onboarded', 'true');
    triggerCustomNotification(
      'Quantum Hub Welcom',
      'System initialisation successfully completed. Welcome on deck.',
      'SIGNAL'
    );
  };

  // Re-start onboarding option
  const handleRestartOnboarding = () => {
    setShowOnboarding(true);
    localStorage.removeItem('vegapunk_onboarded');
  };

  // Floating notifications handler
  const triggerCustomNotification = (title: string, message: string, type: any) => {
    const newAlert: SmartNotification = {
      id: `alert-${Date.now()}`,
      title,
      message,
      type,
      severity: 'INFO',
      read: false,
      timestamp: 'Just now'
    };
    setNotificationsList(prev => [newAlert, ...prev]);
    setActivePopupAlert(newAlert);
  };

  // Dismiss floating alert popup
  useEffect(() => {
    if (activePopupAlert) {
      const timer = setTimeout(() => {
        setActivePopupAlert(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [activePopupAlert]);

  return (
    <div className={`min-h-screen w-full font-sans antialiased overflow-x-hidden ${theme.bgClass}`}>
      
      {/* Dynamic ambient background glow that adjusts on theme colors */}
      <div 
        className="fixed top-[-100px] left-[50%] -translate-x-1/2 w-[550px] h-[350px] rounded-full blur-[140px] pointer-events-none transition-all duration-1000 z-0"
        style={{
          background: theme.accentColor,
          opacity: theme.isDark ? 0.08 : 0.04
        }}
      />

      <AnimatePresence mode="wait">
        {showOnboarding ? (
          <motion.div
            key="onboarding"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="z-50 relative"
          >
            <Onboarding theme={theme} onComplete={handleOnboardingComplete} />
          </motion.div>
        ) : (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col min-h-screen relative z-10"
          >
            
            {/* Top Header bar cockpit layout styled to match Elegant Dark / Arctic White instructions */}
            <header className={`sticky top-4 mx-4 md:mx-8 z-40 backdrop-blur-xl border rounded-2xl h-14 px-4 flex justify-between items-center transition-all ${
              theme.isDark 
                ? 'bg-black/35 border-white/10 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.8)]' 
                : 'bg-white/45 border-black/10 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.06)]'
            }`}>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${theme.isDark ? 'bg-gradient-to-br from-white to-gray-400' : 'bg-gradient-to-br from-black to-gray-700'}`}>
                    <div className={`w-4 h-4 rounded-sm rotate-45 animate-pulse ${theme.isDark ? 'bg-black' : 'bg-white'}`}></div>
                  </div>
                  <h1 className={`font-display font-bold text-lg tracking-tighter ${theme.isDark ? 'text-white' : 'text-[#111111]'}`}>
                    VEGAPUNK <span className={`${theme.isDark ? 'text-white/40' : 'text-black/40'} font-light italic`}>HUB</span>
                  </h1>
                </div>
 
                {/* Live quotes tracking from Mockup */}
                <div className={`hidden lg:flex items-center gap-4 text-[10px] font-medium uppercase tracking-widest pl-4 h-5 border-l ${
                  theme.isDark ? 'text-white/60 border-white/10' : 'text-black/60 border-[#111111]/10'
                }`}>
                  <div className="flex items-center gap-1.5">
                    <CoinIcon pair="BTC/USDT" size={16} />
                    <span>BTC 64,129.20 <span className="text-emerald-500 font-bold ml-1">+2.4%</span></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CoinIcon pair="ETH/USDT" size={16} />
                    <span>ETH 3,421.15 <span className="text-rose-500 font-bold ml-1">-0.8%</span></span>
                  </div>
                </div>
              </div>
 
              {/* Header Right controllers */}
              <div className="flex items-center gap-2">
                {/* Download Desktop Client Button */}
                <button
                  onClick={() => setShowDownloadModal(true)}
                  title="Download Standalone Desktop App Client"
                  className={`flex items-center gap-1.5 px-3 h-8 rounded-xl font-mono text-[10px] font-bold tracking-tight transition-all active:scale-[0.97] cursor-pointer ${
                    theme.isDark 
                      ? 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-[0_2px_10px_-2px_rgba(16,185,129,0.3)]' 
                      : 'bg-emerald-600/15 hover:bg-emerald-600/25 text-emerald-800 border border-emerald-600/25 shadow-[0_2px_10px_-2px_rgba(16,185,129,0.15)]'
                  }`}
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden xs:inline">DOWNLOAD CLIENT</span>
                </button>

                {/* Active Theme indicator from mockup */}
                <div className={`hidden sm:flex items-center px-3 py-1 rounded-full text-[10px] font-medium tracking-tight h-7 ${
                  theme.isDark ? 'bg-white/5 border border-white/10 text-white' : 'bg-black/5 border border-black/10 text-[#111111]'
                }`}>
                  <span className={`${theme.isDark ? 'text-white/40' : 'text-black/40'} mr-1.5`}>THEME</span>
                  <span className="font-bold uppercase">{theme.name}</span>
                </div>
 
                {/* Onboarding retrigger links */}
                <button
                  onClick={handleRestartOnboarding}
                  title="View Onboarding Presentation"
                  className={`p-1.5 h-8 w-8 rounded-xl border transition-all flex items-center justify-center cursor-pointer ${
                    theme.isDark ? 'border-white/10 hover:bg-white/5 text-gray-400 hover:text-white' : 'border-black/10 hover:bg-black/5 text-gray-500 hover:text-black'
                  }`}
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
 
                {/* Secure sync profile avatar indicators */}
                {googleProfile ? (
                  <div className={`flex items-center gap-2 px-2.5 py-1 rounded-xl border h-8 ${
                    theme.isDark ? 'border-white/10 bg-white/5 text-gray-300' : 'border-black/10 bg-black/5 text-gray-800'
                  }`}>
                    <img src={googleProfile.avatarUrl} alt="Avatar" className="w-5 h-5 rounded-full object-cover border border-white/20" />
                    <span className="hidden md:inline font-mono text-[9px]">{googleProfile.name}</span>
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full border border-white/20 bg-[url('https://api.dicebear.com/7.x/shapes/svg?seed=vegapunk')] bg-cover shrink-0" />
                )}
 
                {/* Notification Alarm trigger */}
                <div className="relative">
                  <button
                    onClick={() => setShowAlertLogDrawer(true)}
                    className={`p-1.5 h-8 w-8 rounded-xl border transition-all relative flex items-center justify-center cursor-pointer ${
                      theme.isDark ? 'border-white/10 hover:bg-white/5 text-gray-400 hover:text-white' : 'border-black/10 hover:bg-black/5 text-gray-500 hover:text-black'
                    }`}
                  >
                    <Bell className="w-4 h-4" />
                    {notificationsList.length > 0 && (
                      <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-400 shadow-[0_0_6px_#f87171]" />
                    )}
                  </button>
                </div>
              </div>
            </header>

            {/* Main scrollable body panel */}
            <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-5 md:py-8 flex flex-col gap-6 select-none pb-28">
              
              {/* Active Tab Screen rendering with nice fade integrations */}
              <div className="w-full flex-1">
                {activeTab === 'scanner' && (
                  <TradingScanner 
                    theme={theme}
                    onSelectCoin={(coin) => {
                      setActiveCoin(coin);
                      setActiveTab('charts');
                      triggerCustomNotification('Coin Aligned', `Terminals aligned focus to ${coin} candlestick feed.`, 'SIGNAL');
                    }}
                    onTriggerNotification={triggerCustomNotification}
                  />
                )}

                {activeTab === 'signals' && (
                  <SignalEngine 
                    theme={theme} 
                    onSelectCoin={(coin) => {
                      setActiveCoin(coin);
                      setActiveTab('charts');
                      triggerCustomNotification('Coin Aligned', `Terminals aligned focus to ${coin} candlestick feed.`, 'SIGNAL');
                    }}
                    activeCoin={activeCoin}
                    onTriggerNotification={triggerCustomNotification}
                    apiConnected={!!exchangeState?.connected}
                  />
                )}

                {activeTab === 'game' && (
                  <TradingGame 
                    theme={theme}
                    onTriggerNotification={triggerCustomNotification}
                  />
                )}

                {activeTab === 'journal' && (
                  <TradeJournal 
                    theme={theme}
                    onTriggerNotification={triggerCustomNotification}
                  />
                )}

                {activeTab === 'charts' && (
                  <ChartingSystem 
                    theme={theme} 
                    activeCoin={activeCoin} 
                  />
                )}

                {activeTab === 'intelligence' && (
                  <AIMarketAssistant 
                    theme={theme}
                    onTriggerNotification={triggerCustomNotification}
                  />
                )}

                {activeTab === 'portfolio' && (
                  <PortfolioState 
                    theme={theme}
                    onTriggerNotification={triggerCustomNotification}
                    bybitConnected={!!exchangeState?.connected}
                  />
                )}

                {activeTab === 'gateways' && (
                  <div className="flex flex-col gap-6">
                    <ExchangeConnection 
                      theme={theme}
                      onConnectExchange={handleConnectExchange}
                      onTriggerNotification={triggerCustomNotification}
                      exchangeState={exchangeState}
                      onDisconnect={handleDisconnectExchange}
                    />

                    <GoogleAccount 
                      theme={theme}
                      profile={googleProfile}
                      onLogin={handleGoogleLogin}
                      onLogout={handleGoogleLogout}
                      onTriggerNotification={triggerCustomNotification}
                    />

                    <SettingsSecurity 
                      theme={theme}
                      activeThemeId={activeThemeId}
                      onChangeTheme={setActiveThemeId}
                      notificationSettings={notificationSettings}
                      onChangeNotifications={setNotificationSettings}
                      securitySettings={securitySettings}
                      onChangeSecurity={setSecuritySettings}
                      onTriggerNotification={triggerCustomNotification}
                    />
                  </div>
                )}
              </div>

            </main>

            {/* Premium Bottom navigation - Styled to Elegant Dark / Arctic White specifications */}
            <nav className={`fixed bottom-4 inset-x-4 max-w-2xl mx-auto z-40 backdrop-blur-xl border rounded-2xl p-1.5 flex justify-between items-center overflow-x-auto whitespace-nowrap scrollbar-none gap-2 transition-all duration-300 ${
              theme.isDark 
                ? 'bg-black/45 border-white/10 shadow-[0_12px_44px_rgba(0,0,0,0.85)]' 
                : 'bg-white/55 border-black/10 shadow-[0_12px_44px_rgba(0,0,0,0.08)]'
            }`}>
              {[
                { id: 'scanner', label: 'SCANNER', icon: Compass },
                { id: 'signals', label: 'SIGNALS', icon: Cpu },
                { id: 'game', label: 'SIMULATOR', icon: Gamepad2 },
                { id: 'journal', label: 'JOURNAL', icon: BookOpen },
                { id: 'charts', label: 'CHARTS', icon: Activity },
                { id: 'intelligence', label: 'AI COGNITIVE', icon: BrainCircuit },
                { id: 'portfolio', label: 'PORTFOLIO', icon: PieChart },
                { id: 'gateways', label: 'GATEWAYS', icon: ShieldCheck }
              ].map(tab => {
                const TabIcon = tab.icon;
                const isSelected = activeTab === tab.id;
                
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className="flex-1 min-w-[55px] sm:min-w-[65px] py-1.5 flex flex-col items-center justify-center gap-1 transition-all text-gray-500 hover:text-gray-300 relative group cursor-pointer"
                  >
                    <TabIcon className="w-4 h-4 transition-transform duration-300 group-hover:scale-105" 
                             style={isSelected ? { color: theme.accentColor } : {}} />
                    <span className="text-[8.5px] font-mono tracking-wider transition-colors duration-300"
                          style={isSelected ? { color: theme.accentColor, fontWeight: 600 } : {}}>
                      {tab.label}
                    </span>

                    {isSelected && (
                      <motion.div 
                        layoutId="activeTabMarker"
                        className="absolute bottom-[-2px] w-5 h-0.5 rounded-full"
                        style={{ backgroundColor: theme.accentColor }}
                      />
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Floating Top Notifications Alert Popup */}
            <AnimatePresence>
              {activePopupAlert && (
                <motion.div
                  initial={{ opacity: 0, y: -50, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="fixed top-20 inset-x-4 max-w-sm mx-auto z-50 p-4 rounded-2xl bg-black/75 backdrop-blur-xl border border-white/10 shadow-[0_12px_36px_rgba(0,0,0,0.6)] flex gap-3 text-xs leading-relaxed"
                >
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center border border-purple-500/15 shrink-0 select-none">
                    <Sparkles className="w-4.5 h-4.5 text-purple-400 animate-pulse" />
                  </div>
                  
                  <div className="flex-1 pr-4">
                    <span className="font-display font-bold text-white block mb-0.5 text-xs">{activePopupAlert.title}</span>
                    <span className="text-gray-400 text-[11px] leading-relaxed block">{activePopupAlert.message}</span>
                  </div>

                  <button 
                    onClick={() => setActivePopupAlert(null)}
                    className="absolute right-2 top-2 p-1 text-gray-500 hover:text-white transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Smart notifications list log side drawer dialog */}
            <AnimatePresence>
              {showAlertLogDrawer && (
                <>
                  {/* Backdrop */}
                  <div 
                    onClick={() => setShowAlertLogDrawer(false)}
                    className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
                  />
                  
                  {/* Drawer Content */}
                  <motion.div
                    initial={{ x: '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '100%' }}
                    transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                    className="fixed right-0 inset-y-0 w-full max-w-sm z-50 bg-[#0E0F12] border-l border-white/[0.08] shadow-[0_0_50px_rgba(0,0,0,0.8)] p-5 flex flex-col gap-4 text-white"
                  >
                    <div className="flex justify-between items-center pb-3 border-b border-white/[0.08]">
                      <div>
                        <h3 className="font-display font-bold text-sm">SECURED ALERTS LOG</h3>
                        <span className="font-mono text-[9px] text-gray-400 uppercase">Traffic monitoring</span>
                      </div>
                      <button 
                        onClick={() => setShowAlertLogDrawer(false)}
                        className="p-1.5 rounded-lg bg-white/[0.03] hover:bg-white/5 text-gray-400 hover:text-white transition-colors cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex-1 overflow-y-auto flex flex-col gap-3">
                      {notificationsList.map(not => (
                        <div key={not.id} className="p-3 bg-white/[0.02] border border-white/[0.04] rounded-xl flex flex-col gap-1 text-xs">
                          <div className="flex justify-between items-start font-mono">
                            <span className="font-bold text-white uppercase text-[10px]">{not.title}</span>
                            <span className="text-[9px] text-gray-550">{not.timestamp} ago</span>
                          </div>
                          <span className="text-gray-400 text-[11px] leading-relaxed block mt-1">{not.message}</span>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => {
                        setNotificationsList([]);
                        triggerCustomNotification('Logs Discarded', 'Complete notifications event array cleared.', 'SIGNAL');
                      }}
                      className="w-full h-11 rounded-xl bg-white/[0.03] hover:bg-white/5 text-xs text-gray-400 font-mono tracking-wider transition-all"
                    >
                      Clear All Security Logs
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>

            {/* Standalone Client / App download portal modal */}
            <AnimatePresence>
              {showDownloadModal && (
                <DownloadModal
                  theme={theme}
                  isOpen={showDownloadModal}
                  onClose={() => setShowDownloadModal(false)}
                  onTriggerNotification={triggerCustomNotification}
                />
              )}
            </AnimatePresence>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
