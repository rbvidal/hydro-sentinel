/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, useMemo, FormEvent } from "react";
import {
  ShieldAlert,
  Volume2,
  VolumeX,
  Radio,
  Sparkles,
  Clock,
  Settings,
  AlertCircle,
  CheckCircle2,
  Send,
  Activity,
  Plus,
  RotateCcw,
  Sliders,
  Maximize2,
  X,
  Droplet,
  Flame,
  CloudRain,
  Compass,
  AlertTriangle,
  Play
} from "lucide-react";
import { Sensor, Alert, ThresholdConfig, OperatorAction, SensorStatus } from "./types";
import Sparkline from "./components/Sparkline";
import WaterBasin from "./components/WaterBasin";
import VideoFeed from "./components/VideoFeed";
import HydroMap from "./components/HydroMap";

// Initial standard configurations
const DEFAULT_THRESHOLDS: ThresholdConfig = {
  waterLevelWarning: 8.0,
  waterLevelCritical: 9.3,
  flowRateWarning: 500,
  flowRateCritical: 850,
  precipitationWarning: 30.0,
  precipitationCritical: 55.0,
};

const INITIAL_SENSORS: Sensor[] = [
  {
    id: "sen-wl-01",
    name: "Reservoir Core level Gauge",
    value: 8.42,
    unit: "m",
    icon: "waves",
    status: "Warning",
    history: [7.2, 7.35, 7.5, 7.8, 8.0, 8.12, 8.25, 8.32, 8.38, 8.41, 8.42, 8.42],
    latitude: 54.128,
    longitude: -114.502,
    locationName: "Reservoir Block A Sector 1",
    category: "level",
  },
  {
    id: "sen-wl-02",
    name: "Auxiliary Spillway Overflow Gauge",
    value: 3.12,
    unit: "m",
    icon: "trending-up",
    status: "Normal",
    history: [1.1, 1.2, 1.4, 1.8, 2.1, 2.4, 2.7, 2.9, 3.0, 3.1, 3.12, 3.12],
    latitude: 54.190,
    longitude: -114.615,
    locationName: "Aux Dam Retention Spillway",
    category: "level",
  },
  {
    id: "sen-fr-01",
    name: "Main Outlet Dam Hydro-Gage",
    value: 412,
    unit: "m³/s",
    icon: "activity",
    status: "Normal",
    history: [250, 270, 290, 320, 350, 380, 400, 410, 412, 412, 412, 412],
    latitude: 54.135,
    longitude: -114.498,
    locationName: "Downstream Spillway Throat Gate-01",
    category: "flow",
  },
  {
    id: "sen-wq-01",
    name: "Downstream Basin Water Quality Monitor",
    value: 12.8,
    unit: "NTU",
    icon: "droplet",
    status: "Normal",
    history: [8.5, 9.0, 9.5, 10.2, 11.0, 11.5, 12.0, 12.4, 12.6, 12.8, 12.8, 12.8],
    latitude: 54.180,
    longitude: -114.650,
    locationName: "Cofferdam Discharge Base",
    category: "quality",
  },
  {
    id: "sen-pr-01",
    name: "Catchment Zone Precip-Sensor",
    value: 42.5,
    unit: "mm/h",
    icon: "cloud-rain",
    status: "Warning",
    history: [10.0, 15.0, 20.0, 28.0, 35.0, 40.0, 42.5, 42.5, 42.5, 42.5, 42.5, 42.5],
    latitude: 54.210,
    longitude: -114.422,
    locationName: "North-West Watershed Peak",
    category: "precipitation",
  },
];

const INITIAL_ALERTS: Alert[] = [
  {
    id: "al-101",
    timestamp: "14:21:05",
    sensorId: "sen-wl-01",
    type: "Warning",
    message: "Reservoir Core level exceeded safety warning threshold [8.0m].",
    acknowledged: false,
  },
  {
    id: "al-102",
    timestamp: "14:15:30",
    sensorId: "sen-pr-01",
    type: "Warning",
    message: "Heavy upstream precipitation [42.5mm/h] detected at watershed peak.",
    acknowledged: false,
  },
];

const INITIAL_LOGS: OperatorAction[] = [
  {
    id: "log-1",
    timestamp: "14:10:00",
    operator: "Civil Eng. Vidal",
    action: "Secured lock seals on downstream flow sensors.",
    status: "SUCCESS",
    category: "system",
  },
  {
    id: "log-2",
    timestamp: "14:05:12",
    operator: "Automatic System",
    action: "Spillway gate adjustment scheduled based on catchment precip.",
    status: "SUCCESS",
    category: "spillway",
  },
];

