import React from 'react';
import { ArrowRight, CheckCircle2, Database, Search, Zap, Cpu, Sparkles } from 'lucide-react';

export default function AdaptiveLearningPipeline({ onPromote, isPromoting, isPromoted }) {
  const stages = [
    {
      number: '01',
      title: 'UNKNOWN PATTERN',
      desc: 'Novel high-frequency & noise residual anomalies observed with low match to known registry.',
      icon: Search,
      color: 'text-amber-400 border-amber-500/30 bg-amber-950/40'
    },
    {
      number: '02',
      title: 'CLUSTER',
      desc: 'Automatic grouping of recurring identical fingerprints (e.g. UNKNOWN CLUSTER #47, 1,824 samples).',
      icon: Zap,
      color: 'text-rose-400 border-rose-500/30 bg-rose-950/40'
    },
    {
      number: '03',
      title: 'VALIDATE',
      desc: 'Forensic cross-correlation verifying 95% pattern consistency across wild media sources.',
      icon: CheckCircle2,
      color: 'text-purple-400 border-purple-500/30 bg-purple-950/40'
    },
    {
      number: '04',
      title: 'NEW DNA FINGERPRINT',
      desc: 'Synthesis of mathematical reference vector across the 7 forensic dimensions.',
      icon: Sparkles,
      color: 'text-blue-400 border-blue-500/30 bg-blue-950/40'
    },
    {
      number: '05',
      title: 'GENERATOR REGISTRY',
      desc: 'Promoted from wild unknown into the verified Known Generator catalog.',
      icon: Database,
      color: 'text-forensic-cyan border-forensic-cyan/30 bg-cyan-950/40'
    },
    {
      number: '06',
      title: 'AUTOMATIC ATTRIBUTION',
      desc: 'All future media matching this signature is automatically attributed with 85%+ confidence.',
      icon: Cpu,
      color: 'text-emerald-400 border-emerald-500/30 bg-emerald-950/40'
    }
  ];

  return (
    <div className="glass-panel rounded-2xl p-6 sm:p-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-forensic-cyan/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-forensic-cyan animate-ping"></span>
            <span className="text-xs font-mono tracking-wider uppercase text-forensic-cyan font-bold">
              Core Architectural Differentiator
            </span>
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight">
            TRUVENA Adaptive Learning Pipeline
          </h3>
          <p className="text-slate-400 text-xs max-w-2xl mt-1">
            How TRUVENA dynamically converts unidentified generative models in the wild into verified cataloged generators without requiring model weights.
          </p>
        </div>

        {onPromote && (
          <button
            onClick={onPromote}
            disabled={isPromoting || isPromoted}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-bold transition-all ${
              isPromoted
                ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 cursor-default'
                : 'bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-obsidian-950 font-semibold shadow-glow-rose active:scale-95'
            }`}
          >
            {isPromoting ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-obsidian-950 border-t-transparent rounded-full animate-spin"></span>
                <span>Synthesizing DNA...</span>
              </>
            ) : isPromoted ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Cluster #47 Promoted to Registry!</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Promote Cluster #47 to Registry</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Pipeline Grid / Flow */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3 relative">
        {stages.map((stage, idx) => {
          const Icon = stage.icon;
          return (
            <div 
              key={idx}
              className={`relative rounded-xl p-4 border transition-all flex flex-col justify-between ${stage.color} group hover:scale-[1.02]`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono opacity-60 font-bold tracking-widest">{stage.number}</span>
                  <Icon className="w-4 h-4 opacity-90" />
                </div>
                <h4 className="text-xs font-mono font-bold mb-1 tracking-tight text-white">{stage.title}</h4>
                <p className="text-[11px] text-slate-300 leading-snug">{stage.desc}</p>
              </div>

              {idx < stages.length - 1 && (
                <div className="hidden lg:block absolute -right-2.5 top-1/2 -translate-y-1/2 z-10">
                  <ArrowRight className="w-4 h-4 text-slate-500 opacity-60" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}