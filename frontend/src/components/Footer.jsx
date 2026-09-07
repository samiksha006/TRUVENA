import React from 'react';
import { Shield, Terminal, Award, Lock } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full border-t border-obsidian-800/80 bg-obsidian-950 py-10 mt-20 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 text-white font-mono font-bold text-base mb-2">
              <Shield className="w-4 h-4 text-forensic-cyan" />
              <span>TRUVENA INTELLIGENCE</span>
            </div>
            <p className="text-slate-400 text-xs max-w-md leading-relaxed mb-3">
              ?Detect the unknown. Discover the source. Protect the truth.?
            </p>
            <p className="text-slate-500 text-[11px] leading-relaxed max-w-lg">
              TRUVENA is an enterprise-grade Synthetic Media Forensics and Trust Intelligence platform. 
              Its proprietary Media DNA architecture identifies known model fingerprints, isolates unknown generative patterns, 
              and adapts continuously to emerging generative threats.
            </p>
          </div>

          <div>
            <h4 className="text-slate-200 font-mono font-semibold text-xs mb-3 uppercase tracking-wider">Forensic Vectors</h4>
            <ul className="space-y-1.5 text-slate-400 text-xs font-mono">
              <li>? Frequency Pattern (FFT 2D)</li>
              <li>? Noise Residual (PRNU Proxy)</li>
              <li>? Texture Signature (GLCM)</li>
              <li>? Compression Signature (ELA)</li>
              <li>? Semantic Consistency</li>
              <li>? Generator Fingerprint</li>
              <li>? Artifact Distribution</li>
            </ul>
          </div>

          <div>
            <h4 className="text-slate-200 font-mono font-semibold text-xs mb-3 uppercase tracking-wider">Compliance & Trust</h4>
            <div className="space-y-2 text-slate-400 text-xs">
              <div className="flex items-center gap-2 text-[11px]">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                <span>C2PA / CAI Compatible Manifests</span>
              </div>
              <div className="flex items-center gap-2 text-[11px]">
                <Terminal className="w-3.5 h-3.5 text-forensic-cyan" />
                <span>Evidence-Based Attribution</span>
              </div>
              <div className="flex items-center gap-2 text-[11px]">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>Probabilistic Confidence Scoring</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-obsidian-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500 font-mono">
          <div>
            TRUVENA PLATFORM ? 2026. CONFIDENCE SCORES ARE MODEL ESTIMATES BASED ON FORENSIC SIGNAL ALIGNMENT.
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              CLUSTER ENGINE: SYNCED
            </span>
            <span>API: v1.0.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
}