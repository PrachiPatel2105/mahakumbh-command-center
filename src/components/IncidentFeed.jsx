import { useState } from 'react';
import { Heart, AlertOctagon, Flame, UserX, Clock } from 'lucide-react';

const IncidentFeed = ({ incidents: initialIncidents }) => {
  const [incidents, setIncidents] = useState(initialIncidents || []);
  const [filter, setFilter] = useState('all');
  const [toast, setToast] = useState(null);

  // Get incident icon based on type
  const getIncidentIcon = (type) => {
    const iconClass = 'w-5 h-5';
    switch (type) {
      case 'medical':
        return <Heart className={iconClass} />;
      case 'stampede_risk':
      case 'crowd_surge':
        return <AlertOctagon className={iconClass} />;
      case 'fire':
        return <Flame className={iconClass} />;
      case 'lost_person':
        return <UserX className={iconClass} />;
      default:
        return <AlertOctagon className={iconClass} />;
    }
  };

  // Get severity badge color
  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-500';
      case 'high':
        return 'bg-orange-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  // Get status pill styling
  const getStatusStyle = (status) => {
    switch (status) {
      case 'open':
        return 'bg-red-100 text-red-700 border-red-300';
      case 'assigned':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'resolved':
        return 'bg-green-100 text-green-700 border-green-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  // Calculate time elapsed
  const getTimeElapsed = (timestamp) => {
    const now = new Date();
    const incidentTime = new Date(timestamp);
    const diffMs = now - incidentTime;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hr ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  // Handle assign responder
  const handleAssignResponder = (incidentId, zone) => {
    setIncidents(prevIncidents =>
      prevIncidents.map(incident =>
        incident.id === incidentId
          ? { ...incident, status: 'assigned' }
          : incident
      )
    );

    // Show toast notification
    setToast(`Responder assigned to ${zone}`);
    setTimeout(() => setToast(null), 3000);
  };

  // Filter incidents
  const filteredIncidents = incidents.filter(incident => {
    if (filter === 'all') return true;
    if (filter === 'open') return incident.status === 'open';
    if (filter === 'critical') return incident.severity === 'critical';
    if (filter === 'resolved') return incident.status === 'resolved';
    return true;
  });

  // Sort by newest first
  const sortedIncidents = [...filteredIncidents].sort((a, b) => {
    return new Date(b.timestamp) - new Date(a.timestamp);
  });

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl shadow-lg h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 p-6 pb-4">
        <h2 className="text-xl font-bold text-white mb-4">Live Incident Feed</h2>
        
        {/* Filter buttons */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('open')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'open'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            Open
          </button>
          <button
            onClick={() => setFilter('critical')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'critical'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            Critical
          </button>
          <button
            onClick={() => setFilter('resolved')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'resolved'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            Resolved
          </button>
        </div>
      </div>

      {/* Scrollable incident list */}
      <div className="flex-1 overflow-y-auto px-6 pb-6">
        <div className="space-y-3 pr-2">
        {sortedIncidents.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            No incidents found for this filter
          </div>
        ) : (
          sortedIncidents.map((incident) => (
            <div
              key={incident.id}
              className="bg-slate-700 border border-slate-600 rounded-lg p-4 hover:border-slate-500 transition-all"
            >
              <div className="flex items-start gap-3">
                {/* Severity badge */}
                <div className="flex items-center gap-2 min-w-fit">
                  <div className={`w-3 h-3 rounded-full ${getSeverityColor(incident.severity)}`} />
                  <span className="text-xs font-semibold text-slate-300 uppercase">
                    {incident.severity}
                  </span>
                </div>

                {/* Incident icon */}
                <div className="text-slate-300 mt-0.5">
                  {getIncidentIcon(incident.type)}
                </div>

                {/* Main content */}
                <div className="flex-1 min-w-0">
                  {/* Zone name */}
                  <h3 className="text-sm font-bold text-white mb-1">
                    {incident.zone}
                  </h3>

                  {/* Description - truncated to 1 line */}
                  <p className="text-sm text-slate-300 mb-2 line-clamp-1">
                    {incident.description}
                  </p>

                  {/* Time and status row */}
                  <div className="flex items-center gap-3 flex-wrap">
                    {/* Time elapsed */}
                    <div className="flex items-center gap-1 text-xs text-slate-400">
                      <Clock className="w-3 h-3" />
                      <span>{getTimeElapsed(incident.timestamp)}</span>
                    </div>

                    {/* Status pill */}
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold uppercase border ${getStatusStyle(
                        incident.status
                      )}`}
                    >
                      {incident.status}
                    </span>
                  </div>
                </div>

                {/* Assign button */}
                {incident.status === 'open' && (
                  <button
                    onClick={() => handleAssignResponder(incident.id, incident.zone)}
                    className="px-3 py-2 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
                  >
                    Assign Responder
                  </button>
                )}
              </div>
            </div>
          ))
        )}
        </div>
      </div>

      {/* Toast notification */}
      {toast && (
        <div className="fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-slide-up z-50">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
          <span className="font-medium">{toast}</span>
        </div>
      )}
    </div>
  );
};

export default IncidentFeed;
