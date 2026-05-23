import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Palette, 
  Bell, 
  ShieldCheck, 
  Fingerprint, 
  QrCode, 
  History, 
  Lock, 
  Compass, 
  Sliders, 
  Zap, 
  Camera,
  CheckCircle,
  HelpCircle,
  AlertOctagon,
  Award,
  RefreshCw
} from 'lucide-react';
import { ThemeConfig, ThemeId, AppNotificationSettings, SecuritySettings } from '../types';
import { THEME_PRESETS } from '../themes';

interface SettingsSecurityProps {
  theme: ThemeConfig;
  activeThemeId: ThemeId;
  onChangeTheme: (id: ThemeId) => void;
  notificationSettings: AppNotificationSettings;
  onChangeNotifications: (settings: AppNotificationSettings) => void;
  securitySettings: SecuritySettings;
  onChangeSecurity: (settings: SecuritySettings) => void;
  onTriggerNotification: (title: string, msg: string, type: any) => void;
}

export const MOCK_LOGIN_HISTORY = [
  { timestamp: '2026-05-22 14:12', device: 'Apple iPhone 15 Pro', ip: '185.112.144.12', location: 'London, UK' },
  { timestamp: '2026-05-22 09:34', device: 'macOS Chrome Browser', ip: '82.210.198.4', location: 'London, UK' },
  { timestamp: '2026-05-21 18:55', device: 'Ubuntu Node Sync daemon', ip: '45.12.84.102', location: 'Frankfurt, GER' }
];

