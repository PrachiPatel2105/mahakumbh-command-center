// Helper function to generate random names
const firstNames = ['Rajesh', 'Priya', 'Amit', 'Sneha', 'Vikram', 'Anjali', 'Rahul', 'Kavita', 'Suresh', 'Meera', 
  'Arun', 'Deepa', 'Sanjay', 'Pooja', 'Ravi', 'Nisha', 'Manoj', 'Asha', 'Dinesh', 'Suman',
  'Vikas', 'Rekha', 'Ajay', 'Sunita', 'Ramesh', 'Geeta', 'Prakash', 'Anita', 'Mohit', 'Kiran',
  'Sandeep', 'Mamta', 'Ashok', 'Usha', 'Pankaj', 'Ritu', 'Naveen', 'Seema', 'Sachin', 'Pallavi'];

const lastNames = ['Kumar', 'Sharma', 'Patel', 'Gupta', 'Singh', 'Verma', 'Yadav', 'Chauhan', 'Jain', 'Reddy',
  'Malhotra', 'Agarwal', 'Joshi', 'Desai', 'Nair', 'Iyer', 'Menon', 'Kapoor', 'Bhatia', 'Chopra',
  'Mishra', 'Pandey', 'Tiwari', 'Dubey', 'Saxena', 'Mehta', 'Shah', 'Sinha', 'Rao', 'Pillai'];

const generateName = (index) => {
  return `${firstNames[index % firstNames.length]} ${lastNames[Math.floor(index / firstNames.length) % lastNames.length]}`;
};

// ZONES - 12 major zones at Mahakumbh
export const ZONES = [
  {
    id: 1,
    name: 'Triveni Sangam',
    crowdCount: 45823,
    capacity: 50000,
    status: 'warning',
    activeIncidents: 2,
    volunteers: 48
  },
  {
    id: 2,
    name: 'Ram Ghat',
    crowdCount: 12456,
    capacity: 25000,
    status: 'safe',
    activeIncidents: 0,
    volunteers: 24
  },
  {
    id: 3,
    name: 'Mahakal Temple Complex',
    crowdCount: 32190,
    capacity: 35000,
    status: 'warning',
    activeIncidents: 1,
    volunteers: 32
  },
  {
    id: 4,
    name: 'Parking Zone A',
    crowdCount: 8934,
    capacity: 15000,
    status: 'safe',
    activeIncidents: 0,
    volunteers: 16
  },
  {
    id: 5,
    name: 'Main Bathing Ghat',
    crowdCount: 28567,
    capacity: 30000,
    status: 'warning',
    activeIncidents: 3,
    volunteers: 38
  },
  {
    id: 6,
    name: 'Food Court & Market',
    crowdCount: 19234,
    capacity: 40000,
    status: 'safe',
    activeIncidents: 1,
    volunteers: 28
  },
  {
    id: 7,
    name: 'Medical Camp Zone',
    crowdCount: 4521,
    capacity: 10000,
    status: 'safe',
    activeIncidents: 2,
    volunteers: 42
  },
  {
    id: 8,
    name: 'VIP Enclosure',
    crowdCount: 2876,
    capacity: 5000,
    status: 'safe',
    activeIncidents: 0,
    volunteers: 18
  },
  {
    id: 9,
    name: 'Transit Hub',
    crowdCount: 15678,
    capacity: 20000,
    status: 'safe',
    activeIncidents: 1,
    volunteers: 22
  },
  {
    id: 10,
    name: 'Northern Ghats',
    crowdCount: 18943,
    capacity: 20000,
    status: 'warning',
    activeIncidents: 1,
    volunteers: 26
  },
  {
    id: 11,
    name: 'Parking Zone B',
    crowdCount: 11234,
    capacity: 18000,
    status: 'safe',
    activeIncidents: 0,
    volunteers: 14
  },
  {
    id: 12,
    name: 'Emergency Services Hub',
    crowdCount: 3456,
    capacity: 8000,
    status: 'critical',
    activeIncidents: 4,
    volunteers: 52
  }
];

