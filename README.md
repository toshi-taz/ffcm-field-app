# FFCM Field App

**Offline-first PWA for sea turtle nesting data capture**
FFCM Campamentos Tortugueros — Xcacel-Xcacelito corridor, Quintana Roo, Mexico

---

## What it does

FFCM monitors ~70 km of nesting coastline across 13 beaches in Quintana Roo. Field volunteers currently record nesting events on paper with no standardized centralization. This PWA replaces paper registration with structured digital capture designed for real field conditions:

- **Offline-first** — all data stored locally via IndexedDB, no internet required
- **Red-light UI** — dark theme preserving night vision when working near nesting turtles
- **Large touch targets** — usable with gloves, in the dark, on wet hands
- **Auto-sync** — when WiFi is available at Xcacel base camp, pending records push to cloud automatically
- **Export** — CSV and JSON for analysis pipelines

## Data captured per event

| Field | Type |
|-------|------|
| Species | *Chelonia mydas*, *Caretta caretta*, *Dermochelys coriacea*, *Eretmochelys imbricata* |
| Event type | Nesting success, false crawl, hatchling emergence, relocation, stranding |
| Beach | Dropdown (13 FFCM-monitored beaches) |
| Nest zone | Supralitoral, litoral, vegetación |
| Egg count | Integer |
| Track width (cm) | Float |
| Nest ID | String |
| Observer initials | String |
| Notes | Free text |
| Timestamp | Auto ISO 8601 |

## Tech stack

React + Vite · vite-plugin-pwa + Workbox · IndexedDB · No backend dependency

## Getting started

```bash
git clone https://github.com/toshi-taz/ffcm-field-app
cd ffcm-field-app
npm install
npm run dev
```

Set sync endpoint in `.env`:
VITE_SYNC_URL=https://track-classifier.onrender.com/api/events

## Project structure
src/
├── views/
│   ├── HomeView.jsx      # Main menu with nightly stats
│   ├── NewEventView.jsx  # Nesting event capture form
│   └── RecordsView.jsx   # Record list + CSV/JSON export
├── db.js                 # IndexedDB wrapper
├── sync.js               # Auto-sync when online
├── constants.js          # Beaches, species, event types
├── App.jsx               # Root + routing
└── App.css               # Night-vision theme

## Part of a larger stack

| Repo | Function |
|------|----------|
| [wildlife-telemetry-node](https://github.com/toshi-taz/wildlife-telemetry-node) | ESP32 + LoRa sensor nodes |
| [wildlife-telemetry-pipeline](https://github.com/toshi-taz/wildlife-telemetry-pipeline) | LoRa→CSV→map pipeline |
| [track-classifier](https://github.com/toshi-taz/track-classifier) | AI turtle track classifier |
| **ffcm-field-app** | This repo — offline field capture |

**Target deployment:** June 30, 2026 — FFCM nesting season, Xcacel, Quintana Roo.

## License

MIT

## Author

Alexander Toshiro Bataz López · UPIEM–IPN · github.com/toshi-taz
