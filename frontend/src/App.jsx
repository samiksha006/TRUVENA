import React, { useState, useEffect } from "react";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import DashboardPage from "./pages/DashboardPage";
import AnalyzePage from "./pages/AnalyzePage";
import ForensicReportPage from "./pages/ForensicReportPage";
import GeneratorIntelligencePage from "./pages/GeneratorIntelligencePage";
import UnknownWatchlistPage from "./pages/UnknownWatchlistPage";
import MediaDnaExplorerPage from "./pages/MediaDnaExplorerPage";
import AboutPage from "./pages/AboutPage";

import { fetchSampleMedia, analyzeMedia } from "./services/api";

export default function App() {
  // =========================================================
  // APPLICATION STATE
  // =========================================================

  const [activeTab, setActiveTab] = useState("dashboard");

  const [currentReport, setCurrentReport] = useState(null);

  const [sampleList, setSampleList] = useState([]);

  const [loadingInitial, setLoadingInitial] = useState(true);

  // =========================================================
  // LOAD DEMO SAMPLES
  // =========================================================

  useEffect(() => {
    let mounted = true;

    async function loadSamples() {
      try {
        const data = await fetchSampleMedia();

        if (!mounted) {
          return;
        }

        const samples = Array.isArray(data?.samples) ? data.samples : [];

        setSampleList(samples);

        /*
         * IMPORTANT:
         *
         * Do NOT automatically analyze a hard-coded sample ID here.
         *
         * Your backend currently uses:
         *
         * case_flux_001
         *
         * not:
         *
         * sample-flux-portrait
         *
         * The old hard-coded ID was causing unnecessary failures.
         */

        setLoadingInitial(false);
      } catch (error) {
        console.error("Unable to load TRUVENA demo samples:", error);

        if (mounted) {
          setSampleList([]);
          setLoadingInitial(false);
        }
      }
    }

    loadSamples();

    return () => {
      mounted = false;
    };
  }, []);

  // =========================================================
  // SELECT / ANALYZE A DEMO SAMPLE
  // =========================================================

  const handleSelectAnalysis = async (sampleId) => {
    if (!sampleId) {
      console.error("No sample ID provided.");
      return;
    }

    try {
      console.log("TRUVENA analyzing sample:", sampleId);

      const report = await analyzeMedia({
        sampleId: sampleId,
      });

      if (!report) {
        throw new Error("Backend returned an empty forensic report.");
      }

      setCurrentReport(report);

      setActiveTab("report");

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (error) {
      console.error("TRUVENA sample analysis failed:", error);

      /*
       * Keep the user on the current page rather than
       * breaking the entire application.
       */

      alert(
        error?.message ||
          "Unable to analyze this demo specimen. Please check that the TRUVENA backend is running.",
      );
    }
  };

  // =========================================================
  // CUSTOM IMAGE ANALYSIS COMPLETED
  // =========================================================

  const handleAnalysisComplete = (newReport) => {
    if (!newReport) {
      console.error("handleAnalysisComplete received empty report.");
      return;
    }

    console.log("TRUVENA analysis completed:", newReport);

    setCurrentReport(newReport);

    setActiveTab("report");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =========================================================
  // NAVIGATION HELPER
  // =========================================================

  const navigateTo = (tab) => {
    setActiveTab(tab);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div
      className="
        min-h-screen
        flex
        flex-col
        bg-obsidian-950
        text-slate-100
        bg-grid-pattern
        selection:bg-forensic-cyan/20
        selection:text-white
      "
    >
      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <Navbar
        activeTab={activeTab}
        setActiveTab={navigateTo}
        hasAnalysis={!!currentReport}
      />

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <main
        className="
          flex-1
          max-w-7xl
          w-full
          mx-auto
          px-4
          sm:px-6
          lg:px-8
          py-8
        "
      >
        {/* ===================================================
            DASHBOARD
        =================================================== */}

        {activeTab === "dashboard" && (
          <DashboardPage
            setActiveTab={navigateTo}
            onSelectAnalysis={handleSelectAnalysis}
          />
        )}

        {/* ===================================================
            ANALYZE MEDIA
        =================================================== */}

        {activeTab === "analyze" && (
          <AnalyzePage
            onAnalysisComplete={handleAnalysisComplete}
            onSelectSample={(sample) => {
              if (!sample) {
                return;
              }

              /*
               * If AnalyzePage sends the complete sample object,
               * analyze it through the backend using its ID.
               */

              if (sample.id) {
                handleSelectAnalysis(sample.id);

                return;
              }

              /*
               * Fallback:
               * If a complete report is supplied instead,
               * display it directly.
               */

              setCurrentReport(sample);

              setActiveTab("report");

              window.scrollTo({
                top: 0,
                behavior: "smooth",
              });
            }}
          />
        )}

        {/* ===================================================
            FORENSIC REPORT
        =================================================== */}

        {activeTab === "report" && (
          <ForensicReportPage
            report={currentReport}
            onBack={() => navigateTo("analyze")}
            onSelectCase={handleSelectAnalysis}
            sampleList={sampleList}
          />
        )}

        {/* ===================================================
            GENERATOR INTELLIGENCE
        =================================================== */}

        {activeTab === "generators" && (
          <GeneratorIntelligencePage onSelectAnalysis={handleSelectAnalysis} />
        )}

        {/* ===================================================
            UNKNOWN GENERATOR WATCHLIST
        =================================================== */}

        {activeTab === "watchlist" && (
          <UnknownWatchlistPage onSelectAnalysis={handleSelectAnalysis} />
        )}

        {/* ===================================================
            MEDIA DNA EXPLORER
        =================================================== */}

        {activeTab === "dna-explorer" && <MediaDnaExplorerPage />}

        {/* ===================================================
            ABOUT / HOW IT WORKS
        =================================================== */}

        {activeTab === "about" && <AboutPage />}
      </main>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <Footer />
    </div>
  );
}
