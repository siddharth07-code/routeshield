const express = require('express');
const router = express.Router();
const { getRecoveryPriorities } = require('../services/priorityService');

router.get('/', (req, res) => {
  const scenario = req.query.scenario || 'normal';
  const validScenarios = ['flood', 'landslide', 'cyclone', 'normal'];

  if (!validScenarios.includes(scenario)) {
    return res.status(400).json({ error: `Invalid scenario. Must be one of: ${validScenarios.join(', ')}` });
  }

  const priorities = getRecoveryPriorities(scenario);
  res.json(priorities);
});

module.exports = router;
