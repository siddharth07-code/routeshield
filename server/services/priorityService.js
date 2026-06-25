const roads = require('../data/roads.json');
const recoveryData = require('../data/recoveryPriorities.json');
const scenarios = require('../data/scenarios.json');

function getRecoveryPriorities(scenarioKey) {
  const scenario = scenarios[scenarioKey] || scenarios['normal'];
  const multipliers = scenario.multipliers;

  const priorities = recoveryData.map(priority => {
    const road = roads.find(r => r.id === priority.roadId);
    if (!road) return null;

    const scenarioMult = getScenarioMultiplier(road, multipliers);
    const adjustedScore = Math.min(Math.round(priority.basePriorityScore * scenarioMult), 100);

    return {
      roadId: road.id,
      roadName: road.name,
      priorityScore: adjustedScore,
      criticality: road.criticality,
      populationAffected: road.populationAffected,
      hospitalAccessImpact: priority.hospitalAccessImpact,
      alternateRouteAvailable: priority.alternateRouteAvailable,
      recommendedAction: priority.recommendedAction
    };
  }).filter(Boolean);

  // Sort by adjusted priority score descending
  priorities.sort((a, b) => b.priorityScore - a.priorityScore);

  // Add ranks
  return priorities.map((p, i) => ({ rank: i + 1, ...p }));
}

function getDroneInspection(roadId) {
  const road = roads.find(r => r.id === roadId);
  if (!road) return null;

  let inspectionPriority = 'Routine';
  if (road.criticality > 0.8) inspectionPriority = 'Immediate';
  else if (road.criticality > 0.6) inspectionPriority = 'High';
  else if (road.criticality > 0.4) inspectionPriority = 'Moderate';

  const flightTime = Math.round(5 + road.criticality * 10);

  const checklists = {
    bridge: ['Verify bridge structural integrity', 'Assess floodwater extent around bridge', 'Confirm alternate route usability', 'Check for debris accumulation'],
    hill_road: ['Check for landslide debris', 'Assess road surface stability', 'Verify slope conditions', 'Confirm vehicle passability'],
    hospital_access: ['Verify road clearance for ambulances', 'Check for obstructions', 'Confirm signage visibility', 'Assess surface condition'],
    emergency_link: ['Verify full route accessibility', 'Check for fallen trees or debris', 'Assess road width clearance', 'Confirm emergency vehicle passage'],
    default: ['Verify road surface condition', 'Check for obstructions or debris', 'Assess drainage conditions', 'Confirm route accessibility']
  };

  const checklist = checklists[road.roadType] || checklists.default;

  const reasons = [];
  if (road.criticality > 0.7) reasons.push('High criticality road segment');
  if (road.confidence < 0.8) reasons.push('Uncertain satellite assessment — ground truth needed');
  if (road.blockageProbability > 0.5) reasons.push('Elevated blockage probability requires visual confirmation');
  if (road.occlusionDetails.length > 0) reasons.push('Occlusion detected in satellite imagery');
  if (reasons.length === 0) reasons.push('Routine monitoring inspection');

  return {
    roadId: road.id,
    roadName: road.name,
    inspectionPriority,
    estimatedFlightTime: `${flightTime} minutes`,
    reason: reasons.join('. '),
    inspectionChecklist: checklist
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

module.exports = { getRecoveryPriorities, getDroneInspection };
