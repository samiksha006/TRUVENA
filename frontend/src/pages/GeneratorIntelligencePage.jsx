import React, { useState, useEffect } from 'react';
import { 
  Cpu, 
  Database, 
  AlertTriangle, 
  Activity, 
  Clock, 
  Dna, 
  Fingerprint, 
  CheckCircle2, 
  TrendingUp, 
  Zap, 
  ArrowRight,
  Shield,
  Layers,
  Sparkles
} from 'lucide-react';
import { fetchGenerators, fetchUnknownClusters, promoteCluster } from '../services/api';
import AdaptiveLearningPipeline from '../components/AdaptiveLearningPipeline';

export default function GeneratorIntelligencePage({ onSelectAnalysis }) {
  const [generators, setGenerators] = useState([]);
  const [clusters, setClusters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPromoting, setIsPromoting] = useState(false);
  const [isPromoted, setIsPromoted] = useState(false);
  const [promotionMessage, setPromotionMessage] = useState(null);

  const loadData = () => {
    Promise.all([fetchGenerators(), fetchUnknownClusters()])
      .then(([genData, clusterData]) => {
        setGenerators(genData.generators || []);
        setClusters(clusterData.clusters || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching generator intelligence:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadData();
  }, []);

  const handlePromoteCluster = async () => {
    setIsPromoting(true);
    try {
      const res = await promoteCluster('cluster-47', 'FLUX-Derivative v2 (Discovered)');
      setIsPromoted(true);
      setPromotionMessage(res.message);
      setIsPromoting(false);
      loadData();
    } catch (err) {
      console.error('Promote error:', err);
      setIsPromoting(false);
    }
  };

  return (
    <div className="space-y-10 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forensic-cyan/10 border border-forensic-cyan/30 text-xs font-mono text-forensic-cyan font-bold mb-2">
            <Cpu className="w-3.5 h-3.5" />
            GENERATOR SIGNATURE INTELLIGENCE
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Generator Knowledge Base & Threat Registry
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Comprehensive catalog of known generative diffusion & GAN architectures, their Media DNA fingerprints, and live tracking of emerging models in the wild.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-obsidian-900 px-4 py-2 rounded-2xl border border-obsidian-750 text-xs font-mono text-slate-300">
          <div>
            <span className="text-slate-400">KNOWN: </span>
            <strong className="text-forensic-cyan font-bold">{generators.length}</strong>
          </div>
          <div className="h-4 w-px bg-obsidian-800"></div>
          <div>
            <span className="text-slate-400">UNKNOWN CLUSTERS: </span>
            <strong className="text-amber-400 font-bold">{clusters.length}</strong>
          </div>
        </div>
      </div>

      {/* Adaptive Learning Visual Pipeline Banner */}
      <AdaptiveLearningPipeline
        onPromote={handlePromoteCluster}
        isPromoting={isPromoting}
        isPromoted={isPromoted}
      />

      {promotionMessage && (
        <div className="p-4 rounded-xl bg-emerald-950/70 border border-emerald-500/40 text-xs font-mono text-emerald-300 flex items-center gap-3 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{promotionMessage}</span>
        </div>
      )}

      {/* Emerging Generators Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white font-mono flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              EMERGING GENERATORS (UNREGISTERED CLUSTERS)
            </h3>
            <p className="text-xs text-slate-400">
              Recurring high-novelty forensic clusters detected across viral channels awaiting formal attribution.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {clusters.map((cluster) => (
            <div
              key={cluster.id}
              className={`glass-panel rounded-2xl p-6 border transition-all flex flex-col justify-between ${
                cluster.status === 'EMERGING'
                  ? 'border-amber-500/40 shadow-glow-rose/20'
                  : 'border-obsidian-750'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-950 text-amber-300 border border-amber-500/40 animate-pulse">
                    {cluster.status}
                  </span>
                  <span className="text-xs font-mono font-bold text-rose-400 flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5" />
                    {cluster.growth_rate}
                  </span>
                </div>

                <h4 className="text-base font-bold text-white font-mono">
                  {cluster.cluster_code}
                </h4>
                <div className="text-xs text-slate-400 font-sans mt-0.5">
                  {cluster.title}
                </div>

                {/* Key Cluster Telemetry */}
                <div className="grid grid-cols-2 gap-2 mt-4 p-3 rounded-xl bg-obsidian-950/80 border border-obsidian-800 text-xs font-mono">
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase">Analyzed Samples</div>
                    <div className="text-base font-black text-white">{cluster.sample_count.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase">Pattern Consistency</div>
                    <div className="text-base font-black text-emerald-400">{cluster.pattern_consistency}%</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase">DNA Novelty</div>
                    <div className="text-sm font-bold text-amber-400">{cluster.novelty_score}%</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase">Known Match</div>
                    <div className="text-sm font-bold text-slate-400">{cluster.known_match_score}%</div>
                  </div>
                </div>

                <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                  {cluster.explanation}
                </p>

                {/* Characteristics */}
                <div className="mt-3 space-y-1">
                  <div className="text-[10px] font-mono font-bold text-slate-400 uppercase">Distinguishing Markers:</div>
                  {(cluster.characteristics || []).slice(0, 2).map((c, i) => (
                    <div key={i} className="text-[11px] text-slate-400 flex items-start gap-1.5">
                      <span className="text-amber-400">?</span>
                      <span>{c}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-obsidian-800 flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-500">First seen: {cluster.first_detected}</span>
                <button
                  onClick={() => onSelectAnalysis('sample-unknown-cluster47')}
                  className="text-xs font-mono text-forensic-cyan hover:underline flex items-center gap-1 font-semibold"
                >
                  <span>Inspect Specimen</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Known Generators Section */}
      <div className="space-y-4 pt-6">
        <div>
          <h3 className="text-lg font-bold text-white font-mono flex items-center gap-2">
            <Database className="w-5 h-5 text-forensic-cyan" />
            VERIFIED KNOWN GENERATOR REGISTRY
          </h3>
          <p className="text-xs text-slate-400">
            Catalog of indexed generative architectures with high-dimensional reference DNA fingerprints.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {generators.map((gen) => (
            <div
              key={gen.id}
              className="glass-panel rounded-2xl p-6 border border-obsidian-750 hover:border-forensic-cyan/40 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-forensic-cyan/10 text-forensic-cyan border border-forensic-cyan/30">
                    {gen.vendor}
                  </span>
                  <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-500" />
                    {gen.last_detected}
                  </span>
                </div>

                <h4 className="text-lg font-extrabold text-white font-mono group-hover:text-forensic-cyan transition-colors">
                  {gen.name}
                </h4>
                <p className="text-xs text-slate-400 mt-0.5 font-sans">
                  {gen.architecture}
                </p>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-2 mt-4 p-3 rounded-xl bg-obsidian-950/80 border border-obsidian-800 text-xs font-mono">
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase">Confidence Score</div>
                    <div className="text-base font-black text-forensic-cyan">{gen.baseline_confidence}%</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase">DNA Concordance</div>
                    <div className="text-base font-black text-forensic-blue">{gen.media_dna_match}%</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase">Analyzed Samples</div>
                    <div className="text-xs font-bold text-slate-200">{gen.analyzed_samples?.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase">Release Year</div>
                    <div className="text-xs font-bold text-slate-200">{gen.release_year}</div>
                  </div>
                </div>

                {/* Distinctive Artifacts */}
                <div className="mt-4 space-y-1.5">
                  <div className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                    Signature Forensic Artifacts:
                  </div>
                  {(gen.distinctive_artifacts || []).slice(0, 2).map((art, idx) => (
                    <div key={idx} className="text-xs text-slate-300 flex items-start gap-1.5 leading-snug">
                      <span className="text-forensic-cyan font-bold">?</span>
                      <span>{art}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* DNA mini vector preview */}
              <div className="mt-6 pt-4 border-t border-obsidian-800">
                <div className="text-[10px] font-mono text-slate-500 uppercase mb-2 flex items-center justify-between">
                  <span>Reference DNA Vector</span>
                  <Dna className="w-3.5 h-3.5 text-forensic-cyan" />
                </div>
                <div className="flex items-center gap-1">
                  {Object.entries(gen.dna_fingerprint || {}).map(([key, val]) => (
                    <div key={key} className="flex-1 space-y-1" title={`${key}: ${val}/100`}>
                      <div className="w-full h-1.5 rounded-full bg-obsidian-900 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-forensic-cyan to-forensic-blue rounded-full"
                          style={{ width: `${val}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}