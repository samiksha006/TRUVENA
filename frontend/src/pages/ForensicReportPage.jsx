import React, { useState } from "react";
import {
  Shield,
  Cpu,
  AlertTriangle,
  Download,
  FileText,
  Printer,
  Dna,
  Layers,
  Fingerprint,
  Activity,
  Lock,
  CheckCircle2,
  ArrowLeft,
  Share2,
  HelpCircle,
  ExternalLink,
} from "lucide-react";
import { RiskBadge, ClassificationBadge } from "../components/StatusBadge";
import ForensicHeatmapViewer from "../components/ForensicHeatmapViewer";
import ForensicRadarChart from "../components/ForensicRadarChart";
import MediaDnaCard from "../components/MediaDnaCard";

export default function ForensicReportPage({
  report,
  onBack,
  onSelectCase,
  sampleList,
}) {
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!report) {
    return (
      <div className="text-center py-20 glass-panel rounded-3xl p-12 max-w-xl mx-auto space-y-4">
        <Shield className="w-16 h-16 text-slate-600 mx-auto" />
        <h3 className="text-xl font-bold text-white font-mono">
          No Forensic Report Loaded
        </h3>
        <p className="text-xs text-slate-400">
          Upload an image or select a benchmark specimen to view its
          comprehensive Media DNA forensic report.
        </p>
        <button
          onClick={onBack}
          className="px-5 py-2.5 rounded-xl text-xs font-mono font-bold bg-forensic-cyan text-obsidian-950 hover:brightness-110 shadow-glow-cyan"
        >
          Go to Analyze Media
        </button>
      </div>
    );
  }

  const isUnknown =
    report.likely_generator === "UNKNOWN" &&
    report.cluster &&
    report.samples_in_cluster != null;
  const classifierSignal = Number(
    report.classifier_ai_probability ?? report.ai_probability ?? 0,
  );
  const fusedSignal = Number(report.ai_probability ?? 0);

  // Prefer the backend's explicit final verdict. If an older report is loaded,
  // derive the same binary demo verdict without exposing the internal "Uncertain" state.
  const finalVerdict =
  report.final_verdict ||
  (report.classification === "AI Generated"
    ? "AI GENERATED"
    : report.classification === "Uncertain"
      ? "UNCERTAIN / POTENTIAL SYNTHETIC"
      : "REAL / LIKELY REAL");
  const isFinalAI = finalVerdict === "AI GENERATED";
  const isFinalUncertain = finalVerdict === "UNCERTAIN / POTENTIAL SYNTHETIC";
  const isFinalReal = !isFinalAI && !isFinalUncertain;
  const decisionSignal = Number(
    report.final_confidence ??
      (isFinalAI
        ? classifierSignal
        : isFinalUncertain
          ? classifierSignal
          : Math.max(fusedSignal, 100 - fusedSignal)),
  );

  const displayRisk = isFinalAI ? "HIGH" : isFinalUncertain ? "MEDIUM" : "LOW";

  const displayTrust = isFinalAI
    ? Math.max(5, Math.round(100 - decisionSignal))
    : isFinalUncertain
      ? Math.max(20, Math.round(100 - decisionSignal))
      : Math.max(50, Math.round(decisionSignal));

  const handleDownloadJSON = () => {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(report, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute(
      "download",
      `TRUVENA_Report_${report.analysis_id || "forensic"}.json`,
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-obsidian-800">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-obsidian-900 border border-obsidian-750 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-slate-400">
                DOSSIER ID:
              </span>
              <span className="text-xs font-mono font-bold text-forensic-cyan">
                {report.analysis_id}
              </span>
              <span className="text-slate-600">|</span>
              <span className="text-xs font-mono text-slate-400">
                {report.timestamp}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white font-mono mt-0.5">
              {report.title || `Specimen: ${report.filename}`}
            </h2>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleDownloadJSON}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono font-semibold bg-obsidian-850 hover:bg-obsidian-800 text-slate-200 border border-slate-700 transition-all"
          >
            <Download className="w-3.5 h-3.5 text-forensic-cyan" />
            <span>{downloadSuccess ? "Downloaded!" : "Export JSON"}</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono font-semibold bg-obsidian-850 hover:bg-obsidian-800 text-slate-200 border border-slate-700 transition-all"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Dossier</span>
          </button>
        </div>
      </div>

      {/* Final User-Facing Verdict */}
      <div
        className={`rounded-3xl p-6 sm:p-8 border relative overflow-hidden ${
          isFinalAI
            ? "bg-rose-500/10 border-rose-500/50"
            : isFinalUncertain
              ? "bg-amber-500/10 border-amber-500/50"
              : "bg-emerald-500/10 border-emerald-500/40"
        }`}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
                isFinalAI
                  ? "bg-rose-500/20 text-rose-400 border border-rose-500/40"
                  : isFinalUncertain
                    ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                    : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
              }`}
            >
              {isFinalAI || isFinalUncertain ? (
                <AlertTriangle className="w-7 h-7" />
              ) : (
                <CheckCircle2 className="w-7 h-7" />
              )}
            </div>

            <div>
              <div className="text-[11px] font-mono font-bold tracking-[0.2em] text-slate-400 uppercase">
                Final TRUVENA Verdict
              </div>
              <h3
                className={`text-2xl sm:text-3xl font-black font-mono mt-1 ${
                  isFinalAI
                    ? "text-rose-300"
                    : isFinalUncertain
                      ? "text-amber-300"
                      : "text-emerald-300"
                }`}
              >
                {finalVerdict}
              </h3>
              <p className="text-sm text-slate-300 mt-2 max-w-3xl leading-relaxed">
                {isFinalAI
                  ? "Strong evidence of AI-generated content was detected. The classifier signal triggered forensic review, with additional Media DNA evidence shown below."
                  : isFinalUncertain
                    ? "Synthetic-media indicators were detected, but the available evidence is not sufficient for a definitive AI-generated verdict. TRUVENA has isolated the forensic pattern for further observation."
                    : "No strong evidence of AI generation was detected. The available classifier, forensic, and registry signals support a real / likely real assessment."}
              </p>
            </div>
          </div>

          <div className="shrink-0 rounded-2xl bg-obsidian-950/70 border border-obsidian-750 px-5 py-4 min-w-[190px]">
            <div className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">
              Decision Signal
            </div>
            <div
              className={`text-3xl font-black font-mono mt-1 ${isFinalAI ? "text-rose-300" : "text-emerald-300"}`}
            >
              {decisionSignal}%
            </div>
            <div className="text-[10px] text-slate-500 mt-1">
              Primary evidence strength
            </div>
          </div>
        </div>

        {report.classification && report.classification !== finalVerdict && (
          <div className="mt-5 pt-4 border-t border-obsidian-750/80 text-xs text-slate-400 font-mono">
            Internal detector state:{" "}
            <span className="text-slate-200">{report.classification}</span>
            <span className="mx-2 text-slate-600">•</span>
            AI classifier signal:{" "}
            <span className="text-slate-200">{classifierSignal}%</span>
            <span className="mx-2 text-slate-600">•</span>
            Fused synthetic-media score:{" "}
            <span className="text-slate-200">{fusedSignal}%</span>
          </div>
        )}
      </div>

      {/* Unknown Cluster / Emerging Pattern Banner */}
      {isUnknown && (
        <div className="glass-panel-danger rounded-2xl p-6 border border-rose-500/50 relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-rose-500/20 border border-rose-500/50 flex items-center justify-center text-rose-400 shrink-0 animate-pulse">
                <AlertTriangle className="w-6 h-6" />
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 font-mono text-[11px] font-bold border border-rose-800">
                    POTENTIAL EMERGING PATTERN
                  </span>

                  <span className="text-xs font-mono text-slate-300 font-bold">
                    {report.cluster}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white font-mono">
                  Novel Forensic Fingerprint Isolated
                </h3>

                <p className="text-xs sm:text-sm text-slate-200 mt-1 max-w-3xl leading-relaxed">
                  This media contains a recurring forensic fingerprint that does
                  not sufficiently match the current known generator registry.
                  Repeated observations are required before treating it as
                  evidence of an emerging generator.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-obsidian-950/80 p-3.5 rounded-xl border border-rose-500/30 text-xs font-mono shrink-0">
              <div>
                <div className="text-slate-400 text-[10px]">
                  SAMPLES OBSERVED
                </div>
                <div className="text-lg font-bold text-white">
                  {report.samples_in_cluster?.toLocaleString()}
                </div>
              </div>

              <div className="h-8 w-px bg-obsidian-800"></div>

              <div>
                <div className="text-slate-400 text-[10px]">CONSISTENCY</div>
                <div className="text-lg font-bold text-emerald-400">
                  {report.pattern_consistency}%
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Forensic Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 font-mono">
        <div className="glass-panel p-4 rounded-2xl border border-obsidian-750">
          <div className="text-[10px] text-slate-400 uppercase tracking-wider">
            AI Probability
          </div>
          <div
            className={`text-2xl font-black mt-1 ${report.ai_probability > 50 ? "text-rose-400" : "text-emerald-400"}`}
          >
            {report.ai_probability}%
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5 truncate">
            Internal state: {report.classification}
          </div>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-obsidian-750">
          <div className="text-[10px] text-slate-400 uppercase tracking-wider">
            Likely Generator
          </div>
          <div
            className={`text-xl font-black mt-1 truncate ${isUnknown ? "text-amber-400" : "text-forensic-cyan"}`}
          >
            {report.likely_generator}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            {isUnknown
              ? "Unregistered forensic pattern"
              : report.likely_generator === "UNKNOWN"
                ? "No registered match"
                : `Confidence: ${report.generator_confidence}%`}
          </div>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-obsidian-750">
          <div className="text-[10px] text-slate-400 uppercase tracking-wider">
            Media DNA Match
          </div>
          <div className="text-2xl font-black text-forensic-blue mt-1">
            {report.media_dna_match}%
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            {isUnknown && report.media_dna_novelty != null
              ? `Novelty: ${report.media_dna_novelty}%`
              : report.media_dna_match > 0
                ? "Registry Concordance"
                : "No registry match"}
          </div>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-obsidian-750">
          <div className="text-[10px] text-slate-400 uppercase tracking-wider">
            Provenance / C2PA
          </div>
          <div
            className={`text-xs font-bold mt-2 truncate ${
              String(
                report.c2pa_provenance ?? report.c2pa?.status ?? "Not Found",
              ).includes("Verified")
                ? "text-emerald-400"
                : "text-slate-300"
            }`}
          >
            {String(
              report.c2pa_provenance ?? report.c2pa?.status ?? "Not Found",
            )}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            Provenance status
          </div>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-obsidian-750">
          <div className="text-[10px] text-slate-400 uppercase tracking-wider">
            Watermark Signal
          </div>
          <div className="text-xs font-bold text-slate-300 mt-2 truncate">
            {typeof report.watermark === "object"
              ? report.watermark?.status || "Unavailable"
              : report.watermark || "Unavailable"}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            Watermark status
          </div>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-obsidian-750">
          <div className="text-[10px] text-slate-400 uppercase tracking-wider">
            Overall Risk
          </div>
          <div className="mt-1.5">
            <RiskBadge level={displayRisk} />
          </div>
          <div className="text-[10px] text-slate-500 mt-1.5">
            Trust Score: {displayTrust}/100
          </div>
        </div>
      </div>

      {/* Two Column Layout: Forensic Heatmap Lens + Media DNA Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left: Interactive Multi-Layer Heatmap Viewer */}
        <div className="space-y-6">
          <ForensicHeatmapViewer
            visualizations={report.visualizations}
            originalUrl={
              report.preview_url ||
              report.image_url ||
              (report.filename ? `/uploads/${report.filename}` : "")
            }
            filename={report.filename}
          />

          {/* Forensic Evidence Breakdown */}
          <div className="glass-panel rounded-2xl p-6 border border-obsidian-750">
            <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2 mb-4">
              <CheckCircle2 className="w-4 h-4 text-forensic-cyan" />
              Empirical Forensic Evidence
            </h3>

            <div className="space-y-2.5">
              {(report.evidence || []).map((ev, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3 rounded-xl bg-obsidian-900/60 border border-obsidian-800 text-xs"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-forensic-cyan mt-1.5 shrink-0"></span>
                  <span className="text-slate-200 font-sans leading-relaxed">
                    {ev}
                  </span>
                </div>
              ))}
            </div>

            {/* Narrative Explanation */}
            <div className="mt-4 p-4 rounded-xl bg-obsidian-900/80 border border-obsidian-750 text-xs text-slate-300 leading-relaxed font-sans">
              <span className="font-mono text-[11px] font-bold text-forensic-cyan block mb-1">
                FORENSIC EXPLANATION:
              </span>
              {isFinalAI
                ? `TRUVENA detected strong AI-generation evidence. The AI classifier produced a ${classifierSignal}% signal, triggering forensic review. ${
                    report.likely_generator &&
                    report.likely_generator !== "UNKNOWN" &&
                    report.media_dna_match > 0
                      ? `Media DNA shows ${report.media_dna_match}% similarity to ${report.likely_generator}. This is an evidence-based candidate attribution, not definitive proof of the exact generator.`
                      : "The available Media DNA evidence is shown below."
                  }`
                : isFinalUncertain
                  ? `TRUVENA identified potential synthetic-media evidence but cannot make a definitive AI-generated determination. The AI classifier produced a ${classifierSignal}% signal, while the fused synthetic-media score was ${fusedSignal}%. The forensic pattern has been isolated as ${report.cluster || "an unknown cluster"} for continued observation.`
                  : `TRUVENA assesses this specimen as REAL / LIKELY REAL. The AI classifier produced a ${classifierSignal}% AI signal, while the fused synthetic-media score was ${fusedSignal}%. No strong generator match was found.`}
            </div>
          </div>
        </div>

        {/* Right: Media DNA Radar Chart + 7 Dimensions Card */}
        <div className="space-y-6">
          {/* Radar Chart */}
          <div className="glass-panel rounded-2xl p-6 border border-obsidian-750">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
                  <Dna className="w-4 h-4 text-forensic-cyan" />
                  Media DNA Spatial Geometry
                </h3>
                <p className="text-xs text-slate-400">
                  Multidimensional forensic fingerprint across seven
                  image-signal dimensions
                </p>
              </div>
            </div>

            <ForensicRadarChart
              dnaVector={report.dna_vector}
              likelyGenerator={report.likely_generator}
            />
          </div>

          {/* 7 Dimensions Vector Card */}
          <MediaDnaCard
            dnaVector={report.dna_vector}
            dnaHash={report.dna_hash}
            noveltyScore={report.media_dna_novelty}
            likelyGenerator={report.likely_generator}
          />
        </div>
      </div>
    </div>
  );
}
