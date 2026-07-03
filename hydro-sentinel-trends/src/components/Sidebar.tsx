import { Activity, History, Cpu, Settings, LogOut, HelpCircle, AlertTriangle, ShieldAlert } from 'lucide-react';

interface SidebarProps {
  currentView: 'monitor' | 'history' | 'sensors' | 'settings';
  setCurrentView: (view: 'monitor' | 'history' | 'sensors' | 'settings') => void;
  onEmergencyClick: () => void;
  activeAlertCount: number;
}

export default function Sidebar({
  currentView,
  setCurrentView,
  onEmergencyClick,
  activeAlertCount,
}: SidebarProps) {
  return (
    <aside className="hidden md:flex flex-col h-full py-6 px-4 gap-4 bg-surface-container border-r border-outline-variant/20 w-64 shrink-0 overflow-y-auto">
      {/* Sidebar Header */}
      <div className="px-2 mb-6">
        <div className="flex items-center gap-2">
          <ShieldAlert className="text-primary-brand h-6 w-6 stroke-[2]" />
          <div>
            <h1 className="font-sans text-lg font-bold text-on-surface leading-tight">Command Center</h1>
            <p className="font-mono text-[10px] text-on-surface-variant tracking-wider uppercase opacity-80">
              Vigilant Dashboard
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1">
        <button
          onClick={() => setCurrentView('monitor')}
          className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer ${
            currentView === 'monitor'
              ? 'bg-secondary-container-brand text-on-secondary-container-brand font-semibold shadow-md border border-white/10'
              : 'text-on-surface-variant hover:bg-surface-bright/40 hover:text-on-surface'
          }`}
        >
          <div className="flex items-center gap-3">
            <Activity className="h-5 w-5" />
            <span className="font-sans text-xs font-bold tracking-wider uppercase">Live Monitoring</span>
          </div>
          {currentView !== 'monitor' && activeAlertCount > 0 && (
            <span className="bg-primary-container-brand text-white px-2 py-0.5 rounded-full text-[10px] font-mono animate-pulse">
              {activeAlertCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setCurrentView('history')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer ${
            currentView === 'history'
              ? 'bg-secondary-container-brand text-on-secondary-container-brand font-semibold shadow-md border border-white/10'
              : 'text-on-surface-variant hover:bg-surface-bright/40 hover:text-on-surface'
          }`}
        >
          <History className="h-5 w-5" />
          <span className="font-sans text-xs font-bold tracking-wider uppercase">Alert History</span>
        </button>

        <button
          onClick={() => setCurrentView('sensors')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer ${
            currentView === 'sensors'
              ? 'bg-secondary-container-brand text-on-secondary-container-brand font-semibold shadow-md border border-white/10'
              : 'text-on-surface-variant hover:bg-surface-bright/40 hover:text-on-surface'
          }`}
        >
          <Cpu className="h-5 w-5" />
          <span className="font-sans text-xs font-bold tracking-wider uppercase">Sensor Health</span>
        </button>

        <button
          onClick={() => setCurrentView('settings')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer ${
            currentView === 'settings'
              ? 'bg-secondary-container-brand text-on-secondary-container-brand font-semibold shadow-md border border-white/10'
              : 'text-on-surface-variant hover:bg-surface-bright/40 hover:text-on-surface'
          }`}
        >
          <Settings className="h-5 w-5" />
          <span className="font-sans text-xs font-bold tracking-wider uppercase">Settings</span>
        </button>
      </nav>

      {/* Sidebar Footer Controls */}
      <div className="mt-auto space-y-2 pt-4 border-t border-outline-variant/10">
        <button
          onClick={onEmergencyClick}
          className="w-full py-3 bg-primary-container-brand text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all hover:brightness-110 active:scale-95 shadow-lg border border-red-400/20 shadow-red-950/40 cursor-pointer text-xs uppercase tracking-wider animate-pulse hover:animate-none"
        >
          <AlertTriangle className="h-4 w-4 text-white" />
          Emergency Response
        </button>

        <div className="h-px bg-outline-variant/20 my-2"></div>

        <button
          onClick={() => alert("Hydro-Sentinel technical support system: For emergency system overrides, call +1-800-HYDRO-911.")}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-on-surface-variant hover:bg-surface-bright/30 rounded-xl transition-colors cursor-pointer text-left"
        >
          <HelpCircle className="h-4.5 w-4.5" />
          <span className="font-sans text-[11px] font-bold tracking-wider uppercase">Support</span>
        </button>

        <button
          onClick={() => alert("You have securely logged out from the Hydro-Sentinel grid.")}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-on-surface-variant hover:bg-red-500/15 hover:text-red-300 rounded-xl transition-colors cursor-pointer text-left"
        >
          <LogOut className="h-4.5 w-4.5" />
          <span className="font-sans text-[11px] font-bold tracking-wider uppercase">Logout</span>
        </button>
      </div>
    </aside>
  );
}
