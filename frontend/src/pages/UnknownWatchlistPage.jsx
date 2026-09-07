import React, { useState, useEffect } from "react";
import {
  AlertTriangle,
  TrendingUp,
  Activity,
  ShieldAlert,
  Dna,
  Cpu,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Search,
  Filter,
  Layers,
  Database,
  RefreshCw,
  Eye,
  Clock,
  CircleDot,
} from "lucide-react";

import { fetchUnknownClusters, promoteCluster } from "../services/api";

export default function UnknownWatchlistPage({ onSelectAnalysis }) {
  const [clusters, setClusters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [promotingId, setPromotingId] = useState(null);
  const [promotedClusters, setPromotedClusters] = useState({});
  const [feedbackMsg, setFeedbackMsg] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // =========================================================
  // LOAD UNKNOWN CLUSTERS
  // =========================================================

  const loadClusters = async (showRefresh = false) => {
    if (showRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const data = await fetchUnknownClusters();

      const receivedClusters = Array.isArray(data?.clusters)
        ? data.clusters
        : [];

      setClusters(receivedClusters);
    } catch (err) {
      console.error("Error fetching unknown clusters:", err);

      setClusters([]);

      setFeedbackMsg("Unable to load the unknown-generator watchlist.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadClusters();
  }, []);

  // =========================================================
  // PROMOTE CLUSTER
  // =========================================================

  const handlePromote = async (cluster) => {
    if (!cluster?.id) return;

    setPromotingId(cluster.id);
    setFeedbackMsg(null);

    try {
      const title = cluster.title || cluster.cluster_code || cluster.id;

      const res = await promoteCluster(
        cluster.id,
        `${title} (Registry Promoted)`,
      );

      setPromotedClusters((prev) => ({
        ...prev,
        [cluster.id]: true,
      }));

      setFeedbackMsg(
        res?.message ||
          `${cluster.cluster_code || cluster.id} promoted successfully.`,
      );

      await loadClusters();
    } catch (err) {
      console.error("Promote failed:", err);

      setFeedbackMsg("Promotion failed: " + (err?.message || "Unknown error"));
    } finally {
      setPromotingId(null);
    }
  };

  // =========================================================
  // FILTER CLUSTERS
  // =========================================================

  const filteredClusters = clusters.filter((cluster) => {
    const query = searchTerm.trim().toLowerCase();

    const matchesSearch =
      !query ||
      String(cluster.cluster_code || "")
        .toLowerCase()
        .includes(query) ||
      String(cluster.title || "")
        .toLowerCase()
        .includes(query) ||
      String(cluster.status || "")
        .toLowerCase()
        .includes(query);

    const normalizedStatus = String(cluster.status || "").toUpperCase();

    const matchesStatus =
      statusFilter === "ALL" || normalizedStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // =========================================================
  // DERIVED SUMMARY
  // =========================================================

  const emergingCount = clusters.filter(
    (cluster) => String(cluster.status || "").toUpperCase() === "EMERGING",
  ).length;

  const recurringCount = clusters.filter(
    (cluster) => String(cluster.status || "").toUpperCase() === "RECURRING",
  ).length;

  const totalSamples = clusters.reduce(
    (total, cluster) =>
      total + Number(cluster.sample_count || cluster.samples_in_cluster || 0),
    0,
  );

  // Highest-priority cluster
  const primaryCluster =
    [...clusters].sort((a, b) => {
      const aSamples = Number(a.sample_count || a.samples_in_cluster || 0);

      const bSamples = Number(b.sample_count || b.samples_in_cluster || 0);

      const aConsistency = Number(a.pattern_consistency || 0);

      const bConsistency = Number(b.pattern_consistency || 0);

      return bConsistency + bSamples / 100 - (aConsistency + aSamples / 100);
    })[0] || null;

  // =========================================================
  // STATUS HELPERS
  // =========================================================

  const getDisplayStatus = (cluster) => {
    const status = String(cluster?.status || "UNREGISTERED").toUpperCase();

    if (status.includes("EMERGING")) {
      return "EMERGING";
    }

    if (status.includes("RECURRING")) {
      return "RECURRING";
    }

    if (status.includes("NEW") || status.includes("UNREGISTERED")) {
      return "NEW";
    }

    return status;
  };

  const getStatusClasses = (status) => {
    switch (status) {
      case "EMERGING":
        return "bg-rose-950 text-rose-300 border-rose-800";

      case "RECURRING":
        return "bg-amber-950 text-amber-300 border-amber-800";

      case "NEW":
        return "bg-slate-900 text-slate-300 border-slate-700";

      default:
        return "bg-slate-900 text-slate-300 border-slate-700";
    }
  };

  // =========================================================
  // EMPTY / LOADING STATE
  // =========================================================

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-xs font-mono text-amber-400 font-bold mb-2">
            <AlertTriangle className="w-3.5 h-3.5" />
            SYNTHETIC MEDIA RADAR
          </div>

          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Unknown Generator Watchlist
          </h2>

          <p className="text-slate-400 text-sm mt-2">
            Loading recurring forensic Media DNA patterns...
          </p>
        </div>

        <div className="glass-panel rounded-3xl p-12 border border-obsidian-750 flex flex-col items-center justify-center">
          <div className="w-12 h-12 border-4 border-slate-700 border-t-amber-400 rounded-full animate-spin" />

          <p className="text-slate-400 text-sm mt-5 font-mono">
            ANALYZING UNKNOWN PATTERNS...
          </p>
        </div>
      </div>
    );
  }

  // =========================================================
  // MAIN UI
  // =========================================================

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* ===================================================
          HEADER
      =================================================== */}

      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-xs font-mono text-amber-400 font-bold mb-2">
            <AlertTriangle className="w-3.5 h-3.5" />
            SYNTHETIC MEDIA RADAR
          </div>

          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Unknown Generator Watchlist
          </h2>

          <p className="text-slate-400 text-xs sm:text-sm mt-2 max-w-3xl leading-relaxed">
            Tracking recurring forensic Media DNA patterns that do not
            sufficiently match the current known-generator registry.
          </p>
        </div>

        {/* SUMMARY */}

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <div className="bg-obsidian-900 border border-obsidian-750 rounded-xl px-4 py-3">
            <div className="text-[10px] text-slate-500 uppercase font-mono">
              Clusters
            </div>

            <div className="text-xl font-black text-white">
              {clusters.length}
            </div>
          </div>

          <div className="bg-obsidian-900 border border-obsidian-750 rounded-xl px-4 py-3">
            <div className="text-[10px] text-slate-500 uppercase font-mono">
              Samples
            </div>

            <div className="text-xl font-black text-white">
              {totalSamples.toLocaleString()}
            </div>
          </div>

          <div className="bg-obsidian-900 border border-obsidian-750 rounded-xl px-4 py-3">
            <div className="text-[10px] text-slate-500 uppercase font-mono">
              Recurring
            </div>

            <div className="text-xl font-black text-amber-400">
              {recurringCount}
            </div>
          </div>

          <div className="bg-obsidian-900 border border-obsidian-750 rounded-xl px-4 py-3">
            <div className="text-[10px] text-slate-500 uppercase font-mono">
              Emerging
            </div>

            <div className="text-xl font-black text-rose-400">
              {emergingCount}
            </div>
          </div>
        </div>
      </div>

      {/* ===================================================
          FEEDBACK
      =================================================== */}

      {feedbackMsg && (
        <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-xs font-mono text-emerald-300 flex items-center gap-3 shadow-glow-emerald">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />

          <span className="flex-1">{feedbackMsg}</span>

          <button
            onClick={() => setFeedbackMsg(null)}
            className="text-emerald-500 hover:text-white"
          >
            ×
          </button>
        </div>
      )}

      {/* ===================================================
          SEARCH + FILTER
      =================================================== */}

      <div className="glass-panel rounded-2xl p-4 border border-obsidian-750">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />

            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search cluster ID, pattern, or status..."
              className="w-full bg-obsidian-950 border border-obsidian-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-slate-600 outline-none focus:border-amber-500/50"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-500" />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-obsidian-950 border border-obsidian-800 rounded-xl px-4 py-3 text-sm text-slate-300 outline-none"
            >
              <option value="ALL">All Status</option>

              <option value="EMERGING">Emerging</option>

              <option value="RECURRING">Recurring</option>

              <option value="NEW">New</option>
            </select>

            <button
              onClick={() => loadClusters(true)}
              disabled={refreshing}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-obsidian-900 border border-obsidian-800 text-slate-300 hover:text-white hover:border-slate-600 transition"
            >
              <RefreshCw
                className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
              />

              <span className="hidden sm:inline text-xs font-mono">
                Refresh
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* ===================================================
          NO CLUSTERS
      =================================================== */}

      {clusters.length === 0 ? (
        <div className="glass-panel rounded-3xl p-12 border border-obsidian-750 text-center">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <ShieldAlert className="w-8 h-8 text-emerald-400" />
          </div>

          <h3 className="text-xl font-bold text-white mt-5">
            No Unknown Patterns Detected
          </h3>

          <p className="text-sm text-slate-400 max-w-xl mx-auto mt-2">
            TRUVENA has not observed a recurring unknown Media DNA pattern yet.
            Analyze additional synthetic specimens to populate this watchlist.
          </p>
        </div>
      ) : (
        <>
          {/* =================================================
              PRIMARY CLUSTER
          ================================================= */}

          {primaryCluster && (
            <div className="glass-panel-danger rounded-3xl p-6 sm:p-8 border border-rose-500/30 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* MAIN INFO */}

                <div className="lg:col-span-2 space-y-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-rose-950 text-rose-300 border border-rose-800">
                      <ShieldAlert className="inline w-3.5 h-3.5 mr-1" />
                      PRIORITY PATTERN
                    </span>

                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-mono font-bold border ${getStatusClasses(
                        getDisplayStatus(primaryCluster),
                      )}`}
                    >
                      {getDisplayStatus(primaryCluster)}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold text-white font-mono">
                      {primaryCluster.cluster_code || primaryCluster.id}
                    </h3>

                    <div className="text-sm font-semibold text-slate-300 mt-1">
                      {primaryCluster.title || "Unregistered forensic pattern"}
                    </div>
                  </div>

                  <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
                    {primaryCluster.explanation ||
                      "This Media DNA pattern does not sufficiently match the current known generator registry and is being monitored for recurrence."}
                  </p>

                  {/* METRICS */}

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-4 rounded-xl bg-obsidian-950/80 border border-obsidian-800">
                      <div className="flex items-center gap-2 text-[10px] text-slate-500 uppercase font-mono">
                        <Database className="w-3.5 h-3.5" />
                        Samples
                      </div>

                      <div className="text-xl font-black text-white mt-2">
                        {Number(
                          primaryCluster.sample_count ||
                            primaryCluster.samples_in_cluster ||
                            0,
                        ).toLocaleString()}
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-obsidian-950/80 border border-obsidian-800">
                      <div className="flex items-center gap-2 text-[10px] text-slate-500 uppercase font-mono">
                        <Activity className="w-3.5 h-3.5" />
                        Consistency
                      </div>

                      <div className="text-xl font-black text-emerald-400 mt-2">
                        {Number(
                          primaryCluster.pattern_consistency || 0,
                        ).toFixed(1)}
                        %
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-obsidian-950/80 border border-obsidian-800">
                      <div className="flex items-center gap-2 text-[10px] text-slate-500 uppercase font-mono">
                        <Dna className="w-3.5 h-3.5" />
                        Novelty
                      </div>

                      <div className="text-xl font-black text-amber-400 mt-2">
                        {Number(
                          primaryCluster.media_dna_novelty ||
                            primaryCluster.novelty ||
                            0,
                        ).toFixed(0)}
                        %
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-obsidian-950/80 border border-obsidian-800">
                      <div className="flex items-center gap-2 text-[10px] text-slate-500 uppercase font-mono">
                        <Cpu className="w-3.5 h-3.5" />
                        Registry Match
                      </div>

                      <div className="text-xl font-black text-slate-400 mt-2">
                        {Number(
                          primaryCluster.known_generator_match ||
                            primaryCluster.dna_match ||
                            0,
                        ).toFixed(0)}
                        %
                      </div>
                    </div>
                  </div>
                </div>

                {/* ACTION */}

                <div className="p-6 rounded-2xl bg-obsidian-950/80 border border-obsidian-750 flex flex-col justify-between">
                  <div>
                    <div className="text-xs font-mono font-bold text-slate-300 uppercase mb-2">
                      Adaptive Registry
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed">
                      Repeated unknown patterns can be reviewed and promoted
                      into the known-generator registry after forensic
                      validation.
                    </p>
                  </div>

                  <div className="space-y-3 mt-6">
                    <button
                      onClick={() => handlePromote(primaryCluster)}
                      disabled={
                        promotingId === primaryCluster.id ||
                        promotedClusters[primaryCluster.id]
                      }
                      className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-mono font-bold transition-all ${
                        promotedClusters[primaryCluster.id]
                          ? "bg-emerald-950 text-emerald-300 border border-emerald-500/40"
                          : "bg-gradient-to-r from-amber-500 to-rose-500 text-obsidian-950 hover:brightness-110"
                      }`}
                    >
                      {promotingId === primaryCluster.id ? (
                        <>
                          <span className="w-3.5 h-3.5 border-2 border-obsidian-950 border-t-transparent rounded-full animate-spin" />
                          Reviewing Pattern...
                        </>
                      ) : promotedClusters[primaryCluster.id] ? (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          Promoted to Registry
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          Promote to Registry
                        </>
                      )}
                    </button>

                    {primaryCluster.analysis_id && (
                      <button
                        onClick={() =>
                          onSelectAnalysis(primaryCluster.analysis_id)
                        }
                        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-mono text-slate-300 bg-obsidian-850 hover:bg-obsidian-800 border border-slate-700"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Inspect Specimen
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =================================================
              CLUSTER PIPELINE
          ================================================= */}

          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
                <Layers className="w-4 h-4 text-forensic-cyan" />
                ACTIVE UNKNOWN PATTERN PIPELINE
              </h3>

              <div className="text-xs text-slate-500 font-mono">
                {filteredClusters.length} of {clusters.length} clusters shown
              </div>
            </div>

            {filteredClusters.length === 0 ? (
              <div className="glass-panel rounded-2xl p-8 text-center border border-obsidian-750">
                <Search className="w-6 h-6 text-slate-600 mx-auto" />

                <p className="text-sm text-slate-400 mt-3">
                  No clusters match your filter.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {filteredClusters.map((cluster) => {
                  const status = getDisplayStatus(cluster);

                  const sampleCount = Number(
                    cluster.sample_count || cluster.samples_in_cluster || 0,
                  );

                  const consistency = Number(cluster.pattern_consistency || 0);

                  const isPromoted = !!promotedClusters[cluster.id];

                  return (
                    <div
                      key={cluster.id}
                      className="glass-panel rounded-2xl p-5 border border-obsidian-750 flex flex-col justify-between group hover:border-slate-600 transition-all"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <span
                            className={`px-2 py-1 rounded text-[10px] font-mono font-bold border ${getStatusClasses(
                              status,
                            )}`}
                          >
                            {status}
                          </span>

                          {cluster.growth_rate && (
                            <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                              <TrendingUp className="w-3 h-3" />
                              {cluster.growth_rate}
                            </span>
                          )}
                        </div>

                        <h4 className="text-lg font-bold text-white font-mono">
                          {cluster.cluster_code || cluster.id}
                        </h4>

                        <div className="text-xs font-semibold text-slate-300 mt-1">
                          {cluster.title || "Unregistered forensic pattern"}
                        </div>

                        {/* METRICS */}

                        <div className="grid grid-cols-2 gap-2 mt-5">
                          <div className="p-3 rounded-xl bg-obsidian-950 border border-obsidian-800">
                            <div className="text-[10px] text-slate-500 uppercase font-mono">
                              Samples
                            </div>

                            <div className="text-base font-black text-white mt-1">
                              {sampleCount.toLocaleString()}
                            </div>
                          </div>

                          <div className="p-3 rounded-xl bg-obsidian-950 border border-obsidian-800">
                            <div className="text-[10px] text-slate-500 uppercase font-mono">
                              Consistency
                            </div>

                            <div className="text-base font-black text-emerald-400 mt-1">
                              {consistency.toFixed(1)}%
                            </div>
                          </div>
                        </div>

                        {/* CONSISTENCY BAR */}

                        <div className="mt-4">
                          <div className="flex items-center justify-between text-[10px] font-mono mb-1.5">
                            <span className="text-slate-500">
                              PATTERN STABILITY
                            </span>

                            <span className="text-slate-400">
                              {consistency.toFixed(0)}%
                            </span>
                          </div>

                          <div className="h-1.5 bg-obsidian-900 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full bg-emerald-400 transition-all"
                              style={{
                                width: `${Math.min(
                                  100,
                                  Math.max(0, consistency),
                                )}%`,
                              }}
                            />
                          </div>
                        </div>

                        <p className="text-xs text-slate-400 mt-4 leading-relaxed">
                          {cluster.explanation ||
                            "Forensic pattern currently monitored as an unidentified Media DNA signature."}
                        </p>
                      </div>

                      {/* ACTIONS */}

                      <div className="mt-6 pt-4 border-t border-obsidian-800 flex items-center justify-between gap-3">
                        <button
                          onClick={() => handlePromote(cluster)}
                          disabled={promotingId === cluster.id || isPromoted}
                          className="text-xs font-mono text-forensic-cyan hover:underline flex items-center gap-1 font-bold disabled:opacity-50"
                        >
                          {isPromoted ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                              Promoted
                            </>
                          ) : promotingId === cluster.id ? (
                            <>
                              <RefreshCw className="w-3 h-3 animate-spin" />
                              Reviewing...
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-3.5 h-3.5" />
                              Promote
                            </>
                          )}
                        </button>

                        {cluster.analysis_id ? (
                          <button
                            onClick={() =>
                              onSelectAnalysis(cluster.analysis_id)
                            }
                            className="text-xs font-mono text-slate-400 hover:text-white flex items-center gap-1"
                          >
                            <Eye className="w-3 h-3" />
                            Examine
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        ) : (
                          <span className="text-[10px] text-slate-600 font-mono">
                            NO DOSSIER LINK
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}

      {/* ===================================================
          FOOTER EXPLANATION
      =================================================== */}

      <div className="glass-panel rounded-2xl p-5 border border-obsidian-750">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-forensic-cyan/10 border border-forensic-cyan/20 flex items-center justify-center shrink-0">
            <Dna className="w-4 h-4 text-forensic-cyan" />
          </div>

          <div>
            <h4 className="text-sm font-bold text-white">
              How TRUVENA identifies emerging patterns
            </h4>

            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Each escalated unknown specimen is compared against previously
              observed unknown Media DNA fingerprints. Highly similar specimens
              are grouped into the same cluster. Recurring clusters can then be
              reviewed for potential promotion into the known-generator
              registry.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
