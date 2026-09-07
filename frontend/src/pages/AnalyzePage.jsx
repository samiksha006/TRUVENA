import React, { useEffect, useRef, useState } from "react";
import {
  Upload,
  CloudUpload,
  Loader2,
  ShieldCheck,
  ShieldAlert,
  Layers3,
  Sparkles,
  Image as ImageIcon,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export default function AnalyzePage({ onAnalysisComplete, onSelectSample }) {
  const fileInputRef = useRef(null);

  const [samples, setSamples] = useState([]);
  const [loadingSamples, setLoadingSamples] = useState(true);
  const [samplesError, setSamplesError] = useState("");

  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState("");

  const [analyzing, setAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState("");

  // =========================================================
  // LOAD DEMO SAMPLES
  // =========================================================

  const loadSamples = async () => {
    try {
      setLoadingSamples(true);
      setSamplesError("");

      const response = await fetch(`${API_BASE_URL}/api/samples`);

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();

      if (!data || !Array.isArray(data.samples)) {
        throw new Error("Invalid response received from /api/samples");
      }

      setSamples(data.samples);
    } catch (error) {
      console.error("Failed to load demo samples:", error);

      setSamplesError(
        "Demo specimens could not be loaded. Make sure the TRUVENA backend is running on port 8000.",
      );
    } finally {
      setLoadingSamples(false);
    }
  };

  useEffect(() => {
    loadSamples();
  }, []);

  // =========================================================
  // FILE VALIDATION
  // =========================================================

  const validateImageFile = (file) => {
    if (!file) {
      return false;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/bmp",
      "image/tiff",
    ];

    if (!allowedTypes.includes(file.type)) {
      setAnalysisError(
        "Unsupported image format. Please upload JPG, JPEG, PNG, WEBP, BMP or TIFF.",
      );

      return false;
    }

    if (file.size > 25 * 1024 * 1024) {
      setAnalysisError("The image is larger than the 25MB limit.");

      return false;
    }

    return true;
  };

  // =========================================================
  // FILE SELECTION
  // =========================================================

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setAnalysisError("");

    if (!validateImageFile(file)) {
      return;
    }

    setSelectedFile(file);

    const previewUrl = URL.createObjectURL(file);

    setPreview(previewUrl);
  };

  // =========================================================
  // DRAG & DROP
  // =========================================================

  const handleDrop = (event) => {
    event.preventDefault();

    const file = event.dataTransfer.files?.[0];

    if (!file) {
      return;
    }

    setAnalysisError("");

    if (!validateImageFile(file)) {
      return;
    }

    setSelectedFile(file);

    const previewUrl = URL.createObjectURL(file);

    setPreview(previewUrl);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  // =========================================================
  // OPEN FORENSIC REPORT
  // =========================================================

  const openReport = (report) => {
    if (!report) {
      setAnalysisError("The backend returned an empty forensic report.");

      return;
    }

    console.log("TRUVENA final forensic report:", report);

    // Store latest report for recovery/refresh
    sessionStorage.setItem("truvena_latest_report", JSON.stringify(report));

    /*
     * IMPORTANT:
     *
     * Do NOT use react-router here.
     *
     * App.jsx controls navigation using:
     *
     * setCurrentReport(report)
     * setActiveTab("report")
     *
     * onAnalysisComplete connects this page to App.jsx.
     */

    if (typeof onAnalysisComplete === "function") {
      onAnalysisComplete(report);

      return;
    }

    /*
     * Fallback for safety.
     */

    if (typeof onSelectSample === "function") {
      onSelectSample(report);

      return;
    }

    console.error("No navigation callback was provided to AnalyzePage.");
  };

  // =========================================================
  // ANALYZE USER IMAGE
  // =========================================================

  const analyzeUploadedImage = async () => {
    if (!selectedFile) {
      setAnalysisError("Please choose an image first.");

      return;
    }

    try {
      setAnalyzing(true);
      setAnalysisError("");

      const formData = new FormData();

      formData.append("file", selectedFile);

      console.log("TRUVENA analyzing uploaded image...");

      const response = await fetch(`${API_BASE_URL}/api/analyze`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      console.log("Uploaded image analysis response:", data);

      if (!response.ok) {
        throw new Error(data?.detail || "Image analysis failed.");
      }

      openReport(data);
    } catch (error) {
      console.error("Upload analysis error:", error);

      setAnalysisError(error?.message || "Unable to analyze the image.");
    } finally {
      setAnalyzing(false);
    }
  };

  // =========================================================
  // ANALYZE DEMO SPECIMEN
  // =========================================================

  const analyzeDemoSample = async (sample) => {
    if (!sample?.id) {
      setAnalysisError("This demo specimen does not have a valid sample ID.");

      return;
    }

    try {
      setAnalyzing(true);
      setAnalysisError("");

      const formData = new FormData();

      /*
       * Backend accepts both:
       *
       * sample_id
       * selected_sample_id
       *
       * Use sample_id because it matches the API helper
       * and is the primary field.
       */

      formData.append("sample_id", sample.id);

      console.log("TRUVENA analyzing demo specimen:", sample.id);

      const response = await fetch(`${API_BASE_URL}/api/analyze`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      console.log("Demo specimen analysis response:", data);

      if (!response.ok) {
        throw new Error(
          data?.detail || `Demo specimen analysis failed (${response.status})`,
        );
      }

      if (!data) {
        throw new Error("The backend returned an empty analysis report.");
      }

      openReport(data);
    } catch (error) {
      console.error("Demo specimen analysis error:", error);

      setAnalysisError(error?.message || "Demo specimen cannot be loaded.");
    } finally {
      setAnalyzing(false);
    }
  };

  // =========================================================
  // CLEAR UPLOAD
  // =========================================================

  const clearUpload = () => {
    setSelectedFile(null);
    setPreview("");
    setAnalysisError("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // =========================================================
  // HELPERS
  // =========================================================

  const getClassificationStyle = (classification) => {
    if (classification === "AI Generated") {
      return {
        icon: <ShieldAlert size={18} />,
        className: "text-red-400",
      };
    }

    if (classification === "Likely Real") {
      return {
        icon: <ShieldCheck size={18} />,
        className: "text-emerald-400",
      };
    }

    return {
      icon: <AlertTriangle size={18} />,
      className: "text-yellow-400",
    };
  };

  const getSampleColor = (classification) => {
    if (classification === "AI Generated") {
      return "border-red-500/20";
    }

    if (classification === "Likely Real") {
      return "border-emerald-500/20";
    }

    return "border-yellow-500/20";
  };

  // =========================================================
  // JSX
  // =========================================================

  return (
    <div className="min-h-screen bg-[#05070b] text-white">
      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* =================================================
            HEADER
        ================================================= */}

        <section className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-5 rounded-full border border-cyan-500/30 bg-cyan-500/5 text-cyan-400 text-sm font-semibold">
            <Sparkles size={16} />
            TRUVENA TRUST INTELLIGENCE
          </div>

          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Check if an image is{" "}
            <span className="text-cyan-400">AI-generated</span>
          </h1>

          <p className="mt-4 max-w-3xl mx-auto text-slate-400 text-lg">
            Upload an image and TRUVENA will examine its visual evidence,
            provenance, Media DNA, and known generator patterns to assess its
            authenticity.
          </p>
        </section>

        {/* =================================================
            ERROR
        ================================================= */}

        {analysisError && (
          <div className="mb-6 p-4 rounded-xl border border-red-500/30 bg-red-500/10 flex items-start gap-3">
            <AlertTriangle size={20} className="text-red-400 mt-0.5" />

            <div>
              <p className="font-semibold text-red-300">Analysis Error</p>

              <p className="text-sm text-red-200/80 mt-1">{analysisError}</p>
            </div>
          </div>
        )}

        {/* =================================================
            UPLOAD
        ================================================= */}

        <section className="bg-[#0b0f17] border border-slate-800 rounded-3xl p-6 md:p-10 mb-14">
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="border-2 border-dashed border-cyan-500/50 rounded-2xl min-h-[400px] flex flex-col items-center justify-center text-center px-6 transition hover:border-cyan-400"
          >
            {preview ? (
              <div className="w-full max-w-2xl">
                <div className="relative rounded-xl overflow-hidden border border-slate-700 bg-black">
                  <img
                    src={preview}
                    alt="Selected media preview"
                    className="max-h-[320px] w-full object-contain"
                  />
                </div>

                <div className="mt-5 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={analyzeUploadedImage}
                    disabled={analyzing}
                    className="px-7 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-black font-bold flex items-center gap-2 disabled:opacity-50"
                  >
                    {analyzing ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <ShieldCheck size={18} />
                        Analyze Image
                      </>
                    )}
                  </button>

                  <button
                    onClick={clearUpload}
                    disabled={analyzing}
                    className="px-6 py-3 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800"
                  >
                    Choose Another
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="w-24 h-24 rounded-2xl border border-slate-700 bg-[#0d1320] flex items-center justify-center mb-7">
                  <CloudUpload size={42} className="text-cyan-400" />
                </div>

                <h2 className="text-2xl font-bold">Upload an image</h2>

                <p className="mt-3 text-slate-400 text-lg">
                  Drag and drop your image here, or choose a file
                </p>

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-7 px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-bold text-lg flex items-center gap-2"
                >
                  <Upload size={20} />
                  Choose Image
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".png,.jpg,.jpeg,.webp,.bmp,.tiff,.tif,image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <p className="mt-5 text-sm text-slate-500">
                  PNG, JPG, JPEG, WebP or TIFF • Up to 25MB
                </p>
              </>
            )}
          </div>
        </section>

        {/* =================================================
            DEMO SPECIMENS
        ================================================= */}

        <section>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-7">
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl border border-cyan-500/30 bg-cyan-500/10 flex items-center justify-center">
                <Layers3 size={22} className="text-cyan-400" />
              </div>

              <div>
                <h2 className="text-2xl font-bold">Try a demo specimen</h2>

                <p className="text-slate-400 mt-1">
                  Use these prepared examples to see how TRUVENA handles
                  different types of media.
                </p>
              </div>
            </div>

            <button
              onClick={loadSamples}
              disabled={loadingSamples || analyzing}
              className="self-start md:self-auto px-4 py-2 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 flex items-center gap-2"
            >
              <RefreshCw
                size={16}
                className={loadingSamples ? "animate-spin" : ""}
              />
              Refresh
            </button>
          </div>

          {/* =================================================
              LOADING SAMPLES
          ================================================= */}

          {loadingSamples && (
            <div className="py-20 flex flex-col items-center justify-center">
              <Loader2 size={36} className="animate-spin text-cyan-400" />

              <p className="mt-4 text-slate-400">Loading demo specimens...</p>
            </div>
          )}

          {/* =================================================
              SAMPLE ERROR
          ================================================= */}

          {!loadingSamples && samplesError && (
            <div className="rounded-2xl border border-red-500/30 bg-red-500/5 p-8 text-center">
              <AlertTriangle size={35} className="mx-auto text-red-400" />

              <h3 className="mt-4 text-xl font-bold">
                Demo specimens unavailable
              </h3>

              <p className="mt-2 text-slate-400">{samplesError}</p>

              <button
                onClick={loadSamples}
                className="mt-5 px-5 py-2.5 rounded-lg bg-cyan-500 text-black font-semibold"
              >
                Try Again
              </button>
            </div>
          )}

          {/* =================================================
              NO SAMPLES
          ================================================= */}

          {!loadingSamples && !samplesError && samples.length === 0 && (
            <div className="rounded-2xl border border-slate-800 bg-[#0b0f17] p-10 text-center">
              <ImageIcon size={40} className="mx-auto text-slate-500" />

              <h3 className="mt-4 text-xl font-bold">
                No demo specimens found
              </h3>

              <p className="mt-2 text-slate-400">
                The backend returned an empty specimen list.
              </p>
            </div>
          )}

          {/* =================================================
              SAMPLE CARDS
          ================================================= */}

          {!loadingSamples && !samplesError && samples.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {samples.map((sample) => {
                const classificationStyle = getClassificationStyle(
                  sample.classification,
                );

                return (
                  <div
                    key={sample.id}
                    className={`rounded-2xl border ${getSampleColor(
                      sample.classification,
                    )} bg-[#0b0f17] p-6 hover:bg-[#0d121c] transition`}
                  >
                    {/* Card top */}

                    <div className="flex items-start justify-between gap-4">
                      <div className="w-11 h-11 rounded-xl bg-slate-800 flex items-center justify-center">
                        <ImageIcon size={21} className="text-cyan-400" />
                      </div>

                      <span
                        className={`text-xs px-3 py-1.5 rounded-full border ${
                          sample.classification === "AI Generated"
                            ? "border-red-500/30 bg-red-500/10 text-red-400"
                            : sample.classification === "Likely Real"
                              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                              : "border-yellow-500/30 bg-yellow-500/10 text-yellow-400"
                        }`}
                      >
                        {sample.classification}
                      </span>
                    </div>

                    {/* Title */}

                    <h3 className="mt-5 text-xl font-bold">{sample.name}</h3>

                    <p className="mt-2 text-sm text-slate-400 leading-relaxed min-h-[60px]">
                      {sample.description}
                    </p>

                    {/* Generator */}

                    <div className="mt-5 grid grid-cols-2 gap-3">
                      <div className="rounded-lg bg-black/30 border border-slate-800 p-3">
                        <p className="text-xs text-slate-500">
                          Likely Generator
                        </p>

                        <p className="mt-1 text-sm font-semibold text-cyan-400">
                          {sample.likely_generator || "UNKNOWN"}
                        </p>
                      </div>

                      <div className="rounded-lg bg-black/30 border border-slate-800 p-3">
                        <p className="text-xs text-slate-500">AI Signal</p>

                        <p className="mt-1 text-sm font-semibold">
                          {sample.classifier_ai_probability ??
                            sample.ai_probability ??
                            0}
                          %
                        </p>
                      </div>
                    </div>

                    {/* Evidence */}

                    <div className="mt-4 flex items-center gap-2 text-sm">
                      <span className={classificationStyle.className}>
                        {classificationStyle.icon}
                      </span>

                      <span className="text-slate-400">Evidence:</span>

                      <span className="font-semibold">
                        {sample.evidence_level || "MEDIUM"}
                      </span>
                    </div>

                    {/* Analyze button */}

                    <button
                      onClick={() => analyzeDemoSample(sample)}
                      disabled={analyzing}
                      className="mt-6 w-full py-3 rounded-xl bg-slate-800 hover:bg-cyan-500 hover:text-black border border-slate-700 font-semibold flex items-center justify-center gap-2 transition disabled:opacity-50"
                    >
                      {analyzing ? (
                        <>
                          <Loader2 size={17} className="animate-spin" />
                          Analyzing specimen...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 size={17} />
                          Analyze Specimen
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* =================================================
            INFORMATION SECTION
        ================================================= */}

        <section className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="rounded-2xl border border-slate-800 bg-[#0b0f17] p-6">
            <ShieldCheck size={24} className="text-cyan-400" />

            <h3 className="mt-4 font-bold text-lg">Evidence-based analysis</h3>

            <p className="mt-2 text-sm text-slate-400 leading-relaxed">
              TRUVENA combines classifier signals, forensic image analysis,
              provenance checks, and Media DNA evidence.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-[#0b0f17] p-6">
            <Layers3 size={24} className="text-cyan-400" />

            <h3 className="mt-4 font-bold text-lg">Media DNA</h3>

            <p className="mt-2 text-sm text-slate-400 leading-relaxed">
              Images are represented using multiple forensic signal dimensions
              to compare them against known generator patterns.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-[#0b0f17] p-6">
            <ShieldAlert size={24} className="text-cyan-400" />

            <h3 className="mt-4 font-bold text-lg">
              Unknown generator detection
            </h3>

            <p className="mt-2 text-sm text-slate-400 leading-relaxed">
              When a specimen does not sufficiently match known generators,
              TRUVENA can track recurring unknown Media DNA patterns.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
