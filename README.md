# Mahakumbh Command Center

A real-time monitoring and coordination dashboard for the Mahakumbh event. This application provides comprehensive crowd management, incident tracking, volunteer coordination, and AI-powered insights.

## Features

- **Real-time Metrics**: Live tracking of crowd size, incidents, volunteers, and peak predictions
- **Interactive Map**: Crowd density visualization with color-coded zones
- **Incident Management**: Real-time incident feed with status tracking
- **Volunteer Coordination**: Active volunteer tracking with location and contact details
- **Transport Monitoring**: Live status of buses, trains, and ferries
- **AI Insights**: Predictive analytics for crowd management and resource allocation
- **Alert System**: Emergency alert banner for critical notifications

## Technology Stack

- **React 18**: Modern UI library
- **Vite**: Fast build tool and dev server
- **Tailwind CSS**: Utility-first styling
- **Leaflet & React-Leaflet**: Interactive mapping
- **Recharts**: Data visualization
- **Lucide React**: Beautiful icon set

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Navigate to the project directory:
```bash
cd mahakumbh-command-center
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to the URL shown in the terminal (typically http://localhost:5173)

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
mahakumbh-command-center/
├── src/
│   ├── components/
│   │   ├── Header.jsx              # Top header with branding
│   │   ├── MetricCards.jsx         # Key metrics display
│   │   ├── CrowdDensityMap.jsx     # Interactive crowd map
│   │   ├── IncidentFeed.jsx        # Live incident updates
│   │   ├── VolunteerTracker.jsx    # Volunteer management
│   │   ├── TransportStatus.jsx     # Transport monitoring
│   │   ├── AlertBanner.jsx         # Emergency alerts
│   │   └── AIInsightsPanel.jsx     # AI predictions
│   ├── data/
│   │   └── mockData.js             # Sample data
│   ├── App.jsx                     # Main application
│   ├── main.jsx                    # Entry point
│   └── index.css                   # Global styles
├── package.json
├── index.html
├── vite.config.js
└── tailwind.config.js
```

## Features Overview

### Metrics Dashboard
- Current crowd count with live updates
- Active incident counter
- On-duty volunteer tracking
- Peak crowd predictions

### Crowd Density Map
- Interactive map with multiple zones
- Color-coded density levels (Low, Medium, High, Critical)
- Real-time population data per zone
- Clickable markers with detailed information

### Incident Feed
- Live incident updates
- Status indicators (Active, In-Progress, Resolved)
- Severity levels (Low, Medium, High)
- Location and timestamp information

### Volunteer Tracker
- Active volunteer list with roles
- Real-time location tracking
- Contact information
- Status updates (Active, Break)

### Transport Status
- Bus, train, and ferry monitoring
- Capacity tracking with visual indicators
- Active unit counts
- Status alerts (Operational, Delayed, Crowded)

### AI Insights
- Predictive crowd analytics
- Resource allocation recommendations
- Weather impact analysis
- Bottleneck detection and warnings

## Customization

### Updating Mock Data
Edit `src/data/mockData.js` to customize:
- Zone locations and density
- Incident types and severity
- Volunteer assignments
- Transport capacity

### Styling
The application uses Tailwind CSS. Modify styles in:
- Component files for local changes
- `tailwind.config.js` for theme customization
- `src/index.css` for global styles

## License

MIT
