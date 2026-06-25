import { useState, useEffect } from 'react';
import { Ambulance, Truck, Bus, Flame, Route, Clock, Shield, Info } from 'lucide-react';
import { fetchEmergencyRoutes } from '../services/api';
import { getRiskColor } from '../utils/formatters';
import GlassCard from '../components/GlassCard';
import StatusBadge from '../components/StatusBadge';
import SectionHeader from '../components/SectionHeader';

const vehicleTabs = [
  { id: 'ambulance', label: 'Ambulance', icon: Ambulance, emoji: '🚑' },
  { id: 'fire-truck', label: 'Fire Truck', icon: Flame, emoji: '🚒' },
  { id: 'relief-truck', label: 'Relief Truck', icon: Truck, emoji: '🚛' },
  { id: 'evacuation-bus', label: 'Evacuation Bus', icon: Bus, emoji: '🚌' }
];

export default function EmergencyAccess({ scenario }) {
  const [activeVehicle, setActiveVehicle] = useState('ambulance');
  const [routeData, setRouteData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchEmergencyRoutes(activeVehicle, scenario)
      .then(setRouteData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [activeVehicle, scenario]);

  const activeTab = vehicleTabs.find(t => t.id === activeVehicle);

  return (
    <div className="h-full overflow-y-auto pr-2 space-y-6 pb-6">
      <SectionHeader
        title="Emergency Access Routes"
        subtitle="Vehicle-specific routing optimized for current scenario"
      />

      {/* Vehicle tabs */}
      <div className="flex flex-wrap gap-2">
        {vehicleTabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeVehicle === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveVehicle(tab.id)}
              className={`
                flex items-center gap-2.5 px-5 py-3 rounded-2xl text-sm font-medium
                transition-all duration-200 ease-out border
                ${isActive
                  ? 'bg-white/10 border-white/15 text-slate-100 shadow-lg backdrop-blur-xl'
                  : 'bg-white/3 border-white/5 text-slate-400 hover:bg-white/6 hover:text-slate-300'
                }
              `}
            >
              <span className="text-lg">{tab.emoji}</span>
              {tab.label}
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-slate-500 text-sm">Loading route data...</div>
        </div>
      ) : routeData ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Route display */}
          <GlassCard className="p-6" highlight>
            <div className="flex items-center gap-3 mb-5">
              <div className="p-3 rounded-2xl bg-sky-500/12 border border-sky-400/15">
                <Route size={22} className="text-sky-400" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-slate-100">Recommended Route</h3>
                <div className="text-xs text-slate-500">{activeTab?.label} · {scenario} scenario</div>
              </div>
            </div>

            {/* Route timeline */}
            <div className="ml-2 mb-6">
              {/* Origin */}
              <div className="flex items-center gap-3 mb-1">
                <div className="w-3 h-3 rounded-full bg-green-400 border-2 border-green-400/30" />
                <span className="text-sm text-green-400 font-medium">Emergency Origin</span>
              </div>
              <div className="ml-1.5 border-l-2 border-dashed border-sky-400/20 pl-5 py-1 space-y-0">
                {routeData.recommendedRoute.map((step, i) => (
                  <div key={i} className="flex items-center gap-3 py-2">
                    <div className="w-2 h-2 rounded-full bg-sky-400/60" />
                    <span className="text-sm text-slate-300">{step}</span>
                  </div>
                ))}
              </div>
              {/* Destination */}
              <div className="flex items-center gap-3 mt-1">
                <div className="w-3 h-3 rounded-full bg-red-400 border-2 border-red-400/30" />
                <span className="text-sm text-red-400 font-medium">Destination</span>
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-3">
              <div className="glass-subtle p-3.5">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                  <Clock size={12} /> Travel Time
                </div>
                <div className="text-xl font-bold text-sky-400">{routeData.estimatedTravelTime} min</div>
              </div>
              <div className="glass-subtle p-3.5">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                  <Shield size={12} /> Risk Level
                </div>
                <StatusBadge status={routeData.riskLevel} />
              </div>
            </div>
          </GlassCard>

          {/* Route reasoning */}
          <GlassCard className="p-6" highlight>
            <div className="flex items-center gap-3 mb-5">
              <div className="p-3 rounded-2xl bg-purple-500/12 border border-purple-400/15">
                <Info size={22} className="text-purple-400" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-slate-100">Route Reasoning</h3>
                <div className="text-xs text-slate-500">Why this route was selected</div>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              {routeData.routeReason.map((reason, i) => (
                <div key={i} className="flex items-start gap-3 glass-subtle p-3.5" style={{ borderRadius: 14 }}>
                  <span className="mt-0.5 w-5 h-5 rounded-full bg-sky-400/12 border border-sky-400/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-[10px] text-sky-400 font-bold">{i + 1}</span>
                  </span>
                  <span className="text-sm text-slate-300 leading-relaxed">{reason}</span>
                </div>
              ))}
            </div>

            {/* CSS/SVG Accessibility Impact Chart */}
            <div>
              <h4 className="text-xs font-medium text-slate-400 mb-3">Accessibility Impact</h4>
              <div className="space-y-2.5">
                {[
                  { label: 'Hospital Access', value: routeData.riskLevel === 'LOW' ? 92 : routeData.riskLevel === 'MODERATE' ? 68 : 45, color: '#4ade80' },
                  { label: 'Evacuation Readiness', value: routeData.riskLevel === 'LOW' ? 88 : routeData.riskLevel === 'MODERATE' ? 72 : 55, color: '#38bdf8' },
                  { label: 'Supply Connectivity', value: routeData.riskLevel === 'LOW' ? 95 : routeData.riskLevel === 'MODERATE' ? 78 : 50, color: '#a78bfa' }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-xs text-slate-500 w-32 flex-shrink-0">{item.label}</span>
                    <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${item.value}%`, background: item.color }}
                      />
                    </div>
                    <span className="text-xs font-medium text-slate-400 w-8 text-right">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/5">
              <span className="prototype-badge">Simulated Route Data</span>
            </div>
          </GlassCard>
        </div>
      ) : null}
    </div>
  );
}
