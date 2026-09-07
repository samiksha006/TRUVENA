import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Cpu, 
  AlertTriangle, 
  TrendingUp, 
  Scan, 
  Activity, 
  Dna, 
  ExternalLink, 
  CheckCircle2, 
  Lock,
  ArrowRight,
  Database,
  BarChart3,
  Search
} from 'lucide-react';
import { RiskBadge, ClassificationBadge } from '../components/StatusBadge';
import { fetchDashboardStats } from '../services/api';

export default function DashboardPage({ setActiveTab, onSelectAnalysis }) {
  const [statsData, setStatsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats()
      .then((data) => {
        setStatsData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching dashboard stats:', err);
        setLoading(false);
      });
  }, []);

  const stats = statsData?.stats || {
    total_media_analyzed: 128490,
    ai_generated_detected: 104210,
    known_generators_tracked: 5,
    unknown_patterns_active: 3,
    emerging_generators: 1,
    average_trust_score: 64.2
  };

  const statCards = [
    {
      title: 'TOTAL MEDIA ANALYZED',
      value: stats.total_media_analyzed.toLocaleString(),
      subtext: '+4,120 in the last 24h',
      icon: Activity,
      color: 'text-forensic-cyan border-forensic-cyan/30'
    },
    {
      title: 'AI-GENERATED DETECTED',
      value: stats.ai_generated_detected.toLocaleString(),
      subtext: '81.1% synthetic proportion',
      icon: Cpu,
      color: 'text-rose-400 border-rose-500/30'
    },
    {
      title: 'KNOWN GENERATORS',
      value: stats.known_generators_tracked,
      subtext: 'FLUX, MJ, SDXL, DALL-E, StyleGAN',
      icon: Database,
      color: 'text-forensic-blue border-forensic-blue/30'
    },
    {
      title: 'UNKNOWN PATTERNS',
      value: stats.unknown_patterns_active,
      subtext: 'Active recurring forensic clusters',
      icon: AlertTriangle,
      color: 'text-amber-400 border-amber-500/30'
    },
    {
      title: 'EMERGING GENERATORS',
      value: stats.emerging_generators,
      subtext: 'Cluster #47 (+28% viral growth)',
      icon: TrendingUp,
      color: 'text-purple-400 border-purple-500/30'
    },
    {
      title: 'AVERAGE TRUST SCORE',
      value: `${stats.average_trust_score}%`,
      subtext: 'Across enterprise media streams',
      icon: Shield,
      color: 'text-emerald-400 border-emerald-500/30'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Hero Command Center Header */}
      <div className="relative rounded-3xl p-8 sm:p-12 overflow-hidden border border-obsidian-750 bg-gradient-to-br from-obsidian-900 via-obsidian-950 to-obsidian-900">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-forensic-cyan/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 w-[300px] h-[300px] bg-forensic-blue/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forensic-cyan/10 border border-forensic-cyan/30 text-xs font-mono text-forensic-cyan font-bold mb-4">
            <span className="w-2 h-2 rounded-full bg-forensic-cyan animate-pulse"></span>
            ENTERPRISE AI-FORENSICS & TRUST INTELLIGENCE
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight font-sans">
            TRUVENA
          </h1>
          <p className="text-lg sm:text-xl font-medium text-forensic-cyan mt-2 font-mono">
            ?Detect the unknown. Discover the source. Protect the truth.?
          </p>

          <p className="text-slate-300 text-sm sm:text-base mt-4 leading-relaxed max-w-2xl">
            A state-of-the-art forensic defense platform powered by adaptive <strong className="text-white">Media DNA</strong>. 
            Analyze physical and mathematical signal residuals, attribute known models, isolate unknown generator signatures, 
            and track emerging synthetic threats in real time.
          </p>

          {/* Primary CTA */}
          <div className="flex flex-wrap items-center gap-4 mt-8">
            <button
              onClick={() => setActiveTab('analyze')}
              className="flex items-center gap-3 px-6 py-3.5 rounded-xl text-sm font-bold bg-gradient-to-r from-forensic-cyan via-cyan-400 to-forensic-blue text-obsidian-950 hover:shadow-glow-cyan active:scale-95 transition-all"
            >
              <Scan className="w-5 h-5" />
              <span>Analyze New Media</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveTab('watchlist')}
              className="flex items-center gap-2.5 px-5 py-3.5 rounded-xl text-sm font-mono font-semibold bg-obsidian-850 hover:bg-obsidian-800 text-slate-200 border border-slate-700 transition-all"
            >
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Inspect Unknown Clusters</span>
            </button>

            <button
              onClick={() => setActiveTab('dna-explorer')}
              className="flex items-center gap-2.5 px-5 py-3.5 rounded-xl text-sm font-mono font-semibold bg-obsidian-850 hover:bg-obsidian-800 text-slate-200 border border-slate-700 transition-all"
            >
              <Dna className="w-4 h-4 text-purple-400" />
              <span>Media DNA Space</span>
            </button>
          </div>
        </div>
      </div>

      {/* Threat Alert Banner: UNKNOWN CLUSTER #47 */}
      <div className="glass-panel-danger rounded-2xl p-5 border border-rose-500/40 relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/50 flex items-center justify-center text-rose-400 shrink-0 animate-pulse">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-rose-400 uppercase tracking-wider">
                ACTIVE FORENSIC ALERT
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800 font-semibold">
                +28% GROWTH
              </span>
            </div>
            <p className="text-sm font-bold text-white mt-0.5">
              UNKNOWN CLUSTER #47: Potential Emerging Latent Flow Generator Detected
            </p>
            <p className="text-xs text-slate-300 mt-0.5">
              1,824 samples observed with 95% pattern consistency that do not match the current known generator registry.
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveTab('watchlist')}
          className="shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 transition-all"
        >
          <span>Investigate Cluster #47</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Telemetry Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="glass-panel rounded-2xl p-5 border border-obsidian-750 hover:border-slate-700 transition-all group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-bold text-slate-400 tracking-wider">
                  {card.title}
                </span>
                <div className={`p-2 rounded-lg bg-obsidian-900 border ${card.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono tracking-tight">
                {card.value}
              </div>
              <div className="text-xs text-slate-400 mt-1 font-sans">
                {card.subtext}
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Forensic Analyses Feed */}
      <div className="glass-panel rounded-2xl p-6 border border-obsidian-750">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-obsidian-800">
          <div>
            <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
              <Activity className="w-4 h-4 text-forensic-cyan" />
              LIVE FORENSIC INVESTIGATION FEED
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Real-time media streams analyzed by the TRUVENA distributed sensor network
            </p>
          </div>

          <button
            onClick={() => setActiveTab('analyze')}
            className="text-xs font-mono text-forensic-cyan hover:underline flex items-center gap-1.5 self-start sm:self-auto"
          >
            <span>Run New Forensic Scan</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="text-slate-400 border-b border-obsidian-800 pb-2">
                <th className="py-3 px-3">CASE ID / MEDIA</th>
                <th className="py-3 px-3">CLASSIFICATION</th>
                <th className="py-3 px-3">ATTRIBUTION</th>
                <th className="py-3 px-3">CONFIDENCE</th>
                <th className="py-3 px-3">MEDIA DNA HASH</th>
                <th className="py-3 px-3">RISK</th>
                <th className="py-3 px-3 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-obsidian-800/60">
              {(statsData?.recent_analyses || []).map((row) => (
                <tr key={row.id} className="hover:bg-obsidian-850/60 transition-colors group">
                  <td className="py-3 px-3">
                    <div className="font-bold text-white">{row.id}</div>
                    <div className="text-[11px] text-slate-400 truncate max-w-[180px]">{row.filename}</div>
                  </td>
                  <td className="py-3 px-3">
                    <ClassificationBadge 
                      classification={row.classification} 
                      likelyGenerator={row.likely_generator} 
                    />
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-semibold text-slate-200">
                      {row.likely_generator}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    {row.confidence > 0 ? (
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 rounded-full bg-obsidian-900 overflow-hidden">
                          <div
                            className="h-full bg-forensic-cyan rounded-full"
                            style={{ width: `${row.confidence}%` }}
                          ></div>
                        </div>
                        <span className="text-slate-300 font-bold">{row.confidence}%</span>
                      </div>
                    ) : (
                      <span className="text-amber-400 text-[11px]">Unregistered</span>
                    )}
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded bg-obsidian-900 text-slate-300 border border-obsidian-750 text-[11px]">
                      {row.dna_hash}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <RiskBadge level={row.risk_level} />
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => {
                        // Quick demo trigger to load case
                        if (row.likely_generator.includes('FLUX')) {
                          onSelectAnalysis('sample-flux-portrait');
                        } else if (row.likely_generator.includes('Cluster #47') || row.likely_generator.includes('UNKNOWN')) {
                          onSelectAnalysis('sample-unknown-cluster47');
                        } else if (row.likely_generator.includes('Leica')) {
                          onSelectAnalysis('sample-real-leica-photo');
                        } else {
                          onSelectAnalysis('sample-midjourney-render');
                        }
                      }}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-mono font-semibold bg-obsidian-800 hover:bg-forensic-cyan hover:text-obsidian-950 text-slate-300 border border-obsidian-700 transition-all inline-flex items-center gap-1"
                    >
                      <span>Inspect</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}