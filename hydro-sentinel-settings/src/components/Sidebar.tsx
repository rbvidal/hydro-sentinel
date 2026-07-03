/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Radio, History, Shield, Settings, UserCircle2 } from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  setTab: (tab: string) => void;
  activeAlertsCount: number;
}

export default function Sidebar({ currentTab, setTab, activeAlertsCount }: SidebarProps) {
  const navItems = [
    { id: 'live', label: 'LIVE MONITORING', icon: Radio },
    { id: 'history', label: 'ALERT HISTORY', icon: History, count: activeAlertsCount },
    { id: 'sensors', label: 'SENSOR HEALTH', icon: Shield },
    { id: 'settings', label: 'SETTINGS', icon: Settings },
  ];

  return (
    <aside id="sidebar-panel" className="w-64 bg-[#060e20] border-r border-brand-bright flex flex-col justify-between shrink-0 select-none pb-6">
      {/* Top Brand Block */}
      <div className="p-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center font-bold text-[#060e20] text-sm tracking-wider">
            HS
          </div>
          <div>
            <h1 className="text-sm font-bold text-white tracking-wider font-sans uppercase">Control Center</h1>
            <p className="text-xs text-slate-400 font-medium font-sans">Vigilant Dashboard</p>
          </div>
        </div>
        
        {/* Navigation List */}
        <nav className="mt-8 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                id={`sidebar-tab-${item.id}`}
                onClick={() => setTab(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded text-left transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-safe-blue text-white font-semibold shadow-lg shadow-safe-blue/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 font-medium'
                }`}
              >
                <div className="flex items-center space-x-3 text-xs tracking-wider">
                  <Icon className={`w-4 text-xs h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span className="font-semibold uppercase font-sans">{item.label}</span>
                </div>
                {item.count ? (
                  <span className="text-[10px] font-mono font-bold bg-alert-red text-white px-2 py-0.5 rounded-full live-pulse">
                    {item.count}
                  </span>
                ) : null}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Profile Info */}
      <div className="p-6 border-t border-brand-bright/80 bg-brand-bg/40">
        <div className="flex items-center space-x-3">
          <div className="text-safe-blue">
            <UserCircle2 className="w-9 h-9 opacity-85" />
          </div>
          <div className="overflow-hidden">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider truncate">System Operator</h4>
            <p className="text-[10px] text-green-400 font-semibold uppercase tracking-widest flex items-center gap-1.5 font-sans mt-0.5">
              <span className="w-2 h-2 rounded-full bg-green-400 block shrink-0"></span>
              Session Active
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
