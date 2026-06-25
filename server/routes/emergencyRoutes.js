const express = require('express');
const router = express.Router();
const { getEmergencyRoute } = require('../services/routeService');

router.get('/', (req, res) => {
  const vehicleType = req.query.vehicleType || 'ambulance';
  const scenario = req.query.scenario || 'normal';

  const validVehicles = ['ambulance', 'fire-truck', 'relief-truck', 'evacuation-bus'];
  const validScenarios = ['flood', 'landslide', 'cyclone', 'normal'];

  if (!validVehicles.includes(vehicleType)) {
    return res.status(400).json({ error: `Invalid vehicleType. Must be one of: ${validVehicles.join(', ')}` });
  }

  if (!validScenarios.includes(scenario)) {
    return res.status(400).json({ error: `Invalid scenario. Must be one of: ${validScenarios.join(', ')}` });
  }

  const route = getEmergencyRoute(vehicleType, scenario);
  res.json(route);
});

module.exports = router;
