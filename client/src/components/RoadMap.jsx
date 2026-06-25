import { useState } from 'react';
import { getCriticalityColor } from '../utils/formatters';

const EMERGENCY_ICONS = {
  hospital: '🏥',
  fire_station: '🚒',
  relief_camp: '⛺',
  affected_area: '⚠️',
  shelter: '🏠',
  command_center: '📡'
};

const emergencyLocations = [
  { id: 'loc-1', name: 'District Hospital', type: 'hospital', x: 400, y: 340 },
  { id: 'loc-2', name: 'Fire & Rescue', type: 'fire_station', x: 140, y: 200 },
  { id: 'loc-3', name: 'Relief Camp A', type: 'relief_camp', x: 520, y: 220 },
  { id: 'loc-4', name: 'Ward 12', type: 'affected_area', x: 220, y: 300 },
  { id: 'loc-5', name: 'Evac. Shelter', type: 'shelter', x: 120, y: 120 },
  { id: 'loc-6', name: 'EOC', type: 'command_center', x: 380, y: 380 }
];

export default function RoadMap({
  roads = [],
  onRoadClick,
  selectedRoadId,
  blockedRoadId,
  alternateRoute,
  showLegend = true,
  className = ''
}) {
  const [hoveredRoad, setHoveredRoad] = useState(null);

  return (
    <div className={`relative glass glass-highlight overflow-hidden ${className}`} style={{ borderRadius: 20 }}>
      {/* Terrain background */}
      <svg
        viewBox="0 0 640 440"
        className="w-full h-full"
        style={{ minHeight: 340 }}
      >
        <defs>
          {/* Topographic contours */}
          <pattern id="topo" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
            <circle cx="40" cy="40" r="30" fill="none" stroke="rgba(56,189,248,0.04)" strokeWidth="0.5" />
            <circle cx="40" cy="40" r="20" fill="none" stroke="rgba(56,189,248,0.03)" strokeWidth="0.5" />
            <circle cx="40" cy="40" r="10" fill="none" stroke="rgba(56,189,248,0.02)" strokeWidth="0.5" />
          </pattern>

          {/* River */}
          <linearGradient id="river" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(56,189,248,0.06)" />
            <stop offset="50%" stopColor="rgba(56,189,248,0.12)" />
            <stop offset="100%" stopColor="rgba(56,189,248,0.04)" />
          </linearGradient>

          {/* Glow filter */}
          <filter id="roadGlow">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background */}
        <rect width="640" height="440" fill="rgba(10,14,26,0.6)" />
        <rect width="640" height="440" fill="url(#topo)" />

        {/* River */}
        <path
          d="M 0 260 Q 120 240 200 270 Q 300 310 380 260 Q 460 210 560 240 Q 600 250 640 230"
          fill="none"
          stroke="url(#river)"
          strokeWidth="12"
          strokeLinecap="round"
        />
        <text x="300" y="295" fill="rgba(56,189,248,0.15)" fontSize="9" fontFamily="inherit">
          Rispana River
        </text>

        {/* Terrain labels */}
        <text x="60" y="60" fill="rgba(255,255,255,0.06)" fontSize="10" fontFamily="inherit">
          Mussoorie Hills ▲
        </text>
        <text x="420" y="420" fill="rgba(255,255,255,0.06)" fontSize="10" fontFamily="inherit">
          Dehradun Valley
        </text>

        {/* Road segments */}
        {roads.map(road => {
          const [[x1, y1], [x2, y2]] = road.coordinates;
          const color = getCriticalityColor(road.criticalityLevel);
          const isBlocked = road.id === blockedRoadId;
          const isSelected = road.id === selectedRoadId;
          const isHovered = road.id === hoveredRoad;
          const isAltRoute = alternateRoute?.includes(road.name);

          return (
            <g key={road.id}>
              {/* Road glow */}
              {(isSelected || isHovered) && (
                <line
                  x1={x1} y1={y1} x2={x2} y2={y2}
                  stroke={color}
                  strokeWidth={8}
                  strokeLinecap="round"
                  opacity={0.2}
                  filter="url(#roadGlow)"
                />
              )}

              {/* Alternate route highlight */}
              {isAltRoute && !isBlocked && (
                <line
                  x1={x1} y1={y1} x2={x2} y2={y2}
                  stroke="#38bdf8"
                  strokeWidth={6}
                  strokeLinecap="round"
                  opacity={0.25}
                  filter="url(#roadGlow)"
                />
              )}

              {/* Road line */}
              <line
                x1={x1} y1={y1} x2={x2} y2={y2}
                stroke={isBlocked ? '#f87171' : isAltRoute ? '#38bdf8' : color}
                strokeWidth={isSelected || isHovered ? 4 : 3}
                strokeLinecap="round"
                opacity={isBlocked ? 0.8 : 0.7}
                className={`cursor-pointer transition-all ${isBlocked ? 'road-blocked' : ''}`}
                onMouseEnter={() => setHoveredRoad(road.id)}
                onMouseLeave={() => setHoveredRoad(null)}
                onClick={() => onRoadClick?.(road)}
              />

              {/* Road junction dots */}
              <circle cx={x1} cy={y1} r={3} fill={color} opacity={0.5} />
              <circle cx={x2} cy={y2} r={3} fill={color} opacity={0.5} />

              {/* Road label */}
              {(isHovered || isSelected) && (
                <text
                  x={(x1 + x2) / 2}
                  y={(y1 + y2) / 2 - 10}
                  fill="rgba(255,255,255,0.8)"
                  fontSize="10"
                  fontFamily="inherit"
                  textAnchor="middle"
                  fontWeight="500"
                >
                  {road.name}
                </text>
              )}
            </g>
          );
        })}

        {/* Emergency locations */}
        {emergencyLocations.map(loc => (
          <g key={loc.id}>
            <circle
              cx={loc.x} cy={loc.y} r={14}
              fill="rgba(15,22,41,0.7)"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="1"
            />
            <text
              x={loc.x} y={loc.y + 4}
              textAnchor="middle"
              fontSize="12"
            >
              {EMERGENCY_ICONS[loc.type]}
            </text>
            <text
              x={loc.x} y={loc.y + 26}
              fill="rgba(255,255,255,0.35)"
              fontSize="8"
              textAnchor="middle"
              fontFamily="inherit"
            >
              {loc.name}
            </text>
          </g>
        ))}
      </svg>

      {/* Legend */}
      {showLegend && (
        <div className="absolute bottom-3 left-3 glass-subtle px-3.5 py-2.5 flex items-center gap-4 text-xs" style={{ borderRadius: 12 }}>
          <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 rounded" style={{ background: '#4ade80' }} /> Low</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 rounded" style={{ background: '#facc15' }} /> Medium</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 rounded" style={{ background: '#fb923c' }} /> High</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 rounded" style={{ background: '#f87171' }} /> Critical</span>
        </div>
      )}

      {/* Prototype label */}
      <div className="absolute top-3 right-3">
        <span className="prototype-badge">Simulated Satellite View</span>
      </div>
    </div>
  );
}
