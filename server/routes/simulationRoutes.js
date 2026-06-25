const express = require('express');
const router = express.Router();
const { simulateBlockage } = require('../services/simulationService');

router.post('/', (req, res) => {
  const { roadId, scenario, vehicleType } = req.body;

  if (!roadId) {
    return res.status(400).json({ error: 'roadId is required' });
  }

  const validScenarios = ['flood', 'landslide', 'cyclone', 'normal'];
  const validVehicles = ['ambulance', 'fire-truck', 'relief-truck', 'evacuation-bus'];

  const scenarioKey = validScenarios.includes(scenario) ? scenario : 'normal';
  const vehicle = validVehicles.includes(vehicleType) ? vehicleType : 'ambulance';

  const result = simulateBlockage(roadId, scenarioKey, vehicle);

  if (!result) {
    return res.status(404).json({ error: `Road with id '${roadId}' not found` });
  }

  res.json(result);
});

module.exports = router;
