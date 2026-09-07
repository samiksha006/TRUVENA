import React from 'react';
import { 
  Shield, 
  Dna, 
  Cpu, 
  Layers, 
  Activity, 
  Lock, 
  Sparkles, 
  Award, 
  Terminal, 
  HelpCircle,
  FileCheck2,
  AlertTriangle
} from 'lucide-react';
import AdaptiveLearningPipeline from '../components/AdaptiveLearningPipeline';

export default function AboutPage() {
  const vectors = [
    {
      title: '1. Frequency Pattern (FFT 2D)',
      desc: 'Computes Fast Fourier Transform magnitude spectra to detect high-frequency spectral roll-off anomalies, diagonal aliasing, and continuous-time latent flow grid harmonics.'
    },
    {
      title: '2. Noise Residual (PRNU Proxy)',
      desc: 'Isolates high-pass spatial residuals. Real cameras exhibit physical Bayer pattern photo-response non-uniformity (PRNU); synthetic media displays continuous diffusion step residue.'
    },
    {
      title: '3. Texture Signature (GLCM)',
      desc: 'Evaluates Gray-Level Co-occurrence Matrix (GLCM) contrast and gradient dispersion to quantify unnatural micro-texture smoothing in human skin, hair, and fine geometric edges.'
    },
    {
      title: '4. Compression Signature (ELA)',
      desc: 'Error Level Analysis (ELA) identifies variance in JPEG quantization matrices across composite synthetic layers, distinguishing multi-step inpainting and diffusion upscalers.'
    },
    {
      title: '5. Semantic Consistency',
      desc: 'Evaluates optical coherence, including chromatic lens aberration, specular corneal reflection symmetry, and physical lighting vector plausibility.'
    },
    {
      title: '6. Generator Fingerprint',
      desc: 'Measures high-dimensional cosine similarity against reference latent flow and VAE kernels in the TRUVENA Known Generator Registry (FLUX, Midjourney, SDXL, DALL-E).'
    },
    {
      title: '7. Artifact Distribution',
      desc: 'Spatial heatmapping tracking whether synthetic anomalies are localized to specific perceptual regions (e.g. hands, teeth, hair boundaries) or distributed globally.'
    }
  ];

  return (
    <div className="space-y-12 max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-forensic-cyan/10 border border-forensic-cyan/30 text-xs font-mono text-forensic-cyan font-bold">
          <Shield className="w-3.5 h-3.5" />
          SCIENTIFIC METHODOLOGY & ARCHITECTURE
        </div>
        <h1 className="text-4xl font-extrabold text-white tracking-tight font-sans">
          How TRUVENA Works
        </h1>
        <p className="text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Why traditional binary AI detectors fail against new models, and how TRUVENA?s adaptive <strong className="text-white">Media DNA</strong> architecture solves synthetic attribution.
        </p>
      </div>

      {/* The Fundamental Problem */}
      <div className="glass-panel rounded-3xl p-8 border border-obsidian-750 space-y-4">
        <h3 className="text-lg font-bold text-white font-mono flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-400" />
          THE PROBLEM: THE OBSOLESCENCE OF BINARY DETECTORS
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          Most commercial AI image detectors rely on static convolutional binary classifiers trained on yesterday's models (e.g. Midjourney v4 or Stable Diffusion 1.5). 
          When a revolutionary generative architecture is released (such as FLUX.1 flow matching, Sora, or novel open-weights fine-tunes), traditional detectors experience catastrophic failure rates because the novel artifacts do not resemble the old training distributions.
        </p>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          <strong className="text-forensic-cyan">TRUVENA rejects binary classification.</strong> Instead, it treats media forensics as a dynamic signal intelligence problem, extracting multidimensional forensic fingerprints and actively tracking recurring unknown signatures.
        </p>
      </div>

      {/* Concept: MEDIA DNA */}
      <div className="space-y-6">
        <div>
          <div className="text-xs font-mono font-bold text-forensic-cyan uppercase tracking-wider mb-1">
            CORE SCIENTIFIC CONCEPT
          </div>
          <h3 className="text-2xl font-bold text-white font-mono flex items-center gap-2">
            <Dna className="w-6 h-6 text-forensic-cyan" />
            MEDIA DNA: Multidimensional Forensic Fingerprinting
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Every digital image contains indelible physical and algorithmic residuals across 7 foundational dimensions:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {vectors.map((vec, idx) => (
            <div key={idx} className="glass-panel rounded-2xl p-5 border border-obsidian-750 hover:border-forensic-cyan/30 transition-all">
              <h4 className="text-xs font-mono font-bold text-forensic-cyan mb-1.5 uppercase">{vec.title}</h4>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">{vec.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Adaptive Learning Pipeline Diagram */}
      <div className="space-y-4">
        <div>
          <div className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider mb-1">
            CONTINUOUS EVOLUTION
          </div>
          <h3 className="text-2xl font-bold text-white font-mono flex items-center gap-2">
            <Cpu className="w-6 h-6 text-amber-400" />
            Adaptive Learning & Unknown Clustering
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            The closed-loop lifecycle that turns unregistered synthetic threats into cataloged known generators:
          </p>
        </div>

        <AdaptiveLearningPipeline />
      </div>

      {/* Scientific & Legal Disclaimer */}
      <div className="glass-panel rounded-3xl p-8 border border-obsidian-750 space-y-4 bg-obsidian-950/90">
        <div className="flex items-center gap-3 text-white font-mono font-bold text-sm">
          <Shield className="w-5 h-5 text-emerald-400" />
          <span>SCIENTIFIC INTEGRITY & ENTERPRISE COMPLIANCE NOTICE</span>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          TRUVENA adheres to rigorous scientific standards. Digital image processing cannot mathematically prove the identity of an individual prompt engineer or closed-source API with 100.0% certainty. 
        </p>
        <p className="text-xs text-slate-400 leading-relaxed">
          All platform outputs are explicitly formulated using probabilistic, evidence-based terminology:
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono pt-2">
          <div className="p-3 rounded-xl bg-obsidian-900 border border-obsidian-800 text-center text-slate-200">
            ?Likely Generator?
          </div>
          <div className="p-3 rounded-xl bg-obsidian-900 border border-obsidian-800 text-center text-slate-200">
            ?Evidence-Based Attribution?
          </div>
          <div className="p-3 rounded-xl bg-obsidian-900 border border-obsidian-800 text-center text-slate-200">
            ?Forensic Confidence?
          </div>
          <div className="p-3 rounded-xl bg-obsidian-900 border border-obsidian-800 text-center text-slate-200">
            ?Potential Unknown Generator?
          </div>
        </div>
      </div>
    </div>
  );
}