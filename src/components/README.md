# Components Documentation

## MetricCards Component

### Overview
The MetricCards component displays six key metrics for the Mahakumbh 2028 Operations Command Center in a responsive grid layout.

### Features

#### 📊 Six Metric Cards:

1. **Total Pilgrims Today**
   - Icon: Users (blue)
   - Shows: Total pilgrim count
   - Trend: "+2.3k this hour" (green)

2. **Active Incidents**
   - Icon: AlertTriangle (red)
   - Shows: Count of open/assigned incidents
   - Trend: Number of critical incidents (red)
   - **Pulse animation when > 0**

3. **Volunteers Deployed**
   - Icon: Shield (green)
   - Shows: Number of deployed volunteers
   - Trend: Percentage of total (green)

4. **Shuttles Running**
   - Icon: Bus (purple)
   - Shows: Number of operational shuttles
   - Trend: Number of delayed shuttles (neutral)

5. **Medical Camps Active**
   - Icon: Heart (teal)
   - Shows: Number of active medical camps
   - Trend: "All operational" (green)

6. **Lost Persons Open**
   - Icon: Search (orange)
   - Shows: Number of open lost person cases
   - Trend: "Being located" (neutral)
   - **Pulse animation when > 0**

### Responsive Grid Layout

- **Desktop (lg)**: 3 columns
- **Tablet (md)**: 2 columns
- **Mobile**: 1 column

### Styling

- **Background**: slate-800
- **Border**: slate-700
- **Border Radius**: rounded-xl (12px)
- **Hover Effects**: 
  - Shadow elevation
  - Border color change to slate-600
  - Smooth transition (300ms)

### Card Structure

```
┌─────────────────────────────────┐
│ [Icon]           [Trend]        │
│                                 │
│ LABEL (uppercase, small)        │
│ 123,456 (large, bold)          │
└─────────────────────────────────┘
```

### Props
None - Component fetches data directly from `mockData.js`

### Dependencies
- `lucide-react`: Icons (Users, AlertTriangle, Shield, Bus, Heart, Search)
- `../data/mockData`: Data source (METRICS, INCIDENTS)

### Usage

```jsx
import MetricCards from './components/MetricCards';

function App() {
  return (
    <div>
      <MetricCards />
    </div>
  );
}
```

### Dynamic Features

1. **Real-time Calculations**:
   - Active incidents calculated from INCIDENTS array
   - Critical incident count derived from severity
   - Pulse animations based on values

2. **Color-coded Trends**:
   - Green: Positive/good trend
   - Red: Negative/concerning trend
   - Gray: Neutral information

3. **Animations**:
   - Pulse animation on Active Incidents card (if activeIncidents > 0)
   - Pulse animation on Lost Persons card (if lostPersons > 0)
   - Hover animation on all cards

### Customization

To modify metrics, edit the `cards` array in the component:

```javascript
const cards = [
  {
    icon: Users,
    label: 'Your Custom Label',
    value: yourValue,
    trend: 'Your trend text',
    trendPositive: true, // true/false/null
    color: 'bg-blue-600',
    iconColor: 'text-blue-500',
    shouldPulse: condition
  }
];
```

### Color Palette

- Blue: `bg-blue-600`, `text-blue-500`
- Red: `bg-red-600`, `text-red-500`
- Green: `bg-green-600`, `text-green-500`
- Purple: `bg-purple-600`, `text-purple-500`
- Teal: `bg-teal-600`, `text-teal-500`
- Orange: `bg-orange-600`, `text-orange-500`

---

## CrowdDensityMap Component

### Overview
A visual zone monitoring grid displaying all 12 Mahakumbh zones with real-time crowd density information and live simulation capability.

### Features

#### 📍 Zone Cards Display:

Each zone card shows:
1. **Zone Name** (e.g., "Triveni Sangam")
2. **Status Badge**: SAFE / WARNING / CRITICAL
3. **Crowd Count**: Current / Capacity (e.g., "45,000 / 50,000")
4. **Occupancy Bar**: Visual fill bar with color coding
5. **Occupancy Percentage**: Calculated in real-time
6. **Active Incidents**: Number of incidents in zone
7. **Volunteers**: Number of staff assigned to zone

