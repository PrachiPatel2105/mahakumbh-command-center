import React, { useState, useEffect } from 'react';
import { AlertTriangle, Users, Play, Pause } from 'lucide-react';

function CrowdDensityMap({ zones: initialZones }) {
  const [zones, setZones] = useState(initialZones || []);
  const [isLiveSimulation, setIsLiveSimulation] = useState(false);

  // Update zones when prop changes
  useEffect(() => {
    if (initialZones) {
      setZones(initialZones);
    }
  }, [initialZones]);

  // Simulate live updates
  useEffect(() => {
    if (!isLiveSimulation) return;

    const interval = setInterval(() => {
      setZones(prevZones => 
        prevZones.map(zone => {
          // Random change between -500 and +800 people
          const change = Math.floor(Math.random() * 1300) - 500;
          const newCrowdCount = Math.max(
            0, 
            Math.min(zone.capacity, zone.crowdCount + change)
          );
          
          // Calculate new status based on occupancy
          const occupancy = (newCrowdCount / zone.capacity) * 100;
          let newStatus = 'safe';
          if (occupancy >= 80) newStatus = 'critical';
          else if (occupancy >= 60) newStatus = 'warning';

          return {
            ...zone,
            crowdCount: newCrowdCount,
            status: newStatus
          };
        })
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [isLiveSimulation]);

  const getOccupancyPercentage = (crowdCount, capacity) => {
    return Math.round((crowdCount / capacity) * 100);
  };

  const getOccupancyColor = (percentage) => {
    if (percentage >= 80) return 'bg-red-500';
    if (percentage >= 60) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'critical':
        return 'bg-red-600 text-white border-red-500';
      case 'warning':
        return 'bg-yellow-600 text-white border-yellow-500';
      default:
        return 'bg-green-600 text-white border-green-500';
    }
  };

  const getBorderColor = (status) => {
    switch (status) {
      case 'critical':
        return 'border-red-500 shadow-red-500/20';
      case 'warning':
        return 'border-yellow-500 shadow-yellow-500/20';
      default:
        return 'border-green-500 shadow-green-500/20';
    }
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl shadow-lg h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 flex items-center justify-between p-6 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white">Zone Status Monitor</h2>
          <p className="text-slate-400 text-xs mt-1">Real-time crowd density across all zones</p>
        </div>
        
        {/* Live Simulation Toggle */}
        <button
          onClick={() => setIsLiveSimulation(!isLiveSimulation)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
            isLiveSimulation
              ? 'bg-green-600 hover:bg-green-700 text-white'
              : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
          }`}
        >
          {isLiveSimulation ? (
            <>
              <Pause className="w-3 h-3" />
              Live ON
            </>
          ) : (
            <>
              <Play className="w-3 h-3" />
              Start Live
            </>
          )}
        </button>
      </div>

      {/* Legend */}
      <div className="flex-shrink-0 flex flex-wrap gap-3 px-6 pb-3 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded"></div>
          <span className="text-slate-400">Safe (0-60%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-yellow-500 rounded"></div>
          <span className="text-slate-400">Warning (60-80%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded"></div>
          <span className="text-slate-400">Critical (80%+)</span>
        </div>
      </div>

      {/* Zone Grid */}
      <div className="flex-1 overflow-y-auto px-6 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {zones.map((zone) => {
          const occupancy = getOccupancyPercentage(zone.crowdCount, zone.capacity);
          
          return (
              <div
                key={zone.id}
                className={`bg-slate-700 border-2 ${getBorderColor(zone.status)} rounded-lg p-3 transition-all duration-300 hover:border-opacity-80`}
              >
                {/* Zone Header */}
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-xs text-white leading-tight">
                    {zone.name}
                  </h3>
                  <span className={`px-1.5 py-0.5 text-xs font-bold uppercase rounded border ${getStatusBadgeColor(zone.status)}`}>
                    {zone.status}
                  </span>
                </div>

                {/* Crowd Count */}
                <div className="mb-2">
                  <div className="flex items-baseline justify-between mb-1">
                    <span className="text-base font-bold text-white">
                      {zone.crowdCount.toLocaleString()}
                    </span>
                    <span className="text-xs text-slate-400">
                      / {zone.capacity.toLocaleString()}
                    </span>
                  </div>
                  
                  {/* Occupancy Bar */}
                  <div className="w-full bg-slate-600 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-1.5 ${getOccupancyColor(occupancy)} transition-all duration-500 ease-out`}
                      style={{ width: `${occupancy}%` }}
                    ></div>
                  </div>
                  <div className="text-right mt-1">
                    <span className={`text-xs font-semibold ${
                      occupancy >= 80 ? 'text-red-400' :
                      occupancy >= 60 ? 'text-yellow-400' :
                      'text-green-400'
                    }`}>
                      {occupancy}%
                    </span>
                  </div>
                </div>

                {/* Zone Stats */}
                <div className="flex justify-between items-center pt-2 border-t border-slate-600 text-xs">
                  <div className="flex items-center gap-1 text-slate-400">
                    <AlertTriangle className="w-3 h-3" />
                    <span className="font-medium">{zone.activeIncidents}</span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-400">
                    <Users className="w-3 h-3" />
                    <span className="font-medium">{zone.volunteers}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Live Indicator */}
        {isLiveSimulation && (
          <div className="mt-3 flex items-center justify-center gap-2 text-xs text-green-400">
            <div className="relative">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <div className="absolute inset-0 w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
            </div>
            <span className="font-medium">Live simulation active</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default CrowdDensityMap;
