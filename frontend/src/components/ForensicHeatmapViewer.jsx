import React, { useState } from "react";
import {
  Eye,
  Layers,
  Zap,
  Activity,
  HelpCircle,
  ZoomIn,
  ImageOff,
} from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const resolveMediaUrl = (src) => {
  if (!src) return "";

  // Base64/data URLs can be used directly
  if (src.startsWith("data:")) return src;

  // Absolute URLs can be used directly
  if (src.startsWith("http://") || src.startsWith("https://")) {
    return src;
  }

  // Backend relative paths
  if (src.startsWith("/")) {
    return `${API_BASE_URL}${src}`;
  }

  return `${API_BASE_URL}/${src}`;
};

export default function ForensicHeatmapViewer({
  visualizations,
  originalUrl,
  filename,
}) {
  const [activeLayer, setActiveLayer] = useState("original");
  const [isZoomed, setIsZoomed] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [imageError, setImageError] = useState(false);

  const layers = [
    {
      id: "original",
      name: "Original Media",
      icon: Eye,
      color: "border-slate-500 text-slate-200",
      badge: "RGB Base",
      desc: "The original image submitted for forensic analysis.",
    },
    {
      id: "fft",
      name: "FFT 2D Spectrum",
      icon: Zap,
      color: "border-amber-500 text-amber-300",
      badge: "Frequency Domain",
      desc: "Frequency-domain visualization highlighting high-frequency image patterns and spectral artifacts.",
    },
    {
      id: "noise",
      name: "Noise Residual",
      icon: Activity,
      color: "border-emerald-500 text-emerald-300",
      badge: "Residual Analysis",
      desc: "High-pass residual visualization highlighting fine image structures and forensic noise patterns.",
    },
    {
      id: "ela",
      name: "Error Level Analysis (ELA)",
      icon: Layers,
      color: "border-purple-500 text-purple-300",
      badge: "Compression Map",
      desc: "Compression-error visualization highlighting areas with differing image encoding characteristics.",
    },
  ];

  const getActiveImageSrc = () => {
    if (activeLayer === "fft") {
      return resolveMediaUrl(visualizations?.fft_spectrum || originalUrl);
    }

    if (activeLayer === "noise") {
      return resolveMediaUrl(visualizations?.noise_residual || originalUrl);
    }

    if (activeLayer === "ela") {
      return resolveMediaUrl(visualizations?.ela_artifact || originalUrl);
    }

    return resolveMediaUrl(originalUrl);
  };

  const activeLayerData =
    layers.find((layer) => layer.id === activeLayer) || layers[0];

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();

    const x = Math.max(
      0,
      Math.min(100, Math.round(((e.clientX - rect.left) / rect.width) * 100)),
    );

    const y = Math.max(
      0,
      Math.min(100, Math.round(((e.clientY - rect.top) / rect.height) * 100)),
    );

    setCoords({ x, y });
  };

  const handleLayerChange = (layerId) => {
    setActiveLayer(layerId);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className="glass-panel rounded-2xl p-5 border border-obsidian-700/80 relative">
      {/* Header & Layer Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-4 border-b border-obsidian-800">
        <div>
          <h4 className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4 text-forensic-cyan" />
            Interactive Forensic Multi-Layer Lens
          </h4>

          <p className="text-xs text-slate-400 mt-0.5">
            Explore different image-signal views used by TRUVENA during forensic
            analysis.
          </p>
        </div>

        {/* Layer Toggle Pills */}
        <div className="flex flex-wrap items-center gap-1.5 bg-obsidian-900/90 p-1 rounded-xl border border-obsidian-750">
          {layers.map((layer) => {
            const Icon = layer.icon;
            const isSelected = activeLayer === layer.id;

            return (
              <button
                key={layer.id}
                onClick={() => handleLayerChange(layer.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                  isSelected
                    ? "bg-obsidian-750 text-forensic-cyan font-bold border border-forensic-cyan/30 shadow-sm"
                    : "text-slate-400 hover:text-white hover:bg-obsidian-800/60"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{layer.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Image Viewport */}
      <div
        onMouseMove={handleMouseMove}
        className="relative w-full aspect-square max-h-[500px] rounded-xl overflow-hidden bg-obsidian-950 border border-obsidian-750 flex items-center justify-center group cursor-crosshair"
      >
        {!imageError && getActiveImageSrc() ? (
          <img
            key={`${activeLayer}-${getActiveImageSrc()}`}
            src={getActiveImageSrc()}
            alt={`${activeLayerData.name} forensic visualization for ${filename || "specimen"}`}
            onError={handleImageError}
            className={`w-full h-full object-contain transition-transform duration-300 ${
              isZoomed ? "scale-150" : "scale-100"
            }`}
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-center px-6">
            <ImageOff className="w-10 h-10 text-slate-600 mb-3" />

            <p className="text-sm font-mono font-bold text-slate-300">
              Visualization unavailable
            </p>

            <p className="text-xs text-slate-500 mt-1 max-w-sm">
              This forensic layer could not be loaded for the current specimen.
            </p>

            {activeLayer !== "original" && originalUrl && (
              <button
                onClick={() => {
                  setActiveLayer("original");
                  setImageError(false);
                }}
                className="mt-3 px-3 py-1.5 rounded-lg text-xs font-mono font-bold text-forensic-cyan border border-forensic-cyan/30 hover:bg-forensic-cyan/10 transition-all"
              >
                View Original Media
              </button>
            )}
          </div>
        )}

        {/* Reticle / Crosshair Overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-40 group-hover:opacity-100 transition-opacity">
          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-forensic-cyan/60 m-3"></div>

          <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-forensic-cyan/60 m-3"></div>

          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-forensic-cyan/60 m-3"></div>

          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-forensic-cyan/60 m-3"></div>
        </div>

        {/* Scanline Effect on Forensic Layers */}
        {activeLayer !== "original" && !imageError && (
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-forensic-cyan/5 to-transparent h-16 w-full animate-scanline"></div>
        )}

        {/* Floating Metadata HUD */}
        <div className="absolute top-3 left-3 bg-obsidian-950/80 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/10 text-[10px] font-mono text-slate-300 flex items-center gap-2 pointer-events-none">
          <span className="w-1.5 h-1.5 rounded-full bg-forensic-cyan animate-pulse"></span>

          <span>LAYER: {activeLayer.toUpperCase()}</span>

          <span className="text-slate-500">|</span>

          <span>
            POS: {coords.x}%, {coords.y}%
          </span>
        </div>

        {/* Zoom Toggle Button */}
        <button
          onClick={() => setIsZoomed(!isZoomed)}
          className="absolute bottom-3 right-3 bg-obsidian-950/80 hover:bg-obsidian-850 p-2 rounded-lg border border-white/10 text-slate-300 hover:text-white transition-all"
          title={isZoomed ? "Zoom Out" : "Zoom In (1.5x)"}
        >
          <ZoomIn
            className={`w-4 h-4 ${isZoomed ? "text-forensic-cyan" : ""}`}
          />
        </button>
      </div>

      {/* Layer Context Callout */}
      <div className="mt-3 p-3 rounded-xl bg-obsidian-900/60 border border-obsidian-800 text-xs flex items-start gap-2.5">
        <HelpCircle className="w-4 h-4 text-forensic-cyan shrink-0 mt-0.5" />

        <div>
          <div className="font-mono text-[11px] text-forensic-cyan font-bold uppercase">
            {activeLayerData.badge} Insight
          </div>

          <p className="text-slate-300 text-xs mt-0.5">
            {activeLayerData.desc}
          </p>
        </div>
      </div>
    </div>
  );
}
