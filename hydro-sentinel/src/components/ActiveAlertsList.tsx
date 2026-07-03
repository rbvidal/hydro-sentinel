import { AlertOctagon, TrendingUp } from 'lucide-react';

export interface SimulationAlert {
  id: string;
  stationId: string;
  stationName: string;
  timestamp: string;
  timeAgo: string;
  severity: 'critical' | 'warning';
  title: string;
  message: string;
  acknowledged: boolean;
}

interface ActiveAlertsListProps {
  alerts: SimulationAlert[];
  onAcknowledge: (id: string) => void;
  onAlertClick: (stationId: string) => void;
}

export default function ActiveAlertsList({
  alerts,
  onAcknowledge,
  onAlertClick,
}: ActiveAlertsListProps) {
  const unacknowledged = alerts.filter((a) => !a.acknowledged);
  if (unacknowledged.length === 0) return null;

  const criticalAlerts = unacknowledged.filter((a) => a.severity === 'critical');
  const warningAlerts = unacknowledged.filter((a) => a.severity === 'warning');

  return (
    <>
      {/* Warning alerts — top-right corner */}
      {warningAlerts.length > 0 && (
        <div className="fixed top-20 right-4 md:right-8 z-[60] flex flex-col gap-3 pointer-events-none max-w-sm w-full">
          {warningAlerts.map((alert) => (
            <div
              key={alert.id}
              onClick={() => onAlertClick(alert.stationId)}
              className="glass-card pointer-events-auto rounded-xl shadow-2xl flex items-start gap-4 p-4 border border-amber-500/50 bg-slate-900/90 text-amber-100 transition-all duration-300 cursor-pointer"
            >
              <div className="p-2 rounded-lg shrink-0 bg-amber-500 text-slate-900">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <span className="font-sans font-bold text-[10px] tracking-wider uppercase text-amber-400">WARNING</span>
                  <span className="text-[10px] font-mono text-white/50 uppercase">{alert.timeAgo}</span>
                </div>
                <h4 className="font-sans text-sm font-bold text-white mt-1 leading-snug">{alert.title}</h4>
                <p className="text-xs text-white/70 mt-1 leading-relaxed line-clamp-2">{alert.message}</p>
                <div className="flex justify-end gap-2 mt-3">
                  <button
                    onClick={(e) => { e.stopPropagation(); onAcknowledge(alert.id); }}
                    className="px-2.5 py-1 bg-white/10 hover:bg-emerald-500/30 hover:text-emerald-200 text-[10px] font-sans font-bold uppercase tracking-wider rounded border border-white/15 hover:border-emerald-500/30 transition-all cursor-pointer"
                  >
                    Acknowledge
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Critical alert — centered overlay in the middle of the dashboard */}
      {criticalAlerts.length > 0 && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center pointer-events-none">
          {criticalAlerts.map((alert) => (
            <div
              key={alert.id}
              onClick={() => onAlertClick(alert.stationId)}
              className="pointer-events-auto glass-card rounded-2xl shadow-2xl flex flex-col items-center gap-4 p-8 border-2 border-red-500/60 bg-red-950/90 text-red-100 animate-pulse max-w-lg w-full mx-4 cursor-pointer"
            >
              <div className="p-4 rounded-full bg-red-500 shadow-lg shadow-red-500/40">
                <AlertOctagon className="h-10 w-10 text-white" />
              </div>
              <div className="text-center">
                <span className="font-sans font-bold text-xs tracking-widest uppercase text-red-400 bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20">
                  CRITICAL ALERT — IMMEDIATE ACTION REQUIRED
                </span>
                <h3 className="font-sans text-xl font-extrabold text-white mt-3 leading-tight">
                  {alert.title}
                </h3>
                <p className="text-sm text-red-200/90 mt-3 leading-relaxed max-w-md">
                  {alert.message}
                </p>
                <p className="text-xs text-red-300/60 mt-4 font-mono">
                  Auto-redirecting to alarm dashboard in 5 seconds...
                </p>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); onAcknowledge(alert.id); }}
                className="px-4 py-2 bg-white/10 hover:bg-emerald-500/30 hover:text-emerald-200 text-xs font-sans font-bold uppercase tracking-wider rounded-lg border border-white/15 hover:border-emerald-500/30 transition-all cursor-pointer"
              >
                Acknowledge
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
