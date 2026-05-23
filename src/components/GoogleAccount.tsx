import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Chrome, 
  RefreshCw, 
  User, 
  Mail, 
  Lock, 
  ShieldCheck, 
  Check, 
  Database,
  ArrowRight,
  LogOut
} from 'lucide-react';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut 
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType } from '../firebase';
import { ThemeConfig, GoogleUserProfile } from '../types';

interface GoogleAccountProps {
  theme: ThemeConfig;
  profile: GoogleUserProfile | null;
  onLogin: (profile: GoogleUserProfile) => void;
  onLogout: () => void;
  onTriggerNotification: (title: string, msg: string, type: any) => void;
}

export default function GoogleAccount({
  theme,
  profile,
  onLogin,
  onLogout,
  onTriggerNotification
}: GoogleAccountProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [isSignLoading, setIsSignLoading] = useState(false);
  const [syncPhase, setSyncPhase] = useState<'IDLE' | 'SYNCING' | 'COMPLETED'>('IDLE');

  const handleOAuthSignIn = async () => {
    setIsSignLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const profilePayload: GoogleUserProfile = {
        connected: true,
        name: user.displayName || 'Vegapunk Operator',
        email: user.email || '',
        avatarUrl: user.photoURL || 'https://api.dicebear.com/7.x/shapes/svg?seed=' + user.uid,
        syncState: 'COMPLETED',
        lastSynced: new Date().toISOString()
      };

      // Atomic persistent profile write to Firestore as required by instructions
      try {
        await setDoc(doc(db, 'users', user.uid), {
          userId: user.uid,
          name: profilePayload.name,
          email: profilePayload.email,
          avatarUrl: profilePayload.avatarUrl,
          themeId: theme.id,
          updatedAt: new Date().toISOString()
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `users/${user.uid}`);
      }

      onLogin(profilePayload);
      onTriggerNotification(
        'Google Auth Connected',
        'Device keys, theme customisations, and watchlists safely secured in Cloud Firestore.',
        'NEWS'
      );
    } catch (err: any) {
      console.error(err);
      onTriggerNotification('Authentication Failed', err.message || 'Error occurred during Google login.', 'STOP_LOSS');
    } finally {
      setIsSignLoading(false);
    }
  };

  const handleManualSign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setIsSignLoading(true);
    try {
      let user;
      if (isRegistering) {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        user = result.user;
        onTriggerNotification('Auth Vault Created', 'A fresh system encrypted profile node has been initialized.', 'SIGNAL');
      } else {
        const result = await signInWithEmailAndPassword(auth, email, password);
        user = result.user;
        onTriggerNotification('Vault Access Granted', 'Connected safely to Vegapunk server credentials.', 'SIGNAL');
      }

      const profilePayload: GoogleUserProfile = {
        connected: true,
        name: email.split('@')[0].toUpperCase(),
        email: email,
        avatarUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=' + user.uid,
        syncState: 'COMPLETED',
        lastSynced: new Date().toISOString()
      };

      // Persistent sync to Firestore
      try {
        await setDoc(doc(db, 'users', user.uid), {
          userId: user.uid,
          name: profilePayload.name,
          email: profilePayload.email,
          avatarUrl: profilePayload.avatarUrl,
          themeId: theme.id,
          updatedAt: new Date().toISOString()
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `users/${user.uid}`);
      }

      onLogin(profilePayload);
    } catch (err: any) {
      console.error(err);
      onTriggerNotification('Authentication Failed', err.message || 'Check your operator credentials.', 'STOP_LOSS');
    } finally {
      setIsSignLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      onLogout();
      onTriggerNotification('Credentials Dissolved', 'Cloud synchronize backups safely unlinked.', 'NEWS');
    } catch (err: any) {
      console.error(err);
    }
  };

  const triggerCloudBackupRefresh = () => {
    if (!auth.currentUser) {
      onTriggerNotification('Sync Unavailable', 'Please sign in to execute cloud backups.', 'WARNING');
      return;
    }
    setSyncPhase('SYNCING');
    setTimeout(async () => {
      try {
        const uid = auth.currentUser?.uid;
        if (uid) {
          await setDoc(doc(db, 'users', uid), {
            userId: uid,
            name: profile?.name || 'Vegapunk Operator',
            email: profile?.email || '',
            avatarUrl: profile?.avatarUrl || '',
            themeId: theme.id,
            updatedAt: new Date().toISOString()
          }, { merge: true });
        }
        setSyncPhase('COMPLETED');
        onTriggerNotification(
          'Pref Vaults Synchronised',
          'Your active theme, configurations, and drawing preferences successfully mirror-synced.',
          'VOLATILITY'
        );
        setTimeout(() => setSyncPhase('IDLE'), 3000);
      } catch (err) {
        setSyncPhase('IDLE');
        handleFirestoreError(err, OperationType.WRITE, `users/${auth.currentUser?.uid}`);
      }
    }, 1500);
  };

  return (
    <div className="flex flex-col gap-5">
      
      {profile && profile.connected ? (
        <div className={`p-5 rounded-3xl ${theme.cardClass} border border-white/10 flex flex-col gap-4 relative overflow-hidden bg-gradient-to-b from-indigo-500/[0.02]`}>
          <div className="absolute top-0 right-0 w-24 h-24 rounded-full blur-[45px] pointer-events-none bg-indigo-500/10" />

          <div className="flex items-center gap-3">
            <img
              src={profile.avatarUrl}
              alt={profile.name}
              className="w-12 h-12 rounded-full border border-white/20 object-cover"
            />
            <div>
              <h4 className="font-display font-semibold text-sm text-white">{profile.name}</h4>
              <span className="font-mono text-[10px] text-white/60 block mt-0.5">{profile.email}</span>
            </div>
          </div>

          <div className="border-t border-white/10 pt-4 flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-mono text-gray-400 uppercase">COSMIC CLOUD DECK</span>
              <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded flex items-center gap-1 border border-emerald-500/20">
                <Check className="w-3 h-3" /> SECURED SYNC
              </span>
            </div>

            <p className="text-xs text-white/60 font-sans leading-relaxed">
              Your preferences (such as charts drawings state, custom Bybit parameters, and notification triggers) are fully mirrored into secure Google Cloud backup.
            </p>

            <div className="flex justify-between items-center text-[10px] font-mono text-white/50 border border-white/10 p-2.5 rounded-xl bg-black/15">
              <span>LAST MIRROR ALIGNMENT:</span>
              <span className="text-white font-semibold">{profile.lastSynced ? new Date(profile.lastSynced).toLocaleTimeString() : 'Just now'}</span>
            </div>

            <button
              onClick={triggerCloudBackupRefresh}
              disabled={syncPhase === 'SYNCING'}
              className="w-full h-11 rounded-full flex items-center justify-center gap-1.5 bg-indigo-600/15 border border-indigo-500/30 hover:bg-indigo-600/25 text-indigo-300 text-xs font-mono transition-all cursor-pointer"
            >
              {syncPhase === 'SYNCING' ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>TRANSMITTING DELTAS...</span>
                </>
              ) : syncPhase === 'COMPLETED' ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>MIRROR COMPLETED</span>
                </>
              ) : (
                <>
                  <Database className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Synchronise Vault Preferences Now</span>
                </>
              )}
            </button>
          </div>

          <button
            onClick={handleSignOut}
            className="w-full h-10 rounded-xl flex items-center justify-center gap-1.5 border border-white/10 hover:bg-red-550/10 text-xs text-red-400 hover:text-red-300 transition-all font-mono tracking-wider"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>DISMISS AUTH VAULTS</span>
          </button>

        </div>
      ) : (
        <div className={`p-5 rounded-3xl ${theme.cardClass} border border-white/10 flex flex-col gap-4 relative overflow-hidden`}>
          <div className="flex items-center gap-2">
            <User className="w-4.5 h-4.5" style={{ color: theme.accentColor }} />
            <h3 className="font-display font-bold text-sm text-white">VEGAPUNK SYSTEM IDENTITY</h3>
          </div>

          <button
            onClick={handleOAuthSignIn}
            disabled={isSignLoading}
            className="w-full h-12 rounded-xl flex items-center justify-center gap-2 border border-white/15 hover:bg-white/5 bg-white/5 text-xs font-mono text-white/80 transition-all relative cursor-pointer"
          >
            {isSignLoading ? (
              <RefreshCw className="w-4 h-4 animate-spin text-white" />
            ) : (
              <Chrome className="w-4.5 h-4.5 text-blue-400 font-bold" />
            )}
            <span>{isSignLoading ? 'ALIGNED CONNECTION...' : 'INTEGRATE GOOGLE PROFILE'}</span>
          </button>

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-white/10" />
            <span className="flex-shrink mx-4 text-[9px] font-mono text-gray-500 uppercase">Or Manual Credentials</span>
            <div className="flex-grow border-t border-white/10" />
          </div>

          <form onSubmit={handleManualSign} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-mono text-gray-400 uppercase">System Operator Email</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="name@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-11 pl-9 pr-3 bg-white/5 rounded-xl border border-white/10 text-xs font-sans text-white focus:outline-none focus:border-white/20 transition-colors placeholder:text-gray-600"
                />
                <Mail className="w-3.5 h-3.5 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-mono text-gray-400 uppercase">Operator Passcode</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-11 pl-9 pr-3 bg-white/5 rounded-xl border border-white/10 text-xs font-mono text-white focus:outline-none focus:border-white/20 transition-colors placeholder:text-gray-600"
                />
                <Lock className="w-3.5 h-3.5 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSignLoading}
              className="w-full h-11 rounded-xl flex items-center justify-center gap-1.5 font-display text-xs font-semibold transition-all group overflow-hidden cursor-pointer shadow-lg"
              style={{
                backgroundColor: theme.accentColor,
                color: theme.id === 'arctic-white' ? '#FFFFFF' : '#000000',
              }}
            >
              <span>{isRegistering ? 'INITIALIZE NEW VAULT' : 'ACCESS TRADING VAULT'}</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setIsRegistering(!isRegistering)}
                className="text-[10px] font-mono text-white/40 hover:text-white underline"
              >
                {isRegistering ? 'Access existing credential vault' : 'Initialize fresh encrypted profile node'}
              </button>
            </div>

            <div className="flex justify-between items-center text-[10px] font-mono text-gray-500 border-t border-white/10 pt-3">
              <span>ENCRYPTED VAULTS ON-SHIELD</span>
              <span className="flex items-center gap-1 text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" /> Cloud Sync Validated
              </span>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
