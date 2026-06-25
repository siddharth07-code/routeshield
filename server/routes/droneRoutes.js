const express = require('express');
const router = express.Router();
const { getDroneInspection } = require('../services/priorityService');

router.post('/', (req, res) => {
  const { roadId } = req.body;

  if (!roadId) {
    return res.status(400).json({ error: 'roadId is required' });
  }

  const inspection = getDroneInspection(roadId);

  if (!inspection) {
    return res.status(404).json({ error: `Road with id '${roadId}' not found` });
  }

  res.json(inspection);
});

module.exports = router;
