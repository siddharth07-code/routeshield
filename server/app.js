const express = require('express');
const cors = require('cors');
const path = require('path');

const healthRoutes = require('./routes/healthRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const roadRoutes = require('./routes/roadRoutes');
const simulationRoutes = require('./routes/simulationRoutes');
const emergencyRoutes = require('./routes/emergencyRoutes');
const recoveryRoutes = require('./routes/recoveryRoutes');
const droneRoutes = require('./routes/droneRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/health', healthRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/roads', roadRoutes);
app.use('/api/simulate-blockage', simulationRoutes);
app.use('/api/emergency-routes', emergencyRoutes);
app.use('/api/recovery-priorities', recoveryRoutes);
app.use('/api/drone-inspection', droneRoutes);

// Serve built frontend in production
const clientDistPath = path.join(__dirname, '..', 'client', 'dist');
app.use(express.static(clientDistPath));

// SPA fallback — serve index.html for any non-API route
app.get('*', (req, res) => {
  res.sendFile(path.join(clientDistPath, 'index.html'));
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err.message);
  res.status(500).json({ error: 'Internal server error' });
});

if (process.env.NODE_ENV !== 'production' || process.env.RENDER) {
  app.listen(PORT, () => {
    console.log(`\n  🛰️  RouteShield AI Backend`);
    console.log(`  ─────────────────────────`);
    console.log(`  Running on http://localhost:${PORT}`);
    console.log(`  Health: http://localhost:${PORT}/api/health\n`);
  });
}

module.exports = app;
