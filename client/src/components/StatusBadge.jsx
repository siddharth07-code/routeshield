import { AlertTriangle, AlertCircle, Shield, Eye } from 'lucide-react';
import { getStatusColor } from '../utils/formatters';

const statusConfig = {
  'NORMAL': { icon: Shield, label: 'Normal' },
  'WATCH': { icon: Eye, label: 'Watch' },
  'ELEVATED RISK': { icon: AlertTriangle, label: 'Elevated Risk' },
  'CRITICAL': { icon: AlertCircle, label: 'Critical' },
  'LOW': { icon: Shield, label: 'Low' },
  'MODERATE': { icon: Eye, label: 'Moderate' },
  'HIGH': { icon: AlertTriangle, label: 'High' },
};

export default function StatusBadge({ status, size = 'md' }) {
  const config = statusConfig[status] || statusConfig['NORMAL'];
  const Icon = config.icon;
  const color = getStatusColor(status);
  const isSm = size === 'sm';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full ${isSm ? 'px-2.5 py-0.5 text-xs' : 'px-3.5 py-1.5 text-xs'}`}
      style={{
        background: `${color}14`,
        border: `1px solid ${color}30`,
        color
      }}
    >
      <Icon size={isSm ? 12 : 14} />
      {config.label}
    </span>
  );
}
