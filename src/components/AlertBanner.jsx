import { useState, useEffect, useMemo } from 'react';
import { AlertTriangle, X, Clock } from 'lucide-react';

const AlertBanner = ({ incidents: initialIncidents }) => {
  const [incidents, setIncidents] = useState(initialIncidents || []);
  const [dismissedAlerts, setDismissedAlerts] = useState(new Set());

  // Auto-generate new alerts every 45 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate a new alert by creating a synthetic incident
      const zones = [
        'Triveni Sangam',
        'Main Bathing Ghat',
        'Ram Ghat',
        'Mahakal Temple Complex',
        'Northern Ghats',
        'Food Court & Market'
      ];
      
      const types = ['medical', 'crowd_surge', 'stampede_risk', 'fire'];
      const severities = ['critical', 'high'];
      
      const descriptions = {
        medical: [
          'Multiple pilgrims experiencing heat exhaustion',
          'Elderly pilgrim collapsed, medical team responding',
          'Child injury reported, ambulance en route'
        ],
        crowd_surge: [
          'Sudden crowd movement detected near main entrance',
          'Crowd density exceeding safe threshold',
          'Barrier breach reported, crowd control engaged'
        ],
        stampede_risk: [
          'Panic situation developing in narrow passage',
          'Overcrowding at entry point, immediate intervention needed',
          'Push detected in queue area, security responding'
        ],
        fire: [
          'Smoke detected in vendor area',
          'Small fire reported in kitchen section',
          'Electrical short circuit, fire team dispatched'
        ]
      };

      const randomType = types[Math.floor(Math.random() * types.length)];
      const randomZone = zones[Math.floor(Math.random() * zones.length)];
      const randomSeverity = severities[Math.floor(Math.random() * severities.length)];
      const randomDesc = descriptions[randomType][Math.floor(Math.random() * descriptions[randomType].length)];

      const newIncident = {
        id: `auto-${Date.now()}`,
        type: randomType,
        zone: randomZone,
        severity: randomSeverity,
        timestamp: new Date().toISOString(),
        description: randomDesc,
        status: 'open',
        responderCount: 0,
        isNew: true // Mark as newly generated
      };

      setIncidents(prev => [newIncident, ...prev]);
    }, 45000); // 45 seconds

    return () => clearInterval(interval);
  }, []);

  // Get critical and high severity open incidents
  const activeAlerts = useMemo(() => {
    return incidents
      .filter(incident => 
        (incident.severity === 'critical' || incident.severity === 'high') &&
        incident.status === 'open' &&
        !dismissedAlerts.has(incident.id)
      )
      .sort((a, b) => {
        // Sort by severity first (critical > high)
        if (a.severity === 'critical' && b.severity !== 'critical') return -1;
        if (a.severity !== 'critical' && b.severity === 'critical') return 1;
        // Then by timestamp (newest first)
        return new Date(b.timestamp) - new Date(a.timestamp);
      });
  }, [incidents, dismissedAlerts]);

  // Get the top alert to display
  const topAlert = activeAlerts[0];
  const additionalAlertsCount = activeAlerts.length - 1;

  // Calculate time elapsed
  const getTimeElapsed = (timestamp) => {
    const now = new Date();
    const incidentTime = new Date(timestamp);
    const diffMs = now - incidentTime;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hr ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  // Get banner styling based on severity
  const getBannerStyle = (severity) => {
    if (severity === 'critical') {
      return {
        bg: 'bg-red-600',
        border: 'border-red-700',
        text: 'text-white',
        icon: 'text-white',
        badge: 'bg-red-800'
      };
    }
    return {
      bg: 'bg-orange-500',
      border: 'border-orange-600',
      text: 'text-white',
      icon: 'text-white',
      badge: 'bg-orange-700'
    };
  };

  // Dismiss alert
  const dismissAlert = (alertId) => {
    setDismissedAlerts(prev => new Set([...prev, alertId]));
  };

  // Don't render if no alerts
  if (!topAlert) {
    return null;
  }

  const style = getBannerStyle(topAlert.severity);
  const isCritical = topAlert.severity === 'critical';

  return (
    <div
      className={`${style.bg} ${style.border} border-2 rounded-lg shadow-lg p-4 mb-6 ${
        isCritical ? 'animate-blink' : ''
      }`}
    >
      <div className="flex items-start gap-4">
        {/* Alert icon */}
        <div className="flex-shrink-0 mt-0.5">
          <AlertTriangle className={`w-6 h-6 ${style.icon} ${isCritical ? 'animate-pulse' : ''}`} />
        </div>

        {/* Alert content */}
        <div className="flex-1 min-w-0">
          {/* Severity badge */}
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-3 py-1 ${style.badge} ${style.text} text-xs font-bold uppercase rounded-full`}>
              {topAlert.severity} ALERT
            </span>
            {topAlert.isNew && (
              <span className="px-2 py-1 bg-white text-red-600 text-xs font-bold uppercase rounded animate-pulse">
                NEW
              </span>
            )}
          </div>

          {/* Alert message */}
          <p className={`${style.text} text-base font-semibold mb-1`}>
            {topAlert.description} at <span className="font-bold">{topAlert.zone}</span>
          </p>

          {/* Timestamp and additional alerts */}
          <div className="flex items-center gap-4 flex-wrap">
            <div className={`flex items-center gap-1 ${style.text} text-sm opacity-90`}>
              <Clock className="w-4 h-4" />
              <span>{getTimeElapsed(topAlert.timestamp)}</span>
            </div>

            {additionalAlertsCount > 0 && (
              <span className={`px-2 py-1 ${style.badge} ${style.text} text-xs font-bold rounded`}>
                +{additionalAlertsCount} more {topAlert.severity} alert{additionalAlertsCount !== 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>

        {/* Dismiss button */}
        <button
          onClick={() => dismissAlert(topAlert.id)}
          className={`flex-shrink-0 ${style.text} hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition-colors`}
          aria-label="Dismiss alert"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Additional alerts preview (if any) */}
      {additionalAlertsCount > 0 && (
        <div className="mt-3 pt-3 border-t border-white border-opacity-30">
          <p className={`${style.text} text-xs font-medium opacity-90`}>
            Other active alerts:
          </p>
          <div className="mt-2 space-y-1">
            {activeAlerts.slice(1, 3).map(alert => (
              <div key={alert.id} className={`${style.text} text-xs opacity-80 flex items-center gap-2`}>
                <div className="w-1.5 h-1.5 rounded-full bg-white opacity-60" />
                <span className="truncate">{alert.zone}: {alert.description}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AlertBanner;
