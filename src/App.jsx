import { useState, useEffect } from 'react';
import { Activity, FileDown, Clock } from 'lucide-react';
import { ZONES, INCIDENTS, VOLUNTEERS, TRANSPORT, METRICS } from './data/mockData';
import AlertBanner from './components/AlertBanner';
import MetricCards from './components/MetricCards';
import CrowdDensityMap from './components/CrowdDensityMap';
import IncidentFeed from './components/IncidentFeed';
import VolunteerTracker from './components/VolunteerTracker';
import TransportStatus from './components/TransportStatus';
import AIInsightsPanel from './components/AIInsightsPanel';

function App() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [lastUpdated, setLastUpdated] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Update "Last updated" counter every 5 seconds
  useEffect(() => {
    const updateTimer = setInterval(() => {
      setLastUpdated(0);
    }, 5000);

    const secondTimer = setInterval(() => {
      setLastUpdated(prev => prev + 1);
    }, 1000);

    return () => {
      clearInterval(updateTimer);
      clearInterval(secondTimer);
    };
  }, []);

  // Trigger entrance animations on load
  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 100);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-IN', {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-IN', {
      timeZone: 'Asia/Kolkata',
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleExportReport = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 shadow-lg print:hidden">
        <div className="px-4 md:px-6 py-3 md:py-4">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            {/* Logo and Title */}
            <div className="flex items-center space-x-3 md:space-x-4">
              <div className="bg-gradient-to-br from-orange-600 to-orange-700 p-2 rounded-lg shadow-lg">
                <Activity className="w-6 h-6 md:w-8 md:h-8 text-white" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-white">
                  Mahakumbh 2028 Command Center
                </h1>
                <p className="text-xs md:text-sm text-slate-400">Real-time Operations Dashboard</p>
              </div>
            </div>

            {/* Right side: Status indicators */}
            <div className="flex flex-wrap items-center gap-3 md:gap-4 lg:gap-6 w-full lg:w-auto">
              {/* Last Updated Counter */}
              <div className="flex items-center space-x-2 text-xs md:text-sm">
                <Clock className="w-3 h-3 md:w-4 md:h-4 text-slate-400" />
                <span className="text-slate-400">
                  Last updated: <span className="text-white font-medium">{lastUpdated}s ago</span>
                </span>
              </div>

              {/* Live Indicator */}
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <div className="w-2.5 h-2.5 md:w-3 md:h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <div className="absolute inset-0 w-2.5 h-2.5 md:w-3 md:h-3 bg-green-500 rounded-full animate-ping"></div>
                </div>
                <span className="text-green-500 font-semibold text-xs md:text-sm uppercase tracking-wider">
                  Live
                </span>
              </div>

              {/* Date and Time */}
              <div className="text-right">
                <div className="text-base md:text-lg font-mono font-bold text-white">
                  {formatTime(currentTime)} <span className="text-slate-400 text-xs md:text-sm">IST</span>
                </div>
                <div className="text-xs md:text-sm text-slate-400 hidden md:block">
                  {formatDate(currentTime)}
                </div>
              </div>

              {/* Export Button */}
              <button
                onClick={handleExportReport}
                className="flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs md:text-sm font-medium rounded-lg transition-colors shadow-lg"
              >
                <FileDown className="w-3 h-3 md:w-4 md:h-4" />
                <span className="hidden sm:inline">Export Report</span>
                <span className="sm:hidden">Export</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Dashboard Content */}
      <main className="px-4 md:px-6 py-4 overflow-y-auto overflow-x-hidden bg-slate-950" style={{ height: 'calc(100vh - 89px)' }}>
        <div className="max-w-[2000px] mx-auto pb-6">
          {/* Alert Banner - Full Width */}
          <div className={`mb-6 transition-all duration-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
            <AlertBanner incidents={INCIDENTS} />
          </div>

          {/* Row 1: Metric Cards - Full Width */}
          <div 
            className={`mb-6 transition-all duration-500 delay-100 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}
          >
            <MetricCards metrics={METRICS} zones={ZONES} incidents={INCIDENTS} volunteers={VOLUNTEERS} transport={TRANSPORT} />
          </div>

          {/* Row 2: CrowdDensityMap (60%) + IncidentFeed (40%) */}
          <div 
            className={`grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6 transition-all duration-500 delay-200 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}
          >
            <div className="lg:col-span-3">
              <div className="h-[500px]">
                <CrowdDensityMap zones={ZONES} />
              </div>
            </div>
            <div className="lg:col-span-2">
              <div className="h-[500px]">
                <IncidentFeed incidents={INCIDENTS} />
              </div>
            </div>
          </div>

          {/* Row 3: VolunteerTracker (40%) + TransportStatus (35%) + AIInsightsPanel (25%) */}
          <div 
            className={`grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6 transition-all duration-500 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}
          >
            <div className="lg:col-span-5">
              <div className="h-[550px]">
                <VolunteerTracker volunteers={VOLUNTEERS} zones={ZONES} />
              </div>
            </div>
            <div className="lg:col-span-4">
              <div className="h-[550px]">
                <TransportStatus transport={TRANSPORT} zones={ZONES} />
              </div>
            </div>
            <div className="lg:col-span-3">
              <div className="h-[550px]">
                <AIInsightsPanel 
                  zones={ZONES} 
                  incidents={INCIDENTS} 
                  volunteers={VOLUNTEERS} 
                  transport={TRANSPORT} 
                  metrics={METRICS} 
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Print Styles */}
      <style>{`
        @media print {
          body {
            background: white;
            color: black;
          }
          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}

export default App;
