const express = require('express');
const router = express.Router();
const roads = require('../data/roads.json');

router.get('/', (req, res) => {
  res.json(roads);
});

router.get('/:id', (req, res) => {
  const road = roads.find(r => r.id === req.params.id);
  if (!road) {
    return res.status(404).json({ error: `Road with id '${req.params.id}' not found` });
  }
  res.json(road);
});

module.exports = router;
