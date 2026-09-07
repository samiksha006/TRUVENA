import React from 'react';
import { Dna, Fingerprint, Hash, ShieldCheck, AlertCircle } from 'lucide-react';

export default function MediaDnaCard({ dnaVector, dnaHash, noveltyScore, likelyGenerator }) {
  const dimensions = [
    { key: 'frequency_pattern', label: 'Frequency Pattern', desc: 'FFT high-band spectral distribution', value: dnaVector?.frequency_pattern || 0 },
    { key: 'noise_residual', label: 'Noise Residual', desc: 'High-pass residual and fine-structure response', value: dnaVector?.noise_residual || 0 },
    { key: 'texture_signature', label: 'Texture Signature', desc: 'GLCM gradient dispersion & micro-smoothness', value: dnaVector?.texture_signature || 0 },
    { key: 'compression_signature', label: 'Compression Signature', desc: 'ELA JPEG quantization boundary variance', value: dnaVector?.compression_signature || 0 },
    { key: 'semantic_feature', label: 'Semantic Feature', desc: 'Lighting & chromatic phase consistency', value: dnaVector?.semantic_feature || 0 },
    { key: 'generator_fingerprint', label: 'Generator Fingerprint', desc: 'Latent kernel alignment to known families', value: dnaVector?.generator_fingerprint || 0 },
    { key: 'artifact_distribution', label: 'Artifact Distribution', desc: 'Spatial localization of synthetic anomalies', value: dnaVector?.artifact_distribution || 0 },
  ];

  const getColor = (val) => {
    if (val >= 85) return 'from-rose-500 to-amber-500 text-rose-400';
    if (val >= 70) return 'from-amber-500 to-cyan-500 text-amber-300';
    if (val >= 40) return 'from-cyan-500 to-blue-500 text-cyan-400';
    return 'from-emerald-500 to-blue-500 text-emerald-400';
  };

  return (
    <div className="glass-panel rounded-2xl p-6 border border-obsidian-700/80">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 pb-4 border-b border-obsidian-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-forensic-cyan/10 border border-forensic-cyan/30 flex items-center justify-center text-forensic-cyan shadow-glow-cyan">
            <Dna className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
              MEDIA DNA FINGERPRINT
            </h3>
            <p className="text-xs text-slate-400">
              Multidimensional forensic vector representation
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-obsidian-900 px-3 py-1.5 rounded-xl border border-obsidian-750 text-xs font-mono">
          <Hash className="w-3.5 h-3.5 text-forensic-cyan" />
          <span className="text-slate-400">HASH:</span>
          <span className="text-white font-bold tracking-wider">{dnaHash || 'DNA-GEN-0000'}</span>
        </div>
      </div>

      {/* 7 Dimensions List */}
      <div className="space-y-3.5">
        {dimensions.map((dim) => {
          const colorCls = getColor(dim.value);
          return (
            <div key={dim.key} className="space-y-1">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-200 font-semibold">{dim.label}</span>
                <span className={`font-bold ${colorCls.split(' ')[2]}`}>{dim.value}/100</span>
              </div>
              <div className="w-full h-2 rounded-full bg-obsidian-900 border border-obsidian-800 overflow-hidden">
                <div 
                  className={`h-full rounded-full bg-gradient-to-r ${colorCls.split(' ')[0]} ${colorCls.split(' ')[1]} transition-all duration-500`}
                  style={{ width: `${dim.value}%` }}
                ></div>
              </div>
              <div className="text-[10px] text-slate-400">
                {dim.desc}
              </div>
            </div>
          );
        })}
      </div>

      {noveltyScore && (
        <div className="mt-6 p-4 rounded-xl bg-amber-950/40 border border-amber-500/30 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <div className="text-xs font-mono font-bold text-amber-300">
              HIGH MEDIA DNA NOVELTY ({noveltyScore}%)
            </div>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              This specimen deviates significantly from all known commercial generator signatures. 
              The residual profile has been indexed into the Unknown Cluster database for temporal recurrence tracking.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}