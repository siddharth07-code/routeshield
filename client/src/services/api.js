const API_BASE = '/api';

export async function fetchDashboard(scenario) {
  const res = await fetch(`${API_BASE}/dashboard?scenario=${scenario}`);
  if (!res.ok) throw new Error('Failed to fetch dashboard');
  return res.json();
}

export async function fetchRoads() {
  const res = await fetch(`${API_BASE}/roads`);
  if (!res.ok) throw new Error('Failed to fetch roads');
  return res.json();
}

export async function fetchRoadDetail(id) {
  const res = await fetch(`${API_BASE}/roads/${id}`);
  if (!res.ok) throw new Error('Failed to fetch road detail');
  return res.json();
}

export async function simulateBlockage(roadId, scenario, vehicleType) {
  const res = await fetch(`${API_BASE}/simulate-blockage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ roadId, scenario, vehicleType })
  });
  if (!res.ok) throw new Error('Failed to simulate blockage');
  return res.json();
}

export async function fetchEmergencyRoutes(vehicleType, scenario) {
  const res = await fetch(`${API_BASE}/emergency-routes?vehicleType=${vehicleType}&scenario=${scenario}`);
  if (!res.ok) throw new Error('Failed to fetch emergency routes');
  return res.json();
}

export async function fetchRecoveryPriorities(scenario) {
  const res = await fetch(`${API_BASE}/recovery-priorities?scenario=${scenario}`);
  if (!res.ok) throw new Error('Failed to fetch recovery priorities');
  return res.json();
}

export async function requestDroneInspection(roadId) {
  const res = await fetch(`${API_BASE}/drone-inspection`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ roadId })
  });
  if (!res.ok) throw new Error('Failed to request drone inspection');
  return res.json();
}