// INCIDENTS - 15 realistic incidents
export const INCIDENTS = [
  {
    id: 1,
    type: 'medical',
    zone: 'Triveni Sangam',
    severity: 'high',
    timestamp: new Date(Date.now() - 12 * 60000).toISOString(),
    description: 'Elderly pilgrim experiencing chest pain and difficulty breathing',
    status: 'assigned',
    responderCount: 3
  },
  {
    id: 2,
    type: 'lost_person',
    zone: 'Main Bathing Ghat',
    severity: 'medium',
    timestamp: new Date(Date.now() - 25 * 60000).toISOString(),
    description: 'Child separated from parents, wearing blue kurta, age approximately 7 years',
    status: 'open',
    responderCount: 2
  },
  {
    id: 3,
    type: 'crowd_surge',
    zone: 'Triveni Sangam',
    severity: 'critical',
    timestamp: new Date(Date.now() - 8 * 60000).toISOString(),
    description: 'Sudden crowd movement detected near entry gate 3, potential stampede risk',
    status: 'assigned',
    responderCount: 8
  },
  {
    id: 4,
    type: 'medical',
    zone: 'Ram Ghat',
    severity: 'low',
    timestamp: new Date(Date.now() - 45 * 60000).toISOString(),
    description: 'Minor injury from slip, first aid administered',
    status: 'resolved',
    responderCount: 1
  },
  {
    id: 5,
    type: 'fire',
    zone: 'Food Court & Market',
    severity: 'medium',
    timestamp: new Date(Date.now() - 35 * 60000).toISOString(),
    description: 'Small cooking fire in vendor stall, contained by onsite team',
    status: 'resolved',
    responderCount: 4
  },
  {
    id: 6,
    type: 'stampede_risk',
    zone: 'Northern Ghats',
    severity: 'high',
    timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
    description: 'Overcrowding at narrow passage, crowd control measures being implemented',
    status: 'assigned',
    responderCount: 6
  },
  {
    id: 7,
    type: 'medical',
    zone: 'Medical Camp Zone',
    severity: 'critical',
    timestamp: new Date(Date.now() - 20 * 60000).toISOString(),
    description: 'Heat stroke patient requiring immediate hospitalization',
    status: 'assigned',
    responderCount: 5
  },
  {
    id: 8,
    type: 'lost_person',
    zone: 'Mahakal Temple Complex',
    severity: 'medium',
    timestamp: new Date(Date.now() - 55 * 60000).toISOString(),
    description: 'Elderly woman with memory issues, reunited with family',
    status: 'resolved',
    responderCount: 2
  },
  {
    id: 9,
    type: 'crowd_surge',
    zone: 'Main Bathing Ghat',
    severity: 'high',
    timestamp: new Date(Date.now() - 10 * 60000).toISOString(),
    description: 'Crowd density exceeding safe limits at main bathing area',
    status: 'assigned',
    responderCount: 7
  },
  {
    id: 10,
    type: 'medical',
    zone: 'Transit Hub',
    severity: 'medium',
    timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
    description: 'Pilgrim experiencing dehydration, IV fluids being administered',
    status: 'assigned',
    responderCount: 2
  },
  {
    id: 11,
    type: 'lost_person',
    zone: 'Food Court & Market',
    severity: 'low',
    timestamp: new Date(Date.now() - 65 * 60000).toISOString(),
    description: 'Lost bag recovered and returned to owner',
    status: 'resolved',
    responderCount: 1
  },
  {
    id: 12,
    type: 'fire',
    zone: 'Parking Zone A',
    severity: 'low',
    timestamp: new Date(Date.now() - 90 * 60000).toISOString(),
    description: 'Small electrical fire in lighting, electrician dispatched',
    status: 'resolved',
    responderCount: 2
  },
  {
    id: 13,
    type: 'medical',
    zone: 'Emergency Services Hub',
    severity: 'high',
    timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
    description: 'Multiple patients with respiratory issues, oxygen support provided',
    status: 'assigned',
    responderCount: 6
  },
  {
    id: 14,
    type: 'stampede_risk',
    zone: 'Mahakal Temple Complex',
    severity: 'medium',
    timestamp: new Date(Date.now() - 40 * 60000).toISOString(),
    description: 'Entry gates temporarily closed to manage flow, situation stabilized',
    status: 'resolved',
    responderCount: 5
  },
  {
    id: 15,
    type: 'crowd_surge',
    zone: 'Emergency Services Hub',
    severity: 'critical',
    timestamp: new Date(Date.now() - 3 * 60000).toISOString(),
    description: 'Emergency: Panic situation developing, all nearby units mobilized',
    status: 'open',
    responderCount: 12
  }
];

