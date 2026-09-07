import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip
} from 'recharts';

export default function ForensicRadarChart({ dnaVector, likelyGenerator }) {
  // Vector dimension mapping
  const data = [
    { subject: 'Frequency', value: dnaVector?.frequency_pattern || 50, benchmark: 15, fullMark: 100 },
    { subject: 'Noise Res', value: dnaVector?.noise_residual || 50, benchmark: 12, fullMark: 100 },
    { subject: 'Texture Sig', value: dnaVector?.texture_signature || 50, benchmark: 18, fullMark: 100 },
    { subject: 'Compression', value: dnaVector?.compression_signature || 50, benchmark: 16, fullMark: 100 },
    { subject: 'Semantic', value: dnaVector?.semantic_feature || 50, benchmark: 8, fullMark: 100 },
    { subject: 'Gen Fingerprint', value: dnaVector?.generator_fingerprint || 50, benchmark: 5, fullMark: 100 },
    { subject: 'Artifact Dist', value: dnaVector?.artifact_distribution || 50, benchmark: 6, fullMark: 100 }
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-obsidian-950 border border-obsidian-700 p-2.5 rounded-lg shadow-xl text-xs font-mono">
          <div className="font-bold text-white mb-1">{payload[0]?.payload?.subject}</div>
          <div className="text-forensic-cyan">Specimen: {payload[0]?.value}/100</div>
          {payload[1] && <div className="text-slate-400">Real Camera Baseline: {payload[1]?.value}/100</div>}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-72 flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
          <PolarGrid stroke="#1e293b" />
          <PolarAngleAxis 
            dataKey="subject" 
            tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'monospace' }} 
          />
          <PolarRadiusAxis 
            angle={30} 
            domain={[0, 100]} 
            tick={{ fill: '#475569', fontSize: 9 }}
            stroke="#1e293b" 
          />
          <Tooltip content={<CustomTooltip />} />
          <Radar
            name={likelyGenerator || "Specimen Media DNA"}
            dataKey="value"
            stroke="#06b6d4"
            fill="#06b6d4"
            fillOpacity={0.4}
          />
          <Radar
            name="Real Sensor Baseline"
            dataKey="benchmark"
            stroke="#64748b"
            fill="#64748b"
            fillOpacity={0.15}
            strokeDasharray="3 3"
          />
          <Legend 
            wrapperStyle={{ fontSize: 11, fontFamily: 'monospace', paddingTop: 10 }} 
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}