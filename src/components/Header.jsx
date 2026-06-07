import React from 'react';
import { Activity } from 'lucide-react';

function Header() {
  return (
    <header className="bg-gradient-to-r from-orange-600 to-red-600 shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Activity className="w-8 h-8" />
            <div>
              <h1 className="text-2xl font-bold">Mahakumbh Command Center</h1>
              <p className="text-sm text-orange-100">Real-time Monitoring & Coordination</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-orange-100">
              {new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
            </p>
            <p className="text-xs text-orange-200">IST</p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
