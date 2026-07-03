import { useState } from 'react';
import { 
  X, 
  AlertTriangle, 
  Users, 
  Truck, 
  Navigation, 
  Sliders, 
  Activity, 
  Radio, 
  Heart,
  TrendingDown,
  ShieldAlert,
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';
import { EvacSector, DispatchTeam } from '../types';

interface EmergencyModalProps {
  onClose: () => void;
  gateOpenPct: number;
  setGateOpenPct: (p: number) => void;
  evacSectors: EvacSector[];
  setEvacSectors: (s: EvacSector[]) => void;
  dispatchTeams: DispatchTeam[];
  setDispatchTeams: (t: DispatchTeam[]) => void;
  onPostSysAlert: (title: string, msg: string, severity: 'critical' | 'warning' | 'info') => void;
}

export default function EmergencyModal({
  onClose,
  gateOpenPct,
  setGateOpenPct,
  evacSectors,
  setEvacSectors,
  dispatchTeams,
  setDispatchTeams,
  onPostSysAlert
}: EmergencyModalProps) {
  const [alarmActive, setAlarmActive] = useState(false);
  const [dispatchNote, setDispatchNote] = useState('');

  const toggleGeneralAlarm = () => {
    const nextState = !alarmActive;
    setAlarmActive(nextState);
    if (nextState) {
      onPostSysAlert(
        "GENERAL EMERGENCY ALARM BROADCASTED", 
        "Loudspeakers and strobe indicators deployed across All 5 adjacent Upstream basins.", 
        "critical"
      );
      // set all sectors status to 'standby' or 'alert'
      setEvacSectors(evacSectors.map(s => ({ ...s, status: s.hazardLevel === 'critical' ? 'evacuating' : 'alert' })));
    } else {
      onPostSysAlert(
        "GENERAL EMERGENCY ALARM STAND-DOWN", 
        "Safe monitoring operations resumed. Emergency personnel on alert stand-down.", 
        "info"
      );
      setEvacSectors(evacSectors.map(s => ({ ...s, status: 'none' })));
    }
  };

  const changeSectorStatus = (id: string, newStatus: EvacSector['status']) => {
    setEvacSectors(evacSectors.map(sec => {
      if (sec.id === id) {
        return { ...sec, status: newStatus };
      }
      return sec;
    }));
    
    onPostSysAlert(
      `Sector ${id.toUpperCase()} Status Updated`, 
      `Evacuation level changed to '${newStatus.toUpperCase()}' for safety.`, 
      newStatus === 'evacuating' ? 'critical' : 'warning'
    );
  };

  const triggerDispatch = (teamId: string) => {
    setDispatchTeams(dispatchTeams.map(team => {
      if (team.id === teamId) {
        const isCurrentlyIdle = team.status === 'idle';
        return {
          ...team,
          status: isCurrentlyIdle ? 'dispatched' : 'idle',
          eta: isCurrentlyIdle ? '12 Min' : '--',
          destination: isCurrentlyIdle ? '3KM Floodplain Sector B' : '--'
        };
      }
      return team;
    }));

    const targetedTeam = dispatchTeams.find(t => t.id === teamId);
    if (targetedTeam) {
      onPostSysAlert(
        `${targetedTeam.name} Deploy Command Issued`,
        `Personnel and specialized vehicle dispatched to assist adjacent residents.`,
        "warning"
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
      <div className="glass-card max-w-4xl w-full rounded-2xl bg-slate-900 border border-red-500/30 overflow-hidden shadow-2xl flex flex-col my-8">
        
        {/* Header */}
        <div className="p-4 bg-slate-950 border-b border-red-500/20 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2">
            <ShieldAlert className="text-red-500 h-6 w-6 animate-pulse" />
            <div>
              <h3 className="font-extrabold text-white text-sm uppercase tracking-wider font-sans">
                Hydro-Sentinel Emergency Command Console
              </h3>
              <p className="text-[10px] text-red-400 font-bold uppercase tracking-widest font-mono">
                Mitigation Protocols | Spillway Gates | Dispatch Operations
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-on-surface-variant hover:text-white cursor-pointer bg-slate-900/80 p-1.5 rounded-lg border border-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[80vh]">
          
          {/* Top Threat controls */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Water Release Gate Slider */}
            <div className="p-5 bg-slate-950 border border-slate-800/80 rounded-xl flex flex-col justify-between space-y-4 md:col-span-2">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-xs font-black text-white font-sans uppercase tracking-widest text-[#4edea3]">
                    🎚️ Spillway / Reservoir Outlet Gates
                  </h4>
                  <p className="text-[10px] text-on-surface-variant/85 mt-0.5 font-sans leading-snug">
                    Open gates to release reservoir capacity into the downstream bypass canal. Sliding this directly lowers simulated river depth levels.
                  </p>
                </div>
                <div className="text-right">
                  <span className="font-mono text-2xl font-black text-white">{gateOpenPct}%</span>
                  <span className="text-[9px] block text-[#4edea3] font-bold uppercase font-mono">FLOW DISCHARGE VALVE</span>
                </div>
              </div>

              <div className="space-y-2">
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={gateOpenPct}
                  onChange={(e) => setGateOpenPct(parseInt(e.target.value))}
                  className="w-full accent-emerald-400 cursor-pointer h-2.5 bg-slate-900 rounded-lg appearance-none border border-slate-800"
                />
                <div className="flex justify-between text-[9px] font-mono font-bold text-on-surface-variant/50">
                  <span>0% CLOSED</span>
                  <span>50% SEMI-OPEN (REDUCED THREAT)</span>
                  <span>100% MAXIMUM OUTFLOW VELOCITY</span>
                </div>
              </div>
            </div>

            {/* General Sirens Alarm Overlay toggle */}
            <div className={`p-5 rounded-xl border flex flex-col justify-between space-y-4 transition-all duration-300 ${
              alarmActive 
                ? 'bg-red-950/40 border-red-500/60 shadow-red-950' 
                : 'bg-slate-950 border-slate-800/80 shadow-inner'
            }`}>
              <div>
                <h4 className="text-xs font-black text-white font-sans uppercase tracking-widest text-red-400">
                  📢 Mass Warning Broadcast
                </h4>
                <p className="text-[10px] text-on-surface-variant/80 mt-0.5 leading-snug">
                  Activate emergency regional evacuation sirens, telemetry strobe loops, and broadcast warning statements.
                </p>
              </div>

              <button
                onClick={toggleGeneralAlarm}
                className={`cursor-pointer w-full py-3 rounded-lg font-sans text-xs font-extrabold uppercase tracking-widest transition-all shadow-md ${
                  alarmActive
                    ? 'bg-red-600 hover:bg-red-500 text-white border border-red-500 animate-pulse'
                    : 'bg-slate-900 hover:bg-slate-800 text-red-400 hover:text-white border border-slate-800'
                }`}
              >
                {alarmActive ? 'SILENCE GENERAL SIRENS' : 'ACTIVATE SIRENS ALARM'}
              </button>
            </div>

          </div>

          {/* Sector Evacuation Registry */}
          <div className="space-y-3">
            <h4 className="font-sans font-bold text-xs text-on-surface-variant tracking-wider uppercase flex items-center gap-1">
              <Users className="h-4.5 w-4.5 text-indigo-300" />
              Sectors Population & Evacuation Directives
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              {evacSectors.map(sec => {
                const isCritical = sec.hazardLevel === 'critical' || sec.status === 'evacuating';
                const isAlert = sec.status === 'alert';
                const isCleared = sec.status === 'cleared';

                return (
                  <div 
                    key={sec.id}
                    className={`p-3.5 rounded-xl border flex flex-col justify-between gap-3 ${
                      isCritical 
                        ? 'bg-red-950/20 border-red-500/50' 
                        : isAlert 
                          ? 'bg-amber-950/10 border-amber-500/40' 
                          : isCleared 
                            ? 'bg-emerald-950/15 border-emerald-500/30' 
                            : 'bg-slate-950/40 border-slate-800'
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-center">
                        <span className="font-sans font-extrabold text-xs text-white uppercase">{sec.name}</span>
                        <span className={`text-[8px] font-bold px-1 py-[1px] rounded uppercase ${
                          sec.hazardLevel === 'critical' ? 'bg-red-500 text-white' : 'bg-slate-900 text-on-surface-variant'
                        }`}>
                          {sec.hazardLevel}
                        </span>
                      </div>
                      <p className="text-[10px] text-on-surface-variant/75 mt-1 block">
                        Est. Population: <span className="font-bold text-white">{sec.population}</span>
                      </p>
                    </div>

                    <div className="space-y-1">
                      {/* Action trigger button */}
                      <button
                        onClick={() => {
                          const nextStatus: EvacSector['status'] = 
                            sec.status === 'none' 
                              ? 'alert' 
                              : sec.status === 'alert' 
                                ? 'evacuating' 
                                : sec.status === 'evacuating' 
                                  ? 'cleared' 
                                  : 'none';
                          changeSectorStatus(sec.id, nextStatus);
                        }}
                        className="cursor-pointer w-full py-1 text-[9px] font-sans font-bold uppercase tracking-wider rounded bg-slate-900 text-on-surface-variant hover:text-white hover:bg-slate-800 transition-all text-center block border border-slate-800"
                      >
                        Status: <span className="text-white capitalize">{sec.status}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Rescue Squad Dispatch Center */}
          <div className="space-y-3">
            <h4 className="font-sans font-bold text-xs text-on-surface-variant tracking-wider uppercase flex items-center gap-1.5">
              <Truck className="h-4.5 w-4.5 text-indigo-300" />
              Specialized Dispatch Teams Grid
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {dispatchTeams.map(team => {
                const getTeamColor = (type: string) => {
                  switch (type) {
                    case 'rescue': return 'text-red-400';
                    case 'sandbags': return 'text-amber-400';
                    case 'medical': return 'text-[#4edea3]';
                    default: return 'text-sky-400';
                  }
                };

                const isDispatched = team.status === 'dispatched';

                return (
                  <div 
                    key={team.id}
                    className="p-4 bg-slate-950 rounded-xl border border-slate-800/80 flex flex-col justify-between space-y-3.5"
                  >
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className={`text-[10px] uppercase font-bold tracking-widest ${getTeamColor(team.type)}`}>
                          {team.type} team
                        </span>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          isDispatched ? 'bg-amber-500 animate-ping' : 'bg-slate-700'
                        }`}></span>
                      </div>
                      <h5 className="font-sans font-bold text-xs text-white leading-snug">{team.name}</h5>
                      <p className="text-[10px] text-on-surface-variant/80 mt-1">
                        Task: <span className="text-white">{team.task}</span>
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-[11px] font-mono leading-none">
                      <span className="text-on-surface-variant/50 uppercase">ETA / Dest:</span>
                      <span className="text-white font-bold">{team.eta}</span>
                    </div>

                    <button
                      onClick={() => triggerDispatch(team.id)}
                      className={`cursor-pointer w-full py-1.5 font-sans rounded-lg font-bold text-[10px] uppercase tracking-wider text-center transition-all ${
                        isDispatched
                          ? 'bg-amber-600/20 text-amber-300 border border-amber-500/20'
                          : 'bg-slate-900 border border-slate-800 text-on-surface-variant hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      {isDispatched ? 'RECALL SQUAD' : 'DISPATCH TEAM'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Footer info stats */}
        <div className="p-4 bg-slate-950 border-t border-slate-800/80 flex flex-col sm:flex-row justify-between items-center gap-4 shrink-0 px-6">
          <p className="text-[10px] text-on-surface-variant/70 font-sans tracking-tight max-w-md">
            ⚠️ NOTICE: All decisions issued from this Command Console are fully logged inside the permanent history ledger for compliance audit records.
          </p>
          <button
            onClick={onClose}
            className="cursor-pointer px-4.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-sans text-xs font-bold uppercase tracking-wider rounded-lg border border-slate-800 transition-all"
          >
            Acknowledge & Close Console
          </button>
        </div>

      </div>
    </div>
  );
}
