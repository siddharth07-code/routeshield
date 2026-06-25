const roads = require('../data/roads.json');
const scenarios = require('../data/scenarios.json');

const alternateRoutes = {
  'road-1': ['Central Bypass', 'Station Access Road', 'District Hospital Road'],
  'road-2': ['Forest Edge Road', 'Mussoorie Diversion Road', 'Rajpur Emergency Link'],
  'road-3': ['Canal Side Bypass', 'Relief Camp Connector', 'Station Access Road'],
  'road-4': ['East Market Road', 'District Hospital Road', 'Canal Side Bypass'],
  'road-5': ['Hill View Connector', 'Forest Edge Road', 'River Bridge Corridor'],
  'road-6': ['Hill View Connector', 'Forest Edge Road', 'Evacuation Shelter Road'],
  'road-7': ['Station Access Road', 'Relief Camp Connector', 'East Market Road'],
  'road-8': ['Station Access Road', 'River Bridge Corridor', 'Rajpur Emergency Link'],
  'road-9': ['East Market Road', 'Canal Side Bypass', 'District Hospital Road'],
  'road-10': ['Rajpur Emergency Link', 'Hill View Connector', 'Mussoorie Diversion Road']
};

function simulateBlockage(roadId, scenarioKey, vehicleType) {
  const road = roads.find(r => r.id === roadId);
  if (!road) return null;

  const scenario = scenarios[scenarioKey] || scenarios['normal'];
  const multipliers = scenario.multipliers;
  const vehicleMult = scenario.vehicleMultipliers[vehicleType] || 1.0;

  const scenarioMult = getScenarioMultiplier(road, multipliers);
  const adjustedBlockage = Math.min(road.blockageProbability * scenarioMult, 1);

  // Calculate network disconnection based on criticality and scenario
  const networkDisconnectedPercent = Math.round(road.criticality * scenarioMult * 15);
  
  // Hospital delay based on criticality, vehicle type, and scenario
  const baseDelay = Math.round(road.criticality * 20);
  const hospitalDelayMinutes = Math.round(baseDelay * vehicleMult);

  // Determine risk level
  let riskLevel = 'LOW';
  if (adjustedBlockage > 0.7) riskLevel = 'CRITICAL';
  else if (adjustedBlockage > 0.5) riskLevel = 'HIGH';
  else if (adjustedBlockage > 0.3) riskLevel = 'MODERATE';

  const altRoutes = alternateRoutes[roadId] || ['Central Bypass'];
  const alternateRouteAvailable = road.criticality < 0.95;

  const explanations = [
    `${road.name} is a ${road.criticality > 0.8 ? 'high' : 'moderate'}-centrality connection`,
    `${road.affectedWards} ward${road.affectedWards > 1 ? 's' : ''} lose${road.affectedWards === 1 ? 's' : ''} fastest ${vehicleType === 'ambulance' ? 'hospital' : 'emergency'} access`,
    `Alternative route adds ${hospitalDelayMinutes} minutes for ${vehicleType.replace('-', ' ')}`
  ];

  if (scenarioKey === 'flood' && (road.isLowLying || road.roadType === 'bridge')) {
    explanations.push('Road is in a flood-vulnerable zone — elevated blockage risk');
  }
  if (scenarioKey === 'landslide' && road.isHillRoad) {
    explanations.push('Hill terrain increases landslide blockage probability');
  }
  if (scenarioKey === 'cyclone' && (road.isTreeCovered || road.isMajorCorridor)) {
    explanations.push('Cyclone winds may cause debris on tree-covered or exposed corridors');
  }

  return {
    selectedRoad: {
      id: road.id,
      name: road.name,
      criticality: road.criticality,
      blockageProbability: adjustedBlockage
    },
    networkDisconnectedPercent: Math.min(networkDisconnectedPercent, 45),
    hospitalDelayMinutes,
    affectedWards: road.affectedWards,
    alternateRouteAvailable,
    recommendedRoute: altRoutes,
    riskLevel,
    explanation: explanations
  };
}

function getScenarioMultiplier(road, multipliers) {
  let max = multipliers.default || 1.0;
  if (road.roadType === 'bridge' && multipliers.bridge) max = Math.max(max, multipliers.bridge);
  if (road.isLowLying && multipliers.low_lying) max = Math.max(max, multipliers.low_lying);
  if (road.isHillRoad && multipliers.hill_road) max = Math.max(max, multipliers.hill_road);
  if (road.isTreeCovered && multipliers.tree_covered) max = Math.max(max, multipliers.tree_covered);
  if (road.isMajorCorridor && multipliers.major_corridor) max = Math.max(max, multipliers.major_corridor);
  return max;
}

module.exports = { simulateBlockage };
