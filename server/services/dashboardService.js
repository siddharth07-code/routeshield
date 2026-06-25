const roads = require('../data/roads.json');
const scenarios = require('../data/scenarios.json');

function getDashboard(scenarioKey) {
  const scenario = scenarios[scenarioKey] || scenarios['normal'];
  const multipliers = scenario.multipliers;

  let criticalSegments = 0;
  let totalPopAtRisk = 0;
  let emergencyRoutesAvailable = 0;
  let totalResilience = 0;

  roads.forEach(road => {
    const scenarioMultiplier = getScenarioMultiplier(road, multipliers);
    const adjustedBlockage = Math.min(road.blockageProbability * scenarioMultiplier, 1);
    const adjustedCriticality = road.criticality * scenarioMultiplier;

    if (adjustedCriticality > 0.7) {
      criticalSegments++;
    }

    if (adjustedBlockage > 0.5) {
      totalPopAtRisk += road.populationAffected;
    }

    if (adjustedBlockage < 0.6) {
      emergencyRoutesAvailable++;
    }

    totalResilience += (1 - adjustedBlockage) * road.confidence;
  });

  const resilienceScore = Math.round((totalResilience / roads.length) * 100);
  const confidenceBase = scenarioKey === 'normal' ? 95 : 75;
  const confidence = Math.min(confidenceBase + Math.round(Math.random() * 15), 98);

  let riskStatus = scenario.baseRiskLevel;
  if (criticalSegments >= 5) riskStatus = 'CRITICAL';
  else if (criticalSegments >= 3) riskStatus = 'ELEVATED RISK';
  else if (criticalSegments >= 1) riskStatus = 'WATCH';
  else riskStatus = 'NORMAL';

  if (scenarioKey === 'normal') riskStatus = 'NORMAL';

  return {
    scenario: scenarioKey,
    riskStatus,
    resilienceScore,
    criticalSegments,
    emergencyRoutesAvailable,
    populationAtRisk: totalPopAtRisk,
    aiSummary: {
      title: scenario.aiTitle,
      confidence,
      evidence: scenario.aiEvidence
    }
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

module.exports = { getDashboard };
