/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Waves, Bell, User, CheckCircle2, ShieldAlert } from 'lucide-react';

interface HeaderProps {
  currentTab: string;
  activeAlertsCount: number;
  onClearAlerts?: () => void;
  useJavaApi: boolean;
}

export default function Header({ 
  currentTab, 
  activeAlertsCount,
  onClearAlerts,
  useJavaApi
}: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="flex justify-between items-center w-full px-6 md:px-8 h-16 sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-outline-variant/30 shrink-0">
      {/* Brand Logo & Icon */}
      <div className="flex items-center gap-3">
        <Waves className="text-secondary animate-pulse" size={24} />
        <span className="font-sans text-xl font-extrabold tracking-tight text-white">
          Hydro<span className="text-secondary">-Sentinel</span>
        </span>
        <span className="hidden sm:inline bg-surface-container-highest border border-outline-variant/20 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider text-on-surface-variant font-mono">
          {useJavaApi ? 'JAVA_REST_ACTIVE' : 'SIMULATED_LOCAL'}
        </span>
      </div>

      {/* Nav Actions / Notification Badge */}
      <div className="flex items-center gap-8">
        <div className="hidden md:flex gap-6">
          <span className={`text-[11px] uppercase tracking-wider font-bold cursor-pointer transition-all ${currentTab === 'live' ? 'text-secondary border-b-2 border-secondary pb-1' : 'text-on-surface-variant hover:text-white'}`}>
            Monitor
          </span>
          <span 
            onClick={() => alert("Forecasting simulations: Weather radar correlates steady precipitation at 12mm/h for the next 4 hours.")}
            className="text-[11px] uppercase tracking-wider font-bold text-on-surface-variant hover:text-secondary cursor-pointer transition-colors"
          >
            Forecasting
          </span>
          <span 
            onClick={() => alert("Hydrographic Analytics: Waterfall basin capacity is currently safely nested at 35% cap (1.2m below threshold).")}
            className="text-[11px] uppercase tracking-wider font-bold text-on-surface-variant hover:text-secondary cursor-pointer transition-colors"
          >
            Analytics
          </span>
        </div>

        <div className="flex items-center gap-4 relative">
          {/* Notification Button */}
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-1.5 rounded-lg text-on-surface-variant hover:text-white hover:bg-surface-bright/50 transition-all cursor-pointer relative"
          >
            <Bell size={20} />
            {activeAlertsCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-primary-container rounded-full animate-ping" />
            )}
          </button>

          {/* User Profile Info */}
          <button 
            onClick={() => alert("Operator Profile:\nID: sentinel-admin-01\nAccess: Heavy Hydraulic Control")}
            className="p-1.5 rounded-lg text-on-surface-variant hover:text-white hover:bg-surface-bright/50 transition-all cursor-pointer"
          >
            <User size={20} />
          </button>

          {/* Expanded Notifications Drawer */}
          {showNotifications && (
            <div className="absolute right-0 top-11 w-80 glass-card rounded-xl p-4 shadow-2xl border border-outline-variant/50 space-y-3 z-50">
              <div className="flex justify-between items-center pb-2 border-b border-outline-variant/25">
                <span className="font-bold text-xs uppercase tracking-wider">System Alerts</span>
                {activeAlertsCount > 0 && (
                  <button 
                    onClick={() => {
                      onClearAlerts?.();
                      setShowNotifications(false);
                    }}
                    className="text-[10px] text-tertiary hover:underline"
                  >
                    Resolve All
                  </button>
                )}
              </div>

              {activeAlertsCount === 0 ? (
                <div className="flex items-center gap-2 py-2 text-xs text-tertiary">
                  <CheckCircle2 size={16} />
                  <span>All monitoring stations functional.</span>
                </div>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  <div className="text-[11px] text-primary space-y-1 bg-primary-container/10 p-2.5 rounded-lg border border-primary-container/20">
                    <div className="flex items-center gap-1.5 font-bold">
                      <ShieldAlert size={14} className="text-primary-container animate-bounce" />
                      <span>CRITICAL FLOOD SPEED - Station 3KM</span>
                    </div>
                    <p className="text-on-surface/80 text-[10px]">
                      Water level is at <strong className="font-mono">5.12m</strong>, rising at <strong className="font-mono text-primary">+0.12m/min</strong>. Alert broadcast sent !
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