export default function App() {
  const [sensors, setSensors] = useState<Sensor[]>(INITIAL_SENSORS);
  const [thresholds, setThresholds] = useState<ThresholdConfig>(DEFAULT_THRESHOLDS);
  const [alerts, setAlerts] = useState<Alert[]>(INITIAL_ALERTS);
  const [logs, setLogs] = useState<OperatorAction[]>(INITIAL_LOGS);
  
  // Interactive Simulator parameters
  const [spillwayGateOpen, setSpillwayGateOpen] = useState<number>(30); // 0-100%
  const [isSirenActive, setIsSirenActive] = useState<boolean>(false);
  const [selectedSensorId, setSelectedSensorId] = useState<string>("sen-wl-01");
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(true);
  
  // Operator Input Controls
  const [newLogText, setNewLogText] = useState<string>("");
  const [editSensorValue, setEditSensorValue] = useState<string>("");
  
  // Gemini AI Analysis block
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [aiReport, setAiReport] = useState<string | null>(null);

  // Computed Values
  const selectedSensor = useMemo(() => {
    return sensors.find((s) => s.id === selectedSensorId) || sensors[0];
  }, [sensors, selectedSensorId]);

  // Audio Context for alarm system
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);

  // Initialize selected sensor edit value
  useEffect(() => {
    if (selectedSensor) {
      setEditSensorValue(selectedSensor.value.toString());
    }
  }, [selectedSensorId]);

  // Handle continuous real-time water physical fluid simulation loop
  useEffect(() => {
    const interval = setInterval(() => {
      setSensors((prevSensors) => {
        return prevSensors.map((sensor) => {
          let newValue = sensor.value;
          
          if (sensor.category === "level" && sensor.id === "sen-wl-01") {
            // Level dynamics: Inflow from precipitation minus Outflow from gate setting
            const precipSensor = prevSensors.find((s) => s.id === "sen-pr-01");
            const rainInflow = (precipSensor?.value || 0) * 0.0025;
            const gateOutflow = (spillwayGateOpen / 100) * 0.12;
            
            // Increment water level slightly inside natural bounds
            newValue = Math.max(0.1, Math.min(10.0, sensor.value + rainInflow - gateOutflow + (Math.random() - 0.5) * 0.01));
          } else if (sensor.category === "flow" && sensor.id === "sen-fr-01") {
            // Outflow volume math
            const coreLevel = prevSensors.find((s) => s.id === "sen-wl-01")?.value || 5.0;
            const theoreticalDischarge = (spillwayGateOpen / 100) * 1150 * (coreLevel / 10);
            newValue = Math.max(10, Math.round(theoreticalDischarge + (Math.random() - 0.5) * 8));
          } else if (sensor.category === "quality" || sensor.category === "level" || sensor.category === "precipitation") {
            // Subtle standard simulation fluctuations
            const variance = sensor.category === "precipitation" ? 0.4 : 0.02;
            newValue = Math.max(0, sensor.value + (Math.random() - 0.5) * variance);
          }

          // Evaluate status strictly against updated thresholds
          let status: SensorStatus = "Normal";
          if (sensor.category === "level" && sensor.id === "sen-wl-01") {
            if (newValue >= thresholds.waterLevelCritical) status = "Critical";
            else if (newValue >= thresholds.waterLevelWarning) status = "Warning";
          } else if (sensor.category === "flow" && sensor.id === "sen-fr-01") {
            if (newValue >= thresholds.flowRateCritical) status = "Critical";
            else if (newValue >= thresholds.flowRateWarning) status = "Warning";
          } else if (sensor.category === "precipitation" && sensor.id === "sen-pr-01") {
            if (newValue >= thresholds.precipitationCritical) status = "Critical";
            else if (newValue >= thresholds.precipitationWarning) status = "Warning";
          }

          const newHistory = [...sensor.history.slice(1), parseFloat(newValue.toFixed(2))];

          return {
            ...sensor,
            value: parseFloat(newValue.toFixed(2)),
            status,
            history: newHistory,
          };
        });
      });
    }, 2800);

    return () => clearInterval(interval);
  }, [spillwayGateOpen, thresholds]);

  // Monitor sensor status transitions to generate notifications & alarms in local memory
  useEffect(() => {
    sensors.forEach((sensor) => {
      if (sensor.status === "Critical") {
        const alreadyExists = alerts.some((a) => a.sensorId === sensor.id && a.type === "Critical" && !a.acknowledged);
        if (!alreadyExists) {
          const newAlert: Alert = {
            id: `al-${Date.now()}`,
            timestamp: new Date().toLocaleTimeString(),
            sensorId: sensor.id,
            type: "Critical",
            message: `CRITICAL ALERT: Physical sensor [${sensor.name}] has breached dangerous levels: ${sensor.value}${sensor.unit}!`,
            acknowledged: false,
          };
          setAlerts((prev) => [newAlert, ...prev]);
          
          // Log automated incident
          addSystemLog(`AUTOMATED PILOT: Sentinel logged hazardous condition on ${sensor.name}`, "siren", "FAILED");
          
          // Activate Sirens automatically if water depth is dangerous
          if (sensor.id === "sen-wl-01") {
            setIsSirenActive(true);
          }
        }
      } else if (sensor.status === "Warning") {
        const alreadyExists = alerts.some((a) => a.sensorId === sensor.id && a.type === "Warning" && !a.acknowledged);
        if (!alreadyExists) {
          const newAlert: Alert = {
            id: `al-${Date.now()}`,
            timestamp: new Date().toLocaleTimeString(),
            sensorId: sensor.id,
            type: "Warning",
            message: `Warning state detected on sensor [${sensor.name}]: reached ${sensor.value}${sensor.unit}.`,
            acknowledged: false,
          };
          setAlerts((prev) => [newAlert, ...prev]);
        }
      }
    });
  }, [sensors]);

  // Handle synthesize operator warning sirens using browser Web Audio API
  useEffect(() => {
    if (isSirenActive && !isAudioMuted) {
      try {
        if (!audioCtxRef.current) {
          audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        
        if (!oscillatorRef.current && audioCtxRef.current) {
          const osc = audioCtxRef.current.createOscillator();
          const gainNode = audioCtxRef.current.createGain();
          
          osc.type = "sawtooth";
          osc.frequency.setValueAtTime(320, audioCtxRef.current.currentTime);
          
          // Modulate frequency to create professional civil defense alarm tone
          osc.frequency.linearRampToValueAtTime(650, audioCtxRef.current.currentTime + 1);
          osc.frequency.linearRampToValueAtTime(320, audioCtxRef.current.currentTime + 2);
          
          // Loop modulation
          intervalModulate(osc, audioCtxRef.current);
          
          gainNode.gain.setValueAtTime(0.08, audioCtxRef.current.currentTime);
          osc.connect(gainNode);
          gainNode.connect(audioCtxRef.current.destination);
          osc.start();
          oscillatorRef.current = osc;
        }
      } catch (err) {
        console.warn("Siren synth was prevented by browser security context policies:", err);
      }
    } else {
      if (oscillatorRef.current) {
        try {
          oscillatorRef.current.stop();
        } catch(e){}
        oscillatorRef.current = null;
      }
    }

    return () => {
      if (oscillatorRef.current) {
        try {
          oscillatorRef.current.stop();
        } catch(e){}
        oscillatorRef.current = null;
      }
    };
  }, [isSirenActive, isAudioMuted]);

  const intervalModulate = (osc: OscillatorNode, ctx: AudioContext) => {
    let state = true;
    const interval = setInterval(() => {
      if (!oscillatorRef.current) {
        clearInterval(interval);
        return;
      }
      try {
        const targetFreq = state ? 680 : 310;
        osc.frequency.setValueAtTime(osc.frequency.value, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(targetFreq, ctx.currentTime + 1);
        state = !state;
      } catch (e) {
        clearInterval(interval);
      }
    }, 1200);
  };

  // Helper additions for custom logs
  const addSystemLog = (action: string, category: "spillway" | "system" | "siren" | "dispatch" = "system", status: "SUCCESS" | "FAILED" | "PENDING" = "SUCCESS") => {
    const newAction: OperatorAction = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      operator: "Civil Eng. Vidal",
      action,
      status,
      category,
    };
    setLogs((prev) => [newAction, ...prev]);
  };

  // Interactive functions
  const handleAcknowledgeAlert = (id: string) => {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, acknowledged: true } : a)));
    addSystemLog(`Acknowledged critical warning #${id}`, "system", "SUCCESS");
  };

  const handleClearAcknowledgeAll = () => {
    setAlerts((prev) => prev.map((a) => ({ ...a, acknowledged: true })));
    addSystemLog(`Cleared and marked all system warning notifications to logged files`, "system", "SUCCESS");
  };

  const triggerSirenTest = () => {
    setIsSirenActive((prev) => !prev);
    addSystemLog(`${isSirenActive ? "Deactivated" : "Activated"} emergency alarm audio horn testing.`, "siren", "SUCCESS");
  };

  const triggerEmergencyGateFullOpen = () => {
    setSpillwayGateOpen(100);
    // Add warning
    const newAlert: Alert = {
      id: `al-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      type: "Critical",
      message: "EMERGENCY OVERRIDE ENFORCED: Spillway Gate G1-G4 open at maximum volume limit (100%)",
      acknowledged: false,
    };
    setAlerts((prev) => [newAlert, ...prev]);
    addSystemLog("FORCED OVERRIDE: Deployed emergency bypass level adjustment.", "spillway", "SUCCESS");
  };

  const handleManualSensorInjectSubmit = (e: FormEvent) => {
    e.preventDefault();
    const val = parseFloat(editSensorValue);
    if (!isNaN(val)) {
      setSensors((prev) =>
        prev.map((s) => {
          if (s.id === selectedSensorId) {
            // determine status after injection
            let status: SensorStatus = "Normal";
            if (s.category === "level") {
              if (val >= thresholds.waterLevelCritical) status = "Critical";
              else if (val >= thresholds.waterLevelWarning) status = "Warning";
            } else if (s.category === "flow") {
              if (val >= thresholds.flowRateCritical) status = "Critical";
              else if (val >= thresholds.flowRateWarning) status = "Warning";
            } else if (s.category === "precipitation") {
              if (val >= thresholds.precipitationCritical) status = "Critical";
              else if (val >= thresholds.precipitationWarning) status = "Warning";
            }

            return {
              ...s,
              value: val,
              status,
              history: [...s.history.slice(1), val],
            };
          }
          return s;
        })
      );
      addSystemLog(`Injected manual simulation index override for ${selectedSensor.name}: ${val} ${selectedSensor.unit}`, "system", "SUCCESS");
    }
  };

  const handleManualLogSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (newLogText.trim()) {
      addSystemLog(newLogText, "system", "SUCCESS");
      setNewLogText("");
    }
  };

  // Call the server Gemini API endpoint to retrieve full structural log and forecast analytics
  const fetchGeminiReport = async () => {
    setIsAiLoading(true);
    setAiReport(null);
    try {
      const response = await fetch("/api/analyze-telemetry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sensors,
          currentAlerts: alerts.filter((a) => !a.acknowledged),
          thresholdConfig: thresholds,
          systemStatus: alerts.some((a) => a.type === "Critical" && !a.acknowledged) ? "CRITICAL RISK STATE" : "STANDARD OPERATION NOMINAL",
          actionLogs: logs.slice(0, 5),
        }),
      });

      const data = await response.json();
      if (data.analysis) {
        setAiReport(data.analysis);
        addSystemLog("Generated hydraulic status advisory report.", "dispatch", "SUCCESS");
      } else {
        setAiReport("Error: AI payload format missing analyst report content.");
      }
    } catch (err: any) {
      console.error(err);
      setAiReport("Error: Unable to connect to the Gemini hydrological advisory server-agent.");
      addSystemLog("Failed to generate AI hydraulic report.", "dispatch", "FAILED");
    } finally {
      setIsAiLoading(false);
    }
  };

  // Calculate simulated discharge rate for WaterBasin component
  const calculatedDischargeRate = useMemo(() => {
    const coreLevel = sensors.find((s) => s.id === "sen-wl-01")?.value || 8.42;
    return (spillwayGateOpen / 100) * 1150 * (coreLevel / 10);
  }, [sensors, spillwayGateOpen]);

  return (
    <div className="min-h-screen bg-[#0b1326] text-[#dae2fd] p-4 md:p-6 font-sans selection:bg-[#3B82F6] selection:text-white">
      {/* Background ambient HUD decoration */}
      <div className="fixed inset-0 pointer-events-none opacity-40 mix-blend-screen overflow-hidden z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-blue-900/10 blur-[100px]" />
        <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] rounded-full bg-red-950/5 blur-[120px]" />
      </div>

      <div className="max-w-[1600px] mx-auto relative z-10 flex flex-col gap-6">
        
        {/* TOP STATUS HEADER WITH COMMAND BUTTONS */}
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-white/10 pb-5 gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-[#131b2e] border border-blue-500/20 p-3 rounded-lg flex items-center justify-center shadow-xl">
              <ShieldAlert className="w-8 h-8 text-[#3B82F6] animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono tracking-widest text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  SYSTEM RESPONSIVE
                </span>
                <span className="text-[10px] font-mono text-gray-400">SESSION: ENG-VIDAL</span>
              </div>
              <h1 className="text-2xl font-bold font-sans tracking-tight text-white mt-1">
                HYDRO-SENTINEL telemetry
              </h1>
              <p className="text-xs text-gray-400 font-sans mt-0.5">
                Primary Civil Protection hydraulic Spillways & Catchment Waterway command center
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Audio Toggle */}
            <button
              id="btn-toggle-mute"
              onClick={() => setIsAudioMuted(!isAudioMuted)}
              className={`p-2.5 rounded border transition-all cursor-pointer flex items-center gap-1.5 font-mono text-xs ${
                isAudioMuted
                  ? "bg-white/5 border-white/10 text-gray-400 hover:text-white"
                  : "bg-amber-500/10 border-amber-500/30 text-amber-400 font-bold"
              }`}
              title={isAudioMuted ? "Unmute system alarms" : "Mute system alarms"}
            >
              {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              <span>{isAudioMuted ? "ALARM AUDIO OFF" : "ALARM AUDIO LIVE"}</span>
            </button>

            {/* Simulated Alarm Testing Trigger */}
            <button
              id="btn-siren-test"
              onClick={triggerSirenTest}
              className={`px-3 py-2.5 rounded border font-mono text-xs font-semibold tracking-wider transition-all cursor-pointer ${
                isSirenActive
                  ? "bg-red-500 text-white border-red-600 animate-pulse"
                  : "bg-[#131b2e] border-white/10 text-[#dae2fd] hover:bg-[#222a3d]"
              }`}
            >
              {isSirenActive ? "HALT WARNING TEST" : "TEST WARNING SIRENS"}
            </button>

            {/* Live system clock UTC-7 */}
            <div className="bg-[#131b2e] border border-white/5 rounded-lg px-4 py-2 flex items-center gap-2.5 font-mono text-xs select-none">
              <Clock className="w-4 h-4 text-[#3B82F6]" />
              <div>
                <span className="text-gray-500 block text-[9px] uppercase tracking-widest font-bold">CONTROL LOCAL</span>
                <span className="text-gray-300 font-semibold tracking-wider">
                  {new Date().toLocaleTimeString()}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* INCIDENT ALERTS BANNER CONSOLE */}
        <section id="system-alerts-banner" className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-2.5 h-2.5 rounded-full ${
                alerts.some((a) => a.type === "Critical" && !a.acknowledged)
                  ? "bg-red-500 animate-ping"
                  : alerts.some((a) => a.type === "Warning" && !a.acknowledged)
                    ? "bg-amber-500 animate-pulse"
                    : "bg-emerald-500"
              }`} />
              <h2 className="text-xs font-bold text-gray-300 uppercase tracking-widest font-sans">
                Active telemetry incident roster ({alerts.filter((a) => !a.acknowledged).length})
              </h2>
            </div>
            {alerts.some((a) => !a.acknowledged) && (
              <button
                id="btn-ack-all"
                onClick={handleClearAcknowledgeAll}
                className="text-[10px] font-mono text-[#3B82F6] hover:text-[#adc6ff] transition cursor-pointer underline underline-offset-4"
              >
                Clear/Mark all processed
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[140px] overflow-y-auto pr-1">
            {alerts.filter((a) => !a.acknowledged).length === 0 ? (
              <div className="col-span-2 bg-[#131b2e]/40 border border-[#10B981]/20 rounded-lg p-3 text-center text-xs text-emerald-400 font-mono flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                <span>ALL SENSOR TELEMETRYS CURRENTLY RECORDING INSIDE SAFE BOUNDARIES</span>
              </div>
            ) : (
              alerts
                .filter((a) => !a.acknowledged)
                .map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-3 rounded-lg border backdrop-blur-md flex items-start justify-between gap-3 text-xs ${
                      alert.type === "Critical"
                        ? "bg-red-950/20 border-red-500/30 text-red-200"
                        : "bg-amber-950/20 border-amber-500/30 text-amber-200"
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <div className="mt-0.5">
                        <AlertCircle className={`w-4 h-4 ${alert.type === "Critical" ? "text-red-400" : "text-amber-400"}`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] text-gray-400">[{alert.timestamp}]</span>
                          <span className={`font-mono text-[9px] font-bold uppercase px-1.5 py-0.2 rounded ${
                            alert.type === "Critical" ? "bg-red-500/20 text-red-400" : "bg-amber-500/20 text-amber-400"
                          }`}>
                            {alert.type}
                          </span>
                        </div>
                        <p className="mt-1 font-sans text-gray-200 font-medium leading-relaxed">
                          {alert.message}
                        </p>
                      </div>
                    </div>
                    <button
                      id={`btn-ack-${alert.id}`}
                      onClick={() => handleAcknowledgeAlert(alert.id)}
                      className="px-2 py-1 rounded bg-white/5 border border-white/10 hover:bg-white/10 hover:text-white text-[10px] font-mono cursor-pointer transition shrink-0"
                    >
                      Acknowledge
                    </button>
                  </div>
                ))
            )}
          </div>
        </section>

        {/* PRIMARY 12-COLUMN DASHBOARD LAYOUT GRID */}
        <main className="grid grid-cols-1 lg:grid-cols-12 gap-5 mt-2">
          
          {/* SECTION 1: SENSORS STATUS LISTING (4 COLUMNS) */}
          <section className="lg:col-span-4 flex flex-col gap-4">
            <div className="bg-[#131b2e]/90 rounded-lg p-5 border border-white/10 backdrop-blur-md flex flex-col justify-between">
              <div>
                <span className="text-[10px] text-gray-400 font-mono tracking-widest uppercase">Telemetry Array</span>
                <h3 className="font-semibold text-gray-200 text-sm uppercase tracking-wide mb-4">
                  Active Hydraulic Sensors ({sensors.length})
                </h3>
              </div>

              {/* Sensor list selector */}
              <div className="space-y-2.5">
                {sensors.map((sensor) => {
                  const isSelected = selectedSensorId === sensor.id;
                  return (
                    <div
                      key={sensor.id}
                      id={`sensor-card-${sensor.id}`}
                      onClick={() => setSelectedSensorId(sensor.id)}
                      className={`p-3 rounded-lg border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        isSelected
                          ? "bg-[#3B82F6]/10 border-[#3B82F6] shadow-[0_0_12px_rgba(59,130,246,0.15)]"
                          : "bg-[#0b1326]/60 border-white/5 hover:border-white/15"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Interactive condition indicator orb */}
                        <div className={`w-2 h-2 rounded-full shrink-0 ${
                          sensor.status === "Critical"
                            ? "bg-red-500 animate-pulse"
                            : sensor.status === "Warning"
                              ? "bg-amber-500 animate-pulse"
                              : "bg-emerald-500"
                        }`} />
                        
                        <div className="min-w-0">
                          <p className="font-semibold text-xs text-gray-200 truncate font-sans">
                            {sensor.name}
                          </p>
                          <p className="text-[9px] text-gray-500 font-mono truncate">
                            {sensor.locationName}
                          </p>
                        </div>
                      </div>

                      {/* Sparkline & Current Value */}
                      <div className="flex items-center gap-4 shrink-0 text-right">
                        <div className="hidden sm:block">
                          <Sparkline data={sensor.history} status={sensor.status} width={80} height={24} />
                        </div>
                        <div>
                          <p className="font-mono font-bold text-xs text-white">
                            {sensor.value} <span className="text-[10px] font-medium text-gray-400">{sensor.unit}</span>
                          </p>
                          <span className={`text-[8px] font-mono font-bold uppercase rounded px-1 ${
                            sensor.status === "Critical"
                              ? "bg-red-500/20 text-red-400"
                              : sensor.status === "Warning"
                                ? "bg-amber-500/20 text-amber-400"
                                : "bg-emerald-500/20 text-emerald-400"
                          }`}>
                            {sensor.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* CRITICAL SAFETY OVERRIDE CONTROL BOX */}
            <div className="bg-[#131b2e]/90 rounded-lg p-5 border border-red-500/20 backdrop-blur-md shadow-lg">
              <span className="text-[9px] text-red-400 font-mono tracking-widest uppercase block mb-1">Civil Defense Contingency</span>
              <h4 className="text-xs font-bold text-gray-200 uppercase tracking-wider flex items-center gap-1.5 mb-3">
                <AlertCircle className="w-4 h-4 text-red-500" /> DAM EMERGENCY ACTUATIONS
              </h4>
              <p className="text-[11px] text-gray-400 mb-4 leading-relaxed font-sans">
                In the event of critical flood level violations, bypass general automated logic constraints and force open safety outlets directly.
              </p>
              <button
                id="btn-emergency-full-open"
                onClick={triggerEmergencyGateFullOpen}
                className="w-full py-2.5 bg-[#EF4444] text-white rounded font-mono font-bold text-xs uppercase tracking-widest shadow-lg hover:bg-red-600 transition tracking-wide cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Activity className="w-4 h-4 text-white animate-spin [animation-duration:3s]" />
                FORCE OPEN ALL GATES 100%
              </button>
            </div>
          </section>

          {/* SECTION 2: INTERACTIVE RESERVOIR CROSS-SECTION AND PHYSICAL DAM (4 COLUMNS) */}
          <section className="lg:col-span-4 h-full">
            <WaterBasin
              currentLevel={sensors.find((s) => s.id === "sen-wl-01")?.value || 8.42}
              maxCapacity={10.0}
              warningThreshold={thresholds.waterLevelWarning}
              criticalThreshold={thresholds.waterLevelCritical}
              spillwayGateOpen={spillwayGateOpen}
              setSpillwayGateOpen={setSpillwayGateOpen}
              dischargeRate={calculatedDischargeRate}
            />
          </section>

          {/* SECTION 3: TOPOGRAPHIC GRID SCHEMA & HD LIVE CAMERA FEEDS (4 COLUMNS) */}
          <section className="lg:col-span-4 flex flex-col gap-4">
            <div className="h-[210px]">
              <HydroMap
                sensors={sensors}
                selectedSensorId={selectedSensorId}
                onSelectSensor={(sensorId) => setSelectedSensorId(sensorId)}
              />
            </div>
            <div className="flex-1 min-h-[300px]">
              <VideoFeed />
            </div>
          </section>

        </main>

        {/* BOTTOM METRICS INJECTOR AND INTEL ANALYSIS DISPATCH CO-CO-PILOT */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-5 mt-2">
          
          {/* SENSOR VALUE INJECT PATTERN FOR SIMULATIONS TESTING */}
          <div className="lg:col-span-4 bg-[#131b2e]/90 rounded-lg p-5 border border-white/10 backdrop-blur-md">
            <span className="text-[10px] text-gray-400 font-mono tracking-widest uppercase">Simulation Lab</span>
            <h3 className="font-semibold text-gray-200 text-sm uppercase tracking-wide mb-3">
              Stress Injections & Safety Thresholds
            </h3>
            
            {/* Value Manipulation injection form */}
            <form onSubmit={handleManualSensorInjectSubmit} className="space-y-3.5 pb-4 border-b border-white/15">
              <span className="text-[11px] text-[#adc6ff] font-mono block">
                Force Override [ {selectedSensor.name} ]
              </span>
              <div className="flex gap-2">
                <input
                  id="input-inject-value"
                  type="number"
                  step="0.01"
                  value={editSensorValue}
                  onChange={(e) => setEditSensorValue(e.target.value)}
                  placeholder={`Value in ${selectedSensor.unit}`}
                  className="bg-[#0b1326] border border-white/10 rounded px-3 py-2 text-xs font-mono font-bold text-white flex-1 focus:outline-none focus:border-[#3B82F6]"
                />
                <button
                  type="submit"
                  id="btn-trigger-inject"
                  className="bg-[#3B82F6] hover:bg-[#3273db] font-semibold text-white px-3 py-2 text-xs font-sans rounded transition cursor-pointer"
                >
                  Inject Value
                </button>
              </div>
              <p className="text-[10px] text-gray-500 font-sans leading-relaxed">
                Use the slider or inject abnormal value thresholds to test the live evacuation trigger mechanisms.
              </p>
            </form>

            {/* General Threshold config monitor overview */}
            <div className="mt-4 space-y-3">
              <span className="text-[10px] text-gray-400 font-mono tracking-widest uppercase block">
                Active Threshold Safety Specs
              </span>
              <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                <div className="bg-[#0b1326]/50 p-2 border border-white/5 rounded">
                  <p className="text-gray-500">Reservoir Caution</p>
                  <p className="font-bold text-amber-500">&gt;= {thresholds.waterLevelWarning}m</p>
                </div>
                <div className="bg-[#0b1326]/50 p-2 border border-white/5 rounded">
                  <p className="text-gray-500">Reservoir Hazard</p>
                  <p className="font-bold text-red-500">&gt;= {thresholds.waterLevelCritical}m</p>
                </div>
                <div className="bg-[#0b1326]/50 p-2 border border-white/5 rounded">
                  <p className="text-gray-500">Outflow Caution</p>
                  <p className="font-bold text-amber-500">&gt;= {thresholds.flowRateWarning}m³/s</p>
                </div>
                <div className="bg-[#0b1326]/50 p-2 border border-white/5 rounded">
                  <p className="text-gray-500">Outflow Hazard</p>
                  <p className="font-bold text-red-500">&gt;= {thresholds.flowRateCritical}m³/s</p>
                </div>
              </div>
            </div>
          </div>

          {/* AI ANALYST & SHIFT LOG DISPATCH WRITER */}
          <div className="lg:col-span-8 bg-[#131b2e]/90 rounded-lg p-5 border border-[#3B82F6]/30 backdrop-blur-md flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-400 animate-spin [animation-duration:10s]" />
                  <span className="text-[10px] text-gray-300 font-mono tracking-widest uppercase">
                    Gemini AI Civil Safety Hydraulic Analyst
                  </span>
                </div>
                
                {/* Fetch action trigger */}
                <button
                  id="btn-request-ai-analysis"
                  onClick={fetchGeminiReport}
                  disabled={isAiLoading}
                  className="px-3 py-1 bg-[#3B82F6]/20 border border-[#3B82F6] hover:bg-[#3B82F6]/35 text-[#adc6ff] rounded font-mono text-[10px] uppercase font-bold tracking-wider transition-all disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
                >
                  {isAiLoading ? (
                    <>
                      <div className="w-3 h-3 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                      <span>Synthesizing report...</span>
                    </>
                  ) : (
                    <>
                      <Activity className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Request Hydrology Dispatch</span>
                    </>
                  )}
                </button>
              </div>

              {/* Advisory Response Display Area */}
              <div className="bg-[#060e20] border border-white/5 rounded-lg p-4 font-mono text-[11px] text-gray-300 max-h-[220px] overflow-y-auto leading-relaxed relative">
                {isAiLoading ? (
                  <div className="flex flex-col items-center justify-center py-10 text-gray-400 gap-2">
                    <div className="w-7 h-7 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                    <p className="text-[10px] uppercase tracking-widest font-mono text-cyan-400 animate-pulse mt-1">Analyzing hydrograph data trends...</p>
                  </div>
                ) : aiReport ? (
                  <div className="space-y-3 prose prose-invert font-mono text-xs max-w-none text-[#dae2fd]">
                    <div className="bg-cyan-950/20 border-l-4 border-cyan-400 p-2.5 mb-2 rounded-r">
                      <span className="font-bold text-cyan-400 uppercase tracking-widest text-[9px] block">SECURITY AUDIT METRIC OK</span>
                      <p className="text-[10px] text-gray-400 mt-0.5">Hydraulic advisory dispatch formulated using professional fluid-mechanic formulas.</p>
                    </div>
                    {aiReport.split("\n").map((line, idx) => {
                      if (line.startsWith("###")) {
                        return (
                          <h4 key={idx} className="text-sm font-bold text-white uppercase border-b border-white/5 pb-1 mt-3">
                            {line.replace("###", "")}
                          </h4>
                        );
                      }
                      if (line.startsWith("**")) {
                        return (
                          <p key={idx} className="font-bold text-cyan-400">
                            {line.replaceAll("**", "")}
                          </p>
                        );
                      }
                      return <p key={idx}>{line}</p>;
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <p className="uppercase tracking-widest text-[10px] text-gray-400">Telemetry Analysis Awaiting Command</p>
                    <p className="text-[10px] text-gray-500 mt-2 font-sans max-w-md mx-auto">
                      Click the "Request Hydrology Dispatch" button above. The Gemini AI models will analyze your current dam spillway layout, watershed precipitation levels, and trigger professional incident dispatches.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Tactical Civil dispatch button */}
            <div className="mt-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs font-mono bg-white/5 p-3 rounded border border-white/5">
              <span className="text-gray-400">
                Primary Outflow: <span className="font-bold text-white">{calculatedDischargeRate.toFixed(1)} m³/s</span> // Basin Reservoir Depth: <span className="font-bold text-white">{sensors[0].value}m</span>
              </span>
              <button
                id="btn-broadcast-civil-alert"
                onClick={() => {
                  const message = `MUNICIPAL DISPATCH: Civil warning sirens armed. Reservoir storage volume is currently ${((sensors[0].value / 10) * 100).toFixed(0)}%. Spillway gate G1-G4 level opened manually to ${spillwayGateOpen}%. Avoid downstream floodplain sectors until further notification is published on auxiliary radio networks.`;
                  addSystemLog(message, "dispatch", "SUCCESS");
                  alert("CIVIL ALERT FORWARDED TO MUNICIPAL RADIO REPEATERS SUCCESSFUL");
                }}
                className="px-3 py-1.5 bg-[#EF4444]/20 border border-[#EF4444]/40 hover:bg-[#EF4444]/30 text-red-200 rounded font-semibold transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Radio className="w-3.5 h-3.5 text-red-400 animate-pulse" />
                Broadcast Civil Warning System Alert
              </button>
            </div>
          </div>
        </section>

        {/* INCIDENT REPORT LOG BOOK & OPERATIONS CHAT */}
        <footer className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-2 pb-8">
          
          {/* USER CUSTOM MANUAL LOG FEED */}
          <div className="bg-[#131b2e]/90 rounded-lg p-5 border border-white/10 backdrop-blur-md flex flex-col justify-between">
            <div>
              <span className="text-[10px] text-gray-400 font-mono tracking-widest uppercase">Operator Logs</span>
              <h3 className="font-semibold text-gray-200 text-sm uppercase tracking-wide mb-3">
                Operator Digital Journal Log
              </h3>
              
              <form onSubmit={handleManualLogSubmit} className="flex gap-2 mb-4">
                <input
                  id="input-manual-log"
                  type="text"
                  value={newLogText}
                  onChange={(e) => setNewLogText(e.target.value)}
                  placeholder="Insert localized engineering log entry manually..."
                  className="bg-[#0b1326] border border-white/10 rounded px-3 py-2 text-xs font-mono text-white flex-1 focus:outline-none focus:border-[#3B82F6]"
                />
                <button
                  type="submit"
                  id="btn-submit-log"
                  className="bg-[#3B82F6] hover:bg-[#3273db] text-white px-4 py-2 text-xs rounded transition font-medium cursor-pointer"
                >
                  Log Entry
                </button>
              </form>
            </div>

            {/* List Logs scroll screen */}
            <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
              {logs.map((log) => (
                <div key={log.id} className="p-2.5 rounded bg-[#0b1326]/50 border border-white/5 font-mono text-[10px] hover:bg-[#0b1326] transition">
                  <div className="flex items-center justify-between text-[9px] text-gray-500 mb-1">
                    <span>{log.timestamp} // {log.operator}</span>
                    <span className={`px-1 rounded text-[8px] font-bold ${
                      log.status === "SUCCESS" ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
                    }`}>
                      {log.status}
                    </span>
                  </div>
                  <p className="text-gray-300 font-sans leading-relaxed">{log.action}</p>
                </div>
              ))}
            </div>
          </div>

          {/* TELEMETRY SHIFT SYSTEM DETAILS */}
          <div className="bg-[#131b2e]/90 rounded-lg p-5 border border-white/10 backdrop-blur-md text-xs space-y-4">
            <span className="text-[10px] text-gray-400 font-mono tracking-widest uppercase block">Shift Specifications</span>
            <h3 className="font-semibold text-gray-200 text-sm uppercase tracking-wide">
              Hydro-Sentinel Command Specifications
            </h3>
            
            <div className="grid grid-cols-2 gap-4 text-[11px] font-mono leading-relaxed text-gray-400">
              <div className="space-y-1">
                <span className="text-[8px] text-gray-500 block">WATERSHED AREA</span>
                <span className="text-gray-200 font-medium font-sans">Athabasca Catchment Sec F</span>
              </div>
              <div className="space-y-1">
                <span className="text-[8px] text-gray-500 block">RESERVOIR CREST MAX LEVEL</span>
                <span className="text-gray-200 font-medium font-sans">10.00 Meters Above Bed</span>
              </div>
              <div className="space-y-1">
                <span className="text-[8px] text-gray-500 block">TOTAL SPILLWAY CHANNELS</span>
                <span className="text-gray-200 font-medium font-sans">4 High-velocity radial gates</span>
              </div>
              <div className="space-y-1">
                <span className="text-[8px] text-gray-500 block">CIVIL PROTECTION ZONE</span>
                <span className="text-[#adc6ff] font-medium font-sans font-semibold">Low-lying Flood Basin 3B</span>
              </div>
            </div>

            <div className="p-3 bg-blue-950/20 border border-blue-500/20 rounded-lg flex items-start gap-2.5">
              <Radio className="w-4 h-4 text-[#3B82F6] shrink-0 mt-0.5 animate-pulse" />
              <p className="text-[11px] text-gray-300 leading-relaxed font-sans">
                <strong>Manual Gate Override Mode is actively monitored.</strong> Adjustments to spillway gates trigger physical fluid-mechanics formulas recalculating discharge outflow volume and reservoir depth over time (simulated logic).
              </p>
            </div>
          </div>

        </footer>

      </div>
    </div>
  );
}
