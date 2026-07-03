import { useState } from 'react';
import { 
  Cpu, 
  RefreshCw, 
  Radio, 
  Battery, 
  Sun, 
  Activity, 
  CheckCircle, 
  AlertTriangle, 
  Gauge, 
  Signal, 
  CloudLightning,
  ShieldCheck
} from 'lucide-react';
import { Station, SensorState, StationHealth } from '../types';

interface SensorHealthViewProps {
  stations: Station[];
  onTriggerReboot: (stationId: string) => void;
  onCalibrateSensors: (stationId: string) => void;
}

export default function SensorHealthView({
  stations,
  onTriggerReboot,
  onCalibrateSensors,
}: SensorHealthViewProps) {
  const [selectedStationId, setSelectedStationId] = useState<string>(stations[0]?.id || '');
  const [rebootingStationIds, setRebootingStationIds] = useState<Record<string, number>>({});

  const chosenStation = stations.find(s => s.id === selectedStationId) || stations[0];

  const handleRebootClick = (stId: string) => {
    onTriggerReboot(stId);
    
    // Animate local progress counter
    setRebootingStationIds(prev => ({ ...prev, [stId]: 0 }));
    const interval = setInterval(() => {
      setRebootingStationIds(prev => {
        const current = prev[stId];
        if (current >= 100) {
          clearInterval(interval);
          const newMap = { ...prev };
          delete newMap[stId];
          return newMap;
        }
        return { ...prev, [stId]: current + 20 };
      });
    }, 450);
  };

  // Helper icons selector
  const getSensorIcon = (type: string) => {
    switch (type) {
      case 'water-level': return <Gauge className="h-4 w-4 text-sky-400" />;
      case 'flow-rate': return <Activity className="h-4 w-4 text-indigo-400" />;
      case 'battery': return <Battery className="h-4 w-4 text-emerald-400" />;
      case 'solar': return <Sun className="h-4 w-4 text-amber-400" />;
      case 'telemetry': return <Radio className="h-4 w-4 text-pink-400" />;
      default: return <Cpu className="h-4 w-4 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner metrics */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="font-sans text-xl font-bold text-white flex items-center gap-2">
            <Cpu className="text-primary-brand h-5 w-5" />
            Sensor Array & Telemetry Diagnostics
          </h2>
          <p className="text-xs text-on-surface-variant/80">
            Real-time transceiver latency, solar charge thresholds, and continuous ping registry
          </p>
        </div>

        {/* Global calibration */}
        <button
          onClick={() => {
            alert("Sent self-adjusting ultrasonic waves to all 5 gauges. Calibration successful.");
          }}
          className="cursor-pointer px-4.5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-sans text-xs font-bold uppercase tracking-wider rounded-lg border border-emerald-500/30 transition-all flex items-center gap-1.5 self-stretch md:self-auto text-center justify-center shadow-lg"
        >
          <ShieldCheck className="h-4.5 w-4.5" />
          Re-Calibrate Core Ultrasonic Grid
        </button>
      </div>

      {/* Main Grid: Left Side Station selector buttons, Right side diagnostic detailed panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left column List of devices nodes */}
        <div className="space-y-3 lg:col-span-1">
          <h3 className="font-sans font-bold text-xs text-on-surface-variant tracking-wider uppercase px-1">
            Station Transmitter Nodes
          </h3>

          <div className="flex flex-col gap-2">
            {stations.map(st => {
              const isActive = st.id === selectedStationId;
              const hasCritical = st.activeAlert;
              const isRebooting = rebootingStationIds[st.id] !== undefined;

              return (
                <button
                  key={st.id}
                  onClick={() => !isRebooting && setSelectedStationId(st.id)}
                  disabled={isRebooting}
                  className={`w-full text-left glass-card p-4 rounded-xl flex items-center justify-between border cursor-pointer select-none transition-all ${
                    isRebooting ? 'opacity-65 cursor-not-allowed border-amber-500/40' : ''
                  } ${
                    isActive && !isRebooting
                      ? 'bg-slate-800/80 border-indigo-500/60 shadow-lg text-white' 
                      : 'text-on-surface-variant hover:bg-slate-900/40 hover:text-white'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${
                        hasCritical ? 'bg-red-500 animate-ping' : 'bg-emerald-400 animate-live'
                      }`}></span>
                      <p className="font-sans font-extrabold text-xs text-white">{st.name}</p>
                    </div>
                    <p className="font-sans text-[10px] text-on-surface-variant/75">
                      Distance Upstream: {st.distance} | {st.location}
                    </p>
                  </div>

                  {/* Actions status or reboot progress indicators */}
                  <div className="text-right">
                    {isRebooting ? (
                      <div className="flex flex-col items-end gap-1">
                        <span className="font-mono text-[9px] text-amber-400 font-bold uppercase tracking-widest animate-pulse">
                          Rebooting {rebootingStationIds[st.id]}%
                        </span>
                        <div className="h-1 w-20 bg-slate-950 rounded overflow-hidden">
                          <div 
                            className="h-full bg-amber-400" 
                            style={{ width: `${rebootingStationIds[st.id]}%` }}
                          ></div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-white bg-slate-950 px-2 py-1 rounded border border-slate-800">
                          99.9% Up
                        </span>
                        <Signal className="h-4 w-4 text-emerald-400" />
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Columns Station deep telemetry inspection cards */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="font-sans font-bold text-xs text-on-surface-variant tracking-wider uppercase px-1">
            Diagnostic Inspection Center
          </h3>

          {chosenStation && (
            <div className="glass-card rounded-xl bg-slate-900/60 border border-indigo-500/20 p-6 space-y-6">
              
              {/* Node Overview Header */}
              <div className="flex flex-col sm:flex-row justify-between sm:items-center pb-4 border-b border-slate-800/80 gap-3">
                <div>
                  <h3 className="font-sans text-lg font-extrabold text-white">
                    {chosenStation.name} Diagnostic Ledger
                  </h3>
                  <p className="text-[11px] text-on-surface-variant/80 font-sans">
                    Sector location: <span className="font-bold text-indigo-300">{chosenStation.location}</span> | Latitude: 44.5912° N, Longitude: 120.4044° W
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleRebootClick(chosenStation.id)}
                    className="cursor-pointer px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded border border-slate-700 font-sans text-[10px] font-bold uppercase tracking-wider flex items-center gap-1"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    Reboot Node
                  </button>
                  <button
                    onClick={() => alert(`Self-test completed on ${chosenStation.name}: Diagnostic code 0x00 (SUCCESS).`)}
                    className="cursor-pointer px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-sky-300 rounded border border-slate-700 font-sans text-[10px] font-bold uppercase tracking-wider flex items-center gap-1"
                  >
                    <Signal className="h-3.5 w-3.5 animate-pulse" />
                    Ping Signal
                  </button>
                </div>
              </div>

              {/* Individual sensors table list */}
              <div className="space-y-3">
                <h4 className="font-mono text-[10px] uppercase font-bold tracking-widest text-indigo-300">
                  Sub-Sensor Grid Components
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {chosenStation.sensors.map((sensor, sIdx) => {
                    const isDegraded = sensor.status === 'degraded';
                    const isOffline = sensor.status === 'offline';

                    return (
                      <div 
                        key={sIdx} 
                        className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800/60 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-slate-905 rounded-lg border border-slate-800">
                            {getSensorIcon(sensor.type)}
                          </div>
                          <div>
                            <p className="font-sans font-bold text-xs text-white">{sensor.name}</p>
                            <p className="font-mono text-[10px] text-on-surface-variant/80">
                              Reading: <span className="font-bold text-white">{sensor.value}</span>
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-sans font-bold uppercase tracking-wider border ${
                            isOffline 
                              ? 'bg-red-500/10 text-red-300 border-red-500/20' 
                              : isDegraded 
                                ? 'bg-amber-500/10 text-amber-300 border-amber-500/20' 
                                : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                          }`}>
                            {sensor.status}
                          </span>
                          <span className="text-[8px] font-mono text-on-surface-variant/40 block mt-1">
                            Ping: {sensor.lastPing}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Node status indicators: Temperature, Signal quality, battery levels block */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-800/80">
                {/* Node battery storage status */}
                <div className="p-3 bg-slate-950/30 rounded-lg flex flex-col justify-between border border-slate-800/20">
                  <div className="flex items-center justify-between text-on-surface-variant mb-1">
                    <span className="font-sans text-[10px] uppercase font-bold tracking-wider">Storage Battery</span>
                    <Battery className="h-4.5 w-4.5 text-emerald-400" />
                  </div>
                  <p className="font-sans text-lg font-black text-white">96.84%</p>
                  <p className="text-[9px] text-on-surface-variant/60 font-sans block mt-1">
                    Solar cycle charge optimal (Float mode)
                  </p>
                </div>

                {/* Satellite ping transceiver latency */}
                <div className="p-3 bg-slate-950/30 rounded-lg flex flex-col justify-between border border-slate-800/20">
                  <div className="flex items-center justify-between text-on-surface-variant mb-1">
                    <span className="font-sans text-[10px] uppercase font-bold tracking-wider">RF Transmitting Lag</span>
                    <Radio className="h-4.5 w-4.5 text-sky-400" />
                  </div>
                  <p className="font-sans text-lg font-black text-white">14.00 MS</p>
                  <p className="text-[9px] text-on-surface-variant/60 font-sans block mt-1">
                    Broadband Uplink quality index: 99.8%
                  </p>
                </div>

                {/* Solar array metrics */}
                <div className="p-3 bg-slate-950/30 rounded-lg flex flex-col justify-between border border-slate-800/20">
                  <div className="flex items-center justify-between text-on-surface-variant mb-1">
                    <span className="font-sans text-[10px] uppercase font-bold tracking-wider">Solar Bus Load</span>
                    <Sun className="h-4.5 w-4.5 text-amber-400" />
                  </div>
                  <p className="font-sans text-lg font-black text-white">4.82 V/A</p>
                  <p className="text-[9px] text-on-surface-variant/60 font-sans block mt-1">
                    Daylight intensity: 480 W/m² (Nominal)
                  </p>
                </div>
              </div>

              {/* Simulated network error warning warnings if the station is in Alert */}
              {chosenStation.activeAlert && (
                <div className="p-3.5 bg-red-950/20 border border-red-500/30 rounded-xl flex items-start gap-3 text-red-200">
                  <AlertTriangle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <p className="font-bold text-white">ACTIVE THRESHOLD ALARM INCIDENT DETECTED</p>
                    <p className="opacity-90 leading-snug mt-0.5">
                      The water depth has surpassed safe threshold. The system will continuously transmit level values at triple frequency until a level release gate or acknowledgement is dispatched.
                    </p>
                  </div>
                </div>
              )}

            </div>
          )}
        </div>

      </div>
    </div>
  );
}
