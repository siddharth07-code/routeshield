import { useState, useEffect } from 'react';
import { Zap, RotateCcw, ChevronDown, AlertTriangle, Clock, MapPin, Route, Network, Info } from 'lucide-react';
import { fetchRoads, simulateBlockage } from '../services/api';
import { getRiskColor, formatPercent } from '../utils/formatters';
import GlassCard from '../components/GlassCard';
import GlassButton from '../components/GlassButton';
import StatusBadge from '../components/StatusBadge';
import SectionHeader from '../components/SectionHeader';
import RoadMap from '../components/RoadMap';
import RoadDetailPopup from '../components/RoadDetailPopup';

const vehicles = [
  { id: 'ambulance', label: '🚑 Ambulance' },
  { id: 'fire-truck', label: '🚒 Fire Truck' },
  { id: 'relief-truck', label: '🚛 Relief Truck' },
  { id: 'evacuation-bus', label: '🚌 Evacuation Bus' }
];

export default function DisruptionSimulator({ scenario, onScenarioChange }) {
  const [roads, setRoads] = useState([]);
  const [selectedRoadId, setSelectedRoadId] = useState('');
  const [vehicleType, setVehicleType] = useState('ambulance');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedRoadDetail, setSelectedRoadDetail] = useState(null);
  const [popupPos, setPopupPos] = useState(null);

  useEffect(() => {
    fetchRoads().then(setRoads).catch(console.error);
  }, []);

  const handleSimulate = async () => {
    if (!selectedRoadId) return;
    setLoading(true);
    try {
      const data = await simulateBlockage(selectedRoadId, scenario, vehicleType);
      setResult(data);
      setSelectedRoadDetail(null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setSelectedRoadId('');
    setSelectedRoadDetail(null);
  };

  const handleRoadClick = (road) => {
    setSelectedRoadId(road.id);
    if (!result) {
      setSelectedRoadDetail(road);
      const midX = (road.coordinates[0][0] + road.coordinates[1][0]) / 2;
      const midY = (road.coordinates[0][1] + road.coordinates[1][1]) / 2;
      setPopupPos({ x: midX + 20, y: midY - 40 });
    }
  };

  return (
    <div className="h-full overflow-y-auto pr-2 space-y-6 pb-6">
      <SectionHeader
        title="Disruption Simulator"
        subtitle="Simulate road blockages and analyze network impact"
      />

      {/* Controls */}
      <GlassCard className="p-5" highlight>
        <div className="flex flex-wrap items-end gap-4">
          {/* Road selector */}
          <div className="flex-1 min-w-48">
            <label className="text-xs text-slate-500 mb-1.5 block">Road Segment</label>
            <div className="relative">
              <select
                value={selectedRoadId}
                onChange={e => { setSelectedRoadId(e.target.value); setResult(null); }}
                className="w-full glass-subtle appearance-none px-4 py-2.5 pr-8 text-sm text-slate-200 bg-transparent focus:outline-none cursor-pointer"
                style={{ borderRadius: 12 }}
              >
                <option value="" className="bg-slate-900">Select a road...</option>
                {roads.map(r => (
                  <option key={r.id} value={r.id} className="bg-slate-900">{r.name}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
            </div>
          </div>

          {/* Vehicle selector */}
          <div className="min-w-40">
            <label className="text-xs text-slate-500 mb-1.5 block">Vehicle Type</label>
            <div className="relative">
              <select
                value={vehicleType}
                onChange={e => setVehicleType(e.target.value)}
                className="w-full glass-subtle appearance-none px-4 py-2.5 pr-8 text-sm text-slate-200 bg-transparent focus:outline-none cursor-pointer"
                style={{ borderRadius: 12 }}
              >
                {vehicles.map(v => (
                  <option key={v.id} value={v.id} className="bg-slate-900">{v.label}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
            </div>
          </div>

          {/* Scenario selector */}
          <div className="min-w-36">
            <label className="text-xs text-slate-500 mb-1.5 block">Scenario</label>
            <div className="relative">
              <select
                value={scenario}
                onChange={e => onScenarioChange(e.target.value)}
                className="w-full glass-subtle appearance-none px-4 py-2.5 pr-8 text-sm text-slate-200 bg-transparent focus:outline-none cursor-pointer"
                style={{ borderRadius: 12 }}
              >
                <option value="flood" className="bg-slate-900">🌊 Flood</option>
                <option value="landslide" className="bg-slate-900">🏔️ Landslide</option>
                <option value="cyclone" className="bg-slate-900">🌀 Cyclone</option>
                <option value="normal" className="bg-slate-900">✅ Normal</option>
              </select>
              <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-2">
            <GlassButton
              variant="danger"
              onClick={handleSimulate}
              disabled={!selectedRoadId || loading}
              className="flex items-center gap-2"
            >
              <Zap size={15} />
              {loading ? 'Simulating...' : 'Simulate Blockage'}
            </GlassButton>
            {result && (
              <GlassButton onClick={handleReset} className="flex items-center gap-2">
                <RotateCcw size={15} />
                Reset
              </GlassButton>
            )}
          </div>
        </div>
      </GlassCard>

      {/* Map */}
      <div className="relative z-40">
        <RoadMap
          roads={roads}
          onRoadClick={handleRoadClick}
          selectedRoadId={selectedRoadId}
          blockedRoadId={result ? selectedRoadId : null}
          alternateRoute={result?.recommendedRoute}
        />
        {selectedRoadDetail && !result && (
          <RoadDetailPopup
            road={selectedRoadDetail}
            position={popupPos}
            onClose={() => setSelectedRoadDetail(null)}
          />
        )}
      </div>

      {/* Simulation Results */}
      {result && (
        <div className="space-y-4 fade-slide-in">
          <SectionHeader title="Simulation Results" subtitle={`Impact of blocking ${result.selectedRoad.name}`} />

          {/* Impact metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <GlassCard className="p-4" highlight>
              <div className="flex items-center gap-2 mb-2">
                <Network size={14} className="text-red-400" />
                <span className="text-xs text-slate-500">Network Disconnected</span>
              </div>
              <div className="text-2xl font-bold text-red-400">{result.networkDisconnectedPercent}%</div>
            </GlassCard>

            <GlassCard className="p-4" highlight>
              <div className="flex items-center gap-2 mb-2">
                <Clock size={14} className="text-amber-400" />
                <span className="text-xs text-slate-500">Hospital Delay</span>
              </div>
              <div className="text-2xl font-bold text-amber-400">+{result.hospitalDelayMinutes} min</div>
            </GlassCard>

            <GlassCard className="p-4" highlight>
              <div className="flex items-center gap-2 mb-2">
                <MapPin size={14} className="text-sky-400" />
                <span className="text-xs text-slate-500">Affected Wards</span>
              </div>
              <div className="text-2xl font-bold text-sky-400">{result.affectedWards}</div>
            </GlassCard>

            <GlassCard className="p-4" highlight>
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle size={14} style={{ color: getRiskColor(result.riskLevel) }} />
                <span className="text-xs text-slate-500">Risk Level</span>
              </div>
              <StatusBadge status={result.riskLevel} />
            </GlassCard>
          </div>

          {/* Route + Explanation */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <GlassCard className="p-5" highlight>
              <div className="flex items-center gap-2 mb-4">
                <Route size={16} className="text-sky-400" />
                <h4 className="text-sm font-semibold text-slate-200">Recommended Alternate Route</h4>
              </div>
              <div className="flex items-center gap-1 mb-4 text-xs text-slate-500">
                {result.alternateRouteAvailable ? '✅ Alternate route available' : '⚠️ No direct alternate route'}
              </div>

              {/* Route timeline */}
              <div className="space-y-0">
                {result.recommendedRoute.map((step, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-2.5 h-2.5 rounded-full bg-sky-400 border-2 border-sky-400/30" />
                      {i < result.recommendedRoute.length - 1 && (
                        <div className="w-0.5 h-6 bg-sky-400/20" />
                      )}
                    </div>
                    <span className="text-sm text-slate-300 py-1">{step}</span>
                  </div>
                ))}
              </div>
            </GlassCard>

            <GlassCard className="p-5" highlight>
              <div className="flex items-center gap-2 mb-4">
                <Info size={16} className="text-purple-400" />
                <h4 className="text-sm font-semibold text-slate-200">AI Explanation</h4>
              </div>
              <div className="space-y-2.5">
                {result.explanation.map((e, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-slate-400">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-purple-400 flex-shrink-0" />
                    {e}
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-3 border-t border-white/5">
                <span className="prototype-badge">Simulated Analysis</span>
              </div>
            </GlassCard>
          </div>
        </div>
      )}
    </div>
  );
}