// VOLUNTEERS - 200 volunteers
export const VOLUNTEERS = Array.from({ length: 200 }, (_, i) => ({
  id: i + 1,
  name: generateName(i),
  zone: ZONES[i % 12].name,
  role: ['medical', 'security', 'guide', 'transport'][i % 4],
  status: i % 7 === 0 ? 'idle' : i % 11 === 0 ? 'deployed' : 'active'
}));

// TRANSPORT - 20 shuttle routes
export const TRANSPORT = [
  { id: 1, route: 'Main Station → Triveni Sangam', occupancy: 87, status: 'operational', eta: 12 },
  { id: 2, route: 'Parking A → Ram Ghat', occupancy: 45, status: 'operational', eta: 8 },
  { id: 3, route: 'Airport → Transit Hub', occupancy: 92, status: 'delayed', eta: 25 },
  { id: 4, route: 'Transit Hub → Main Bathing Ghat', occupancy: 68, status: 'operational', eta: 5 },
  { id: 5, route: 'Hotel Zone → Mahakal Temple', occupancy: 55, status: 'operational', eta: 15 },
  { id: 6, route: 'Parking B → Food Court', occupancy: 34, status: 'operational', eta: 7 },
  { id: 7, route: 'Main Station → Medical Camp', occupancy: 23, status: 'operational', eta: 10 },
  { id: 8, route: 'VIP Gate → VIP Enclosure', occupancy: 78, status: 'operational', eta: 3 },
  { id: 9, route: 'Northern Ghats → Transit Hub', occupancy: 91, status: 'operational', eta: 18 },
  { id: 10, route: 'Food Court → Parking A', occupancy: 42, status: 'operational', eta: 9 },
  { id: 11, route: 'Ram Ghat → Mahakal Temple', occupancy: 88, status: 'delayed', eta: 22 },
  { id: 12, route: 'Emergency Hub → Main Station', occupancy: 15, status: 'operational', eta: 14 },
  { id: 13, route: 'Triveni Sangam → Transit Hub', occupancy: 95, status: 'operational', eta: 6 },
  { id: 14, route: 'Medical Camp → Emergency Hub', occupancy: 38, status: 'operational', eta: 4 },
  { id: 15, route: 'Parking B → Northern Ghats', occupancy: 61, status: 'operational', eta: 11 },
  { id: 16, route: 'Main Station → Food Court', occupancy: 73, status: 'operational', eta: 13 },
  { id: 17, route: 'Transit Hub → Parking B', occupancy: 29, status: 'operational', eta: 16 },
  { id: 18, route: 'Mahakal Temple → Main Station', occupancy: 84, status: 'delayed', eta: 28 },
  { id: 19, route: 'Airport → Hotel Zone', occupancy: 67, status: 'operational', eta: 20 },
  { id: 20, route: 'Circular Route (All Ghats)', occupancy: 52, status: 'operational', eta: 35 }
];

// METRICS - Overall event statistics
export const METRICS = {
  totalPilgrims: 213912,
  activeIncidents: 8,
  volunteersDeployed: 164,
  shuttlesRunning: 17,
  medicalCamps: 12,
  lostPersons: 3
};

// Export everything as default object too
export default {
  ZONES,
  INCIDENTS,
  VOLUNTEERS,
  TRANSPORT,
  METRICS
};
