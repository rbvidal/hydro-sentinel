import { useState, useEffect, useRef, useMemo, FormEvent } from 'react';
import {
  ShieldAlert,
  Volume2,
  VolumeX,
  Radio,
  Sparkles,
  Clock,
  AlertCircle,
  CheckCircle2,
  Activity,
  RotateCcw,
} from 'lucide-react';
import {
  TelemetrySensor,
  TelemetryAlert,
  TelemetryThresholdConfig,
  TelemetryOperatorAction,
  TelemetrySensorStatus,
} from '../types';
import Sparkline from './Sparkline';
import WaterBasin from './WaterBasin';
import VideoFeed from './VideoFeed';
import HydroMap from './HydroMap';

const DEFAULT_THRESHOLDS: TelemetryThresholdConfig = {
  waterLevelWarning: 8.0,
  waterLevelCritical: 9.3,
  flowRateWarning: 500,
  flowRateCritical: 850,
  precipitationWarning: 30.0,
  precipitationCritical: 55.0,
};

const INITIAL_SENSORS: TelemetrySensor[] = [
  {
    id: 'sen-wl-01', name: 'Reservoir Core level Gauge', value: 8.42, unit: 'm',
    icon: 'waves', status: 'Warning',
    history: [7.2, 7.35, 7.5, 7.8, 8.0, 8.12, 8.25, 8.32, 8.38, 8.41, 8.42, 8.42],
    latitude: 54.128, longitude: -114.502, locationName: 'Reservoir Block A Sector 1', category: 'level',
  },
  {
    id: 'sen-wl-02', name: 'Auxiliary Spillway Overflow Gauge', value: 3.12, unit: 'm',
    icon: 'trending-up', status: 'Normal',
    history: [1.1, 1.2, 1.4, 1.8, 2.1, 2.4, 2.7, 2.9, 3.0, 3.1, 3.12, 3.12],
    latitude: 54.19, longitude: -114.615, locationName: 'Aux Dam Retention Spillway', category: 'level',
  },
  {
    id: 'sen-fr-01', name: 'Main Outlet Dam Hydro-Gage', value: 412, unit: 'm³/s',
    icon: 'activity', status: 'Normal',
    history: [250, 270, 290, 320, 350, 380, 400, 410, 412, 412, 412, 412],
    latitude: 54.135, longitude: -114.498, locationName: 'Downstream Spillway Throat Gate-01', category: 'flow',
  },
  {
    id: 'sen-wq-01', name: 'Downstream Basin Water Quality Monitor', value: 12.8, unit: 'NTU',
    icon: 'droplet', status: 'Normal',
    history: [8.5, 9.0, 9.5, 10.2, 11.0, 11.5, 12.0, 12.4, 12.6, 12.8, 12.8, 12.8],
    latitude: 54.18, longitude: -114.65, locationName: 'Cofferdam Discharge Base', category: 'quality',
  },
  {
    id: 'sen-pr-01', name: 'Catchment Zone Precip-Sensor', value: 42.5, unit: 'mm/h',
    icon: 'cloud-rain', status: 'Warning',
    history: [10, 15, 20, 28, 35, 40, 42.5, 42.5, 42.5, 42.5, 42.5, 42.5],
    latitude: 54.21, longitude: -114.422, locationName: 'North-West Watershed Peak', category: 'precipitation',
  },
];

const INITIAL_ALERTS: TelemetryAlert[] = [
  { id: 'al-101', timestamp: '14:21:05', sensorId: 'sen-wl-01', type: 'Warning',
    message: 'Reservoir Core level exceeded safety warning threshold [8.0m].', acknowledged: false },
  { id: 'al-102', timestamp: '14:15:30', sensorId: 'sen-pr-01', type: 'Warning',
    message: 'Heavy upstream precipitation [42.5mm/h] detected at watershed peak.', acknowledged: false },
];

const INITIAL_LOGS: TelemetryOperatorAction[] = [
  { id: 'log-1', timestamp: '14:10:00', operator: 'Civil Eng. Vidal',
    action: 'Secured lock seals on downstream flow sensors.', status: 'SUCCESS', category: 'system' },
  { id: 'log-2', timestamp: '14:05:12', operator: 'Automatic System',
    action: 'Spillway gate adjustment scheduled based on catchment precip.', status: 'SUCCESS', category: 'spillway' },
];