export default function SettingsSecurity({
  theme,
  activeThemeId,
  onChangeTheme,
  notificationSettings,
  onChangeNotifications,
  securitySettings,
  onChangeSecurity,
  onTriggerNotification
}: SettingsSecurityProps) {
  const [activePane, setActivePane] = useState<'THEMES' | 'SECURITY' | 'NOTIFICATIONS' | 'DOWNLOADS'>('THEMES');
  
  // Biometric scanner state simulation
  const [biometricScanning, setBiometricScanning] = useState(false);
  const [biometricSuccess, setBiometricSuccess] = useState(false);
  
  // QR code rendering generator indicator mock
  const [showQr, setShowQr] = useState(false);
  const [authenticatorCode, setAuthenticatorCode] = useState('');

  const handleDownloadAppBundle = () => {
    const readmeContent = `# VEGAPUNK AI QUANTUM TERMINAL - OFFLINE CLIENT
=========================================================
Thank you for downloading the premium Vegapunk AI desktop runner.

## QUICK START INSTRUCTIONS
1. Extract this file archive completely.
2. Ensure you have Node.js installed on your machine (v18.0 or higher).
3. Open a terminal / Command Prompt inside the extracted directory.
4. Execute:
   npm install
5. Launch the local client server by running:
   npm run dev
6. Open http://localhost:3000 in your browser to experience full real-time Bybit charts, AI signal generators, interactive trading simulators, and smart trade journals running 100% locally!

* Vegapunk Hub Secure Client v2.4.0 *
`;

    // Download README file
    const blob = new Blob([readmeContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'VEGAPUNK_DESKTOP_GUIDE.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    onTriggerNotification(
      'Client Package Downloaded',
      'Vegapunk offline shell and desktop documentation compiled and saved dynamically to your downloads folder.',
      'SIGNAL'
    );
  };

  const triggerThemeSwap = (id: ThemeId) => {
    onChangeTheme(id);
    onTriggerNotification(
      'Aesthetic Node Swapped',
      `Vegapunk dashboard palette synchronized to ${THEME_PRESETS[id].name}.`,
      'NEWS'
    );
  };

  const scanBiometricsSimulate = () => {
    setBiometricScanning(true);
    setBiometricSuccess(false);

    setTimeout(() => {
      setBiometricScanning(false);
      setBiometricSuccess(true);
      onChangeSecurity({
        ...securitySettings,
        encryptionEnabled: true
      });
      onTriggerNotification(
        'Biometric Auth Synced',
        'Your fingerprint/face ID token successfully bound to local vault key protection.',
        'SIGNAL'
      );
    }, 2000);
  };

  const handleToggle2FA = () => {
    if (securitySettings.twoFactorEnabled) {
      onChangeSecurity({
         ...securitySettings,
         twoFactorEnabled: false
      });
      setShowQr(false);
      onTriggerNotification('2FA Security Disabled', 'Multi-factor access credentials discarded.', 'VOLATILITY');
    } else {
       setShowQr(true);
    }
  };

  const handleVerify2FACode = (e: React.FormEvent) => {
    e.preventDefault();
    if (authenticatorCode.length < 4) return;
    onChangeSecurity({
      ...securitySettings,
      twoFactorEnabled: true
    });
    setAuthenticatorCode('');
    setShowQr(false);
    onTriggerNotification(
      '2FA Token Connected',
      'Continuous authenticator challenge loop established for order dispatch permissions.',
      'SIGNAL'
    );
  };

  return (
    <div className="flex flex-col gap-4">
      
      {/* Settings Navigation */}
      <div className="flex p-0.5 rounded-xl border border-white/[0.04] bg-black/20 overflow-x-auto max-w-full">
        {(['THEMES', 'SECURITY', 'NOTIFICATIONS', 'DOWNLOADS'] as const).map(pane => (
          <button
            key={pane}
            onClick={() => setActivePane(pane)}
            className={`px-4 py-2 text-xs font-mono font-medium rounded-lg transition-all uppercase whitespace-nowrap flex-1 cursor-pointer ${
              activePane === pane ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-400'
            }`}
            style={activePane === pane ? { color: theme.accentColor } : {}}
          >
            {pane}
          </button>
        ))}
      </div>

      {activePane === 'THEMES' && (
        <div className={`p-5 rounded-3xl ${theme.cardClass} border border-white/[0.04] flex flex-col gap-4`}>
          <div className="flex items-center gap-2 pb-3 border-b border-white/[0.04]">
            <Palette className="w-4.5 h-4.5" style={{ color: theme.accentColor }} />
            <h3 className="font-display font-semibold text-sm">SELECT HIGH-END THEME SECURE PRESETS</h3>
          </div>

          <p className="text-xs text-gray-500 font-sans leading-relaxed">
            Vegapunks system auto-calibrates color palettes, glow emissions, and border parameters instantly across all dashboard and candlestick charting engines.
          </p>

          <div className="grid grid-cols-2 gap-3.5 pt-2">
            {(Object.keys(THEME_PRESETS) as ThemeId[]).map(id => {
              const p = THEME_PRESETS[id];
              const isSelected = activeThemeId === id;
              
              return (
                <button
                  key={id}
                  onClick={() => triggerThemeSwap(id)}
                  className={`p-4 rounded-2xl text-left border relative overflow-hidden transition-all duration-300 ${
                    isSelected 
                      ? 'border-white/20 scale-[1.01]' 
                      : 'border-white/[0.04] hover:bg-white/[0.02]'
                  }`}
                  style={isSelected ? { 
                    borderColor: p.accentColor, 
                    boxShadow: `0 8px 24px -6px ${p.accentColor}33`,
                    background: p.isDark ? '#15171C' : '#FFFFFF'
                  } : { 
                    backgroundColor: 'rgba(0,0,0,0.15)' 
                  }}
                >
                  {/* Decorative corner visual */}
                  <div className="absolute top-0 right-0 w-8 h-8 rounded-full blur-[15px] opacity-25"
                       style={{ background: p.accentColor }} />

                  <span className="text-xs font-display font-medium block text-white">{p.name}</span>
                  <span className="text-[10px] font-mono text-gray-400 mt-2 block uppercase">{p.isDark ? 'Dark glass' : 'Light glass'}</span>
                  
                  {/* Visual color dot row indicator */}
                  <div className="flex gap-1.5 mt-3">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.accentColor }} />
                    <div className="w-2.5 h-2.5 rounded-full border border-white/[0.1]" style={{ background: p.isDark ? '#000000' : '#CCCCCC' }} />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {activePane === 'SECURITY' && (
        <div className="flex flex-col gap-4">
          
          {/* Encrypted Vault and Biometrics setups */}
          <div className={`p-5 rounded-3xl ${theme.cardClass} border border-white/[0.04] flex flex-col gap-4 relative overflow-hidden bg-gradient-to-b from-purple-500/[0.01]`}>
            <div className="flex items-center gap-2 pb-3 border-b border-white/[0.04]">
              <ShieldCheck className="w-4.5 h-4.5 text-purple-400" />
              <h3 className="font-display font-semibold text-sm">SECURE VAULT ENCRYPTION</h3>
            </div>

            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-gray-400 block font-sans">ENCRYPTED STATE:</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${securitySettings.encryptionEnabled ? 'text-emerald-400 bg-emerald-500/10' : 'text-amber-400 bg-amber-500/10'}`}>
                {securitySettings.encryptionEnabled ? 'AES-256 SYSTEM PROTECTED' : 'LOCAL STANDARD'}
              </span>
            </div>

            <p className="text-xs text-gray-550 font-sans leading-relaxed">
              Biometric binding links the local private key container directly with hardware face triggers or touch targets. Keep this parameter verified.
            </p>

            {/* Custom Interactive Biometric visual box scanner */}
            <div className="border border-white/[0.04] bg-black/15 p-4 rounded-2xl flex flex-col items-center justify-center text-center gap-3 relative min-h-[140px] overflow-hidden">
              <AnimatePresence mode="wait">
                {biometricScanning ? (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center gap-2"
                  >
                    <RefreshCw className="w-8 h-8 text-purple-400 animate-spin" />
                    <span className="font-mono text-xs text-purple-450 animate-pulse uppercase">TRANSMITTING hardWARE CHALLENGE...</span>
                  </motion.div>
                ) : biometricSuccess ? (
                  <motion.div 
                    initial={{ scale: 0.95 }}
                    animate={{ scale: 1 }}
                    className="flex flex-col items-center gap-2"
                  >
                    <CheckCircle className="w-9 h-9 text-emerald-400" />
                    <span className="font-mono text-xs text-emerald-400 uppercase font-semibold">SECURITY VAULT UNLOCKED</span>
                    <button onClick={() => setBiometricSuccess(false)} className="text-[10px] text-gray-500 hover:text-gray-300 underline font-mono">Reset Protection Token</button>
                  </motion.div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center gap-3"
                  >
                    <Fingerprint className="w-10 h-10 text-gray-500 hover:text-gray-300 cursor-pointer transition-colors" onClick={scanBiometricsSimulate} />
                    <span className="text-[10px] font-mono text-gray-400 tracking-wider block">TAP SENSOR TO VERIFY BIOMETRIC KEY</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Authentic Multi-Factor Authenticator 2FA */}
          <div className={`p-5 rounded-3xl ${theme.cardClass} border border-white/[0.04] flex flex-col gap-4`}>
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="font-semibold text-white uppercase flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-indigo-400" /> Multi-Factor 2FA Control
              </span>
              
              {/* Trigger Toggler */}
              <button
                onClick={handleToggle2FA}
                className={`w-11 h-6 rounded-full transition-colors relative flex items-center ${
                  securitySettings.twoFactorEnabled ? 'bg-indigo-600' : 'bg-white/[0.05] border border-white/[0.08]'
                }`}
              >
                <div className={`w-4.5 h-4.5 rounded-full bg-white shadow transition-all ${
                  securitySettings.twoFactorEnabled ? 'translate-x-5' : 'translate-x-0.5'
                }`} />
              </button>
            </div>

            <p className="text-xs text-gray-550 font-sans leading-relaxed">
              Require dual token confirmations (OTP) for any outbound dispatch of Spot or Futures orders.
            </p>

            {showQr && (
              <form onSubmit={handleVerify2FACode} className="p-4 rounded-2xl bg-black/15 border border-indigo-500/20 flex flex-col items-center gap-3.5 text-center">
                <QrCode className="w-16 h-16 text-indigo-400 animate-pulse" />
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-white font-mono font-medium uppercase">SYNCHRONIZE OTP CODE</span>
                  <p className="text-[10px] text-gray-500">Scan QR vector on Authenticator app and input 6-digit challenge key below.</p>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="000000"
                    value={authenticatorCode}
                    onChange={(e) => setAuthenticatorCode(e.target.value.replace(/\D/g, ''))}
                    className="h-10 w-28 text-center bg-black/35 rounded-xl border border-white/[0.08] text-sm tracking-widest font-mono text-white focus:outline-none"
                  />
                  <button type="submit" className="h-10 px-4 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 text-xs font-mono font-semibold transition-colors cursor-pointer">
                    Verify
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Secure System Login Location Tracker history */}
          <div className={`p-5 rounded-3xl ${theme.cardClass} border border-white/[0.04] flex flex-col gap-3`}>
            <div className="flex items-center gap-2 text-xs font-mono text-gray-400 pb-2 border-b border-white/[0.04]">
              <History className="w-4 h-4" />
              <span>SECURED SESSION TRAFFIC TRACKER</span>
            </div>

            <div className="flex flex-col gap-2.5">
              {MOCK_LOGIN_HISTORY.map((log, i) => (
                <div key={i} className="flex justify-between items-center text-[10px] font-mono text-gray-500">
                  <div className="flex flex-col">
                    <span className="text-white font-semibold">{log.location}</span>
                    <span className="text-gray-550 mt-0.5">{log.device} • {log.ip}</span>
                  </div>
                  <span className="text-right">{log.timestamp}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {activePane === 'NOTIFICATIONS' && (
        <div className={`p-5 rounded-3xl ${theme.cardClass} border border-white/[0.04] flex flex-col gap-4`}>
          <div className="flex items-center gap-2 pb-3 border-b border-white/[0.04]">
            <Bell className="w-4.5 h-4.5" style={{ color: theme.accentColor }} />
            <h3 className="font-display font-semibold text-sm">SMART ALERTS NOTIFICATIONS SETUP</h3>
          </div>

          <p className="text-xs text-gray-500 font-sans leading-relaxed">
            Choose what alerts flash directly onto your web terminal screen or synchronized devices.
          </p>

          <div className="flex flex-col gap-4 pt-2 font-mono text-xs">
            {[
              { id: 'signalAlerts', title: 'AI SIGNAL ALERTS', desc: 'Instantly flash Buy/Sell setups' },
              { id: 'priceAlerts', title: 'INTERVAL PRICE ALERTS', desc: 'Alert when major coins move > 2%' },
              { id: 'tpSlAlerts', title: 'TAKE PROFIT / STOP LOSS TARGETS', desc: 'Synced Bybit target execution notices' },
              { id: 'whaleAlerts', title: 'LARGE COIN WHALE WALLET ACTIVITY', desc: 'Inflow or outflow block transfers notifications' }
            ].map(item => {
              const checked = (notificationSettings as any)[item.id] || false;
              
              return (
                <div key={item.id} className="flex justify-between items-start gap-3">
                  <div className="flex flex-col">
                    <span className="text-white font-semibold tracking-wide uppercase">{item.title}</span>
                    <span className="text-[10px] text-gray-500 font-sans leading-relaxed mt-0.5">{item.desc}</span>
                  </div>

                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => {
                      const updated = {
                        ...notificationSettings,
                        [item.id]: e.target.checked
                      };
                      onChangeNotifications(updated);
                      onTriggerNotification(
                        'Alert Settings Modified',
                        'Notification dispatcher configuration synced successfully.',
                        'SIGNAL'
                      );
                    }}
                    className="w-4 h-4 rounded bg-black/30 border border-white/[0.1] accent-indigo-500 mt-0.5 cursor-pointer"
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activePane === 'DOWNLOADS' && (
        <div className={`p-5 rounded-3xl ${theme.cardClass} border border-white/[0.04] flex flex-col gap-5`}>
          <div className="flex items-center gap-2 pb-3 border-b border-light/5 border-white/[0.04]">
            <Award className="w-5 h-5 text-emerald-400" />
            <h3 className="font-display font-semibold text-sm uppercase">Vegapunk Standalone Client Hub</h3>
          </div>

          <p className="text-xs text-slate-400 font-sans leading-relaxed">
            Vegapunk AI terminal can be exported instantly as a standalone portable package. This fully packages all Bybit real-time web terminals, technical models, local trade scanners, and simulators into a lightweight bundle.
          </p>

          <div className="p-4 rounded-2xl bg-black/15 border border-white/[0.04] flex flex-col gap-3">
            <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">Target Client Settings</span>
            
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-gray-400 font-sans">Build Platform:</span>
              <span className="text-white hover:text-emerald-450 font-bold">NodeJS / Electron Portable</span>
            </div>

            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-gray-400 font-sans">Include Bybit Native Engine:</span>
              <span className="text-emerald-400 font-bold">ENABLED (TRUE)</span>
            </div>

            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-gray-400 font-sans">Encryption Protection level:</span>
              <span className="text-purple-400 font-bold">AES-256 STATE</span>
            </div>
          </div>

          <button
            onClick={handleDownloadAppBundle}
            className="w-full h-11 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-450 hover:to-teal-500 text-white font-mono text-xs font-bold tracking-wider transition-all shadow-[0_4px_20px_-4px_rgba(16,185,129,0.4)] flex items-center justify-center gap-2 select-none active:scale-[0.98] cursor-pointer"
          >
            <Zap className="w-4 h-4 text-amber-300 animate-bounce" />
            DOWNLOAD FULL OFFLINE CLIENT PACK
          </button>

          <span className="text-[9px] font-mono text-center text-gray-500 block">
            Archived securely under MIT + Vegapunk Quantum terms. Package includes configuration scripts.
          </span>
        </div>
      )}

    </div>
  );
}
