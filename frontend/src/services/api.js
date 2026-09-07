const API_BASE = '/api';

export async function fetchDashboardStats() {
  const res = await fetch(`${API_BASE}/dashboard-stats`);
  if (!res.ok) throw new Error('Failed to fetch dashboard stats');
  return res.json();
}

export async function fetchGenerators() {
  const res = await fetch(`${API_BASE}/generators`);
  if (!res.ok) throw new Error('Failed to fetch generator registry');
  return res.json();
}

export async function fetchUnknownClusters() {
  const res = await fetch(`${API_BASE}/unknown-clusters`);
  if (!res.ok) throw new Error('Failed to fetch unknown clusters');
  return res.json();
}

export async function fetchSampleMedia() {
  const res = await fetch(`${API_BASE}/sample-media`);
  if (!res.ok) throw new Error('Failed to fetch sample media');
  return res.json();
}

export async function fetchAnalysis(analysisId) {
  const res = await fetch(`${API_BASE}/analysis/${analysisId}`);
  if (!res.ok) throw new Error(`Failed to fetch analysis dossier ${analysisId}`);
  return res.json();
}

export async function analyzeMedia({ file, sampleId }) {
  if (file) {
    const formData = new FormData();
    formData.append('file', file);
    if (sampleId) formData.append('sample_id', sampleId);
    
    const res = await fetch(`${API_BASE}/analyze`, {
      method: 'POST',
      body: formData
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Failed to analyze uploaded file');
    }
    return res.json();
  } else if (sampleId) {
    const res = await fetch(`${API_BASE}/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sample_id: sampleId })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Failed to analyze sample');
    }
    return res.json();
  } else {
    throw new Error('Must provide either a file or a sample ID');
  }
}

export async function promoteCluster(clusterId, customName) {
  const res = await fetch(`${API_BASE}/clusters/${clusterId}/promote`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ custom_name: customName })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Failed to promote cluster');
  }
  return res.json();
}