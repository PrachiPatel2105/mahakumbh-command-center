import React from 'react';
import { Users, AlertTriangle, Shield, Bus, Heart, Search } from 'lucide-react';

function MetricCards({ metrics, zones, incidents, volunteers, transport }) {
  // Use props if provided, otherwise use defaults from mockData
  const METRICS = metrics || { totalPilgrims: 0, activeIncidents: 0, volunteersDeployed: 0, shuttlesRunning: 0, medicalCamps: 0, lostPersons: 0 };
  const INCIDENTS = incidents || [];
  
  // Calculate active incidents (open or assigned)
  const activeIncidents = INCIDENTS.filter(
    i => i.status === 'open' || i.status === 'assigned'
  ).length;

  const cards = [
    {
      icon: Users,
      label: 'Total Pilgrims Today',
      value: METRICS.totalPilgrims.toLocaleString(),
      trend: '+2.3k this hour',
      trendPositive: true,
      color: 'bg-blue-600',
      iconColor: 'text-blue-500',
      shouldPulse: false
    },
    {
      icon: AlertTriangle,
      label: 'Active Incidents',
      value: activeIncidents,
      trend: `${INCIDENTS.filter(i => i.severity === 'critical').length} critical`,
      trendPositive: false,
      color: 'bg-red-600',
      iconColor: 'text-red-500',
      shouldPulse: activeIncidents > 0
    },
    {
      icon: Shield,
      label: 'Volunteers Deployed',
      value: METRICS.volunteersDeployed,
      trend: '82% of total',
      trendPositive: true,
      color: 'bg-green-600',
      iconColor: 'text-green-500',
      shouldPulse: false
    },
    {
      icon: Bus,
      label: 'Shuttles Running',
      value: METRICS.shuttlesRunning,
      trend: '3 delayed',
      trendPositive: null,
      color: 'bg-purple-600',
      iconColor: 'text-purple-500',
      shouldPulse: false
    },
    {
      icon: Heart,
      label: 'Medical Camps Active',
      value: METRICS.medicalCamps,
      trend: 'All operational',
      trendPositive: true,
      color: 'bg-teal-600',
      iconColor: 'text-teal-500',
      shouldPulse: false
    },
    {
      icon: Search,
      label: 'Lost Persons Open',
      value: METRICS.lostPersons,
      trend: 'Being located',
      trendPositive: null,
      color: 'bg-orange-600',
      iconColor: 'text-orange-500',
      shouldPulse: METRICS.lostPersons > 0
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div 
            key={index} 
            className="bg-slate-800 border border-slate-700 rounded-xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-slate-600"
          >
            <div className="flex items-start justify-between">
              {/* Icon */}
              <div className={`${card.color} p-3 rounded-lg ${card.shouldPulse ? 'animate-pulse' : ''}`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              
              {/* Trend Indicator */}
              <div className="text-right">
                <span className={`text-xs font-medium ${
                  card.trendPositive === true ? 'text-green-400' :
                  card.trendPositive === false ? 'text-red-400' :
                  'text-slate-400'
                }`}>
                  {card.trend}
                </span>
              </div>
            </div>

            {/* Label */}
            <h3 className="text-slate-400 text-sm font-medium mt-4 uppercase tracking-wide">
              {card.label}
            </h3>

            {/* Value */}
            <p className="text-3xl font-bold text-white mt-2">
              {card.value}
            </p>
          </div>
        );
      })}
    </div>
  );
}

export default MetricCards;
