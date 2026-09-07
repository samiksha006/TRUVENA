const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

// ============================================================
// GENERIC API HELPER
// ============================================================

async function apiRequest(endpoint, options = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, options);

  let data = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const message =
      data?.detail ||
      data?.message ||
      `API request failed with status ${response.status}`;

    throw new Error(message);
  }

  return data;
}

// ============================================================
// GET DEMO SPECIMENS
// ============================================================
//
// Backend endpoint:
// GET /api/samples
//
// If your backend returns:
// {
//   "samples": [...]
// }
//
// the frontend receives the same object.
//

export async function fetchSampleMedia() {
  return apiRequest("/api/samples");
}

// ============================================================
// ANALYZE MEDIA
// ============================================================
//
// Supports both:
//
// 1. Uploaded image
// 2. Demo specimen using sample_id
//
// Backend endpoint:
// POST /api/analyze
//
// Request:
// multipart/form-data
//
// file
// sample_id
//

export async function analyzeMedia({ file = null, sampleId = null } = {}) {
  const formData = new FormData();

  // Add uploaded file only when available
  if (file) {
    formData.append("file", file);
  }

  // Add sample ID only when available
  if (sampleId) {
    formData.append("sample_id", sampleId);
  }

  return apiRequest("/api/analyze", {
    method: "POST",
    body: formData,
  });
}

// ============================================================
// UNKNOWN CLUSTERS
// ============================================================

export async function fetchUnknownClusters() {
  return apiRequest("/api/unknown-clusters");
}

// ============================================================
// KNOWN GENERATORS
// ============================================================

export async function fetchGenerators() {
  return apiRequest("/api/generators");
}

// ============================================================
// GET ONE UNKNOWN CLUSTER
// ============================================================

export async function fetchUnknownCluster(clusterId) {
  if (!clusterId) {
    throw new Error("Cluster ID is required.");
  }

  return apiRequest(`/api/unknown-clusters/${encodeURIComponent(clusterId)}`);
}

// ============================================================
// PROMOTE UNKNOWN CLUSTER
// ============================================================

export async function promoteUnknownCluster(clusterId, customName = null) {
  if (!clusterId) {
    throw new Error("Cluster ID is required.");
  }

  const payload = {};

  if (customName && customName.trim()) {
    payload.custom_name = customName.trim();
  }

  return apiRequest(`/api/clusters/${encodeURIComponent(clusterId)}/promote`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}

// ============================================================
// HEALTH CHECK
// ============================================================

export async function checkBackendHealth() {
  try {
    const response = await fetch(`${API_BASE_URL}/docs`);

    return response.ok;
  } catch {
    return false;
  }
}

// ============================================================
// EXPORT API BASE URL
// ============================================================

export { API_BASE_URL };
