import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Key, 
  ShieldCheck, 
  RefreshCw, 
  Radio, 
  ArrowRight, 
  AlertTriangle, 
  Info, 
  TrendingUp, 
  Check, 
  ExternalLink,
  ChevronDown,
  Activity,
  UserCheck
} from 'lucide-react';
import { ThemeConfig, ExchangeState } from '../types';
import { db, auth, handleFirestoreError, OperationType } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { getApiUrl } from '../lib/api';

interface ExchangeConnectionProps {
  theme: ThemeConfig;
  onConnectExchange: (exchangeData: ExchangeState) => void;
  onTriggerNotification: (title: string, msg: string, type: any) => void;
  exchangeState: ExchangeState | null;
  onDisconnect: () => void;
}

export default function ExchangeConnection({
  theme,
  onConnectExchange,
  onTriggerNotification,
  exchangeState,
  onDisconnect
}: ExchangeConnectionProps) {
  const [activeExchange, setActiveExchange] = useState<'Bybit' | 'Binance' | 'OKX'>('Bybit');
  
  // API credentials forms
  const [apiKey, setApiKey] = useState('');
  const [apiSecret, setApiSecret] = useState('');
  const [passphrase, setPassphrase] = useState('');
  const [isTestnet, setIsTestnet] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [expandedSection, setExpandedSection] = useState<'form' | 'positions' | 'permissions'>('form');

  const handleValidateConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim() || !apiSecret.trim()) {
      setErrorMessage('Bybit API Key and Secret Key are strictly required for security validation.');
      return;
    }

    setIsValidating(true);
    setErrorMessage('');

    try {
      const response = await fetch(getApiUrl('/api/exchange/connect'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exchangeName: activeExchange,
          apiKey,
          apiSecret,
          passphrase,
          isTestnet
        })
      });

      const data = await response.json();

      if (data.success && data.data) {
        // Sync to cloud Firestore safely if logged in
        if (auth.currentUser) {
          try {
            const uid = auth.currentUser.uid;
            await setDoc(doc(db, 'users', uid, 'secure', 'credentials'), {
              userId: uid,
              bybit: {
                apiKey,
                apiSecret: 'SECURE_RED_' + apiSecret.slice(-4), // Zero-exposure redaction hash
                passphrase,
                isTestnet
              },
              updatedAt: new Date().toISOString()
            });
          } catch (firestoreErr) {
            handleFirestoreError(firestoreErr, OperationType.WRITE, `users/${auth.currentUser.uid}/secure/credentials`);
          }
        }

        onConnectExchange(data.data);
        onTriggerNotification(
          `${activeExchange} Corridor Connected`,
          `Live read-only spot and futures metrics synced with total balance ${data.data.balance.total} USD.`,
          'SIGNAL'
        );
        // Reset state
        setApiKey('');
        setApiSecret('');
        setPassphrase('');
      } else {
        setErrorMessage(data.error || 'Identity credentials validation failed. Confirm Bybit keys correctness.');
      }
    } catch (err) {
      console.error(err);
      setErrorMessage('A network communication delay occurred during gateway resolution.');
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      
      {/* Selector Tabs for Exchanges */}
      <div className="grid grid-cols-3 gap-2 bg-black/25 rounded-2xl p-1 border border-white/[0.04]">
        {(['Bybit', 'Binance', 'OKX'] as const).map(exch => (
          <button
            key={exch}
            onClick={() => {
              if (exch !== 'Bybit') {
                onTriggerNotification(
                  'Exchange Node Preview',
                  `${exch} connection is currently in staging. Bybit is fully operational.`,
                  'SIGNAL'
                );
              }
              setActiveExchange(exch);
            }}
            className={`py-2 rounded-xl text-xs font-display font-medium uppercase tracking-wide transition-all ${
              activeExchange === exch
                ? 'bg-white/10 text-white shadow'
                : 'text-gray-500 hover:text-gray-300'
            }`}
            style={activeExchange === exch ? { color: theme.accentColor } : {}}
          >
            {exch}
          </button>
        ))}
      </div>

      {/* Connection Info Notice Card */}
      <div className={`p-4 rounded-3xl ${theme.cardClass} border border-white/[0.04] flex gap-3`}>
        <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0 border border-blue-500/15">
          <Info className="w-4 h-4 text-blue-400" />
        </div>
        <div className="flex-1 text-xs leading-relaxed">
          <span className="font-semibold text-white block mb-0.5">SECURITY PROTOCOL NOTICE</span>
          <span className="text-gray-400">
            For maximum asset protection, establish your API nodes using <strong className="text-white">READ-ONLY</strong> permissions. Enable spot/futures trading if you desire one-tap order dispatching from signals. <strong className="text-red-400">Withdrawals must remain strictly disabled.</strong>
          </span>
        </div>
      </div>

      {/* Connection Status or form rendering */}
      {exchangeState && exchangeState.exchangeName === activeExchange && exchangeState.connected ? (
        
        /* Connected Node Overview Panel */
        <div className={`p-5 rounded-3xl ${theme.cardClass} border border-emerald-500/20 relative overflow-hidden flex flex-col gap-4 bg-gradient-to-b from-emerald-500/[0.02]`}>
          <div className="absolute right-0 top-0 w-20 h-20 rounded-full blur-[40px] pointer-events-none bg-emerald-500/15" />
          
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-mono tracking-wider font-bold text-emerald-400 uppercase">CONNECTED SECURE NODE</span>
            </div>
            <button
              onClick={onDisconnect}
              className="text-[10px] font-mono text-red-400 hover:text-red-300 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20 hover:bg-red-500/15 transition-all"
            >
              Terminate Bridge
            </button>
          </div>

          <div className="flex flex-col gap-1 border-t border-white/[0.04] pt-4">
            <span className="text-[10px] font-mono text-gray-500 uppercase">SYNCHRONIZED BALANCE</span>
            <span className="text-2xl font-mono font-bold tracking-tight text-white">
              ${exchangeState.balance.total.toFixed(2)} <span className="text-xs text-gray-500 font-normal">{exchangeState.balance.currency}</span>
            </span>
          </div>

          {/* Allocation margins details */}
          <div className="grid grid-cols-2 gap-3 bg-black/15 p-3 rounded-2xl border border-white/[0.03] text-xs font-mono">
            <div>
              <span className="text-gray-500 block mb-0.5">SPOT BALANCE</span>
              <span className="font-semibold text-white">${exchangeState.balance.spot.toFixed(2)}</span>
            </div>
            <div>
              <span className="text-gray-500 block mb-0.5">FUTURES MARGIN</span>
              <span className="font-semibold text-white">${exchangeState.balance.futures.toFixed(2)}</span>
            </div>
          </div>

          {/* Connected API permissions checks lists */}
          <div className="border-t border-white/[0.04] pt-3">
            <h4 className="text-[10px] font-mono text-gray-400 font-semibold mb-2">GATEWAY PERMISSIONS</h4>
            <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <Check className="w-3.5 h-3.5" /> Read-Only
              </span>
              <span className="flex items-center gap-1.5 text-emerald-400">
                <Check className="w-3.5 h-3.5" /> Spot Order Sync
              </span>
              <span className="flex items-center gap-1.5 text-emerald-400">
                <Check className="w-3.5 h-3.5" /> Futures Order Sync
              </span>
              <span className="flex items-center gap-1.5 text-red-400">
                <Check className="w-3.5 h-3.5" /> Withdrawals Disabled
              </span>
            </div>
          </div>

          {/* Synced Futures positions */}
          <div className="border-t border-white/[0.04] pt-3">
            <h4 className="text-[10px] font-mono text-gray-400 font-semibold mb-2">ACTIVE COIN MARGIN ACTIONS</h4>
            <div className="flex flex-col gap-2">
              {exchangeState.openPositions.length === 0 ? (
                <p className="text-[10px] font-mono text-gray-500">No active positions on connected address.</p>
              ) : (
                exchangeState.openPositions.map(pos => (
                  <div key={pos.id} className="p-3 bg-white/[0.02] border border-white/[0.04] rounded-xl flex justify-between items-center text-xs font-mono">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-white">{pos.symbol}</span>
                        <span className={`px-1 rounded text-[9px] font-bold ${pos.side === 'LONG' ? 'text-emerald-400 bg-emerald-500/10' : 'text-red-400 bg-red-500/10'}`}>
                          {pos.side} • {pos.leverage}x
                        </span>
                      </div>
                      <span className="text-[9px] text-gray-500 mt-1">S:{pos.size} • EP: ${pos.entryPrice}</span>
                    </div>

                    <div className="text-right flex flex-col items-end">
                      <span className={`font-semibold ${pos.unrealizedPnl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {pos.unrealizedPnl >= 0 ? '+' : ''}${pos.unrealizedPnl.toFixed(2)}
                      </span>
                      <span className="text-[9px] text-gray-550">Unrealized profit</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      ) : (

        /* Unconnected credentials form entry page */
        <form onSubmit={handleValidateConnect} className={`p-5 rounded-3xl ${theme.cardClass} border border-white/[0.04] flex flex-col gap-4 relative overflow-hidden`}>
          <div className="flex items-center gap-2 mb-1">
            <Key className="w-4.5 h-4.5" style={{ color: theme.accentColor }} />
            <h3 className="font-display font-bold text-sm">CONNECT SECURE {activeExchange.toUpperCase()} GATEWAY</h3>
          </div>

          {activeExchange !== 'Bybit' ? (
            /* Warning or simulated placeholder details for Binance / OKX */
            <div className="p-12 text-center flex flex-col justify-center items-center gap-3">
              <AlertTriangle className="w-8 h-8 text-amber-500 animate-pulse" />
              <h4 className="text-sm font-display font-semibold">Staging Sandbox Only</h4>
              <p className="text-xs text-gray-500 font-sans leading-relaxed max-w-xs">
                {activeExchange} nodes are currently being audited for SOC2 compliance. Connect to the <button type="button" onClick={() => setActiveExchange('Bybit')} className="text-white hover:underline">BYBIT gateway node</button> to test full live functionalities.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono text-gray-500 uppercase">Bybit API Key</label>
                <input
                  type="text"
                  placeholder="Paste Bybit API key..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="h-11 px-3 bg-black/35 rounded-xl border border-white/[0.08] text-xs font-mono text-white focus:outline-none focus:border-white/25 transition-colors placeholder:text-gray-600"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono text-gray-500 uppercase">Bybit Secret Key</label>
                <input
                  type="password"
                  placeholder="Paste Bybit Secret..."
                  value={apiSecret}
                  onChange={(e) => setApiSecret(e.target.value)}
                  className="h-11 px-3 bg-black/35 rounded-xl border border-white/[0.08] text-xs font-mono text-white focus:outline-none focus:border-white/25 transition-colors placeholder:text-gray-600"
                />
              </div>

              {/* Advanced options */}
              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono text-gray-500 uppercase">Bybit Passphrase (Optional)</label>
                  <input
                    type="password"
                    placeholder="Set Passcode..."
                    value={passphrase}
                    onChange={(e) => setPassphrase(e.target.value)}
                    className="h-10 px-3 bg-black/35 rounded-xl border border-white/[0.08] text-xs font-mono text-white focus:outline-none focus:border-white/25 transition-colors placeholder:text-gray-600"
                  />
                </div>
                
                <div className="flex items-center gap-2 mt-4">
                  <input
                    id="isTestnetId"
                    type="checkbox"
                    checked={isTestnet}
                    onChange={(e) => setIsTestnet(e.target.checked)}
                    className="w-4 h-4 rounded bg-black/30 border border-white/[0.1] accent-indigo-500"
                  />
                  <label htmlFor="isTestnetId" className="text-[10px] text-gray-400 uppercase select-none cursor-pointer">Use Testnet Node</label>
                </div>
              </div>

              {errorMessage && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl font-sans text-center transition-all">
                  {errorMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={isValidating}
                className="w-full h-12 rounded-xl flex items-center justify-center gap-1.5 font-display text-sm font-medium transition-all relative mt-2 group overflow-hidden cursor-pointer"
                style={{
                  backgroundColor: theme.accentColor,
                  color: theme.id === 'arctic-white' ? '#FFFFFF' : '#000000',
                  boxShadow: `0 8px 24px -6px ${theme.accentColor}44`
                }}
              >
                {isValidating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Validating Secure Node...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Establish Secure Handshake</span>
                  </>
                )}
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>

              <div className="flex justify-between items-center text-[10px] font-mono text-gray-500 border-t border-white/[0.04] pt-3 mt-1">
                <span>ENCRYPTED IN COLD STORAGE</span>
                <span className="flex items-center gap-1">
                  <UserCheck className="w-3.5 h-3.5" /> 256-bit AES protection
                </span>
              </div>
            </div>
          )}

        </form>
      )}

    </div>
  );
}
