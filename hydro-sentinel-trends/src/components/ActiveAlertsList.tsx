import { AlertOctagon, TrendingUp, Video, CheckCircle } from 'lucide-react';
import { AlertLog } from '../types';

interface ActiveAlertsListProps {
  alerts: AlertLog[];
  onAcknowledge: (id: string) => void;
  onViewCamera: (stationId: string) => void;
}

export default function ActiveAlertsList({
  alerts,
  onAcknowledge,
  onViewCamera,
}: ActiveAlertsListProps) {
  const unacknowledgedAlerts = alerts.filter(a => !a.acknowledged);

  if (unacknowledgedAlerts.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-20 right-4 md:right-8 z-[60] flex flex-col gap-3 pointer-events-none max-w-sm w-full">
      {unacknowledgedAlerts.map((alert) => {
        const isCritical = alert.severity === 'critical';

        return (
          <div
            key={alert.id}
            className={`glass-card pointer-events-auto rounded-xl shadow-2xl flex items-start gap-4 p-4 border transition-all duration-300 transform translate-y-0 opacity-100 ${
              isCritical
                ? 'bg-red-950/80 border-red-500/50 text-red-100 animate-pulse'
                : 'bg-slate-900/90 border-amber-500/50 text-amber-100'
            }`}
          >
            {/* Severity Icon */}
            <div
              className={`p-2 rounded-lg shrink-0 ${
                isCritical ? 'bg-red-500' : 'bg-amber-500 text-slate-900'
              }`}
            >
              {isCritical ? (
                <AlertOctagon className="h-5 w-5 text-white" />
              ) : (
                <TrendingUp className="h-5 w-5" />
              )}
            </div>

            {/* Notification Details */}
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <span className={`font-sans font-bold text-[10px] tracking-wider uppercase ${
                  isCritical ? 'text-red-400' : 'text-amber-400'
                }`}>
                  {isCritical ? 'CRITICAL ALERT' : 'WARNING'}
                </span>
                <span className="text-[10px] font-mono text-on-surface-variant/70 uppercase">
                  {alert.timeAgo}
                </span>
              </div>
              
              <h4 className="font-sans text-sm font-bold text-white mt-1 leading-snug">
                {alert.title}
              </h4>
              <p className="text-xs text-on-surface-variant/90 mt-1 leading-relaxed">
                {alert.message}
              </p>

              {/* Actions Row */}
              <div className="flex justify-end gap-2 mt-3">
                {alert.stationId && (
                  <button
                    onClick={() => onViewCamera(alert.stationId!)}
                    className="px-2.5 py-1 bg-white/10 hover:bg-white/20 hover:text-white text-[10px] font-sans font-bold uppercase tracking-wider rounded border border-white/15 transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <Video className="h-3 w-3" />
                    View Camera
                  </button>
                )}
                <button
                  onClick={() => onAcknowledge(alert.id)}
                  className="px-2.5 py-1 bg-white/10 hover:bg-emerald-500/30 hover:text-emerald-200 text-[10px] font-sans font-bold uppercase tracking-wider rounded border border-white/15 hover:border-emerald-500/30 transition-all flex items-center gap-1 cursor-pointer"
                >
                  <CheckCircle className="h-3 w-3" />
                  Acknowledge
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
