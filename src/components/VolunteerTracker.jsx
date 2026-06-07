import { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Users, AlertTriangle } from 'lucide-react';

const VolunteerTracker = ({ volunteers: initialVolunteers, zones }) => {
  const [volunteers, setVolunteers] = useState(initialVolunteers || []);
  const [toast, setToast] = useState(null);

  // Calculate status summary
  const statusSummary = useMemo(() => {
    const summary = volunteers.reduce(
      (acc, volunteer) => {
        acc[volunteer.status] = (acc[volunteer.status] || 0) + 1;
        return acc;
      },
      { active: 0, idle: 0, deployed: 0 }
    );
    return summary;
  }, [volunteers]);

  // Calculate volunteers per zone
  const volunteersPerZone = useMemo(() => {
    const zoneCount = {};
    
    volunteers.forEach((volunteer) => {
      if (!zoneCount[volunteer.zone]) {
        zoneCount[volunteer.zone] = { active: 0, idle: 0, deployed: 0 };
      }
      zoneCount[volunteer.zone][volunteer.status]++;
    });

    return Object.entries(zoneCount).map(([zone, counts]) => ({
      zone,
      total: counts.active + counts.idle + counts.deployed,
      active: counts.active,
      idle: counts.idle,
      deployed: counts.deployed,
    }));
  }, [volunteers]);

  // Get top 8 zones by volunteer count
  const top8Zones = useMemo(() => {
    return [...volunteersPerZone]
      .sort((a, b) => b.total - a.total)
      .slice(0, 8);
  }, [volunteersPerZone]);

  // Get understaffed zones (< 5 volunteers)
  const understaffedZones = useMemo(() => {
    return volunteersPerZone
      .filter((zone) => zone.total < 5)
      .sort((a, b) => a.total - b.total);
  }, [volunteersPerZone]);

  // Get count of idle volunteers
  const idleVolunteersCount = statusSummary.idle;

  // Deploy volunteer to understaffed zone
  const deployVolunteer = (targetZone) => {
    // Find an idle volunteer
    const idleVolunteer = volunteers.find((v) => v.status === 'idle');
    
    if (!idleVolunteer) {
      setToast('No idle volunteers available');
      setTimeout(() => setToast(null), 3000);
      return;
    }

    // Update volunteer status and zone
    setVolunteers((prevVolunteers) =>
      prevVolunteers.map((v) =>
        v.id === idleVolunteer.id
          ? { ...v, status: 'deployed', zone: targetZone }
          : v
      )
    );

    setToast(`${idleVolunteer.name} deployed to ${targetZone}`);
    setTimeout(() => setToast(null), 3000);
  };

  // Custom bar colors based on status composition
  const getBarColor = (data) => {
    const deployedRatio = data.deployed / data.total;
    if (deployedRatio > 0.6) return '#ef4444'; // red-500 - heavily deployed
    if (deployedRatio > 0.3) return '#f59e0b'; // amber-500 - moderately deployed
    return '#10b981'; // emerald-500 - good availability
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl shadow-lg h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 flex items-center gap-2 p-6 pb-4">
        <Users className="w-6 h-6 text-blue-500" />
        <h2 className="text-xl font-bold text-white">Volunteer Tracker</h2>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-6">
        <div className="space-y-6">
      {/* Status Summary Row */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-slate-700 border border-emerald-500/30 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-300">Active</span>
            <span className="px-2 py-1 bg-emerald-500 text-white text-xs font-bold rounded-full">
              {statusSummary.active}
            </span>
          </div>
        </div>
        
        <div className="bg-slate-700 border border-slate-600 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-300">Idle</span>
            <span className="px-2 py-1 bg-slate-500 text-white text-xs font-bold rounded-full">
              {statusSummary.idle}
            </span>
          </div>
        </div>
        
        <div className="bg-slate-700 border border-blue-500/30 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-300">Deployed</span>
            <span className="px-2 py-1 bg-blue-500 text-white text-xs font-bold rounded-full">
              {statusSummary.deployed}
            </span>
          </div>
        </div>
      </div>

      {/* Bar Chart - Top 8 Zones */}
      <div>
        <h3 className="text-sm font-semibold text-slate-300 mb-3">Volunteers per Zone (Top 8)</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={top8Zones} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
            <XAxis 
              dataKey="zone" 
              tick={{ fontSize: 11, fill: '#cbd5e1' }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis tick={{ fontSize: 11, fill: '#cbd5e1' }} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1e293b', 
                border: '1px solid #475569',
                borderRadius: '8px',
                fontSize: '12px',
                color: '#fff'
              }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-slate-800 border border-slate-600 rounded-lg p-3 shadow-lg">
                      <p className="font-semibold text-white mb-2">{data.zone}</p>
                      <p className="text-xs text-slate-300">Total: {data.total}</p>
                      <p className="text-xs text-emerald-400">Active: {data.active}</p>
                      <p className="text-xs text-slate-400">Idle: {data.idle}</p>
                      <p className="text-xs text-blue-400">Deployed: {data.deployed}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="total" radius={[8, 8, 0, 0]}>
              {top8Zones.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(entry)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Understaffed Zones Alert */}
      {understaffedZones.length > 0 && (
        <div className="border-2 border-red-500/50 rounded-lg bg-red-900/20 p-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <h3 className="text-sm font-bold text-red-300">
              Understaffed Zones ({understaffedZones.length})
            </h3>
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto">
            {understaffedZones.map((zone) => (
              <div
                key={zone.zone}
                className="bg-slate-700 border border-red-500/30 rounded-lg p-3 flex items-center justify-between"
              >
                <div className="flex-1">
                  <p className="text-sm font-semibold text-white">{zone.zone}</p>
                  <p className="text-xs text-red-400 font-medium">
                    Only {zone.total} volunteer{zone.total !== 1 ? 's' : ''} available
                  </p>
                </div>
                
                <button
                  onClick={() => deployVolunteer(zone.zone)}
                  disabled={idleVolunteersCount === 0}
                  className={`px-3 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                    idleVolunteersCount === 0
                      ? 'bg-slate-600 text-slate-400 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  Deploy Volunteer
                </button>
              </div>
            ))}
          </div>

          {idleVolunteersCount === 0 && (
            <p className="text-xs text-red-400 mt-3 text-center font-medium">
              No idle volunteers available for deployment
            </p>
          )}
        </div>
      )}

      {understaffedZones.length === 0 && (
        <div className="border border-green-500/50 rounded-lg bg-green-900/20 p-4 text-center">
          <p className="text-sm text-green-400 font-medium">
            ✓ All zones have adequate volunteer coverage
          </p>
        </div>
      )}
        </div>
      </div>

      {/* Toast notification */}
      {toast && (
        <div className="fixed bottom-4 right-4 bg-gray-800 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-slide-up z-50">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
          <span className="font-medium">{toast}</span>
        </div>
      )}
    </div>
  );
};

export default VolunteerTracker;
