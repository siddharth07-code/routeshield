import { X, AlertTriangle, MapPin, BarChart3, Info } from 'lucide-react';
import { formatPercent, getCriticalityColor } from '../utils/formatters';

export default function RoadDetailPopup({ road, onClose }) {
  if (!road) return null;

  const critColor = getCriticalityColor(road.criticalityLevel);

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div
        className="w-96 glass p-6 fade-slide-in relative"
        onClick={e => e.stopPropagation()}
        style={{
          borderRadius: 24,
          background: 'rgba(10, 14, 26, 0.92)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 24px 80px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.06)'
        }}
      >
        {/* Top highlight */}
        <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-sky-400/30 to-transparent" />

        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div>
            <h4 className="text-base font-semibold text-slate-100">{road.name}</h4>
            <span className="text-xs text-slate-500 capitalize">{road.roadType?.replace('_', ' ')}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/8 transition-all duration-200"
          >
            <X size={14} className="text-slate-400" />
          </button>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="glass-subtle p-3.5">
            <div className="text-xs text-slate-500 mb-1.5 flex items-center gap-1">
              <BarChart3 size={11} /> Criticality
            </div>
            <div className="text-xl font-bold" style={{ color: critColor }}>
              {formatPercent(road.criticality)}
            </div>
          </div>
          <div className="glass-subtle p-3.5">
            <div className="text-xs text-slate-500 mb-1.5 flex items-center gap-1">
              <AlertTriangle size={11} /> Blockage Risk
            </div>
            <div className="text-xl font-bold text-amber-400">
              {formatPercent(road.blockageProbability)}
            </div>
          </div>
          <div className="glass-subtle p-3.5">
            <div className="text-xs text-slate-500 mb-1.5 flex items-center gap-1">
              <MapPin size={11} /> Wards Affected
            </div>
            <div className="text-xl font-bold text-slate-200">{road.affectedWards}</div>
          </div>
          <div className="glass-subtle p-3.5">
            <div className="text-xs text-slate-500 mb-1.5 flex items-center gap-1">
              <Info size={11} /> Confidence
            </div>
            <div className="text-xl font-bold text-sky-400">{formatPercent(road.confidence)}</div>
          </div>
        </div>

        {/* Analysis */}
        {road.explanation && road.explanation.length > 0 && (
          <div className="space-y-2 mb-4">
            <div className="text-xs font-medium text-slate-400 mb-1.5">Analysis</div>
            {road.explanation.map((item, i) => (
              <div key={i} className="flex items-start gap-2.5 text-xs text-slate-400 leading-relaxed">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-sky-400 flex-shrink-0" />
                {item}
              </div>
            ))}
          </div>
        )}

        {/* Population */}
        <div className="text-xs text-slate-400 mt-3 pt-3 border-t border-white/5 flex items-center gap-2">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400/60" />
          Population affected: {road.populationAffected?.toLocaleString()}
        </div>
      </div>
    </div>
  );
}
