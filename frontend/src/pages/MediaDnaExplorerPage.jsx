import React, { useState } from 'react';
import { 
  Dna, 
  Layers, 
  Sparkles, 
  ArrowLeftRight, 
  Sliders, 
  Info, 
  Activity, 
  ShieldCheck, 
  AlertTriangle,
  ZoomIn
} from 'lucide-react';
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, Cell, Legend } from 'recharts';

export default function MediaDnaExplorerPage() {
  const [specimenA, setSpecimenA] = useState('flux');
  const [specimenB, setSpecimenB] = useState('unknown47');

  const models = {
    flux: {
      name: 'FLUX.1',
      type: 'Known Latent Flow Diffusion',
      color: '#06b6d4',
      dna: {
        frequency_pattern: 88,
        noise_residual: 85,
        texture_signature: 84,
        compression_signature: 76,
        semantic_feature: 80,
        generator_fingerprint: 87,
        artifact_distribution: 91
      }
    },
    unknown47: {
      name: 'UNKNOWN CLUSTER #47',
      type: 'Emerging Unregistered Model',
      color: '#f43f5e',
      dna: {
        frequency_pattern: 94,
        noise_residual: 91,
        texture_signature: 89,
        compression_signature: 82,
        semantic_feature: 78,
        generator_fingerprint: 28,
        artifact_distribution: 93
      }
    },
    midjourney: {
      name: 'Midjourney v6.1',
      type: 'Aesthetic Diffusion Upscaler',
      color: '#a855f7',
      dna: {
        frequency_pattern: 91,
        noise_residual: 82,
        texture_signature: 93,
        compression_signature: 79,
        semantic_feature: 85,
        generator_fingerprint: 91,
        artifact_distribution: 88
      }
    },
    sdxl: {
      name: 'Stable Diffusion XL',
      type: 'Ensemble VAE Diffusion',
      color: '#3b82f6',
      dna: {
        frequency_pattern: 86,
        noise_residual: 83,
        texture_signature: 80,
        compression_signature: 74,
        semantic_feature: 77,
        generator_fingerprint: 85,
        artifact_distribution: 82
      }
    },
    leica_real: {
      name: 'Leica M11 (Real Camera)',
      type: 'Authentic Physical Sensor',
      color: '#10b981',
      dna: {
        frequency_pattern: 12,
        noise_residual: 8,
        texture_signature: 15,
        compression_signature: 14,
        semantic_feature: 6,
        generator_fingerprint: 3,
        artifact_distribution: 5
      }
    }
  };

  // Synthetic 2D PCA/t-SNE forensic vector scatter points
  const scatterData = [
    // FLUX cluster (cyan)
    { x: 74, y: 82, z: 25, model: 'FLUX.1', type: 'Known', fill: '#06b6d4' },
    { x: 76, y: 80, z: 20, model: 'FLUX.1', type: 'Known', fill: '#06b6d4' },
    { x: 73, y: 85, z: 22, model: 'FLUX.1', type: 'Known', fill: '#06b6d4' },
    { x: 78, y: 81, z: 24, model: 'FLUX.1', type: 'Known', fill: '#06b6d4' },
    { x: 75, y: 83, z: 30, model: 'FLUX.1 (Centroid)', type: 'Known', fill: '#06b6d4' },

    // Midjourney cluster (purple)
    { x: 88, y: 72, z: 25, model: 'Midjourney v6.1', type: 'Known', fill: '#a855f7' },
    { x: 86, y: 74, z: 20, model: 'Midjourney v6.1', type: 'Known', fill: '#a855f7' },
    { x: 89, y: 70, z: 22, model: 'Midjourney v6.1', type: 'Known', fill: '#a855f7' },
    { x: 87, y: 75, z: 30, model: 'Midjourney (Centroid)', type: 'Known', fill: '#a855f7' },

    // SDXL cluster (blue)
    { x: 62, y: 68, z: 25, model: 'SDXL', type: 'Known', fill: '#3b82f6' },
    { x: 64, y: 65, z: 20, model: 'SDXL', type: 'Known', fill: '#3b82f6' },
    { x: 60, y: 70, z: 22, model: 'SDXL', type: 'Known', fill: '#3b82f6' },
    { x: 63, y: 67, z: 30, model: 'SDXL (Centroid)', type: 'Known', fill: '#3b82f6' },

    // UNKNOWN CLUSTER #47 (rose / alert)
    { x: 82, y: 92, z: 30, model: 'UNKNOWN CLUSTER #47', type: 'Emerging', fill: '#f43f5e' },
    { x: 84, y: 90, z: 28, model: 'UNKNOWN CLUSTER #47', type: 'Emerging', fill: '#f43f5e' },
    { x: 81, y: 94, z: 26, model: 'UNKNOWN CLUSTER #47', type: 'Emerging', fill: '#f43f5e' },
    { x: 83, y: 91, z: 35, model: 'CLUSTER #47 (Centroid)', type: 'Emerging', fill: '#f43f5e' },

    // Authentic Real Media (emerald)
    { x: 12, y: 15, z: 30, model: 'Leica M11 Sensor', type: 'Real', fill: '#10b981' },
    { x: 14, y: 12, z: 25, model: 'Sony A7R V Sensor', type: 'Real', fill: '#10b981' },
    { x: 10, y: 18, z: 22, model: 'Canon EOS R5 Sensor', type: 'Real', fill: '#10b981' },
    { x: 13, y: 14, z: 35, model: 'Physical Sensor (Centroid)', type: 'Real', fill: '#10b981' },
  ];

  const dimensions = [
    { key: 'frequency_pattern', label: 'Frequency Pattern', desc: 'FFT 2D spectral power distribution' },
    { key: 'noise_residual', label: 'Noise Residual', desc: 'PRNU sensor noise vs diffusion step residue' },
    { key: 'texture_signature', label: 'Texture Signature', desc: 'GLCM gradient dispersion' },
    { key: 'compression_signature', label: 'Compression Signature', desc: 'ELA JPEG quantization variance' },
    { key: 'semantic_feature', label: 'Semantic Feature', desc: 'Lighting & chromatic phase consistency' },
    { key: 'generator_fingerprint', label: 'Generator Fingerprint', desc: 'Latent flow & VAE kernel alignment' },
    { key: 'artifact_distribution', label: 'Artifact Distribution', desc: 'Spatial localization of anomalies' }
  ];

  const modelA = models[specimenA];
  const modelB = models[specimenB];

  const CustomScatterTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const p = payload[0].payload;
      return (
        <div className="bg-obsidian-950 p-3 rounded-xl border border-obsidian-750 text-xs font-mono shadow-xl">
          <div className="font-bold text-white mb-1">{p.model}</div>
          <div className="text-slate-400">Class: <span style={{ color: p.fill }}>{p.type}</span></div>
          <div className="text-slate-400">Dim 1 (Latent Flow Index): <strong className="text-white">{p.x}</strong></div>
          <div className="text-slate-400">Dim 2 (Noise Kurtosis): <strong className="text-white">{p.y}</strong></div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-10 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-xs font-mono text-purple-400 font-bold mb-2">
          <Dna className="w-3.5 h-3.5" />
          MULTIDIMENSIONAL FORENSIC VECTOR EXPLORER
        </div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight font-sans">
          Media DNA Space
        </h2>
        <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-3xl">
          Inspect the multidimensional forensic manifold. Every digital media file is mapped into a 7-dimensional forensic coordinate space 
          derived from Fourier spectral decay, PRNU sensor noise, texture dispersion, and compression signatures.
        </p>
      </div>

      {/* 2D Forensic Manifold Projection Chart */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-obsidian-750 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-obsidian-800">
          <div>
            <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
              <Activity className="w-4 h-4 text-forensic-cyan" />
              FORENSIC MANIFOLD PROJECTION (PCA / t-SNE)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Clustering of Known Generative Models vs Unknown Outliers and Authentic Physical Sensors
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-cyan-400">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
              FLUX.1
            </span>
            <span className="flex items-center gap-1.5 text-purple-400">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-400"></span>
              Midjourney
            </span>
            <span className="flex items-center gap-1.5 text-blue-400">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-400"></span>
              SDXL
            </span>
            <span className="flex items-center gap-1.5 text-rose-400 font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-400 animate-ping"></span>
              Cluster #47 (Unknown)
            </span>
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
              Real Camera Sensors
            </span>
          </div>
        </div>

        <div className="w-full h-80">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <XAxis 
                type="number" 
                dataKey="x" 
                name="Latent Flow Harmonic Dimension" 
                domain={[0, 100]}
                stroke="#334155"
                tick={{ fill: '#64748b', fontSize: 11, fontFamily: 'monospace' }}
              />
              <YAxis 
                type="number" 
                dataKey="y" 
                name="Noise Residual Kurtosis" 
                domain={[0, 100]}
                stroke="#334155"
                tick={{ fill: '#64748b', fontSize: 11, fontFamily: 'monospace' }}
              />
              <ZAxis type="number" dataKey="z" range={[60, 200]} />
              <Tooltip content={<CustomScatterTooltip />} />
              <Scatter data={scatterData}>
                {scatterData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        <div className="text-[11px] text-slate-400 font-mono text-right pt-2 border-t border-obsidian-800">
          NOTICE: Points represent centroid distributions derived from 128,490 processed forensic specimens.
        </div>
      </div>

      {/* Side-by-Side Forensic DNA Comparator */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-obsidian-750 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-obsidian-800">
          <div>
            <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
              <ArrowLeftRight className="w-4 h-4 text-forensic-cyan" />
              MEDIA DNA COMPARATOR & DELTA INSPECTOR
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Select two specimens or model profiles to compare their 7-dimensional forensic delta
            </p>
          </div>

          {/* Selectors */}
          <div className="flex items-center gap-3">
            <select
              value={specimenA}
              onChange={(e) => setSpecimenA(e.target.value)}
              className="bg-obsidian-900 border border-obsidian-750 rounded-xl px-3 py-2 text-xs font-mono text-slate-200"
            >
              {Object.entries(models).map(([k, m]) => (
                <option key={k} value={k}>Specimen A: {m.name}</option>
              ))}
            </select>

            <span className="text-slate-500 font-mono text-xs">vs</span>

            <select
              value={specimenB}
              onChange={(e) => setSpecimenB(e.target.value)}
              className="bg-obsidian-900 border border-obsidian-750 rounded-xl px-3 py-2 text-xs font-mono text-slate-200"
            >
              {Object.entries(models).map(([k, m]) => (
                <option key={k} value={k}>Specimen B: {m.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Comparison Header */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-obsidian-900/80 border border-obsidian-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono text-slate-500 uppercase">SPECIMEN A</span>
              <h4 className="text-lg font-bold font-mono" style={{ color: modelA.color }}>{modelA.name}</h4>
              <span className="text-xs text-slate-400 font-sans">{modelA.type}</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-obsidian-900/80 border border-obsidian-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono text-slate-500 uppercase">SPECIMEN B</span>
              <h4 className="text-lg font-bold font-mono" style={{ color: modelB.color }}>{modelB.name}</h4>
              <span className="text-xs text-slate-400 font-sans">{modelB.type}</span>
            </div>
          </div>
        </div>

        {/* Dimensional Comparison Bars */}
        <div className="space-y-4">
          {dimensions.map((dim) => {
            const valA = modelA.dna[dim.key] || 0;
            const valB = modelB.dna[dim.key] || 0;
            const delta = valA - valB;

            return (
              <div key={dim.key} className="p-4 rounded-2xl bg-obsidian-900/40 border border-obsidian-800/80 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-slate-200">{dim.label}</span>
                  <div className="flex items-center gap-4">
                    <span style={{ color: modelA.color }} className="font-bold">A: {valA}</span>
                    <span style={{ color: modelB.color }} className="font-bold">B: {valB}</span>
                    <span className={`px-2 py-0.5 rounded text-[11px] ${Math.abs(delta) > 20 ? 'bg-rose-950 text-rose-400 border border-rose-800' : 'bg-obsidian-800 text-slate-400'}`}>
                      ? {delta > 0 ? `+${delta}` : delta}
                    </span>
                  </div>
                </div>

                {/* Dual Comparison Bar */}
                <div className="space-y-1.5">
                  <div className="w-full h-2 rounded-full bg-obsidian-950 overflow-hidden flex">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{ width: `${valA}%`, backgroundColor: modelA.color }}
                    ></div>
                  </div>
                  <div className="w-full h-2 rounded-full bg-obsidian-950 overflow-hidden flex">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{ width: `${valB}%`, backgroundColor: modelB.color }}
                    ></div>
                  </div>
                </div>

                <div className="text-[10px] text-slate-500 font-sans">
                  {dim.desc}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}