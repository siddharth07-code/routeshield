import { useState, useEffect } from 'react';
import { Shield, AlertTriangle, Route, Users, MapPin, ChevronDown, Brain } from 'lucide-react';
import { fetchDashboard, fetchRoads, fetchRoadDetail } from '../services/api';
import { formatPercent, getCriticalityColor, getCriticalityBg } from '../utils/formatters';
import MetricCard from '../components/MetricCard';
import StatusBadge from '../components/StatusBadge';
import GlassCard from '../components/GlassCard';
import SectionHeader from '../components/SectionHeader';
import RoadMap from '../components/RoadMap';
import RoadDetailPopup from '../components/RoadDetailPopup';

export default function Overview({ scenario, onScenarioChange }) {
  const [dashboard, setDashboard] = useState(null);
  const [roads, setRoads] = useState([]);
  const [selectedRoad, setSelectedRoad] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchDashboard(scenario), fetchRoads()])
      .then(([dash, roadsData]) => {
        setDashboard(dash);
        setRoads(roadsData);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [scenario]);

  const handleRoadClick = async (road) => {
    try {
      const detail = await fetchRoadDetail(road.id);
      setSelectedRoad(detail);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading || !dashboard) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-slate-500 text-sm">Loading intelligence data...</div>
      </div>
    );
  }

  const criticalRoads = roads.filter(r => r.criticality > 0.5).sort((a, b) => b.criticality - a.criticality);

  return (
    <div className="h-full overflow-y-auto pr-2 space-y-6 pb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight">RouteShield AI</h1>
          <p className="text-sm text-slate-400 mt-1">Satellite-to-Response Intelligence for Disaster Mobility</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="glass-subtle px-3 py-2 flex items-center gap-2 text-xs text-slate-400" style={{ borderRadius: 12 }}>
            <MapPin size={13} />
            Dehradun, Uttarakhand
          </div>
          <div className="relative">
            <select
              value={scenario}
              onChange={e => onScenarioChange(e.target.value)}
              className="glass-subtle appearance-none px-4 py-2 pr-8 text-sm text-slate-200 bg-transparent cursor-pointer focus:outline-none"
              style={{ borderRadius: 12 }}
            >
              <option value="flood" className="bg-slate-900">🌊 Flood</option>
              <option value="landslide" className="bg-slate-900">🏔️ Landslide</option>
              <option value="cyclone" className="bg-slate-900">🌀 Cyclone</option>
              <option value="normal" className="bg-slate-900">✅ Normal</option>
            </select>
            <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
          </div>
          <StatusBadge status={dashboard.riskStatus} />
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard icon={Shield} label="Network Resilience" value={`${dashboard.resilienceScore}%`} color="#38bdf8" sub="Road network health" />
        <MetricCard icon={AlertTriangle} label="Critical Segments" value={dashboard.criticalSegments} color="#f87171" sub="High-risk roads" />
        <MetricCard icon={Route} label="Emergency Routes" value={dashboard.emergencyRoutesAvailable} color="#4ade80" sub="Available paths" />
        <MetricCard icon={Users} label="Population at Risk" value={dashboard.populationAtRisk.toLocaleString()} color="#fb923c" sub="Affected residents" />
      </div>

      {/* Map + AI Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 relative">
          <RoadMap
            roads={roads}
            onRoadClick={handleRoadClick}
            selectedRoadId={selectedRoad?.id}
          />
          <div className="scan-line" />
          {selectedRoad && (
            <RoadDetailPopup
              road={selectedRoad}
              onClose={() => setSelectedRoad(null)}
            />
          )}
        </div>

        {/* AI Summary */}
        <GlassCard className="p-5" highlight>
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 rounded-xl bg-purple-500/12 border border-purple-400/15">
              <Brain size={16} className="text-purple-400" />
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-200">AI Situation Summary</div>
              <div className="text-[10px] text-slate-500">Analysis Engine v2.1</div>
            </div>
          </div>

          <h4 className="text-sm font-medium text-slate-200 mb-3 leading-relaxed">
            {dashboard.aiSummary.title}
          </h4>

          <div className="flex items-center gap-2 mb-4">
            <div className="text-xs text-slate-500">Confidence</div>
            <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${dashboard.aiSummary.confidence}%`,
                  background: dashboard.aiSummary.confidence > 80 ? '#4ade80' : '#facc15'
                }}
              />
            </div>
            <div className="text-xs font-medium text-slate-300">{dashboard.aiSummary.confidence}%</div>
          </div>

          <div className="space-y-2.5">
            <div className="text-xs font-medium text-slate-400">Evidence</div>
            {dashboard.aiSummary.evidence.map((e, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-slate-400">
                <span className="mt-1.5 w-1 h-1 rounded-full bg-sky-400 flex-shrink-0" />
                {e}
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-white/5">
            <span className="prototype-badge">Simulated AI Analysis</span>
          </div>
        </GlassCard>
      </div>

      {/* Critical Roads Table */}
      <GlassCard className="p-5" highlight>
        <SectionHeader
          title="Critical Road Segments"
          subtitle={`${criticalRoads.length} segments requiring attention`}
        />
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-slate-500 border-b border-white/5">
                <th className="text-left pb-3 font-medium">Road Segment</th>
                <th className="text-left pb-3 font-medium">Criticality</th>
                <th className="text-left pb-3 font-medium">Blockage Prob.</th>
                <th className="text-left pb-3 font-medium">Wards</th>
                <th className="text-left pb-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {criticalRoads.map(road => (
                <tr
                  key={road.id}
                  className="border-b border-white/3 hover:bg-white/3 cursor-pointer transition-colors"
                  onClick={() => handleRoadClick(road)}
                >
                  <td className="py-3 text-slate-200 font-medium">{road.name}</td>
                  <td className="py-3">
                    <span
                      className="px-2 py-0.5 rounded-md text-xs font-medium"
                      style={{
                        background: getCriticalityBg(road.criticalityLevel),
                        color: getCriticalityColor(road.criticalityLevel)
                      }}
                    >
                      {formatPercent(road.criticality)}
                    </span>
                  </td>
                  <td className="py-3 text-slate-300">{formatPercent(road.blockageProbability)}</td>
                  <td className="py-3 text-slate-400">{road.affectedWards}</td>
                  <td className="py-3 text-xs text-slate-500">
                    {road.criticality > 0.8 ? 'Immediate review' : road.criticality > 0.6 ? 'Monitor closely' : 'Routine check'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}
