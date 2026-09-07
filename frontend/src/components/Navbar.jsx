import React from 'react';
import { Shield, Cpu, Activity, AlertTriangle, Dna, Info, Scan, Radio } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, hasAnalysis }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity },
    { id: 'analyze', label: 'Analyze Media', icon: Scan },
    { id: 'report', label: 'Forensic Report', icon: Shield, badge: hasAnalysis ? 'Active' : null },
    { id: 'generators', label: 'Generator Intel', icon: Cpu },
    { id: 'watchlist', label: 'Unknown Watchlist', icon: AlertTriangle, badge: '1 Emerging' },
    { id: 'dna-explorer', label: 'Media DNA Explorer', icon: Dna },
    { id: 'about', label: 'How It Works', icon: Info },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-obsidian-700/60 bg-obsidian-950/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div 
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-forensic-cyan/20 to-forensic-blue/20 border border-forensic-cyan/40 shadow-glow-cyan transition-transform group-hover:scale-105">
              <Shield className="w-5 h-5 text-forensic-cyan" />
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-forensic-cyan opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-forensic-cyan"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold tracking-wider font-mono bg-gradient-to-r from-white via-slate-100 to-forensic-cyan bg-clip-text text-transparent">
                  TRUVENA
                </span>
                <span className="text-[10px] font-mono tracking-widest px-1.5 py-0.5 rounded bg-forensic-cyan/10 text-forensic-cyan border border-forensic-cyan/20">
                  v1.0
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-sans tracking-tight hidden sm:block">
                Synthetic Media Forensics & Trust Intelligence
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-obsidian-750 text-forensic-cyan border border-forensic-cyan/30 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-obsidian-850 border border-transparent'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-forensic-cyan' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full border ${
                      item.badge === 'Active'
                        ? 'bg-emerald-950 text-emerald-400 border-emerald-500/40'
                        : 'bg-rose-950 text-rose-300 border-rose-500/40 animate-pulse'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action & Status */}
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-full bg-obsidian-850 border border-slate-800 text-[11px] font-mono text-slate-400">
              <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
              <span>DEFENSE: ACTIVE</span>
            </div>

            <button
              onClick={() => setActiveTab('analyze')}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold bg-gradient-to-r from-forensic-cyan to-forensic-blue text-obsidian-950 hover:brightness-110 active:scale-95 transition-all shadow-glow-cyan"
            >
              <Scan className="w-4 h-4" />
              <span>Analyze Media</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile nav bar */}
      <div className="md:hidden flex items-center justify-around py-2 border-t border-obsidian-800 bg-obsidian-900/90 text-xs overflow-x-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-1 px-2 py-1 ${isActive ? 'text-forensic-cyan' : 'text-slate-400'}`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-[10px]">{item.label.split(' ')[0]}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
}