#### 🎯 Status Color Coding:

- **SAFE (Green)**: 0-60% occupancy
  - Green border (`border-green-500`)
  - Green fill bar
  
- **WARNING (Yellow)**: 60-80% occupancy
  - Yellow border (`border-yellow-500`)
  - Yellow fill bar
  
- **CRITICAL (Red)**: 80%+ occupancy
  - Red border (`border-red-500`)
  - Red fill bar

#### 🔴 Live Simulation Feature:

**"Simulate Live Update" Button:**
- Toggles live simulation mode
- When **ON**:
  - Updates every 3 seconds
  - Random crowd changes (-500 to +800 people)
  - Automatic status recalculation
  - Green indicator shows "Live simulation active"
  - Button shows "Live Updates ON" with Pause icon
- When **OFF**:
  - Static data display
  - Button shows "Start Live Simulation" with Play icon

### Responsive Grid Layout

- **XL screens**: 4 columns
- **Large (lg)**: 3 columns
- **Medium (md)**: 2 columns
- **Mobile**: 1 column

### Card Structure

```
┌─────────────────────────────────┐
│ Zone Name        [STATUS BADGE] │
│                                 │
│ 45,000 / 50,000                 │
│ ████████████░░░░  90% occupied  │
│                                 │
│ ⚠ 2 incidents    👥 48 staff    │
└─────────────────────────────────┘
```

### Component State

```javascript
const [zones, setZones] = useState(INITIAL_ZONES);
const [isLiveSimulation, setIsLiveSimulation] = useState(false);
```

### Live Update Logic

```javascript
// Updates every 3 seconds when simulation is active
const change = Math.floor(Math.random() * 1300) - 500;
const newCrowdCount = Math.max(0, Math.min(capacity, crowdCount + change));

// Auto-recalculate status
const occupancy = (newCrowdCount / capacity) * 100;
if (occupancy >= 80) status = 'critical';
else if (occupancy >= 60) status = 'warning';
else status = 'safe';
```

### Key Functions

1. **getOccupancyPercentage(crowdCount, capacity)**
   - Returns: percentage as integer

2. **getOccupancyColor(percentage)**
   - Returns: Tailwind color class based on threshold

3. **getStatusBadgeColor(status)**
   - Returns: Badge styling classes

4. **getBorderColor(status)**
   - Returns: Border and shadow classes for card

### Props
None - Component manages its own state and fetches initial data from `mockData.js`

### Dependencies
- `lucide-react`: Icons (AlertTriangle, Users, Play, Pause)
- `../data/mockData`: Data source (ZONES)
- React hooks: `useState`, `useEffect`

### Usage

```jsx
import CrowdDensityMap from './components/CrowdDensityMap';

function App() {
  return (
    <div>
      <CrowdDensityMap />
    </div>
  );
}
```

### Styling

- **Container**: slate-900 background, slate-800 border
- **Zone Cards**: slate-800 background with status-based borders
- **Borders**: 2px solid, animated on status change
- **Hover Effects**: Shadow elevation
- **Transitions**: 300ms for cards, 500ms for occupancy bars

### Animation Features

1. **Occupancy Bar Animation**:
   - Smooth width transition (500ms ease-out)
   - Color changes based on threshold

2. **Live Indicator**:
   - Pulse animation on green dot
   - Ping animation for visual emphasis

3. **Status Border**:
   - Changes smoothly when status updates
   - Shadow glow matching border color

### Accessibility

- Clear visual hierarchy
- Color-coded with text labels (not color-only)
- Hover states for interactivity
- Button states clearly indicated

### Performance

- Simulation uses single interval
- Cleanup on component unmount
- Efficient re-renders with proper state management
- Respects capacity boundaries (no overflow)

### Example Zones

1. **Triveni Sangam**: 45,823 / 50,000 (Warning)
2. **Ram Ghat**: 12,456 / 25,000 (Safe)
3. **Mahakal Temple**: 32,190 / 35,000 (Warning)
4. **Emergency Services Hub**: 3,456 / 8,000 (Critical)
5. ...and 8 more zones

---

**Component Paths**: 
- `src/components/MetricCards.jsx`
- `src/components/CrowdDensityMap.jsx`

**Last Updated**: June 7, 2026
