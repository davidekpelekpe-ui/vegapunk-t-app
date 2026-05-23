import { ThemeConfig, ThemeId } from './types';

export const THEME_PRESETS: Record<ThemeId, ThemeConfig> = {
  'arctic-white': {
    id: 'arctic-white',
    name: 'Arctic White',
    isDark: false,
    bgClass: 'bg-[#F4F5F7] text-black transition-all duration-500',
    cardClass: 'liquid-glass rounded-2xl shadow-[0_12px_44px_-10px_rgba(0,0,0,0.08)]',
    textPrimary: 'text-[#111111]',
    textSecondary: 'text-[#4A4A4A]',
    accentColor: '#111111', // Rich pure black contrast
    accentGlow: 'rgba(0,0,0,0.06)',
    borderColor: 'border-black/10',
    glowIntensity: 'opacity-15'
  },
  'obsidian-black': {
    id: 'obsidian-black',
    name: 'Elegant Dark',
    isDark: true,
    bgClass: 'bg-[#050505] text-[#E0E0E0] transition-all duration-500',
    cardClass: 'bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_12px_44px_rgba(0,0,0,0.85)] rounded-2xl',
    textPrimary: 'text-white',
    textSecondary: 'text-white/60',
    accentColor: '#FFFFFF', // High-contrast crisp white accent
    accentGlow: 'rgba(255,255,255,0.15)',
    borderColor: 'border-white/10',
    glowIntensity: 'opacity-10'
  },
  'midnight-blue': {
    id: 'midnight-blue',
    name: 'Midnight Blue',
    isDark: true,
    bgClass: 'bg-[#060B18] text-[#E0E7FF] transition-all duration-500',
    cardClass: 'bg-[#0B1528]/50 backdrop-blur-xl border border-indigo-500/[0.12] shadow-[0_12px_40px_rgba(0,0,0,0.6)]',
    textPrimary: 'text-[#F1F5F9]',
    textSecondary: 'text-[#94A3B8]',
    accentColor: '#6366F1', // Indigo glow
    accentGlow: 'rgba(99,102,241,0.5)',
    borderColor: 'border-indigo-500/[0.15]',
    glowIntensity: 'opacity-50'
  },
  'emerald-glass': {
    id: 'emerald-glass',
    name: 'Emerald Glass',
    isDark: true,
    bgClass: 'bg-[#030A05] text-[#ECFDF5] transition-all duration-500',
    cardClass: 'bg-[#091E10]/40 backdrop-blur-xl border border-[#10B981]/[0.15] shadow-[0_12px_40px_rgba(0,0,0,0.6)]',
    textPrimary: 'text-[#ECFDF5]',
    textSecondary: 'text-[#A7F3D0]',
    accentColor: '#10B981', // Clean profit green
    accentGlow: 'rgba(16,185,129,0.5)',
    borderColor: 'border-[#10B981]/[0.18]',
    glowIntensity: 'opacity-40'
  },
  'crimson-red': {
    id: 'crimson-red',
    name: 'Crimson Red',
    isDark: true,
    bgClass: 'bg-[#0A0204] text-[#FFF5F5] transition-all duration-500',
    cardClass: 'bg-[#1D080E]/40 backdrop-blur-xl border border-[#EF4444]/[0.15] shadow-[0_12px_40px_rgba(0,0,0,0.6)]',
    textPrimary: 'text-[#FFF5F5]',
    textSecondary: 'text-[#FECACA]',
    accentColor: '#EF4444', // Hot breakout red
    accentGlow: 'rgba(239,68,68,0.5)',
    borderColor: 'border-[#EF4444]/[0.18]',
    glowIntensity: 'opacity-40'
  },
  'purple-nebula': {
    id: 'purple-nebula',
    name: 'Purple Nebula',
    isDark: true,
    bgClass: 'bg-[#070313] text-[#F5F3FF] transition-all duration-500',
    cardClass: 'bg-[#150A2E]/40 backdrop-blur-xl border border-purple-500/[0.15] shadow-[0_12px_40px_rgba(7,3,19,0.7)]',
    textPrimary: 'text-[#F5F3FF]',
    textSecondary: 'text-[#DDD6FE]',
    accentColor: '#A855F7', // Royal Purple
    accentGlow: 'rgba(168,85,247,0.5)',
    borderColor: 'border-purple-500/[0.18]',
    glowIntensity: 'opacity-50'
  },
  'cyber-teal': {
    id: 'cyber-teal',
    name: 'Cyber Teal',
    isDark: true,
    bgClass: 'bg-[#02090C] text-[#E0F2FE] transition-all duration-500',
    cardClass: 'bg-[#051E28]/40 backdrop-blur-xl border border-[#14B8A6]/[0.15] shadow-[0_12px_40px_rgba(0,0,0,0.6)]',
    textPrimary: 'text-[#F0FDFA]',
    textSecondary: 'text-[#99F6E4]',
    accentColor: '#14B8A6', // High-tech Teal
    accentGlow: 'rgba(20,184,166,0.6)',
    borderColor: 'border-[#14B8A6]/[0.18]',
    glowIntensity: 'opacity-60'
  },
  'gold-elite': {
    id: 'gold-elite',
    name: 'Gold Elite',
    isDark: true,
    bgClass: 'bg-[#0B0A05] text-[#FEFDF0] transition-all duration-500',
    cardClass: 'bg-[#1D1B0D]/50 backdrop-blur-xl border border-[#E9C46A]/[0.18] shadow-[0_12px_40px_rgba(0,0,0,0.65)]',
    textPrimary: 'text-[#FFFDF5]',
    textSecondary: 'text-[#F6E6B4]',
    accentColor: '#F4A261', // Warm Amber Gold
    accentGlow: 'rgba(244,162,97,0.5)',
    borderColor: 'border-[#E9C46A]/[0.2]',
    glowIntensity: 'opacity-45'
  }
};
