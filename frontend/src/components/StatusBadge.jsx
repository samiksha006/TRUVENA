import React from 'react';

export function RiskBadge({ level }) {
  const map = {
    LOW: 'bg-emerald-950/80 text-emerald-400 border-emerald-500/30',
    MEDIUM: 'bg-amber-950/80 text-amber-400 border-amber-500/30',
    HIGH: 'bg-rose-950/80 text-rose-400 border-rose-500/30 animate-pulse',
    CRITICAL: 'bg-red-950/90 text-red-300 border-red-500/50 shadow-glow-rose animate-pulse',
  };
  const cls = map[level?.toUpperCase()] || 'bg-slate-800 text-slate-300 border-slate-700';
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold border ${cls}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
      RISK: {level?.toUpperCase() || 'UNKNOWN'}
    </span>
  );
}

export function ClassificationBadge({ classification, likelyGenerator }) {
  const isReal = classification?.toLowerCase().includes('real') || classification?.toLowerCase().includes('authentic');
  const isUnknown = likelyGenerator?.toUpperCase() === 'UNKNOWN' || likelyGenerator?.toLowerCase().includes('cluster');

  if (isReal) {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-500/30">
        <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
        AUTHENTIC / REAL MEDIA
      </span>
    );
  }

  if (isUnknown) {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-amber-950/80 text-amber-300 border border-amber-500/40 animate-pulse">
        <span className="w-2 h-2 rounded-full bg-amber-400"></span>
        ? POTENTIAL EMERGING GENERATOR
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-cyan-950/80 text-cyan-300 border border-cyan-500/40">
      <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
      AI GENERATED ({likelyGenerator})
    </span>
  );
}