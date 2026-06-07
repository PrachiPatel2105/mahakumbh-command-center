import { useMemo, useState } from 'react';
import { Bus, Clock, Navigation, AlertCircle, CheckCircle2, Zap, TrendingUp } from 'lucide-react';

const TransportStatus = ({ transport, zones }) => {
  const [selectedRoute, setSelectedRoute] = useState(null);

  // Calculate summary stats
  const stats = useMemo(() => {
    if (!transport) return { total: 0, onTime: 0, delayed: 0, full: 0 };
    
    return {
      total: transport.length,
      onTime: transport.filter(t => t.status === 'on-time').length,
      delayed: transport.filter(t => t.status === 'delayed').length,
      full: transport.filter(t => t.occupancy >= 95).length,
    };
  }, [transport]);

  // Get average occupancy
  const avgOccupancy = useMemo(() => {
    if (!transport || transport.length === 0) return 0;
    const sum = transport.reduce((acc, t) => acc + t.occupancy, 0);
    return Math.round(sum / transport.length);
  }, [transport]);

  // Get status styling
  const getStatusStyle = (route) => {
    const { occupancy, status } = route;
    
    if (occupancy >= 95) {
      return {
        badge: 'bg-red-500/20 text-red-400 border-red-500/50',
        icon: AlertCircle,
        label: 'FULL',
        bar: 'bg-red-500'
      };
    }
    
    if (status === 'delayed') {
      return {
        badge: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
        icon: Clock,
        label: 'DELAYED',
        bar: 'bg-yellow-500'
      };
    }
    
    return {
      badge: 'bg-green-500/20 text-green-400 border-green-500/50',
      icon: CheckCircle2,
      label: 'ON TIME',
      bar: occupancy >= 80 ? 'bg-orange-500' : occupancy >= 60 ? 'bg-yellow-500' : 'bg-green-500'
    };
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl shadow-lg h-full flex flex-col overflow-hidden">
      {/* Header with Stats */}
      <div className="flex-shrink-0 p-6 pb-4 border-b border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Bus className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Transport Hub</h2>
              <p className="text-xs text-slate-400">{stats.total} Active Routes</p>
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="flex items-center gap-3">
            <div className="text-center">
              <div className="text-lg font-bold text-green-400">{stats.onTime}</div>
              <div className="text-xs text-slate-400">On Time</div>
            </div>
            <div className="w-px h-8 bg-slate-700"></div>
            <div className="text-center">
              <div className="text-lg font-bold text-yellow-400">{stats.delayed}</div>
              <div className="text-xs text-slate-400">Delayed</div>
            </div>
            <div className="w-px h-8 bg-slate-700"></div>
            <div className="text-center">
              <div className="text-lg font-bold text-blue-400">{avgOccupancy}%</div>
              <div className="text-xs text-slate-400">Avg Load</div>
            </div>
          </div>
        </div>
      </div>

      {/* Routes List */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        <div className="space-y-2">
          {transport?.map((route) => {
            const statusStyle = getStatusStyle(route);
            const StatusIcon = statusStyle.icon;
            const isSelected = selectedRoute === route.id;
            
            return (
              <div
                key={route.id}
                onClick={() => setSelectedRoute(isSelected ? null : route.id)}
                className={`bg-slate-700/50 border rounded-lg p-4 cursor-pointer transition-all hover:bg-slate-700 ${
                  isSelected 
                    ? 'border-blue-500 shadow-lg shadow-blue-500/20' 
                    : 'border-slate-600 hover:border-slate-500'
                }`}
              >
                {/* Route Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="p-2 bg-slate-600 rounded-lg mt-0.5">
                      <Navigation className="w-4 h-4 text-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-white mb-1 leading-tight">
                        {route.route}
                      </h3>
                      <div className="flex items-center gap-3 text-xs text-slate-400">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>ETA {route.eta} min</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Zap className="w-3 h-3" />
                          <span>{route.occupancy}% capacity</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Status Badge */}
                  <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-bold ${statusStyle.badge}`}>
                    <StatusIcon className="w-3 h-3" />
                    <span>{statusStyle.label}</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="relative">
                  <div className="w-full bg-slate-600 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-2 ${statusStyle.bar} transition-all duration-500 rounded-full relative`}
                      style={{ width: `${route.occupancy}%` }}
                    >
                      {route.occupancy > 10 && (
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20"></div>
                      )}
                    </div>
                  </div>
                  
                  {/* Capacity markers */}
                  <div className="flex justify-between mt-1 text-xs">
                    <span className="text-slate-500">0%</span>
                    <span className="text-slate-500">50%</span>
                    <span className="text-slate-500">100%</span>
                  </div>
                </div>

                {/* Expanded Details */}
                {isSelected && (
                  <div className="mt-4 pt-4 border-t border-slate-600 grid grid-cols-3 gap-3 animate-slideDown">
                    <div className="bg-slate-600/50 rounded-lg p-3 text-center">
                      <div className="text-xs text-slate-400 mb-1">Next Stop</div>
                      <div className="text-sm font-semibold text-white">
                        {route.route.split(' → ')[1] || 'Terminal'}
                      </div>
                    </div>
                    <div className="bg-slate-600/50 rounded-lg p-3 text-center">
                      <div className="text-xs text-slate-400 mb-1">Passengers</div>
                      <div className="text-sm font-semibold text-white">~{Math.round(route.occupancy * 0.45)}</div>
                    </div>
                    <div className="bg-slate-600/50 rounded-lg p-3 text-center">
                      <div className="text-xs text-slate-400 mb-1">Speed</div>
                      <div className="text-sm font-semibold text-white">
                        {route.status === 'delayed' ? '12 km/h' : '25 km/h'}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer with Trend */}
      <div className="flex-shrink-0 p-4 border-t border-slate-700 bg-slate-700/30">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <span>Passenger flow: <span className="text-green-400 font-semibold">+12% vs yesterday</span></span>
          </div>
          <div className="text-slate-500">
            Updated: Just now
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransportStatus;
