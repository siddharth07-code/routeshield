export function formatPercent(value) {
  return `${Math.round(value * 100)}%`;
}

export function formatNumber(num) {
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
}

export function getCriticalityColor(level) {
  const colors = {
    critical: '#f87171',
    high: '#fb923c',
    medium: '#facc15',
    low: '#4ade80'
  };
  return colors[level] || '#94a3b8';
}

export function getCriticalityBg(level) {
  const colors = {
    critical: 'rgba(248, 113, 113, 0.12)',
    high: 'rgba(251, 146, 60, 0.12)',
    medium: 'rgba(250, 204, 21, 0.12)',
    low: 'rgba(74, 222, 128, 0.12)'
  };
  return colors[level] || 'rgba(148, 163, 184, 0.12)';
}

export function getStatusColor(status) {
  const map = {
    'NORMAL': '#4ade80',
    'WATCH': '#facc15',
    'ELEVATED RISK': '#fb923c',
    'CRITICAL': '#f87171'
  };
  return map[status] || '#94a3b8';
}

export function getRiskColor(risk) {
  const map = {
    'LOW': '#4ade80',
    'MODERATE': '#facc15',
    'HIGH': '#fb923c',
    'CRITICAL': '#f87171'
  };
  return map[risk] || '#94a3b8';
}

export function getConfidenceColor(confidence) {
  if (confidence >= 0.8) return '#4ade80';
  if (confidence >= 0.65) return '#facc15';
  return '#f87171';
}
