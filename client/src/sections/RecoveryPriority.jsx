import { useState, useEffect } from 'react';
import { ListOrdered, Send, MapPin, Users, Route, AlertTriangle, Info, CheckCircle2 } from 'lucide-react';
import { fetchRecoveryPriorities, requestDroneInspection } from '../services/api';
import { getCriticalityColor, formatPercent } from '../utils/formatters';
import GlassCard from '../components/GlassCard';
import GlassButton from '../components/GlassButton';
import GlassModal from '../components/GlassModal';
import SectionHeader from '../components/SectionHeader';

export default function RecoveryPriority({ scenario }) {
  const [priorities, setPriorities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [droneModal, setDroneModal] = useState(null);
  const [droneLoading, setDroneLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchRecoveryPriorities(scenario)
      .then(setPriorities)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [scenario]);

  const handleDroneInspection = async (roadId) => {
    setDroneLoading(true);
    try {
      const data = await requestDroneInspection(roadId);
      setDroneModal(data);
    } catch (err) {
      console.error(err);
    } finally {
      setDroneLoading(false);
    }
  };

  const getImpactColor = (impact) => {
    const map = { 'Severe': '#f87171', 'High': '#fb923c', 'Moderate': '#facc15', 'Low': '#4ade80', 'Minimal': '#94a3b8' };
    return map[impact] || '#94a3b8';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-slate-500 text-sm">Loading recovery priorities...</div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto pr-2 space-y-6 pb-6">
      <SectionHeader
        title="Recovery Priority"
        subtitle="Ranked road restoration priorities for disaster response"
      >
        <div className="glass-subtle px-3 py-1.5 text-xs text-slate-500 flex items-center gap-1.5" style={{ borderRadius: 10 }}>
          <Info size={12} />
          Priority = Criticality + Emergency Impact + Population + Lack of Alternatives
        </div>
      </SectionHeader>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {priorities.map(p => {
          const critColor = getCriticalityColor(
            p.criticality > 0.8 ? 'critical' : p.criticality > 0.6 ? 'high' : p.criticality > 0.4 ? 'medium' : 'low'
          );
          const impactColor = getImpactColor(p.hospitalAccessImpact);

          return (
            <GlassCard key={p.roadId} className="p-5" highlight hover>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold"
                    style={{
                      background: p.rank <= 3 ? 'rgba(248,113,113,0.12)' : 'rgba(255,255,255,0.05)',
                      border: `1px solid ${p.rank <= 3 ? 'rgba(248,113,113,0.2)' : 'rgba(255,255,255,0.08)'}`,
                      color: p.rank <= 3 ? '#f87171' : '#94a3b8'
                    }}
                  >
                    #{p.rank}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-200">{p.roadName}</h4>
                    <div className="text-[10px] text-slate-500">Priority Score: {p.priorityScore}</div>
                  </div>
                </div>
                {/* Priority bar */}
                <div className="w-16 h-2 rounded-full bg-white/5 overflow-hidden mt-1">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${p.priorityScore}%`, background: p.priorityScore > 80 ? '#f87171' : p.priorityScore > 60 ? '#fb923c' : '#facc15' }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="glass-subtle p-2.5 flex items-center gap-2" style={{ borderRadius: 10 }}>
                  <AlertTriangle size={12} style={{ color: critColor }} />
                  <div>
                    <div className="text-[10px] text-slate-500">Criticality</div>
                    <div className="text-xs font-medium" style={{ color: critColor }}>{formatPercent(p.criticality)}</div>
                  </div>
                </div>
                <div className="glass-subtle p-2.5 flex items-center gap-2" style={{ borderRadius: 10 }}>
                  <Users size={12} className="text-sky-400" />
                  <div>
                    <div className="text-[10px] text-slate-500">Population</div>
                    <div className="text-xs font-medium text-sky-400">{p.populationAffected.toLocaleString()}</div>
                  </div>
                </div>
                <div className="glass-subtle p-2.5 flex items-center gap-2" style={{ borderRadius: 10 }}>
                  <MapPin size={12} style={{ color: impactColor }} />
                  <div>
                    <div className="text-[10px] text-slate-500">Hospital Impact</div>
                    <div className="text-xs font-medium" style={{ color: impactColor }}>{p.hospitalAccessImpact}</div>
                  </div>
                </div>
                <div className="glass-subtle p-2.5 flex items-center gap-2" style={{ borderRadius: 10 }}>
                  <Route size={12} className={p.alternateRouteAvailable ? 'text-green-400' : 'text-red-400'} />
                  <div>
                    <div className="text-[10px] text-slate-500">Alt Route</div>
                    <div className={`text-xs font-medium ${p.alternateRouteAvailable ? 'text-green-400' : 'text-red-400'}`}>
                      {p.alternateRouteAvailable ? 'Available' : 'None'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-xs text-slate-400 mb-4 flex items-start gap-2">
                <span className="mt-0.5 w-1 h-1 rounded-full bg-sky-400 flex-shrink-0" />
                {p.recommendedAction}
              </div>

              <GlassButton
                variant="primary"
                onClick={() => handleDroneInspection(p.roadId)}
                className="w-full flex items-center justify-center gap-2 text-xs"
              >
                <Send size={13} />
                Deploy Inspection Drone
              </GlassButton>
            </GlassCard>
          );
        })}
      </div>

      <div className="text-center">
        <span className="prototype-badge">Simulated Priority Rankings</span>
      </div>

      {/* Drone Inspection Modal */}
      <GlassModal
        isOpen={!!droneModal}
        onClose={() => setDroneModal(null)}
        title="🛸 Drone Inspection Order"
      >
        {droneModal && (
          <div className="space-y-5">
            <div className="glass-subtle p-4" style={{ borderRadius: 14 }}>
              <div className="text-xs text-slate-500 mb-1">Road Segment</div>
              <div className="text-sm font-semibold text-slate-200">{droneModal.roadName}</div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="glass-subtle p-3.5" style={{ borderRadius: 14 }}>
                <div className="text-xs text-slate-500 mb-1">Priority</div>
                <div className="text-lg font-bold" style={{
                  color: droneModal.inspectionPriority === 'Immediate' ? '#f87171' :
                         droneModal.inspectionPriority === 'High' ? '#fb923c' : '#facc15'
                }}>
                  {droneModal.inspectionPriority}
                </div>
              </div>
              <div className="glass-subtle p-3.5" style={{ borderRadius: 14 }}>
                <div className="text-xs text-slate-500 mb-1">Est. Flight Time</div>
                <div className="text-lg font-bold text-sky-400">{droneModal.estimatedFlightTime}</div>
              </div>
            </div>

            <div>
              <div className="text-xs text-slate-500 mb-2">Reason</div>
              <p className="text-sm text-slate-300 leading-relaxed">{droneModal.reason}</p>
            </div>

            <div>
              <div className="text-xs text-slate-500 mb-2">Inspection Checklist</div>
              <div className="space-y-2">
                {droneModal.inspectionChecklist.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 glass-subtle p-2.5 text-sm text-slate-300" style={{ borderRadius: 10 }}>
                    <CheckCircle2 size={14} className="text-sky-400 flex-shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <span className="prototype-badge">Simulated Drone Dispatch</span>
            </div>
          </div>
        )}
      </GlassModal>
    </div>
  );
}
