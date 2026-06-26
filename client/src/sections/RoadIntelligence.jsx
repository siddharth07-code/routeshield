import { useState, useEffect } from 'react';
import { Layers, Eye, Crosshair, ThermometerSun, TreePine, CloudFog, Waves, Info } from 'lucide-react';
import { fetchRoads, fetchRoadDetail } from '../services/api';
import { getConfidenceColor, formatPercent, getCriticalityColor } from '../utils/formatters';
import GlassCard from '../components/GlassCard';
import GlassButton from '../components/GlassButton';
import SectionHeader from '../components/SectionHeader';
import RoadMap from '../components/RoadMap';
import RoadDetailPopup from '../components/RoadDetailPopup';

const views = [
  { id: 'satellite', label: 'Original Satellite View', icon: Layers },
  { id: 'mask', label: 'AI Road Mask', icon: Eye },
  { id: 'occlusion', label: 'Occlusion Confidence', icon: Crosshair },
  { id: 'heatmap', label: 'Criticality Heatmap', icon: ThermometerSun },
];

const occlusionDetections = [
  {
    icon: TreePine,
    type: 'Tree cover',
    road: 'Rajpur Emergency Link',
    confidence: 0.89,
    description: 'Dense tree canopy near Rajpur obscures road edges — AI estimates 89% continuity confidence based on direction vectors and nearby context.'
  },
  {
    icon: CloudFog,
    type: 'Shadow occlusion',
    road: 'Hill View Connector',
    confidence: 0.74,
    description: 'Hill shadow in satellite imagery hides a 120m segment — reconstruction model infers likely road continuation at 74% confidence.'
  },
  {
    icon: Waves,
    type: 'Floodwater obstruction',
    road: 'River Bridge Corridor',
    confidence: 0.61,
    description: 'Seasonal flooding obscures road surface near bridge approach — uncertain connectivity requiring ground verification.'
  }
];

export default function RoadIntelligence({ scenario }) {
  const [activeView, setActiveView] = useState('satellite');
  const [roads, setRoads] = useState([]);
  const [selectedRoad, setSelectedRoad] = useState(null);
  const [popupPos, setPopupPos] = useState(null);

  useEffect(() => {
    fetchRoads().then(setRoads).catch(console.error);
  }, []);

  const handleRoadClick = async (road) => {
    try {
      const detail = await fetchRoadDetail(road.id);
      setSelectedRoad(detail);
      const midX = (road.coordinates[0][0] + road.coordinates[1][0]) / 2;
      const midY = (road.coordinates[0][1] + road.coordinates[1][1]) / 2;
      setPopupPos({ x: midX + 20, y: midY - 40 });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="h-full overflow-y-auto pr-2 space-y-6 pb-6">
      <SectionHeader
        title="Road Intelligence"
        subtitle="Satellite imagery analysis and road extraction pipeline"
      />

      {/* View Toggle */}
      <div className="flex flex-wrap gap-2">
        {views.map(view => {
          const Icon = view.icon;
          return (
            <GlassButton
              key={view.id}
              active={activeView === view.id}
              onClick={() => setActiveView(view.id)}
              className="flex items-center gap-2"
            >
              <Icon size={15} />
              {view.label}
            </GlassButton>
          );
        })}
      </div>

      {/* Map with view-specific styling */}
      <div className="relative z-40">
        <RoadMap
          roads={roads}
          onRoadClick={handleRoadClick}
          selectedRoadId={selectedRoad?.id}
          className={activeView === 'heatmap' ? 'ring-1 ring-red-400/20' : activeView === 'mask' ? 'ring-1 ring-sky-400/20' : ''}
        />

        {/* View-specific overlay label */}
        <div className="absolute top-3 left-3">
          <span className="glass-subtle px-3 py-1.5 text-xs text-slate-300 flex items-center gap-1.5" style={{ borderRadius: 10 }}>
            {views.find(v => v.id === activeView)?.label}
          </span>
        </div>

        {selectedRoad && (
          <RoadDetailPopup
            road={selectedRoad}
            position={popupPos}
            onClose={() => setSelectedRoad(null)}
          />
        )}
      </div>

      {/* Occlusion Explanation */}
      <GlassCard className="p-5" highlight>
        <div className="flex items-start gap-3 mb-4">
          <div className="p-2 rounded-xl bg-purple-500/12 border border-purple-400/15 mt-0.5">
            <Info size={16} className="text-purple-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-200">Occlusion-Aware Reconstruction</h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Uses road direction, nearby context, and topology constraints to infer hidden road continuity behind trees, shadows, or floodwater.
            </p>
          </div>
        </div>

        {/* Confidence legend */}
        <div className="flex items-center gap-4 text-xs text-slate-500 mb-1">
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-400" /> Clearly visible</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-yellow-400" /> Likely continuation</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-400" /> Uncertain — verify</span>
        </div>
      </GlassCard>

      {/* Occlusion Detections */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {occlusionDetections.map((det, i) => {
          const Icon = det.icon;
          const confColor = getConfidenceColor(det.confidence);
          return (
            <GlassCard key={i} className="p-5" hover highlight>
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 rounded-xl" style={{ background: `${confColor}14`, border: `1px solid ${confColor}20` }}>
                  <Icon size={16} style={{ color: confColor }} />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-200">{det.type}</div>
                  <div className="text-[10px] text-slate-500">{det.road}</div>
                </div>
              </div>

              {/* Confidence bar */}
              <div className="flex items-center gap-2 mb-3">
                <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${det.confidence * 100}%`, background: confColor }}
                  />
                </div>
                <span className="text-xs font-medium" style={{ color: confColor }}>
                  {formatPercent(det.confidence)}
                </span>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">{det.description}</p>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
}
