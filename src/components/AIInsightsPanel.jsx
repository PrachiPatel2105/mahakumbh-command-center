import { useState, useMemo, useEffect } from 'react';
import { Sparkles, AlertTriangle, Info, CheckCircle, TrendingUp, RefreshCw } from 'lucide-react';

const AIInsightsPanel = ({ zones, incidents, volunteers, transport, metrics }) => {
  const [lastAnalyzed, setLastAnalyzed] = useState(new Date());
  const [animateCards, setAnimateCards] = useState(false);
  const [dismissedInsights, setDismissedInsights] = useState(new Set());
  const [actionedInsights, setActionedInsights] = useState(new Map());
  const [toast, setToast] = useState(null);

  // Show toast notification
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Rule-based insights engine
  const generateInsights = useMemo(() => {
    const insights = [];

    // Rule 1: High capacity zones (> 85%)
    const highCapacityZones = zones?.filter(zone => {
      const capacityPercent = (zone.crowdCount / zone.capacity) * 100;
      return capacityPercent > 85;
    }) || [];

    highCapacityZones.forEach(zone => {
      const capacityPercent = ((zone.crowdCount / zone.capacity) * 100).toFixed(1);
      insights.push({
        id: `capacity-${zone.id}`,
        severity: 'high',
        icon: AlertTriangle,
        title: 'Crowd Surge Risk Detected',
        text: `${zone.name} is at ${capacityPercent}% capacity (${zone.crowdCount.toLocaleString()}/${zone.capacity.toLocaleString()} pilgrims). Immediate crowd diversion recommended.`,
        action: 'Divert Flow via Gate 3',
        actionType: 'divert'
      });
    });

    // Rule 2: High incident load (> 5 active incidents)
    const activeIncidentCount = incidents?.filter(i => i.status === 'open' || i.status === 'assigned').length || 0;
    if (activeIncidentCount > 5) {
      insights.push({
        id: 'incident-load',
        severity: 'medium',
        icon: AlertTriangle,
        title: 'High Incident Activity',
        text: `${activeIncidentCount} active incidents currently being managed. Response capacity may be strained during peak hours.`,
        action: 'Activate Backup Response Team',
        actionType: 'activate'
      });
    }

    // Rule 3: Volunteer shortage in crowded zones
    const volunteerCountByZone = {};
    volunteers?.forEach(v => {
      volunteerCountByZone[v.zone] = (volunteerCountByZone[v.zone] || 0) + 1;
    });

    zones?.forEach(zone => {
      const volunteerCount = volunteerCountByZone[zone.name] || 0;
      if (volunteerCount < 3 && zone.crowdCount > 10000) {
        insights.push({
          id: `volunteer-${zone.id}`,
          severity: 'high',
          icon: AlertTriangle,
          title: 'Critical Volunteer Shortage',
          text: `${zone.name} has only ${volunteerCount} volunteer${volunteerCount !== 1 ? 's' : ''} managing ${zone.crowdCount.toLocaleString()} pilgrims. Volunteer-to-crowd ratio is dangerously low.`,
          action: 'Deploy 5 Additional Guides',
          actionType: 'deploy'
        });
      }
    });

    // Rule 4: Lost persons elevated (> 3)
    const lostPersonIncidents = incidents?.filter(i => i.type === 'lost_person' && i.status !== 'resolved').length || 0;
    if (lostPersonIncidents > 3) {
      insights.push({
        id: 'lost-persons',
        severity: 'medium',
        icon: Info,
        title: 'Elevated Lost Person Reports',
        text: `${lostPersonIncidents} active lost person cases. Pattern suggests need for enhanced wayfinding and announcement systems.`,
        action: 'Activate Announcement System',
        actionType: 'announce'
      });
    }

    // Rule 5: Medical incidents pattern
    const medicalIncidents = incidents?.filter(i => i.type === 'medical' && i.status !== 'resolved').length || 0;
    if (medicalIncidents >= 3) {
      insights.push({
        id: 'medical-pattern',
        severity: 'medium',
        icon: AlertTriangle,
        title: 'Medical Incident Pattern',
        text: `${medicalIncidents} active medical cases. Consider heat stress and dehydration as primary factors. Medical stations should be on high alert.`,
        action: 'Alert Medical Camps',
        actionType: 'medical'
      });
    }

    // Rule 6: Critical severity incidents
    const criticalIncidents = incidents?.filter(i => i.severity === 'critical' && i.status !== 'resolved') || [];
    if (criticalIncidents.length > 0) {
      const zones = criticalIncidents.map(i => i.zone).join(', ');
      insights.push({
        id: 'critical-incidents',
        severity: 'critical',
        icon: AlertTriangle,
        title: 'Critical Incidents Active',
        text: `${criticalIncidents.length} critical incident${criticalIncidents.length !== 1 ? 's' : ''} in progress at: ${zones}. All emergency resources should be on standby.`,
        action: 'Mobilize Emergency Resources',
        actionType: 'emergency'
      });
    }

    // Rule 7: Transport congestion
    const highOccupancyRoutes = transport?.filter(t => t.occupancy >= 90) || [];
    if (highOccupancyRoutes.length >= 3) {
      insights.push({
        id: 'transport-congestion',
        severity: 'medium',
        icon: Info,
        title: 'Transport System Strain',
        text: `${highOccupancyRoutes.length} shuttle routes are at or near capacity. Consider deploying additional vehicles on high-demand corridors.`,
        action: 'Deploy Additional Shuttles',
        actionType: 'transport'
      });
    }

    // Rule 8: ALWAYS show 1 positive insight (least congested route)
    const leastCongestedRoute = transport?.reduce((min, route) => 
      route.occupancy < min.occupancy ? route : min
    , transport?.[0] || {});

    if (leastCongestedRoute?.route) {
      insights.push({
        id: 'optimal-flow',
        severity: 'positive',
        icon: CheckCircle,
        title: 'Optimal Transport Flow',
        text: `${leastCongestedRoute.route} is operating efficiently at ${leastCongestedRoute.occupancy}% capacity with ${leastCongestedRoute.eta} min ETA. Excellent passenger flow management.`,
        action: 'View Route Details',
        actionType: 'info'
      });
    }

    // Rule 9: All clear zones
    const safeZones = zones?.filter(zone => {
      const capacityPercent = (zone.crowdCount / zone.capacity) * 100;
      return capacityPercent < 60 && zone.activeIncidents === 0;
    }) || [];

    if (safeZones.length >= 3 && insights.filter(i => i.severity === 'positive').length < 2) {
      insights.push({
        id: 'safe-zones',
        severity: 'positive',
        icon: CheckCircle,
        title: 'Multiple Safe Zones Available',
        text: `${safeZones.length} zones (${safeZones.slice(0, 3).map(z => z.name).join(', ')}) are operating well below capacity with no active incidents. Consider these for overflow routing.`,
        action: 'View Safe Zones',
        actionType: 'info'
      });
    }

    // Sort: Critical first, then high, medium, positive last
    const severityOrder = { critical: 0, high: 1, medium: 2, positive: 3 };
    insights.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

    // Filter out dismissed insights
    const filteredInsights = insights.filter(i => !dismissedInsights.has(i.id));

    // Return top 5 insights
    return filteredInsights.slice(0, 5);
  }, [zones, incidents, volunteers, transport, dismissedInsights]);

  // Get severity styling
  const getSeverityStyle = (severity) => {
    switch (severity) {
      case 'critical':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          iconColor: 'text-red-600',
          badge: 'bg-red-500'
        };
      case 'high':
        return {
          bg: 'bg-orange-50',
          border: 'border-orange-200',
          iconColor: 'text-orange-600',
          badge: 'bg-orange-500'
        };
      case 'medium':
        return {
          bg: 'bg-yellow-50',
          border: 'border-yellow-200',
          iconColor: 'text-yellow-600',
          badge: 'bg-yellow-500'
        };
      case 'positive':
        return {
          bg: 'bg-green-50',
          border: 'border-green-200',
          iconColor: 'text-green-600',
          badge: 'bg-green-500'
        };
      default:
        return {
          bg: 'bg-gray-50',
          border: 'border-gray-200',
          iconColor: 'text-gray-600',
          badge: 'bg-gray-500'
        };
    }
  };

  // Handle action button click
  const handleAction = (insight) => {
    // Mark as actioned
    setActionedInsights(prev => new Map(prev).set(insight.id, new Date()));
    
    // Show appropriate feedback based on action type
    const actionMessages = {
      divert: `✓ Crowd diversion activated for ${insight.title.includes('Crowd') ? 'congested zone' : 'affected area'}`,
      activate: '✓ Backup response team has been notified and is mobilizing',
      deploy: '✓ Additional volunteers are being deployed to the zone',
      announce: '✓ Public announcement system activated with wayfinding instructions',
      medical: '✓ All medical camps have been alerted and are on standby',
      emergency: '✓ Emergency resources mobilized and all units on high alert',
      transport: '✓ Additional shuttle vehicles are being dispatched to high-demand routes',
      info: '✓ Information retrieved successfully'
    };
    
    const message = actionMessages[insight.actionType] || '✓ Action completed successfully';
    showToast(message, 'success');
    
    // Auto-dismiss after action (optional)
    setTimeout(() => {
      setDismissedInsights(prev => new Set(prev).add(insight.id));
    }, 2000);
  };

  // Dismiss insight
  const dismissInsight = (insightId) => {
    setDismissedInsights(prev => new Set(prev).add(insightId));
    showToast('Insight dismissed', 'info');
  };

  // Regenerate insights
  const regenerateInsights = () => {
    setAnimateCards(true);
    setLastAnalyzed(new Date());
    setDismissedInsights(new Set()); // Clear dismissed insights
    setActionedInsights(new Map()); // Clear actioned insights
    showToast('AI insights regenerated', 'info');
    
    // Reset animation after completion
    setTimeout(() => setAnimateCards(false), 600);
  };

  // Get relative time
  const getRelativeTime = (date) => {
    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    
    if (diffSec < 10) return 'just now';
    if (diffSec < 60) return `${diffSec}s ago`;
    
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin}m ago`;
    
    const diffHr = Math.floor(diffMin / 60);
    return `${diffHr}h ago`;
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl shadow-lg h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 flex items-center justify-between p-6 pb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-purple-500" />
          <h2 className="text-xl font-bold text-white">AI Recommendations</h2>
        </div>
        
        <button
          onClick={regenerateInsights}
          className="flex items-center gap-2 px-3 py-1.5 bg-purple-600 text-white text-xs font-medium rounded-lg hover:bg-purple-700 transition-colors"
        >
          <RefreshCw className="w-3 h-3" />
          Regenerate
        </button>
      </div>

      {/* Timestamp */}
      <div className="flex-shrink-0 flex items-center gap-2 px-6 pb-3 text-xs text-slate-400">
        <TrendingUp className="w-3 h-3" />
        <span>Last analyzed: {getRelativeTime(lastAnalyzed)}</span>
      </div>

      {/* Insights Cards */}
      <div className="flex-1 overflow-y-auto px-6 pb-4">
        <div className="space-y-3 pr-2">
        {generateInsights.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            <CheckCircle className="w-12 h-12 mx-auto mb-2 text-green-500" />
            <p className="font-medium">All systems operating normally</p>
            <p className="text-sm">No critical insights at this time</p>
          </div>
        ) : (
          generateInsights.map((insight, index) => {
            const style = getSeverityStyle(insight.severity);
            const IconComponent = insight.icon;
            const isActioned = actionedInsights.has(insight.id);
            
            return (
              <div
                key={insight.id}
                className={`bg-slate-700 border-2 rounded-lg p-4 transition-all ${
                  isActioned ? 'border-green-500/50 bg-green-900/10' : style.border
                } ${animateCards ? 'animate-slide-in' : ''}`}
                style={{
                  animationDelay: animateCards ? `${index * 100}ms` : '0ms'
                }}
              >
                <div className="flex items-start gap-3">
                  {/* Severity indicator */}
                  <div className="flex-shrink-0">
                    <div className={`w-8 h-8 rounded-full ${
                      isActioned ? 'bg-green-500/20 border-green-500' : 'bg-slate-600'
                    } border-2 ${style.border} flex items-center justify-center transition-all`}>
                      <IconComponent className={`w-4 h-4 ${
                        isActioned ? 'text-green-400' : style.iconColor
                      }`} />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    {/* Title with severity badge */}
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-sm font-bold text-white">{insight.title}</h3>
                      {isActioned ? (
                        <span className="px-2 py-0.5 bg-green-500 text-white text-xs font-bold uppercase rounded animate-pulse">
                          ACTIONED
                        </span>
                      ) : (
                        <span className={`px-2 py-0.5 ${style.badge} text-white text-xs font-bold uppercase rounded`}>
                          {insight.severity}
                        </span>
                      )}
                    </div>

                    {/* Insight text */}
                    <p className="text-sm text-slate-300 mb-3 leading-relaxed">
                      {insight.text}
                    </p>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2">
                      {!isActioned ? (
                        <button
                          onClick={() => handleAction(insight)}
                          className={`px-4 py-2 bg-gradient-to-r ${
                            insight.severity === 'positive'
                              ? 'from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
                              : insight.severity === 'critical'
                              ? 'from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 animate-pulse'
                              : 'from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
                          } text-white text-xs font-medium rounded-lg transition-all shadow-sm hover:shadow-md`}
                        >
                          {insight.action}
                        </button>
                      ) : (
                        <div className="flex items-center gap-2 text-xs text-green-400">
                          <CheckCircle className="w-4 h-4" />
                          <span className="font-medium">Action completed {getRelativeTime(actionedInsights.get(insight.id))}</span>
                        </div>
                      )}
                      
                      {!isActioned && (
                        <button
                          onClick={() => dismissInsight(insight.id)}
                          className="px-3 py-2 bg-slate-600 hover:bg-slate-500 text-slate-300 text-xs font-medium rounded-lg transition-colors"
                        >
                          Dismiss
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
        </div>
      </div>

      {/* Stats footer */}
      <div className="flex-shrink-0 px-6 py-4 border-t border-slate-700">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <p className="text-xs text-slate-400">Critical</p>
            <p className="text-lg font-bold text-red-500">
              {generateInsights.filter(i => i.severity === 'critical').length}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Warnings</p>
            <p className="text-lg font-bold text-yellow-500">
              {generateInsights.filter(i => i.severity === 'high' || i.severity === 'medium').length}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Positive</p>
            <p className="text-lg font-bold text-green-500">
              {generateInsights.filter(i => i.severity === 'positive').length}
            </p>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className={`fixed bottom-6 right-6 px-6 py-3 rounded-lg shadow-xl flex items-center gap-3 z-50 animate-slideUp ${
          toast.type === 'success' ? 'bg-green-600' : 
          toast.type === 'error' ? 'bg-red-600' : 
          'bg-blue-600'
        } text-white`}>
          <div className="relative">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <div className="absolute inset-0 w-2 h-2 bg-white rounded-full animate-ping"></div>
          </div>
          <span className="font-medium text-sm">{toast.message}</span>
        </div>
      )}
    </div>
  );
};

export default AIInsightsPanel;
