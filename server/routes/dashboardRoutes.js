const express = require('express');
const router = express.Router();
const { getDashboard } = require('../services/dashboardService');

router.get('/', (req, res) => {
  const scenario = req.query.scenario || 'normal';
  const validScenarios = ['flood', 'landslide', 'cyclone', 'normal'];

  if (!validScenarios.includes(scenario)) {
    return res.status(400).json({ error: `Invalid scenario. Must be one of: ${validScenarios.join(', ')}` });
  }

  const dashboard = getDashboard(scenario);
  res.json(dashboard);
});

module.exports = router;
