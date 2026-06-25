const roads = require('../data/roads.json');
const scenarios = require('../data/scenarios.json');

const vehicleRoutes = {
  ambulance: {
    preferWide: false,
    avoidBridge: false,
    prioritizeHospital: true,
    speedFactor: 0.8,
    routes: {
      flood: {
        route: ['Rajpur Emergency Link', 'Central Bypass', 'District Hospital Road'],
        reason: ['Avoids low-lying flood-prone roads', 'Uses elevated corridors for reliable access', 'Maintains fastest hospital access']
      },
      landslide: {
        route: ['Station Access Road', 'East Market Road', 'District Hospital Road'],
        reason: ['Avoids hill roads with landslide risk', 'Uses flat urban corridors', 'Maintains hospital access through city center']
      },
      cyclone: {
        route: ['Station Access Road', 'Canal Side Bypass', 'District Hospital Road'],
        reason: ['Avoids tree-covered roads with debris risk', 'Uses sheltered canal-side corridor', 'Maintains direct hospital access']
      },
      normal: {
        route: ['River Bridge Corridor', 'District Hospital Road'],
        reason: ['Shortest route to District Hospital', 'All roads clear and operational', 'No active hazards on route']
      }
    }
  },
  'fire-truck': {
    preferWide: true,
    avoidBridge: true,
    prioritizeHospital: false,
    speedFactor: 1.2,
    routes: {
      flood: {
        route: ['Station Access Road', 'East Market Road', 'Central Bypass'],
        reason: ['Uses wider roads for fire truck access', 'Avoids flood-prone bridges', 'Maintains access to residential areas']
      },
      landslide: {
        route: ['East Market Road', 'Station Access Road', 'Central Bypass'],
        reason: ['Avoids narrow hill roads', 'Uses wide arterial roads suitable for heavy vehicles', 'Maintains area coverage']
      },
      cyclone: {
        route: ['Station Access Road', 'District Hospital Road', 'Central Bypass'],
        reason: ['Avoids tree-lined corridors with falling debris', 'Uses wide corridors for vehicle clearance', 'Covers maximum residential area']
      },
      normal: {
        route: ['Rajpur Emergency Link', 'River Bridge Corridor', 'Station Access Road'],
        reason: ['Full network access for fire response', 'All wide corridors available', 'No restrictions on any route']
      }
    }
  },
  'relief-truck': {
    preferWide: true,
    avoidBridge: false,
    prioritizeHospital: false,
    speedFactor: 1.4,
    routes: {
      flood: {
        route: ['East Market Road', 'Relief Camp Connector', 'Canal Side Bypass'],
        reason: ['Connects supply depot to relief camps', 'Avoids severely flooded zones', 'Uses roads with drainage infrastructure']
      },
      landslide: {
        route: ['Station Access Road', 'East Market Road', 'Relief Camp Connector'],
        reason: ['Avoids debris-prone hill roads', 'Uses stable flat terrain', 'Ensures supply line to relief camps']
      },
      cyclone: {
        route: ['Station Access Road', 'East Market Road', 'Relief Camp Connector'],
        reason: ['Avoids tree-covered roads with debris', 'Uses sheltered corridors', 'Maintains supply chain to relief points']
      },
      normal: {
        route: ['Station Access Road', 'East Market Road', 'Relief Camp Connector'],
        reason: ['Standard supply route to relief camps', 'All roads accessible', 'Optimal logistics routing']
      }
    }
  },
  'evacuation-bus': {
    preferWide: true,
    avoidBridge: true,
    prioritizeHospital: false,
    speedFactor: 1.5,
    routes: {
      flood: {
        route: ['Station Access Road', 'Central Bypass', 'Evacuation Shelter Access'],
        reason: ['Avoids flooded low-lying roads and weak bridges', 'Uses wide roads for bus maneuverability', 'Direct route to evacuation shelter']
      },
      landslide: {
        route: ['East Market Road', 'Station Access Road', 'Evacuation Shelter Access'],
        reason: ['Avoids steep hill roads unsuitable for buses', 'Uses flat wide corridors', 'Maintains safe evacuation corridor']
      },
      cyclone: {
        route: ['Station Access Road', 'Central Bypass', 'Evacuation Shelter Access'],
        reason: ['Avoids tree-lined roads with falling branch risk', 'Uses wide open corridors', 'Ensures safe passage for evacuees']
      },
      normal: {
        route: ['River Bridge Corridor', 'Mussoorie Diversion Road', 'Evacuation Shelter Access'],
        reason: ['Standard evacuation route', 'All roads accessible for large vehicles', 'Shortest path to shelter']
      }
    }
  }
};

function getEmergencyRoute(vehicleType, scenarioKey) {
  const vehicle = vehicleRoutes[vehicleType];
  if (!vehicle) return null;

  const scenario = scenarios[scenarioKey] || scenarios['normal'];
  const routeData = vehicle.routes[scenarioKey] || vehicle.routes['normal'];

  const baseTravelTime = 12;
  const travelTime = Math.round(baseTravelTime * vehicle.speedFactor * (scenario.vehicleMultipliers[vehicleType] || 1.0));

  const adjustedBlockage = scenarioKey === 'normal' ? 0.1 : 0.3 + Math.random() * 0.2;
  let riskLevel = 'LOW';
  if (adjustedBlockage > 0.6) riskLevel = 'HIGH';
  else if (adjustedBlockage > 0.35) riskLevel = 'MODERATE';

  return {
    vehicleType,
    scenario: scenarioKey,
    recommendedRoute: routeData.route,
    estimatedTravelTime: travelTime,
    riskLevel,
    routeReason: routeData.reason
  };
}

module.exports = { getEmergencyRoute };
