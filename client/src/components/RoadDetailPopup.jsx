import { X, AlertTriangle, MapPin, BarChart3, Info } from 'lucide-react';
import { formatPercent, getCriticalityColor } from '../utils/formatters';

export default function RoadDetailPopup({ road, onClose, position }) {
  if (!road) return null;

  const critColor = getCriticalityColor(road.criticalityLevel);

  return (
    <div
      className="absolute z-30 w-80 glass glass-highlight p-5 fade-slide-in"
      style={{
        left: Math.min(position?.x || 200, 320),
        top: Math.min(position?.y || 100, 250),
        borderRadius: 20
      }}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h4 className="text-sm font-semibold text-slate-100">{road.name}</h4>
          <span className="text-xs text-slate-500 capitalize">{road.roadType?.replace('_', ' ')}</span>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
        >
          <X size={14} className="text-slate-400" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="glass-subtle p-3">
          <div className="text-xs text-slate-500 mb-1 flex items-center gap-1">
            <BarChart3 size={10} /> Criticality
          </div>
          <div className="text-lg font-bold" style={{ color: critColor }}>
            {formatPercent(road.criticality)}
          </div>
        </div>
        <div className="glass-subtle p-3">
          <div className="text-xs text-slate-500 mb-1 flex items-center gap-1">
            <AlertTriangle size={10} /> Blockage Risk
          </div>
          <div className="text-lg font-bold text-amber-400">
            {formatPercent(road.blockageProbability)}
          </div>
        </div>
        <div className="glass-subtle p-3">
          <div className="text-xs text-slate-500 mb-1 flex items-center gap-1">
            <MapPin size={10} /> Wards Affected
          </div>
          <div className="text-lg font-bold text-slate-200">{road.affectedWards}</div>
        </div>
        <div className="glass-subtle p-3">
          <div className="text-xs text-slate-500 mb-1 flex items-center gap-1">
            <Info size={10} /> Confidence
          </div>
          <div className="text-lg font-bold text-sky-400">{formatPercent(road.confidence)}</div>
        </div>
      </div>

      {road.explanation && road.explanation.length > 0 && (
        <div className="space-y-1.5">
          <div className="text-xs font-medium text-slate-400 mb-1">Analysis</div>
          {road.explanation.map((item, i) => (
            <div key={i} className="flex items-start gap-2 text-xs text-slate-400">
              <span className="mt-1 w-1 h-1 rounded-full bg-sky-400 flex-shrink-0" />
              {item}
            </div>
          ))}
        </div>
      )}

      <div className="text-xs text-slate-600 mt-3 flex items-center gap-1">
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400/50" />
        Population affected: {road.populationAffected?.toLocaleString()}
      </div>
    </div>
  );
}
