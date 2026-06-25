# RouteShield AI — Satellite-to-Response Intelligence

> 🛰️ An ISRO hackathon prototype that transforms satellite imagery into emergency-response decisions for disaster mobility.

**⚠️ Prototype — All data is simulated for demonstration purposes. Not connected to live satellite feeds or real-time data.**

## Overview

RouteShield AI analyzes satellite imagery and road networks to help disaster-response teams:

- Identify which roads are most critical to the network
- Simulate the impact of road blockages during disasters
- Find vehicle-specific emergency routes
- Prioritize road restoration after disasters
- Recommend drone inspections for uncertain areas

## Main Features

| Feature | Description |
|---------|-------------|
| **Dashboard Overview** | KPIs, risk status, AI situation summary, interactive road map |
| **Road Intelligence** | Satellite view toggles, occlusion-aware road extraction analysis |
| **Disruption Simulator** | Simulate road blockages with dynamic network impact analysis |
| **Emergency Access** | Vehicle-specific routing (ambulance, fire truck, relief truck, bus) |
| **Recovery Priority** | Ranked road restoration priorities with drone inspection dispatch |
| **About Model** | Visual pipeline explaining the AI/ML methodology |

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + Vite + Tailwind CSS v4 |
| Backend | Node.js + Express |
| Data | Local JSON files |
| Icons | Lucide React |
| Maps | Custom SVG (no external map services) |

## Folder Structure

```
routeshield-ai/
├── client/                 # React frontend
│   └── src/
│       ├── components/     # Reusable glass UI components
│       ├── sections/       # Page sections (Overview, Simulator, etc.)
│       ├── services/       # API service layer
│       └── utils/          # Formatting utilities
├── server/                 # Express backend
│   ├── data/               # Mock JSON data files
│   ├── routes/             # API route handlers
│   └── services/           # Business logic services
└── README.md
```

## Setup

### Backend

```bash
cd server
npm install
npm run dev
```

Server starts on http://localhost:3001

### Frontend

```bash
cd client
npm install
npm run dev
```

App opens on http://localhost:5173

> Start the backend first so the frontend API proxy works correctly.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | Health check |
| `GET` | `/api/dashboard?scenario=flood` | Dashboard KPIs and AI summary |
| `GET` | `/api/roads` | All road segments |
| `GET` | `/api/roads/:id` | Single road detail |
| `POST` | `/api/simulate-blockage` | Simulate road failure impact |
| `GET` | `/api/emergency-routes?vehicleType=ambulance&scenario=flood` | Vehicle-specific routing |
| `GET` | `/api/recovery-priorities?scenario=flood` | Ranked restoration priorities |
| `POST` | `/api/drone-inspection` | Drone inspection recommendation |

### Supported Scenarios
`flood` · `landslide` · `cyclone` · `normal`

### Supported Vehicle Types
`ambulance` · `fire-truck` · `relief-truck` · `evacuation-bus`

## Data

All data simulates a road network around **Dehradun, Uttarakhand** with 10 road segments and 6 emergency locations. Road criticality, blockage probability, and impact calculations use scenario-specific multipliers.

## Future Integration

- 🛰️ Real satellite imagery (ISRO CARTOSAT, Sentinel)
- 🧠 Real road-segmentation model (U-Net / DeepLabV3+)
- 📡 SAR and optical imagery fusion
- 🗺️ GIS layers and real mapping
- ⚡ Real disaster alerts (IMD, NDMA)
- 🚗 Live traffic data integration
- 🛸 Real-time drone feeds
- 📊 Historical disaster pattern analysis

---

Built for the ISRO Space Technology Hackathon.