export default function TelemetryDashboard() {
  const [sensors, setSensors] = useState<TelemetrySensor[]>(INITIAL_SENSORS);
  const [thresholds] = useState<TelemetryThresholdConfig>(DEFAULT_THRESHOLDS);
  const [alerts, setAlerts] = useState<TelemetryAlert[]>(INITIAL_ALERTS);
  const [logs, setLogs] = useState<TelemetryOperatorAction[]>(INITIAL_LOGS);
  const [spillwayGateOpen, setSpillwayGateOpen] = useState(30);
  const [isSirenActive, setIsSirenActive] = useState(false);
  const [selectedSensorId, setSelectedSensorId] = useState('sen-wl-01');
  const [isAudioMuted, setIsAudioMuted] = useState(true);
  const [newLogText, setNewLogText] = useState('');
  const [editSensorValue, setEditSensorValue] = useState('');

  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const lastClearedRef = useRef<number>(0);

  const selectedSensor = useMemo(
    () => sensors.find(s => s.id === selectedSensorId) || sensors[0],
    [sensors, selectedSensorId],
  );

  useEffect(() => {
    if (selectedSensor) setEditSensorValue(selectedSensor.value.toString());
  }, [selectedSensorId]);

  // Simulation loop
  useEffect(() => {
    const interval = setInterval(() => {
      setSensors(prev =>
        prev.map(sensor => {
          let newValue = sensor.value;
          if (sensor.category === 'level' && sensor.id === 'sen-wl-01') {
            const precipSensor = prev.find(s => s.id === 'sen-pr-01');
            const rainInflow = (precipSensor?.value || 0) * 0.0025;
            const gateOutflow = (spillwayGateOpen / 100) * 0.12;
            newValue = Math.max(0.1, Math.min(10, sensor.value + rainInflow - gateOutflow + (Math.random() - 0.5) * 0.01));
          } else if (sensor.category === 'flow' && sensor.id === 'sen-fr-01') {
            const coreLevel = prev.find(s => s.id === 'sen-wl-01')?.value || 5;
            newValue = Math.max(10, Math.round((spillwayGateOpen / 100) * 1150 * (coreLevel / 10) + (Math.random() - 0.5) * 8));
          } else if (sensor.category === 'quality' || sensor.category === 'level' || sensor.category === 'precipitation') {
            const variance = sensor.category === 'precipitation' ? 0.4 : 0.02;
            newValue = Math.max(0, sensor.value + (Math.random() - 0.5) * variance);
          }
          let status: TelemetrySensorStatus = 'Normal';
          if (sensor.category === 'level' && sensor.id === 'sen-wl-01') {
            if (newValue >= thresholds.waterLevelCritical) status = 'Critical';
            else if (newValue >= thresholds.waterLevelWarning) status = 'Warning';
          } else if (sensor.category === 'flow' && sensor.id === 'sen-fr-01') {
            if (newValue >= thresholds.flowRateCritical) status = 'Critical';
            else if (newValue >= thresholds.flowRateWarning) status = 'Warning';
          } else if (sensor.category === 'precipitation' && sensor.id === 'sen-pr-01') {
            if (newValue >= thresholds.precipitationCritical) status = 'Critical';
            else if (newValue >= thresholds.precipitationWarning) status = 'Warning';
          }
          return { ...sensor, value: parseFloat(newValue.toFixed(2)), status, history: [...sensor.history.slice(1), parseFloat(newValue.toFixed(2))] };
        }),
      );
    }, 2800);
    return () => clearInterval(interval);
  }, [spillwayGateOpen, thresholds]);

  // Alert generation — suppressed for 8 s after clearing all alerts
  useEffect(() => {
    if (Date.now() - lastClearedRef.current < 8000) return;
    sensors.forEach(sensor => {
      if (sensor.status === 'Critical') {
        const exists = alerts.some(a => a.sensorId === sensor.id && a.type === 'Critical' && !a.acknowledged);
        if (!exists) {
          setAlerts(prev => [{ id: `al-${Date.now()}`, timestamp: new Date().toLocaleTimeString(), sensorId: sensor.id, type: 'Critical', message: `CRITICAL: ${sensor.name} breached dangerous levels: ${sensor.value}${sensor.unit}!`, acknowledged: false }, ...prev]);
          addSystemLog(`AUTOMATED: Hazardous condition on ${sensor.name}`, 'siren', 'FAILED');
          if (sensor.id === 'sen-wl-01') setIsSirenActive(true);
        }
      } else if (sensor.status === 'Warning') {
        const exists = alerts.some(a => a.sensorId === sensor.id && a.type === 'Warning' && !a.acknowledged);
        if (!exists) {
          setAlerts(prev => [{ id: `al-${Date.now()}`, timestamp: new Date().toLocaleTimeString(), sensorId: sensor.id, type: 'Warning', message: `Warning: ${sensor.name} reached ${sensor.value}${sensor.unit}.`, acknowledged: false }, ...prev]);
        }
      }
    });
  }, [sensors]);

  // Siren audio
  useEffect(() => {
    if (isSirenActive && !isAudioMuted) {
      try {
        if (!audioCtxRef.current) audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        if (!oscillatorRef.current && audioCtxRef.current) {
          const osc = audioCtxRef.current.createOscillator();
          const gain = audioCtxRef.current.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(320, audioCtxRef.current.currentTime);
          osc.frequency.linearRampToValueAtTime(650, audioCtxRef.current.currentTime + 1);
          osc.frequency.linearRampToValueAtTime(320, audioCtxRef.current.currentTime + 2);
          gain.gain.setValueAtTime(0.08, audioCtxRef.current.currentTime);
          osc.connect(gain);
          gain.connect(audioCtxRef.current.destination);
          osc.start();
          oscillatorRef.current = osc;
        }
      } catch { /* browser security */ }
    } else {
      if (oscillatorRef.current) { try { oscillatorRef.current.stop(); } catch {} oscillatorRef.current = null; }
    }
    return () => { if (oscillatorRef.current) { try { oscillatorRef.current.stop(); } catch {} } };
  }, [isSirenActive, isAudioMuted]);

  const addSystemLog = (action: string, category: 'spillway' | 'system' | 'siren' | 'dispatch' = 'system', status: 'SUCCESS' | 'FAILED' | 'PENDING' = 'SUCCESS') => {
    setLogs(prev => [{ id: `log-${Date.now()}`, timestamp: new Date().toLocaleTimeString(), operator: 'Civil Eng. Vidal', action, status, category }, ...prev]);
  };

  const handleAcknowledgeAlert = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, acknowledged: true } : a));
    addSystemLog(`Acknowledged alert #${id}`, 'system', 'SUCCESS');
  };

  const handleClearAll = () => {
    setAlerts(prev => prev.map(a => ({ ...a, acknowledged: true })));
    lastClearedRef.current = Date.now();
    addSystemLog('Cleared all warning notifications', 'system', 'SUCCESS');
  };

  const triggerEmergencyGateFullOpen = () => {
    setSpillwayGateOpen(100);
    setAlerts(prev => [{ id: `al-${Date.now()}`, timestamp: new Date().toLocaleTimeString(), type: 'Critical', message: 'EMERGENCY OVERRIDE: Spillway Gate G1-G4 at 100%', acknowledged: false }, ...prev]);
    addSystemLog('FORCED OVERRIDE: Emergency bypass deployed.', 'spillway', 'SUCCESS');
  };

  const handleInjectValue = (e: FormEvent) => {
    e.preventDefault();
    const val = parseFloat(editSensorValue);
    if (!isNaN(val)) {
      setSensors(prev => prev.map(s => s.id === selectedSensorId ? { ...s, value: val, history: [...s.history.slice(1), val] } : s));
      addSystemLog(`Manual override: ${selectedSensor.name} = ${val} ${selectedSensor.unit}`, 'system', 'SUCCESS');
    }
  };

  const handleManualLogSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (newLogText.trim()) { addSystemLog(newLogText, 'system', 'SUCCESS'); setNewLogText(''); }
  };

  const dischargeRate = useMemo(() => {
    const coreLevel = sensors.find(s => s.id === 'sen-wl-01')?.value || 8.42;
    return (spillwayGateOpen / 100) * 1150 * (coreLevel / 10);
  }, [sensors, spillwayGateOpen]);

  return (
    <div className="min-h-0 text-[#dae2fd] font-sans">
      {/* Incidents Banner */}
      <section className="space-y-3 mb-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-2.5 h-2.5 rounded-full ${
              alerts.some(a => a.type === 'Critical' && !a.acknowledged) ? 'bg-red-500 animate-ping'
              : alerts.some(a => a.type === 'Warning' && !a.acknowledged) ? 'bg-amber-500 animate-pulse'
              : 'bg-emerald-500'
            }`} />
            <h2 className="text-xs font-bold text-gray-300 uppercase tracking-widest">
              Active Telemetry Incident Roster ({alerts.filter(a => !a.acknowledged).length})
            </h2>
          </div>
          {alerts.some(a => !a.acknowledged) && (
            <button onClick={handleClearAll} className="text-[10px] font-mono text-blue-400 hover:text-blue-200 transition underline cursor-pointer">
              Clear/Mark all processed
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[140px] overflow-y-auto pr-1">
          {alerts.filter(a => !a.acknowledged).length === 0 ? (
            <div className="col-span-2 bg-[#131b2e]/40 border border-emerald-500/20 rounded-lg p-3 text-center text-xs text-emerald-400 font-mono flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>ALL SENSOR TELEMETRYS CURRENTLY RECORDING INSIDE SAFE BOUNDARIES</span>
            </div>
          ) : alerts.filter(a => !a.acknowledged).map(alert => (
            <div key={alert.id} className={`p-3 rounded-lg border flex items-start justify-between gap-3 text-xs ${
              alert.type === 'Critical' ? 'bg-red-950/20 border-red-500/30 text-red-200' : 'bg-amber-950/20 border-amber-500/30 text-amber-200'
            }`}>
              <div className="flex items-start gap-2.5">
                <AlertCircle className={`w-4 h-4 mt-0.5 ${alert.type === 'Critical' ? 'text-red-400' : 'text-amber-400'}`} />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-gray-400">[{alert.timestamp}]</span>
                    <span className={`font-mono text-[9px] font-bold uppercase px-1.5 py-0.2 rounded ${alert.type === 'Critical' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'}`}>{alert.type}</span>
                  </div>
                  <p className="mt-1 font-sans text-gray-200 font-medium leading-relaxed">{alert.message}</p>
                </div>
              </div>
              <button onClick={() => handleAcknowledgeAlert(alert.id)} className="px-2 py-1 rounded bg-white/5 border border-white/10 hover:bg-white/10 text-[10px] font-mono cursor-pointer transition shrink-0">Acknowledge</button>
            </div>
          ))}
        </div>
      </section>

      {/* Main 12-col Grid */}
      <main className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Sensors List */}
        <section className="lg:col-span-4 flex flex-col gap-4">
          <div className="bg-[#131b2e]/90 rounded-lg p-5 border border-white/10">
            <span className="text-[10px] text-gray-400 font-mono tracking-widest uppercase">Telemetry Array</span>
            <h3 className="font-semibold text-gray-200 text-sm uppercase tracking-wide mb-4">Active Hydraulic Sensors ({sensors.length})</h3>
            <div className="space-y-2.5">
              {sensors.map(sensor => {
                const isSelected = selectedSensorId === sensor.id;
                return (
                  <div key={sensor.id} onClick={() => setSelectedSensorId(sensor.id)}
                    className={`p-3 rounded-lg border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected ? 'bg-blue-500/10 border-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.15)]' : 'bg-[#0b1326]/60 border-white/5 hover:border-white/15'
                    }`}>
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-2 h-2 rounded-full shrink-0 ${sensor.status === 'Critical' ? 'bg-red-500 animate-pulse' : sensor.status === 'Warning' ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`} />
                      <div className="min-w-0">
                        <p className="font-semibold text-xs text-gray-200 truncate">{sensor.name}</p>
                        <p className="text-[9px] text-gray-500 font-mono truncate">{sensor.locationName}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 shrink-0 text-right">
                      <div className="hidden sm:block"><Sparkline data={sensor.history} status={sensor.status} width={80} height={24} /></div>
                      <div>
                        <p className="font-mono font-bold text-xs text-white">{sensor.value} <span className="text-[10px] font-medium text-gray-400">{sensor.unit}</span></p>
                        <span className={`text-[8px] font-mono font-bold uppercase rounded px-1 ${sensor.status === 'Critical' ? 'bg-red-500/20 text-red-400' : sensor.status === 'Warning' ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'}`}>{sensor.status}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Emergency Override */}
          <div className="bg-[#131b2e]/90 rounded-lg p-5 border border-red-500/20 shadow-lg">
            <span className="text-[9px] text-red-400 font-mono tracking-widest uppercase block mb-1">Civil Defense Contingency</span>
            <h4 className="text-xs font-bold text-gray-200 uppercase tracking-wider flex items-center gap-1.5 mb-3">
              <AlertCircle className="w-4 h-4 text-red-500" /> DAM EMERGENCY ACTUATIONS
            </h4>
            <p className="text-[11px] text-gray-400 mb-4 leading-relaxed">
              In the event of critical flood level violations, bypass automated logic and force open safety outlets.
            </p>
            <button onClick={triggerEmergencyGateFullOpen}
              className="w-full py-2.5 bg-red-500 text-white rounded font-mono font-bold text-xs uppercase tracking-widest shadow-lg hover:bg-red-600 transition cursor-pointer flex items-center justify-center gap-1.5">
              <Activity className="w-4 h-4 text-white animate-spin [animation-duration:3s]" />
              FORCE OPEN ALL GATES 100%
            </button>
          </div>
        </section>

        {/* Water Basin */}
        <section className="lg:col-span-4 h-full">
          <WaterBasin
            currentLevel={sensors.find(s => s.id === 'sen-wl-01')?.value || 8.42}
            maxCapacity={10}
            warningThreshold={thresholds.waterLevelWarning}
            criticalThreshold={thresholds.waterLevelCritical}
            spillwayGateOpen={spillwayGateOpen}
            setSpillwayGateOpen={setSpillwayGateOpen}
            dischargeRate={dischargeRate}
          />
        </section>

        {/* Map + Video */}
        <section className="lg:col-span-4 flex flex-col gap-4">
          <div className="h-[210px]">
            <HydroMap sensors={sensors} selectedSensorId={selectedSensorId} onSelectSensor={setSelectedSensorId} />
          </div>
          <div className="flex-1 min-h-[300px]">
            <VideoFeed />
          </div>
        </section>
      </main>

      {/* Bottom: Injection + Logs */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-5 mt-5">
        <div className="lg:col-span-4 bg-[#131b2e]/90 rounded-lg p-5 border border-white/10">
          <span className="text-[10px] text-gray-400 font-mono tracking-widest uppercase">Simulation Lab</span>
          <h3 className="font-semibold text-gray-200 text-sm uppercase tracking-wide mb-3">Stress Injections & Safety Thresholds</h3>
          <form onSubmit={handleInjectValue} className="space-y-3.5 pb-4 border-b border-white/15">
            <span className="text-[11px] text-blue-300 font-mono block">Force Override [{selectedSensor.name}]</span>
            <div className="flex gap-2">
              <input type="number" step="0.01" value={editSensorValue} onChange={e => setEditSensorValue(e.target.value)}
                className="bg-[#0b1326] border border-white/10 rounded px-3 py-2 text-xs font-mono font-bold text-white flex-1 focus:outline-none focus:border-blue-500" />
              <button type="submit" className="bg-blue-600 hover:bg-blue-500 font-semibold text-white px-3 py-2 text-xs rounded transition cursor-pointer">Inject Value</button>
            </div>
            <p className="text-[10px] text-gray-500 leading-relaxed">Override sensor values to test evacuation trigger mechanisms.</p>
          </form>
          <div className="mt-4 space-y-3">
            <span className="text-[10px] text-gray-400 font-mono tracking-widest uppercase block">Active Threshold Safety Specs</span>
            <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
              <div className="bg-[#0b1326]/50 p-2 border border-white/5 rounded"><p className="text-gray-500">Reservoir Caution</p><p className="font-bold text-amber-500">&gt;= {thresholds.waterLevelWarning}m</p></div>
              <div className="bg-[#0b1326]/50 p-2 border border-white/5 rounded"><p className="text-gray-500">Reservoir Hazard</p><p className="font-bold text-red-500">&gt;= {thresholds.waterLevelCritical}m</p></div>
              <div className="bg-[#0b1326]/50 p-2 border border-white/5 rounded"><p className="text-gray-500">Outflow Caution</p><p className="font-bold text-amber-500">&gt;= {thresholds.flowRateWarning}m³/s</p></div>
              <div className="bg-[#0b1326]/50 p-2 border border-white/5 rounded"><p className="text-gray-500">Outflow Hazard</p><p className="font-bold text-red-500">&gt;= {thresholds.flowRateCritical}m³/s</p></div>
            </div>
          </div>
        </div>

        {/* Logs + Specs */}
        <div className="lg:col-span-8 bg-[#131b2e]/90 rounded-lg p-5 border border-blue-500/30 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400 animate-spin [animation-duration:10s]" />
                <span className="text-[10px] text-gray-300 font-mono tracking-widest uppercase">Hydro-Sentinel Spillway Command Analyst</span>
              </div>
              <button onClick={() => alert('AI dispatch: All sensor arrays nominal. Spillway gates at safe margins.')}
                className="px-3 py-1 bg-blue-500/20 border border-blue-500 hover:bg-blue-500/35 text-blue-200 rounded font-mono text-[10px] uppercase font-bold tracking-wider transition-all cursor-pointer">
                Request Hydrology Dispatch
              </button>
            </div>
            <div className="bg-[#060e20] border border-white/5 rounded-lg p-4 font-mono text-[11px] text-gray-300 max-h-[100px] overflow-y-auto">
              <p className="text-[10px] text-gray-400 uppercase tracking-widest">Telemetry Analysis Awaiting Command</p>
              <p className="text-[10px] text-gray-500 mt-1">Submit a hydrology dispatch request or inject sensor values to analyze dam spillway layout and watershed levels.</p>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between gap-3 text-xs font-mono bg-white/5 p-3 rounded border border-white/5">
            <span className="text-gray-400">Outflow: <span className="font-bold text-white">{dischargeRate.toFixed(1)} m³/s</span> | Depth: <span className="font-bold text-white">{sensors[0].value}m</span></span>
            <button onClick={() => { addSystemLog('MUNICIPAL DISPATCH: Civil warning sirens armed.', 'dispatch', 'SUCCESS'); alert('CIVIL ALERT FORWARDED TO MUNICIPAL RADIO REPEATERS'); }}
              className="px-3 py-1.5 bg-red-500/20 border border-red-500/40 hover:bg-red-500/30 text-red-200 rounded font-semibold transition cursor-pointer flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-red-400 animate-pulse" /> Broadcast Civil Warning
            </button>
          </div>
        </div>
      </section>

      {/* Operator Log */}
      <footer className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5 pb-8">
        <div className="bg-[#131b2e]/90 rounded-lg p-5 border border-white/10">
          <span className="text-[10px] text-gray-400 font-mono tracking-widest uppercase">Operator Logs</span>
          <h3 className="font-semibold text-gray-200 text-sm uppercase tracking-wide mb-3">Operator Digital Journal</h3>
          <form onSubmit={handleManualLogSubmit} className="flex gap-2 mb-4">
            <input type="text" value={newLogText} onChange={e => setNewLogText(e.target.value)}
              placeholder="Insert engineering log entry..."
              className="bg-[#0b1326] border border-white/10 rounded px-3 py-2 text-xs font-mono text-white flex-1 focus:outline-none focus:border-blue-500" />
            <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 text-xs rounded transition font-medium cursor-pointer">Log Entry</button>
          </form>
          <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
            {logs.map(log => (
              <div key={log.id} className="p-2.5 rounded bg-[#0b1326]/50 border border-white/5 font-mono text-[10px] hover:bg-[#0b1326] transition">
                <div className="flex items-center justify-between text-[9px] text-gray-500 mb-1">
                  <span>{log.timestamp} // {log.operator}</span>
                  <span className={`px-1 rounded text-[8px] font-bold ${log.status === 'SUCCESS' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>{log.status}</span>
                </div>
                <p className="text-gray-300 leading-relaxed">{log.action}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-[#131b2e]/90 rounded-lg p-5 border border-white/10 text-xs space-y-4">
          <span className="text-[10px] text-gray-400 font-mono tracking-widest uppercase block">Shift Specifications</span>
          <h3 className="font-semibold text-gray-200 text-sm uppercase tracking-wide">Hydro-Sentinel Command Specs</h3>
          <div className="grid grid-cols-2 gap-4 text-[11px] font-mono leading-relaxed text-gray-400">
            <div className="space-y-1"><span className="text-[8px] text-gray-500 block">WATERSHED AREA</span><span className="text-gray-200 font-medium">Athabasca Catchment Sec F</span></div>
            <div className="space-y-1"><span className="text-[8px] text-gray-500 block">RESERVOIR CREST MAX</span><span className="text-gray-200 font-medium">10.00 Meters Above Bed</span></div>
            <div className="space-y-1"><span className="text-[8px] text-gray-500 block">SPILLWAY CHANNELS</span><span className="text-gray-200 font-medium">4 High-velocity radial gates</span></div>
            <div className="space-y-1"><span className="text-[8px] text-gray-500 block">CIVIL PROTECTION ZONE</span><span className="text-blue-200 font-medium font-semibold">Low-lying Flood Basin 3B</span></div>
          </div>
          <div className="p-3 bg-blue-950/20 border border-blue-500/20 rounded-lg flex items-start gap-2.5">
            <Radio className="w-4 h-4 text-blue-500 shrink-0 mt-0.5 animate-pulse" />
            <p className="text-[11px] text-gray-300 leading-relaxed"><strong>Manual Gate Override is actively monitored.</strong> Spillway gate adjustments trigger fluid-mechanics formulas recalculating discharge outflow and reservoir depth.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
