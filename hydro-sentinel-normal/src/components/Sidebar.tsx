/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Activity, 
  History, 
  Radio, 
  Settings, 
  ShieldAlert, 
  HelpCircle, 
  LogOut 
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  onChangeTab: (tab: string) => void;
  onTriggerEmergency: () => void;
  activeAlertsCount: number;
}

export default function Sidebar({ 
  currentTab, 
  onChangeTab, 
  onTriggerEmergency,
  activeAlertsCount 
}: SidebarProps) {
  const menuItems = [
    { id: 'live', name: 'Live Monitoring', icon: Activity },
    { id: 'history', name: 'Alert History', icon: History, badge: activeAlertsCount > 0 ? activeAlertsCount : undefined },
    { id: 'sensors', name: 'Sensor Health', icon: Radio },
    { id: 'integration', name: 'Settings', icon: Settings },
  ];

  return (
    <aside className="hidden md:flex flex-col h-full py-6 px-4 gap-4 bg-surface-container border-r border-outline-variant/20 w-64 shrink-0 overflow-y-auto">
      {/* Brand Header */}
      <div className="px-2 mb-6">
        <h1 className="font-sans text-xl font-bold tracking-tight text-on-surface">Command Center</h1>
        <p className="font-sans text-[10px] uppercase tracking-wider text-on-surface-variant font-bold opacity-70">
          Vigilant Dashboard
        </p>
      </div>

      {/* Main Navigation Menu */}
      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onChangeTab(item.id)}
              className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-left ${
                isActive
                  ? 'bg-secondary-container text-on-secondary-container font-bold shadow-md shadow-secondary-container/10'
                  : 'text-on-surface-variant hover:bg-surface-bright/50 hover:text-on-surface'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon size={18} className={isActive ? 'text-on-secondary-container' : 'text-on-surface-variant'} />
                <span className="text-xs uppercase tracking-wider font-bold">{item.name}</span>
              </div>
              {item.badge !== undefined && (
                <span className="bg-primary-container text-on-primary-container px-2 py-0.5 rounded-full text-[10px] font-bold">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Option Actions */}
      <div className="mt-auto space-y-2">
        {/* Emergency Trigger */}
        <button
          onClick={onTriggerEmergency}
          className="w-full py-3 bg-primary-container text-on-primary-container font-bold rounded-xl flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-98 shadow-lg shadow-primary-container/20 cursor-pointer"
        >
          <ShieldAlert size={18} className="animate-pulse" />
          <span className="text-xs uppercase tracking-widest font-bold">Emergency Response</span>
        </button>

        <div className="h-px bg-outline-variant/20 my-4" />

        <button
          onClick={() => alert("Connecting to system assistance portal...")}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-on-surface-variant hover:bg-surface-bright/50 rounded-xl transition-all text-left text-xs uppercase tracking-wider font-bold"
        >
          <HelpCircle size={16} />
          <span>Support</span>
        </button>

        <button
          onClick={() => {
            if (window.confirm("Are you sure you want to sign out of Hydro-Sentinel?")) {
              location.reload();
            }
          }}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-on-surface-variant hover:bg-surface-bright/35 rounded-xl transition-all text-left text-xs uppercase tracking-wider font-bold text-red-400"
        >
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
