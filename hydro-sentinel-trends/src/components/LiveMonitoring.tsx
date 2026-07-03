import { useState } from 'react';
import { 
  Waves, 
  CheckCircle, 
  AlertTriangle, 
  CloudRain, 
  Droplets, 
  Zap, 
  Volume2, 
  Video, 
  TrendingUp, 
  Eye, 
  HelpCircle,
  HelpCircle as HelpIcon,
  Play,
  Pause,
  Shuffle
} from 'lucide-react';
import { Station, AlertLog, SimulationProfile, LevelStage } from '../types';

interface LiveMonitoringProps {
  stations: Station[];
  alerts: AlertLog[];
  simulationProfile: SimulationProfile;
  setSimulationProfile: (profile: SimulationProfile) => void;
  basinLevel: number;
  basinCapacityPct: number;
  onViewCamera: (stationId: string) => void;
  onAcknowledgeAll: () => void;
  rainLevel: number;
  basinSaturation: number;
  dischargeRate: number;
  sensorHealth: number;
  isSimulating: boolean;
  setIsSimulating: (sim: boolean) => void;
  onTriggerSingleStep: () => void;
  gateOpenPct: number;
}

export default function LiveMonitoring({
  stations,
  alerts,
  simulationProfile,
  setSimulationProfile,
  basinLevel,
  basinCapacityPct,
  onViewCamera,
  onAcknowledgeAll,
  rainLevel,
  basinSaturation,
  dischargeRate,
  sensorHealth,
  isSimulating,
  setIsSimulating,
  onTriggerSingleStep,
  gateOpenPct
}: LiveMonitoringProps) {
  // Local state for interactive SVG hover guide
  const [hoveredTrendIndex, setHoveredTrendIndex] = useState<number | null>(null);
  
  const activeAlerts = alerts.filter(a => !a.acknowledged);
  const activeCriticalCount = activeAlerts.filter(a => a.severity === 'critical').length;
  const activeWarningCount = activeAlerts.filter(a => a.severity === 'warning').length;

  // Determine current status
  let statusText = 'NORMAL';
  let statusColor = 'text-emerald-400';
  let statusBg = 'bg-emerald-500/10';
  let statusLabel = `${(basinLevel).toFixed(2)}m below trigger threshold`;

  if (activeCriticalCount > 0) {
    statusText = 'CRITICAL FLOOD ALERT';
    statusColor = 'text-red-500';
    statusBg = 'bg-red-500/15 animate-pulse';
    statusLabel = `Active breaches at ${activeCriticalCount} monitoring point(s)!`;
  } else if (activeWarningCount > 0) {
    statusText = 'WARNING STAGE ACTIVE';
    statusColor = 'text-amber-400';
    statusBg = 'bg-amber-400/10';
    statusLabel = 'Prevention operations activated. Level rising rapidly.';
  }

  // Interactive coordinate hover for 24-hr historical SVG points
  const pointsCount = 11;
  const hoverPercentages = Array.from({ length: pointsCount }, (_, i) => (i / (pointsCount - 1)) * 100);

  return (
    <div className="space-y-6">
      {/* Simulation Quick Controls */}
      <div className="glass-card rounded-xl p-4 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-900/60 border-indigo-500/20">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-ping"></span>
          <div>
            <h3 className="text-xs font-bold tracking-wider text-indigo-300 uppercase font-sans">
              Dynamic Hydraulic Engine
            </h3>
            <p className="text-[11px] text-on-surface-variant/80">
              Simulating fluid flow & precipitation feedback. Current mode: <span className="font-bold text-white uppercase">{simulationProfile.replace('-', ' ')}</span>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          <button
            onClick={() => setIsSimulating(!isSimulating)}
            className={`cursor-pointer px-3 py-1.5 rounded-lg text-xs font-bold font-sans uppercase tracking-wider flex items-center gap-1.5 border transition-all ${
              isSimulating
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-500/40'
            }`}
          >
            {isSimulating ? (
              <>
                <Pause className="h-3.5 w-3.5 fill-current" /> Pause Telemetry
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5 fill-current" /> Live Feed Sim
              </>
            )}
          </button>

          <button
            onClick={onTriggerSingleStep}
            className="cursor-pointer px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-on-surface text-xs font-bold font-sans uppercase tracking-wider rounded-lg border border-slate-700 transition-all flex items-center gap-1.5"
            title="Force next telemetry snapshot"
          >
            <Shuffle className="h-3.5 w-3.5 text-secondary-brand" />
            Tick
          </button>

          <div className="h-6 w-px bg-slate-800 mx-1 hidden sm:block"></div>

          <div className="flex rounded-lg overflow-hidden border border-slate-800 shadow-inner">
            {(['nominal', 'heavy-rain', 'flash-flood', 'dry'] as SimulationProfile[]).map((p) => (
              <button
                key={p}
                onClick={() => setSimulationProfile(p)}
                className={`cursor-pointer px-2.5 py-1.5 text-[10px] font-sans font-bold capitalize transition-all ${
                  simulationProfile === p
                    ? 'bg-indigo-600 text-white font-extrabold'
                    : 'bg-slate-900 text-on-surface-variant hover:text-white hover:bg-slate-800'
                }`}
              >
                {p.replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Top Row: General Basin Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Waterfall Basin Status */}
        <div className="lg:col-span-2 glass-card rounded-xl p-6 flex flex-col justify-between min-h-[160px]">
          <div>
            <p className="font-sans font-bold text-[11px] text-on-surface-variant tracking-widest uppercase mb-1">
              Waterfall Basin Overall Status
            </p>
            <div className="flex flex-wrap items-end gap-3">
              <h2 className={`font-sans text-3xl md:text-4xl font-extrabold tracking-tight ${statusColor} drop-shadow-sm`}>
                {statusText}
              </h2>
              <p className="font-sans text-xs md:text-sm text-on-surface/70 mb-1">
                {statusLabel}
              </p>
            </div>
          </div>
          
          <div className="flex flex-col gap-2 mt-4">
            <div className="flex justify-between items-center text-xs">
              <div className="flex items-center gap-2">
                <span className="text-on-surface-variant/80">Basin Storage Utilization</span>
                {gateOpenPct > 0 && (
                  <span className="px-1.5 py-0.5 bg-cyan-900/40 text-[9px] text-cyan-300 font-mono rounded border border-cyan-800 animate-pulse">
                    RELEASE GATES OPEN {gateOpenPct}%
                  </span>
                )}
              </div>
              <span className="font-mono text-white font-bold">{basinCapacityPct.toFixed(1)}% Capacity</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="h-3 flex-1 bg-slate-900 rounded-full overflow-hidden border border-slate-800 p-[1px]">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ${
                    basinCapacityPct > 85 
                      ? 'bg-red-500 ' 
                      : basinCapacityPct > 65 
                        ? 'bg-amber-400' 
                        : 'bg-emerald-400'
                  }`}
                  style={{ width: `${Math.min(basinCapacityPct, 100)}%` }}
                ></div>
              </div>
              <span className="font-mono text-xs text-on-surface-variant/80 shrink-0">
                {basinCapacityPct > 85 ? '🚨 CRITICAL' : basinCapacityPct > 65 ? '⚡ HIGH' : '✔️ CONSTRAINED'}
              </span>
            </div>
          </div>
        </div>

        {/* Active Alerts Summary */}
        <div className={`glass-card rounded-xl p-6 flex flex-col justify-between border ${
          activeAlerts.length > 0 
            ? 'border-red-500/20 bg-red-950/15' 
            : 'border-emerald-500/20'
        }`}>
          <div className="flex justify-between items-start">
            <div>
              <p className="font-sans font-bold text-[11px] text-on-surface-variant tracking-widest uppercase mb-1">
                Active Critical Incidents
              </p>
              <h2 className={`font-mono text-4xl font-extrabold ${
                activeAlerts.length > 0 ? 'text-red-400' : 'text-emerald-400'
              }`}>
                {activeAlerts.length > 0 ? `0${activeAlerts.length}` : '00'}
              </h2>
            </div>
            <div className={`p-2.5 rounded-xl ${
              activeAlerts.length > 0 ? 'bg-red-500/20 text-red-400 animate-ping' : 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/20'
            }`}>
              <CheckCircle className="h-6 w-6" />
            </div>
          </div>

          <div className="mt-4">
            {activeAlerts.length > 0 ? (
              <div className="space-y-2">
                <p className="text-xs text-red-300 font-sans leading-snug">
                  Hydraulic surges registered at point sites. Immediate mitigation response is active.
                </p>
                <button
                  onClick={onAcknowledgeAll}
                  className="w-full py-1.5 bg-red-500/10 hover:bg-red-500/20 hover:text-white border border-red-500/20 rounded-lg text-[10px] font-sans font-bold tracking-widest text-red-300 uppercase transition-all cursor-pointer"
                >
                  Bulk Acknowledge Alerts ({activeAlerts.length})
                </button>
              </div>
            ) : (
              <p className="text-xs text-emerald-400 bg-emerald-500/5 border border-emerald-500/10 px-3 py-2 rounded-xl inline-flex items-center gap-1.5 w-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                All upstream stations functioning nominally
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Monitoring Grid (5 Stations) */}
      <div>
        <h3 className="font-sans font-bold text-xs text-on-surface-variant tracking-wider uppercase mb-3 px-1">
          River Measurement Points (Upstream Distance Location)
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-5">
          {stations.map((station) => {
            const hasAlert = station.activeAlert;
            const isWarning = station.warningState;
            
            return (
              <div 
                key={station.id} 
                className={`glass-card rounded-xl overflow-hidden group flex flex-col justify-between ${
                  hasAlert 
                    ? 'border-red-500 bg-red-950/20' 
                    : isWarning 
                      ? 'border-amber-500/40 bg-amber-500/5' 
                      : 'hover:border-indigo-500/30'
                }`}
              >
                {/* Live Surveillance Feed Box */}
                <div className="relative h-40 bg-surface-container-lowest overflow-hidden">
                  <img 
                    alt={station.altText} 
                    className="w-full h-full object-cover opacity-60 group-hover:opacity-90 group-hover:scale-105 transition-all duration-700" 
                    src={station.image}
                    referrerPolicy="no-referrer"
                  />
                  {/* Digital Overlay Shader */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent opacity-50"></div>
                  
                  {/* Corner LED Indicator */}
                  <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2 py-0.5 bg-black/60 rounded backdrop-blur">
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      hasAlert 
                        ? 'bg-red-500 animate-pulse' 
                        : isWarning 
                          ? 'bg-amber-500 animate-pulse' 
                          : 'bg-emerald-400 animate-live'
                    }`}></span>
                    <span className="font-sans text-[9px] text-white font-bold uppercase tracking-wider">
                      {station.liveLabel}
                    </span>
                  </div>

                  {/* Subtitle Indicator */}
                  <div className="absolute bottom-2 left-3">
                    <p className="font-sans text-[10px] text-white/50">{station.location}</p>
                  </div>

                  {/* Interactive Eye Button on Hover */}
                  <div className="absolute inset-0 bg-indigo-950/40 opacity-0 group-hover:opacity-100 Transition-all duration-300 flex items-center justify-center">
                    <button
                      onClick={() => onViewCamera(station.id)}
                      className="cursor-pointer px-3 py-1.5 bg-white text-slate-950 rounded-lg text-[10px] font-sans font-bold uppercase tracking-wider flex items-center gap-1 shadow-xl hover:scale-105 transition-all"
                    >
                      <Video className="h-3.5 w-3.5" />
                      View Feed
                    </button>
                  </div>
                </div>

                {/* Station Readings */}
                <div className="p-4 space-y-3">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className={`font-sans font-bold text-[10px] tracking-widest ${
                        hasAlert ? 'text-red-400' : 'text-on-surface-variant/70'
                      }`}>
                        LEVEL (M)
                      </p>
                      <p className={`font-sans text-2xl font-extrabold ${
                        hasAlert ? 'text-red-400' : isWarning ? 'text-amber-300' : 'text-white'
                      }`}>
                        {station.level.toFixed(2)}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className={`font-mono text-xs font-bold ${
                        station.rateOfChange > 0 
                          ? 'text-red-400' 
                          : station.rateOfChange < 0 
                            ? 'text-emerald-400' 
                            : 'text-on-surface-variant/70'
                      }`}>
                        {station.rateOfChange > 0 ? '+' : ''}{station.rateOfChange.toFixed(2)}
                      </p>
                      <p className="text-[9px] font-mono tracking-widest text-on-surface-variant/50">
                        M/MIN
                      </p>
                    </div>
                  </div>

                  {/* Sparkline Graphic */}
                  <div className="sparkline-container relative">
                    <svg className="w-full h-full stroke-[1.5] fill-none" viewBox="0 0 100 20">
                      <path 
                        className={hasAlert ? 'stroke-red-400' : isWarning ? 'stroke-amber-400' : 'stroke-emerald-400'}
                        d={station.sparkline.reduce((d, level, i) => {
                          const x = (i / (station.sparkline.length - 1)) * 100;
                          // Invert level so higher values go up (svg height 20)
                          // we map range roughly from 3.5 to 5.5 to svg y 20 to 0
                          const minL = 3.8;
                          const maxL = 5.3;
                          const normY = 20 - ((level - minL) / (maxL - minL)) * 20;
                          const clampedY = Math.max(1, Math.min(19, normY));
                          return d + `${i === 0 ? 'M' : 'L'}${x},${clampedY}`;
                        }, '')}
                      ></path>
                    </svg>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 24-Hour Historical Trends & Precipitation Section */}
      <div className="space-y-4">
        <h3 className="font-sans font-bold text-xs text-on-surface-variant tracking-wider uppercase px-1">
          24-Hour Historical Hydrology & Precipitation Trends
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* River Level Trend (Large SVG Chart) */}
          <div className="lg:col-span-2 glass-card rounded-xl p-6 flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
              <div>
                <p className="font-sans font-bold text-[10px] text-on-surface-variant tracking-widest uppercase">
                  River Hydrological Level Trend (Meters)
                </p>
                <p className="text-[11px] text-on-surface-variant/70">
                  Continuous multi-gauge readings mapped across 24h timeline
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400"></span>
                  <span className="text-[10px] font-sans font-bold tracking-wider text-on-surface-variant/80">3KM Station</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                  <span className="text-[10px] font-sans font-bold tracking-wider text-on-surface-variant/80">5KM Station</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-400"></span>
                  <span className="text-[10px] font-sans font-bold tracking-wider text-on-surface-variant/80">Basin Avg</span>
                </div>
                <div className="h-4 w-px bg-outline-variant/30 hidden sm:block"></div>
                <div className="flex items-center gap-1">
                  <div className="w-2.5 h-[2px] bg-red-500/60 border-t border-dashed"></div>
                  <span className="text-[10px] font-sans font-bold tracking-wider text-red-400">Stages</span>
                </div>
              </div>
            </div>

            {/* SVG Plotter */}
            <div className="h-48 w-full relative group/plotter border border-slate-800/40 rounded-lg p-2 bg-slate-950/30">
              <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 400 100">
                {/* Stage Threshold Lines */}
                {/* Severe Flood stage line (y=15, 4.9m) */}
                <line x1="0" x2="400" y1="20" y2="20" stroke="#f43f5e" strokeWidth="1" strokeDasharray="3 3" opacity="0.3"></line>
                {/* Warning stage line (y=45, 4.4m) */}
                <line x1="0" x2="400" y1="45" y2="45" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3 3" opacity="0.3"></line>
                {/* Advisory stage line (y=75, 4.1m) */}
                <line x1="0" x2="400" y1="70" y2="70" stroke="#fbbf24" strokeWidth="1" strokeDasharray="3 3" opacity="0.3"></line>

                {/* Grid guidelines */}
                <line x1="0" x2="400" y1="10" y2="10" stroke="#334155" strokeWidth="0.5" opacity="0.15"></line>
                <line x1="0" x2="400" y1="35" y2="35" stroke="#334155" strokeWidth="0.5" opacity="0.15"></line>
                <line x1="0" x2="400" y1="60" y2="60" stroke="#334155" strokeWidth="0.5" opacity="0.15"></line>
                <line x1="0" x2="400" y1="85" y2="85" stroke="#334155" strokeWidth="0.5" opacity="0.15"></line>

                {/* Multi-line Paths */}
                {/* 5KM Gauge Path (Stable emerald) */}
                <path 
                    className="stroke-emerald-400 transition-all duration-500 animate-pulse" 
                    d="M0,80 L40,75 L80,78 L120,70 L160,65 L200,68 L240,60 L280,55 L320,58 L360,51 L400,47" 
                    fill="none" 
                    strokeWidth="2"
                ></path>

                {/* 3KM Gauge Path (Rising red/pulsing) */}
                <path 
                    className="stroke-red-400 transition-all duration-500" 
                    d="M0,60 L40,62 L80,55 L120,58 L160,50 L200,45 L240,48 L280,35 L320,29 L360,22 L400,12" 
                    fill="none" 
                    strokeWidth="2.5"
                ></path>

                {/* Basin Average Path (Sky blue) */}
                <path 
                    className="stroke-sky-400 transition-all duration-500" 
                    d="M0,85 L40,81 L80,84 L120,85 L160,82 L200,80 L240,81 L280,78 L320,79 L360,76 L400,75" 
                    fill="none" 
                    strokeWidth="1.5"
                    strokeDasharray="1 1"
                ></path>

                {/* Vertical hover bars */}
                {hoverPercentages.map((pct, idx) => (
                  <line
                    key={idx}
                    x1={`${pct}%`}
                    x2={`${pct}%`}
                    y1="0"
                    y2="100"
                    stroke="#818cf8"
                    strokeWidth="1.5"
                    opacity={hoveredTrendIndex === idx ? '0.4' : '0'}
                    className="transition-opacity"
                  ></line>
                ))}
              </svg>

              {/* Tooltip trigger columns over plots */}
              <div className="absolute inset-0 flex justify-between">
                {hoverPercentages.map((_, idx) => (
                  <div
                    key={idx}
                    className="flex-1 cursor-crosshair"
                    onMouseEnter={() => setHoveredTrendIndex(idx)}
                    onMouseLeave={() => setHoveredTrendIndex(null)}
                  ></div>
                ))}
              </div>

              {/* Dynamic Legend indicators inside the SVG */}
              <div className="absolute right-3 top-2 h-full flex flex-col justify-between pointer-events-none select-none text-right">
                <span className="text-[8px] font-bold text-red-500/80 tracking-wider">FLOOD DEVIATION PRE-BORDER LIMIT</span>
                <span className="text-[8px] font-bold text-amber-500/80 tracking-wider">WARNING INTERCEPT</span>
                <span className="text-[8px] font-bold text-yellow-400/80 tracking-wider">PREVENTATIVE ADVISORY STAGE</span>
                <div className="flex-1"></div>
              </div>

              {/* Live Interactive Values readout */}
              {hoveredTrendIndex !== null && (
                <div className="absolute top-2 left-3 bg-slate-900/90 border border-indigo-500/50 rounded-lg p-2 flex gap-3 text-[10px] font-mono shadow-2xl backdrop-blur-md">
                  <div>
                    <span className="text-white/50">TIMESTAGE:</span>{' '}
                    <span className="text-indigo-300 font-bold">-{24 - Math.round(hoveredTrendIndex * 2.4)}H UTC</span>
                  </div>
                  <div>
                    <span className="text-red-400">3KM:</span>{' '}
                    <span className="text-white font-bold">{(5.14 - (10 - hoveredTrendIndex) * 0.08).toFixed(2)}m</span>
                  </div>
                  <div>
                    <span className="text-emerald-400">5KM:</span>{' '}
                    <span className="text-white font-bold">{(4.53 - (10 - hoveredTrendIndex) * 0.03).toFixed(2)}m</span>
                  </div>
                </div>
              )}
            </div>

            {/* Timelines and labels */}
            <div className="flex justify-between px-1 text-[10px] font-sans font-bold text-on-surface-variant/40">
              <span>24 HOURS AGO</span>
              <span>12 HOURS AGO</span>
              <span>REAL-TIME STATUS SNAPSHOT</span>
            </div>
          </div>

          {/* Precipitation Trend */}
          <div className="glass-card rounded-xl p-6 flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-sans font-bold text-[10px] text-on-surface-variant tracking-widest uppercase">
                  Precipitation Log (MM)
                </p>
                <p className="text-[11px] text-on-surface-variant/70">
                  Accumulated volume mapped by hour
                </p>
              </div>
              <CloudRain className="text-sky-400 h-5 w-5" />
            </div>

            {/* Precipitation Bar Chart Representation */}
            <div className="h-48 w-full relative flex items-end gap-1 px-1 py-2 bg-slate-950/20 rounded-lg border border-slate-800/30">
              <div className="flex-1 bg-sky-500/20 hover:bg-sky-500/40 transition-colors h-[20%] rounded-t-sm group relative cursor-pointer">
                <span className="absolute bottom-full left-1/2 -translate-x-1/2 bg-slate-900 text-white rounded text-[8px] p-1 opacity-0 group-hover:opacity-100 transition-opacity">1.2mm</span>
              </div>
              <div className="flex-1 bg-sky-500/20 hover:bg-sky-500/40 transition-colors h-[25%] rounded-t-sm group relative cursor-pointer">
                <span className="absolute bottom-full left-1/2 -translate-x-1/2 bg-slate-900 text-white rounded text-[8px] p-1 opacity-0 group-hover:opacity-100 transition-opacity">2.4mm</span>
              </div>
              <div className="flex-1 bg-sky-500/40 hover:bg-sky-500/65 transition-colors h-[45%] rounded-t-sm group relative cursor-pointer">
                <span className="absolute bottom-full left-1/2 -translate-x-1/2 bg-slate-900 text-white rounded text-[8px] p-1 opacity-0 group-hover:opacity-100 transition-opacity">4.5mm</span>
              </div>
              <div className="flex-1 bg-sky-500/60 hover:bg-sky-500/80 transition-colors h-[70%] rounded-t-sm group relative cursor-pointer">
                <span className="absolute bottom-full left-1/2 -translate-x-1/2 bg-slate-900 text-white rounded text-[8px] p-1 opacity-0 group-hover:opacity-100 transition-opacity">7.2mm</span>
              </div>
              <div className="flex-1 bg-sky-500/80 hover:bg-sky-500 transition-colors h-[85%] rounded-t-sm group relative cursor-pointer">
                <span className="absolute bottom-full left-1/2 -translate-x-1/2 bg-slate-900 text-white rounded text-[8px] p-1 opacity-0 group-hover:opacity-100 transition-opacity">9.5mm</span>
              </div>
              <div className="flex-1 bg-sky-500 hover:brightness-110 h-full rounded-t-sm group relative cursor-pointer">
                <span className="absolute bottom-full left-1/2 -translate-x-1/2 bg-slate-900 text-white rounded text-[8px] p-1 opacity-0 group-hover:opacity-100 transition-opacity">12.0mm</span>
              </div>
              <div className="flex-1 bg-sky-500/80 hover:bg-sky-500 transition-colors h-[75%] rounded-t-sm group relative cursor-pointer">
                <span className="absolute bottom-full left-1/2 -translate-x-1/2 bg-slate-900 text-white rounded text-[8px] p-1 opacity-0 group-hover:opacity-100 transition-opacity">8.4mm</span>
              </div>
              <div className="flex-1 bg-sky-500/60 hover:bg-sky-500/85 transition-colors h-[50%] rounded-t-sm group relative cursor-pointer">
                <span className="absolute bottom-full left-1/2 -translate-x-1/2 bg-slate-900 text-white rounded text-[8px] p-1 opacity-0 group-hover:opacity-100 transition-opacity">5.1mm</span>
              </div>
              <div className="flex-1 bg-sky-500/40 hover:bg-sky-500/65 transition-colors h-[30%] rounded-t-sm group relative cursor-pointer">
                <span className="absolute bottom-full left-1/2 -translate-x-1/2 bg-slate-900 text-white rounded text-[8px] p-1 opacity-0 group-hover:opacity-100 transition-opacity">3.0mm</span>
              </div>
              <div className="flex-1 bg-sky-500/20 hover:bg-sky-500/40 transition-colors h-[15%] rounded-t-sm group relative cursor-pointer">
                <span className="absolute bottom-full left-1/2 -translate-x-1/2 bg-slate-900 text-white rounded text-[8px] p-1 opacity-0 group-hover:opacity-100 transition-opacity">0.8mm</span>
              </div>
            </div>

            <p className="text-center font-sans font-bold text-[10px] text-on-surface-variant/40 uppercase tracking-widest">
              Accumulated Hourly volume logs
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Row secondary Telemetry Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Rain Level */}
        <div className="glass-card rounded-xl p-5 border-l-4 border-sky-400">
          <div className="flex justify-between items-center mb-1">
            <p className="font-sans font-bold text-[10px] text-on-surface-variant/70 tracking-widest uppercase">
              Rain Level (MM/H)
            </p>
            <CloudRain className="text-sky-400 h-5 w-5" />
          </div>
          <h4 className="font-sans text-2xl font-extrabold text-white">
            {rainLevel.toFixed(2)}
          </h4>
          <p className="text-xs text-sky-300 font-sans mt-0.5 opacity-80">
            {rainLevel > 30 ? 'Heavy storm warnings' : rainLevel > 15 ? 'Steady precipitation' : 'Intermittent drizzle'}
          </p>
        </div>

        {/* Basin Saturation */}
        <div className="glass-card rounded-xl p-5 border-l-4 border-emerald-400">
          <div className="flex justify-between items-center mb-1">
            <p className="font-sans font-bold text-[10px] text-on-surface-variant/70 tracking-widest uppercase">
              Basin Saturation (%)
            </p>
            <Droplets className="text-emerald-400 h-5 w-5" />
          </div>
          <h4 className="font-sans text-2xl font-extrabold text-white">
            {basinSaturation.toFixed(2)}%
          </h4>
          <p className="text-xs text-emerald-300 font-sans mt-0.5 opacity-80">
            {basinSaturation > 80 ? 'Excess runoff risks' : 'Moderate fluid retention'}
          </p>
        </div>

        {/* Upstream Discharge */}
        <div className="glass-card rounded-xl p-5 border-l-4 border-indigo-400">
          <div className="flex justify-between items-center mb-1">
            <p className="font-sans font-bold text-[10px] text-on-surface-variant/70 tracking-widest uppercase">
              Discharge Rate (M³/S)
            </p>
            <TrendingUp className="text-indigo-400 h-5 w-5" />
          </div>
          <h4 className="font-sans text-2xl font-extrabold text-white">
            {dischargeRate.toFixed(2)}
          </h4>
          <p className="text-xs text-indigo-300 font-sans mt-0.5 opacity-80">
            {dischargeRate > 2.5 ? 'Accelerated outflows' : 'Stable outflows detected'}
          </p>
        </div>

        {/* System Sensor Health */}
        <div className="glass-card rounded-xl p-5 border-l-4 border-emerald-400">
          <div className="flex justify-between items-center mb-1">
            <p className="font-sans font-bold text-[10px] text-on-surface-variant/70 tracking-widest uppercase">
              Sensor Health (GRID)
            </p>
            <Zap className="text-emerald-400 h-5 w-5" />
          </div>
          <h4 className="font-sans text-2xl font-extrabold text-white">
            {sensorHealth.toFixed(2)}%
          </h4>
          <div className="flex gap-1.5 items-center mt-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <p className="text-xs text-emerald-300 font-sans font-bold uppercase tracking-wider">
              {sensorHealth > 95 ? 'All nodes active' : 'Telemetry degraded'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
