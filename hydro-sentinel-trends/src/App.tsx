import { useState, useEffect, useRef } from 'react';
import { 
  Waves, 
  HelpCircle, 
  Video, 
  X, 
  MapPin, 
  Cpu, 
  Battery, 
  Gauge, 
  Sparkles,
  AlertOctagon,
  ShieldAlert,
  BellRing,
  Volume2
} from 'lucide-react';

import { Station, AlertLog, SimulationProfile, LevelStage, Thresholds, EvacSector, DispatchTeam } from './types';
import Sidebar from './components/Sidebar';
import ActiveAlertsList from './components/ActiveAlertsList';
import LiveMonitoring from './components/LiveMonitoring';
import AlertHistory from './components/AlertHistory';
import SensorHealthView from './components/SensorHealthView';
import SettingsView from './components/SettingsView';
import EmergencyModal from './components/EmergencyModal';
import AICopilot from './components/AICopilot';

// Static assets links from the HTML code
const IMAGE_5KM = "https://lh3.googleusercontent.com/aida-public/AB6AXuDhKJHVkekk-lJhbNuZQHk2frUPPypGKGOFY0J395LNSlijfFmDE4rskUHnCU6s4XCHp4mD--IjZhJbK_x8wmQRAhuJVcMDB5J-l0Qe9KmGKL-K6r70TRIDe6x13_1n9CXqu91Bge0jbS1OKx5LX7U94fJx2_YrITO2qk3vIpgfkpGSW2bYMrPObDA25s_bkbQk7fGkQeogJYDRXkFjxBNoy-K3IYkzNsrAyfcAyjUB1q1DLxxB3ulMV2Sje6tnGgQ05ITn6y1oD0RS";
const IMAGE_4KM = "https://lh3.googleusercontent.com/aida-public/AB6AXuDqm2Qg__LLdNXewIxQ60HLkLcKsKLM0jFpnpcGtgfdVxC-ZeIYHvWzcPtLKmxFhfeZaMQHScoT1W_0HhdgxQRgBIUR00JPPgYfAUe2FEV1XUFO4A5cqtryjgpelBoH7fbfFiozjY9gyI_0NTLmglNS2WjA5Hnih66B1JHOV1rz7wnHrK1vUId31G0PDK6QtB7UjF42d4LunDM0h_bDydccDwwxxdA7F8OhD_y7UF8v_oJQz7lAGqiehW-nVBUcVeihYnv6zUeNTWBb";
const IMAGE_3KM = "https://lh3.googleusercontent.com/aida-public/AB6AXuAQPzApoMY3lw60HVwzVdXA002j0wkuX_SdKDJHSQC17uPGZsL7vSfj5VuE5TF3qQ_WMBOjG0N0duyyI_d3IYK3B42yVRSE5LhIJBch9mG5YWGDAXb5e6--c6AuP1yj_q3HmtbOVYCkZLlMo-StnmE8uV3YdOH9qQIu7O0BFsj7iZux26lmxmFcqfz0jXBRztyV6GGVMmrmaEkP4Ko17IjLLicjQ2uSfffkJdylHISkYQbLAIzSnaOdckzs3lDw30mrDKsSwhpkkPjg";
const IMAGE_2KM = "https://lh3.googleusercontent.com/aida-public/AB6AXuBp5ZObaTwrmZzG_2ZT8_4MoQNJYy5bj80wpRW1mgeIbBPJ15vM9aDt-t3amTHl0mq1RN5_PG1WlDR6bUiQQeVChd54BFiSiIp9EXw-tTdjXshm3m9lacgGqqOPNWj4DHuGKXRosH9GRS79Vq9H0xD2cPirXq4_mNsKOZ29AwQ6IR9dRcLORFIZ43LNPzQClZec0i0z4j-OnuG1QbSqhYqxnpt0tZFk0vHp2CZJWipnIgl2kU9EfeRx9hmEsbiaC3ZZLP02VmdtSOkS";
const IMAGE_1KM = "https://lh3.googleusercontent.com/aida-public/AB6AXuB9UpY1WwolTa-Dol3ad7DIZ5kxYsKlzGCR0r7_IPN9myBkTCoUuJ4KQNPTBpFqpfSXTtK58ielQTRrpqtFcqUzpckUHkC076E_qYdcW0NJceLfDVCELVNCPa_QqS1JtGNxrB_uwSdB56xNcKADPLVw3ntviVxckDXzRJhbj0_lcs_DeAh49K4l9xFy9ht-vgiX2ADJMKDlY35vzynEcEU3O3qT6Z0VDHcXSFdGB3C3kNpoDENyvV_0-oe-Wd4En07cslzfHdZ6ivBl";

export default function App() {
  const [currentView, setCurrentView] = useState<'monitor' | 'history' | 'sensors' | 'settings'>('monitor');
  const [isSimulating, setIsSimulating] = useState(true);
  const [simulationProfile, setSimulationProfile] = useState<SimulationProfile>('nominal');
  const [gateOpenPct, setGateOpenPct] = useState(0);

  // Modals visibility toggles
  const [showEmergencyConsole, setShowEmergencyConsole] = useState(false);
  const [activeCameraStationId, setActiveCameraStationId] = useState<string | null>(null);
  const [showCopilot, setShowCopilot] = useState(false);
  const [showForecastingOverlay, setShowForecastingOverlay] = useState(false);

  // Response preferences toggles
  const [sirensEnabled, setSirensEnabled] = useState(true);
  const [emailSimEnabled, setEmailSimEnabled] = useState(true);

  // Environmental general parameters
  const [rainLevel, setRainLevel] = useState(12.02);
  const [basinSaturation, setBasinSaturation] = useState(63.99);
  const [dischargeRate, setDischargeRate] = useState(1.20);
  const [sensorHealth, setSensorHealth] = useState(99.98);

  // Trigger Threshold Levels
  const [thresholds, setThresholds] = useState<Thresholds>({
    normalLimit: 3.80,
    advisoryLimit: 4.10,
    warningLimit: 4.40,
    floodLimit: 4.90,
  });

  // Base list of active sector populations for evacuation protocols
  const [evacSectors, setEvacSectors] = useState<EvacSector[]>([
    { id: '5km', name: '5KM Gorge', hazardLevel: 'low', status: 'none', population: 420 },
    { id: '4km', name: '4KM Flats', hazardLevel: 'low', status: 'none', population: 850 },
    { id: '3km', name: '3KM Floodplain', hazardLevel: 'critical', status: 'none', population: 1400 },
    { id: '2km', name: '2KM Lowland', hazardLevel: 'medium', status: 'none', population: 2100 },
    { id: '1km', name: '1KM Confluence', hazardLevel: 'low', status: 'none', population: 680 },
  ]);

  // Dispatch Teams
  const [dispatchTeams, setDispatchTeams] = useState<DispatchTeam[]>([
    { id: 'recon-a', name: 'Recon Unit Alpha', type: 'recon', status: 'idle', eta: '--', destination: '--', task: 'Drone flood monitoring' },
    { id: 'rescue-b', name: 'Rescue Squad Bravo', type: 'rescue', status: 'idle', eta: '--', destination: '--', task: 'Lowland evacuation support' },
    { id: 'sandbag-c', name: 'Sandbag Division Charlie', type: 'sandbags', status: 'idle', eta: '--', destination: '--', task: 'Structural bank fortification' },
    { id: 'medic-d', name: 'Paramedic Group Delta', type: 'medical', status: 'idle', eta: '--', destination: '--', task: 'Emergency medical response' },
  ]);

  // Default Alarm logs
  const [alerts, setAlerts] = useState<AlertLog[]>([
    {
      id: 'alert-1',
      timestamp: "11:51:30",
      timeAgo: "JUST NOW",
      stationId: "3km",
      stationName: "3KM Monitoring Station",
      severity: 'critical',
      title: "3KM Point Breach",
      message: "Water level exceeded flood trigger depth of 4.90m. Immediate action required.",
      acknowledged: false,
    },
    {
      id: 'alert-2',
      timestamp: "11:49:50",
      timeAgo: "2 MIN AGO",
      stationId: "5km",
      stationName: "5KM Monitoring Station",
      severity: 'warning',
      title: "5KM Rising Rapidly",
      message: "Rate of change detected: +0.05m/min. Remote diagnostics checking transducers.",
      acknowledged: false,
    }
  ]);

  // Initial Base Stations setup
  const [stations, setStations] = useState<Station[]>([
    {
      id: '5km',
      name: "5KM Monitoring Station",
      liveLabel: "LIVE 5KM",
      distance: "5.2KM Up",
      level: 4.53,
      rateOfChange: 0.05,
      sparkline: [4.12, 4.15, 4.20, 4.28, 4.31, 4.35, 4.41, 4.46, 4.51, 4.52, 4.53],
      image: IMAGE_5KM,
      altText: "SURVEILLANCE HUD: GORGE VIEW CONCRETE BULKHEAD LIGHT",
      warningState: true,
      location: "Upper Gorge Outlet",
      health: 'nominal',
      sensors: [
        { name: "Ultrasonic Water Depth", type: 'water-level', status: 'online', value: "4.53m", lastPing: "1s ago" },
        { name: "Thermal Flow Velocity", type: 'flow-rate', status: 'online', value: "2.44m/s", lastPing: "1s ago" },
        { name: "Lithium Power Reserve", type: 'battery', status: 'online', value: "89%", lastPing: "4s ago" },
        { name: "Backup Solar Regulator", type: 'solar', status: 'online', value: "4.8V", lastPing: "8s ago" },
        { name: "RF Transceiver", type: 'telemetry', status: 'online', value: "-45dBm", lastPing: "1s ago" },
      ]
    },
    {
      id: '4km',
      name: "4KM Monitoring Station",
      liveLabel: "LIVE 4KM",
      distance: "4.1KM Up",
      level: 4.45,
      rateOfChange: 0.00,
      sparkline: [4.45, 4.44, 4.45, 4.45, 4.46, 4.45, 4.45, 4.45, 4.45, 4.45, 4.45],
      image: IMAGE_4KM,
      altText: "HIGH DEFINITION WIDE ANGLE MOONLIT RIVER FORESTRY BEND",
      location: "Gorge Midplain Bend",
      health: 'nominal',
      sensors: [
        { name: "Ultrasonic Water Depth", type: 'water-level', status: 'online', value: "4.45m", lastPing: "2s ago" },
        { name: "Thermal Flow Velocity", type: 'flow-rate', status: 'online', value: "1.98m/s", lastPing: "2s ago" },
        { name: "Lithium Power Reserve", type: 'battery', status: 'online', value: "96%", lastPing: "5s ago" },
        { name: "Backup Solar Regulator", type: 'solar', status: 'online', value: "4.9V", lastPing: "9s ago" },
        { name: "RF Transceiver", type: 'telemetry', status: 'online', value: "-42dBm", lastPing: "2s ago" },
      ]
    },
    {
      id: '3km',
      name: "3KM Monitoring Station",
      liveLabel: "ALERT 3KM",
      distance: "3.0KM Up",
      level: 5.14,
      rateOfChange: 0.12,
      sparkline: [4.70, 4.79, 4.81, 4.85, 4.92, 4.98, 5.02, 5.06, 5.09, 5.11, 5.14],
      image: IMAGE_3KM,
      altText: "HARSH SURVEILLANCE FLOODLIGHT VIEW OF TURBULENT WATER AT HARSH PIER BANK",
      activeAlert: "3KM Point Breach active",
      warningState: true,
      location: "Floodplain Spillway Intercept",
      health: 'critical',
      sensors: [
        { name: "Ultrasonic Water Depth", type: 'water-level', status: 'degraded', value: "5.14m (CRITICAL)", lastPing: "0s ago" },
        { name: "Thermal Flow Velocity", type: 'flow-rate', status: 'online', value: "3.75m/s", lastPing: "0s ago" },
        { name: "Lithium Power Reserve", type: 'battery', status: 'online', value: "78%", lastPing: "3s ago" },
        { name: "Backup Solar Regulator", type: 'solar', status: 'degraded', value: "3.5V (LOW LIGHT)", lastPing: "10s ago" },
        { name: "RF Transceiver", type: 'telemetry', status: 'online', value: "-52dBm", lastPing: "0s ago" },
      ]
    },
    {
      id: '2km',
      name: "2KM Monitoring Station",
      liveLabel: "LIVE 2KM",
      distance: "1.9KM Up",
      level: 4.30,
      rateOfChange: -0.02,
      sparkline: [4.38, 4.36, 4.37, 4.35, 4.34, 4.33, 4.32, 4.31, 4.31, 4.30, 4.30],
      image: IMAGE_2KM,
      altText: "INDUSTRIAL METAL GATE CANAL OUTFLOW STRUCTURAL HUD",
      location: "Lowland Gates Bypass",
      health: 'nominal',
      sensors: [
        { name: "Ultrasonic Water Depth", type: 'water-level', status: 'online', value: "4.30m", lastPing: "3s ago" },
        { name: "Thermal Flow Velocity", type: 'flow-rate', status: 'online', value: "1.45m/s", lastPing: "3s ago" },
        { name: "Lithium Power Reserve", type: 'battery', status: 'online', value: "92%", lastPing: "6s ago" },
        { name: "Backup Solar Regulator", type: 'solar', status: 'online', value: "4.7V", lastPing: "12s ago" },
        { name: "RF Transceiver", type: 'telemetry', status: 'online', value: "-46dBm", lastPing: "3s ago" },
      ]
    },
    {
      id: '1km',
      name: "1KM Monitoring Station",
      liveLabel: "LIVE 1KM",
      distance: "1.1KM Up",
      level: 4.24,
      rateOfChange: 0.00,
      sparkline: [4.24, 4.24, 4.25, 4.24, 4.24, 4.24, 4.24, 4.24, 4.24, 4.24, 4.24],
      image: IMAGE_1KM,
      altText: "SURVEILLANCE SURFACES OF CONCRETE CONFLUENCE OVER WAY COLD LIGHT FEEDS",
      location: "Bypass Junction Outlet",
      health: 'nominal',
      sensors: [
        { name: "Ultrasonic Water Depth", type: 'water-level', status: 'online', value: "4.24m", lastPing: "4s ago" },
        { name: "Thermal Flow Velocity", type: 'flow-rate', status: 'online', value: "1.12m/s", lastPing: "4s ago" },
        { name: "Lithium Power Reserve", type: 'battery', status: 'online', value: "98%", lastPing: "7s ago" },
        { name: "Backup Solar Regulator", type: 'solar', status: 'online', value: "5.0V", lastPing: "14s ago" },
        { name: "RF Transceiver", type: 'telemetry', status: 'online', value: "-40dBm", lastPing: "4s ago" },
      ]
    }
  ]);

  // Handle single simulation frame update ("hydraulic tick")
  const triggerSimulationStep = () => {
    // Generate slight random weather fluctuations
    let rainDrift = 0;
    let satDrift = 0;
    let dischargeDrift = 0;
    let depthChangeCoefficient = 0.02;

    switch (simulationProfile) {
      case 'dry':
        rainDrift = -0.5;
        satDrift = -0.15;
        dischargeDrift = -0.04;
        depthChangeCoefficient = -0.03;
        break;
      case 'nominal':
        rainDrift = (Math.random() - 0.5) * 0.2;
        satDrift = (Math.random() - 0.5) * 0.1;
        dischargeDrift = (Math.random() - 0.5) * 0.05;
        depthChangeCoefficient = (Math.random() - 0.5) * 0.015;
        break;
      case 'heavy-rain':
        rainDrift = 1.2;
        satDrift = 0.45;
        dischargeDrift = 0.12;
        depthChangeCoefficient = 0.04;
        break;
      case 'flash-flood':
        rainDrift = 3.5;
        satDrift = 0.95;
        dischargeDrift = 0.28;
        depthChangeCoefficient = 0.11;
        break;
    }

    setRainLevel(prev => Math.max(0, parseFloat((prev + rainDrift).toFixed(2))));
    setBasinSaturation(prev => Math.min(100, Math.max(10, parseFloat((prev + satDrift).toFixed(2)))));
    setDischargeRate(prev => Math.max(0.2, parseFloat((prev + dischargeDrift).toFixed(2))));

    // Spillway release feedback: if gate is open, reduce level rise multiplier
    const dischargeGateImpact = (gateOpenPct / 100) * 0.16;

    // Mutate station metrics in place statefully
    setStations(prevStations => {
      return prevStations.map(station => {
        // Different stations rise at slightly different ratios based on geography upstream
        const stationFlowMultiplier = station.id === '3km' ? 1.3 : station.id === '5km' ? 1.1 : 0.8;
        const levelChangeAmount = (depthChangeCoefficient * stationFlowMultiplier) - dischargeGateImpact;
        const newLevel = Math.max(3.5, parseFloat((station.level + levelChangeAmount).toFixed(2)));

        // Shift sparklines array
        const newSparkline = [...station.sparkline.slice(1), newLevel];

        // Status determinations
        let activeAlertText = undefined;
        let warningActive = false;

        if (newLevel >= thresholds.floodLimit) {
          activeAlertText = `${station.name} Depth Critical Breach`;
          warningActive = true;
          
          // Inject custom alert on trigger limit if not duplicate
          setAlerts(prevAlerts => {
            const hasDuplicate = prevAlerts.some(a => !a.acknowledged && a.stationId === station.id && a.severity === 'critical');
            if (!hasDuplicate) {
              const freshId = `alert-${Date.now()}`;
              return [
                {
                  id: freshId,
                  timestamp: new Date().toLocaleTimeString(),
                  timeAgo: "JUST NOW",
                  stationId: station.id,
                  stationName: station.name,
                  severity: 'critical',
                  title: `${station.name} Point Breach`,
                  message: `Water level exceeded critical threshold of ${thresholds.floodLimit}m. High danger in sectors nearby.`,
                  acknowledged: false,
                },
                ...prevAlerts
              ];
            }
            return prevAlerts;
          });
        } else if (newLevel >= thresholds.warningLimit) {
          warningActive = true;
          setAlerts(prevAlerts => {
            const hasDuplicate = prevAlerts.some(a => !a.acknowledged && a.stationId === station.id && a.severity === 'warning');
            if (!hasDuplicate) {
              const freshId = `alert-${Date.now()}`;
              return [
                {
                  id: freshId,
                  timestamp: new Date().toLocaleTimeString(),
                  timeAgo: "JUST NOW",
                  stationId: station.id,
                  stationName: station.name,
                  severity: 'warning',
                  title: `${station.name} Rising Rapidly`,
                  message: `Rapid water accretion noted: Depth at ${newLevel}m. Remote transponder diagnostics deployed.`,
                  acknowledged: false,
                },
                ...prevAlerts
              ];
            }
            return prevAlerts;
          });
        }

        // Apply updated values to sensors
        const updatedSensors = station.sensors.map(s => {
          if (s.type === 'water-level') {
            return { ...s, value: `${newLevel}m`, status: newLevel >= thresholds.floodLimit ? 'degraded' : 'online' };
          }
          if (s.type === 'flow-rate') {
            const newFlow = (dischargeRate * stationFlowMultiplier).toFixed(2);
            return { ...s, value: `${newFlow}m/s` };
          }
          return s;
        });

        return {
          ...station,
          level: newLevel,
          rateOfChange: levelChangeAmount,
          sparkline: newSparkline,
          activeAlert: activeAlertText,
          warningState: warningActive,
          sensors: updatedSensors,
          health: newLevel >= thresholds.floodLimit ? 'critical' : 'nominal'
        };
      });
    });
  };

  // Run simulation intervals
  useEffect(() => {
    if (!isSimulating) return;
    const interval = setInterval(() => {
      triggerSimulationStep();
    }, 4000);
    return () => clearInterval(interval);
  }, [isSimulating, simulationProfile, gateOpenPct, thresholds]);

  // Acknowledge custom alert
  const handleAcknowledgeAlert = (id: string) => {
    setAlerts(prev => prev.map(a => {
      if (a.id === id) {
        return { ...a, acknowledged: true };
      }
      return a;
    }));
  };

  // Bulk Acknowledge alerts
  const handleAcknowledgeAllAlerts = () => {
    setAlerts(prev => prev.map(a => ({ ...a, acknowledged: true })));
    alert("📢 All active alerts successfully flagged as Acknowledged / Read.");
  };

  const handleClearAlertLogs = () => {
    setAlerts([]);
    alert("Alert ledger registry has been wiped.");
  };

  // Push user-generated custom alert for simulation/testing
  const handleAddTestAlert = (
    severity: 'critical' | 'warning' | 'info', 
    stationId: string, 
    title: string, 
    message: string
  ) => {
    const fresh: AlertLog = {
      id: `alert-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      timeAgo: "JUST NOW",
      stationId: stationId || undefined,
      stationName: stations.find(s => s.id === stationId)?.name,
      severity,
      title,
      message,
      acknowledged: false,
    };
    setAlerts(prev => [fresh, ...prev]);
  };

  const postSystemLog = (title: string, msg: string, severity: 'critical' | 'warning' | 'info') => {
    handleAddTestAlert(severity, '', title, msg);
  };

  // Trigger simulated node reboots
  const handleTriggerRebootNode = (stationId: string) => {
    // Notify log ledger
    postSystemLog(
      `Remote Node Reboot Dispatched`, 
      `Full system command dispatched to physical hardware ID [${stationId.toUpperCase()}]. Initiating RF diagnostic sequence.`, 
      "info"
    );
  };

  // Active viewed camera node info
  const chosenCamStation = stations.find(s => s.id === activeCameraStationId);

  // Compute basin percentage
  const averageAllHeights = stations.reduce((tot, s) => tot + s.level, 0) / stations.length;
  // Map average range [3.8, 5.2] to [15, 95] pct
  const basinPct = Math.min(99.9, Math.max(10, ((averageAllHeights - 3.8) / (5.2 - 3.8)) * 80 + 15));

  return (
    <div className="flex h-screen overflow-hidden selection:bg-red-500 selection:text-white font-sans text-on-surface">
      
      {/* Side Navigation Bar */}
      <Sidebar 
        currentView={currentView}
        setCurrentView={setCurrentView}
        onEmergencyClick={() => setShowEmergencyConsole(true)}
        activeAlertCount={alerts.filter(a => !a.acknowledged).length}
      />

      {/* Main Container */}
      <div className="flex-1 flex flex-col h-full bg-[#0b1326] relative overflow-hidden">
        
        {/* Floating Active Alerts List notifications inside viewport */}
        <ActiveAlertsList 
          alerts={alerts}
          onAcknowledge={handleAcknowledgeAlert}
          onViewCamera={setActiveCameraStationId}
        />

        {/* Global Toolbar Header */}
        <header className="flex justify-between items-center w-full px-8 h-18 sticky top-0 z-40 bg-slate-950/75 backdrop-blur-xl border-b border-slate-800/85 shrink-0 select-none">
          <div className="flex items-center gap-2">
            <Waves className="h-6 w-6 text-indigo-400 stroke-[2.5]" />
            <span className="font-sans text-base font-extrabold tracking-tight text-white flex items-center gap-2">
              Hydro-Sentinel
              <span className="text-[9px] font-mono tracking-widest text-[#4edea3] bg-[#00a572]/15 px-2 py-0.5 rounded border border-[#00a572]/20 uppercase">
                Grid active
              </span>
            </span>
          </div>

          <div className="flex items-center gap-6">
            {/* Top tabs */}
            <div className="hidden md:flex gap-4">
              <button 
                onClick={() => {
                  setCurrentView('monitor');
                  setShowCopilot(false);
                }}
                className={`text-[11px] font-sans font-bold tracking-widest uppercase cursor-pointer transition-all ${
                  currentView === 'monitor' && !showCopilot ? 'text-indigo-400' : 'text-on-surface-variant/70 hover:text-white'
                }`}
              >
                Telemetry Monitor
              </button>
              
              <button 
                onClick={() => {
                  setCurrentView('monitor');
                  setShowCopilot(true);
                }}
                className={`text-[11px] font-sans font-bold tracking-widest uppercase cursor-pointer transition-all flex items-center gap-1 ${
                  showCopilot ? 'text-indigo-400 animate-pulse' : 'text-on-surface-variant/70 hover:text-white'
                }`}
              >
                <Sparkles className="h-3 w-3" /> AI Predictive Advisor
              </button>

              <button 
                onClick={() => {
                  alert("📊 SYSTEM ANALYTICS REPORT:\n24-Hour Hydrology: Normal base flow.\nTotal Accretion Index: Nominal.\nPrecipitation Mass Balance: Stable Outflow.");
                }}
                className="text-[11px] font-sans font-bold tracking-widest uppercase text-on-surface-variant/70 hover:text-white cursor-pointer"
              >
                Hydrology Reports
              </button>
            </div>

            {/* Notification & profile items */}
            <div className="h-4 w-px bg-slate-800/60 hidden sm:block"></div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => {
                  const unack = alerts.filter(a => !a.acknowledged);
                  if (unack.length > 0) {
                    alert(`🚨 Alert notification backlog: ${unack.length} unread incidents pending review.`);
                  } else {
                    alert("✔️ Notifications check: No outstanding active alerts.");
                  }
                }}
                className="p-1.5 hover:bg-slate-900 border border-transparent hover:border-slate-800 rounded-lg text-on-surface-variant hover:text-white cursor-pointer relative"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 absolute top-1 right-1 animate-pulse"></span>
                <span className="text-xs uppercase font-bold text-slate-400">Ledger</span>
              </button>

              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-indigo-600 border border-indigo-400/30 flex items-center justify-center font-bold text-xs text-white">
                  OP
                </div>
                <div className="hidden lg:block text-left select-none leading-none">
                  <p className="text-[11px] font-sans font-bold text-white">System Operator</p>
                  <p className="text-[9px] text-[#4edea3] font-mono mt-0.5">VIGILANT_CORE_ON</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Outer Scrollbox Grid Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6 md:px-8 pb-20 select-none">
          
          {showCopilot ? (
            /* AI forecasting section override */
            <div className="max-w-3xl mx-auto space-y-4">
              <div className="flex justify-between items-center bg-slate-950/40 p-4 border border-indigo-500/10 rounded-xl">
                <div>
                  <h2 className="text-sm font-bold text-white uppercase tracking-wider font-sans">
                    Hydrological Prognosis Center
                  </h2>
                  <p className="text-[11px] text-on-surface-variant/80">
                    Conversational mitigation recommendations based on real-time river level vectors
                  </p>
                </div>
                <button
                  onClick={() => setShowCopilot(false)}
                  className="px-3 py-1 bg-slate-900 border border-slate-800 text-[10px] text-white hover:text-indigo-300 font-sans font-bold rounded-lg cursor-pointer uppercase"
                >
                  Back to dashboard
                </button>
              </div>

              <AICopilot 
                stations={stations}
                simulationProfile={simulationProfile}
                rainLevel={rainLevel}
              />
            </div>
          ) : (
            /* Standard tab panels */
            <>
              {currentView === 'monitor' && (
                <LiveMonitoring 
                  stations={stations}
                  alerts={alerts}
                  simulationProfile={simulationProfile}
                  setSimulationProfile={setSimulationProfile}
                  basinLevel={averageAllHeights}
                  basinCapacityPct={basinPct}
                  onViewCamera={setActiveCameraStationId}
                  onAcknowledgeAll={handleAcknowledgeAllAlerts}
                  rainLevel={rainLevel}
                  basinSaturation={basinSaturation}
                  dischargeRate={dischargeRate}
                  sensorHealth={sensorHealth}
                  isSimulating={isSimulating}
                  setIsSimulating={setIsSimulating}
                  onTriggerSingleStep={triggerSimulationStep}
                  gateOpenPct={gateOpenPct}
                />
              )}

              {currentView === 'history' && (
                <AlertHistory 
                  alerts={alerts}
                  stations={stations}
                  onAcknowledge={handleAcknowledgeAlert}
                  onClearLogs={handleClearAlertLogs}
                  onAddTestAlert={handleAddTestAlert}
                />
              )}

              {currentView === 'sensors' && (
                <SensorHealthView 
                  stations={stations}
                  onTriggerReboot={handleTriggerRebootNode}
                  onCalibrateSensors={() => alert("Calibration routine finished.")}
                />
              )}

              {currentView === 'settings' && (
                <SettingsView 
                  thresholds={thresholds}
                  setThresholds={setThresholds}
                  simulationProfile={simulationProfile}
                  setSimulationProfile={setSimulationProfile}
                  sirensEnabled={sirensEnabled}
                  setSirensEnabled={setSirensEnabled}
                  emailSimEnabled={emailSimEnabled}
                  setEmailSimEnabled={setEmailSimEnabled}
                />
              )}
            </>
          )}

        </div>

        {/* Mobile Pinned Bottom Navigation bar */}
        <nav className="md:hidden fixed bottom-0 left-0 w-full z-40 flex justify-around items-center h-16 bg-[#0b1326]/95 backdrop-blur-md border-t border-slate-800/60 shadow-2xl px-4 select-none">
          <button
            onClick={() => {
              setCurrentView('monitor');
              setShowCopilot(false);
            }}
            className={`flex flex-col items-center justify-center cursor-pointer transition-all ${
              currentView === 'monitor' ? 'text-indigo-400' : 'text-on-surface-variant/70'
            }`}
          >
            <span className="text-[9px] font-sans font-bold uppercase tracking-wider block mt-1">Monitor</span>
          </button>
          
          <button
            onClick={() => setShowEmergencyConsole(true)}
            className="flex flex-col items-center justify-center cursor-pointer text-red-400"
          >
            <span className="text-[9px] font-sans font-bold text-red-400 uppercase tracking-widest block mt-1 animate-pulse">EMERGENCY</span>
          </button>

          <button
            onClick={() => {
              setCurrentView('history');
              setShowCopilot(false);
            }}
            className={`flex flex-col items-center justify-center cursor-pointer transition-all ${
              currentView === 'history' ? 'text-indigo-400' : 'text-on-surface-variant/70'
            }`}
          >
            <span className="text-[9px] font-sans font-bold uppercase tracking-wider block mt-1">Logs</span>
          </button>

          <button
            onClick={() => {
              setCurrentView('sensors');
              setShowCopilot(false);
            }}
            className={`flex flex-col items-center justify-center cursor-pointer transition-all ${
              currentView === 'sensors' ? 'text-indigo-400' : 'text-on-surface-variant/70'
            }`}
          >
            <span className="text-[9px] font-sans font-bold uppercase tracking-wider block mt-1">Sensors</span>
          </button>

          <button
            onClick={() => {
              setCurrentView('settings');
              setShowCopilot(false);
            }}
            className={`flex flex-col items-center justify-center cursor-pointer transition-all ${
              currentView === 'settings' ? 'text-indigo-400' : 'text-on-surface-variant/70'
            }`}
          >
            <span className="text-[9px] font-sans font-bold uppercase tracking-wider block mt-1">Settings</span>
          </button>
        </nav>

        {/* Emergency Modal Control Center Overlay */}
        {showEmergencyConsole && (
          <EmergencyModal 
            onClose={() => setShowEmergencyConsole(false)}
            gateOpenPct={gateOpenPct}
            setGateOpenPct={setGateOpenPct}
            evacSectors={evacSectors}
            setEvacSectors={setEvacSectors}
            dispatchTeams={dispatchTeams}
            setDispatchTeams={setDispatchTeams}
            onPostSysAlert={postSystemLog}
          />
        )}

        {/* Full-Screen Diagnostic camera feed viewport */}
        {activeCameraStationId && chosenCamStation && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-md select-none">
            <div className="glass-card max-w-3xl w-full rounded-2xl bg-black border border-indigo-500/40 overflow-hidden shadow-2xl flex flex-col relative">
              
              {/* Surveillance header overlay */}
              <div className="absolute top-0 inset-x-0 p-4 bg-gradient-to-b from-black/80 to-transparent flex justify-between items-center z-10">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
                  <div className="text-left font-mono text-[10px] leading-tight">
                    <p className="text-white font-extrabold tracking-widest uppercase">
                      SECURITY STREAM FEED SOURCE: {chosenCamStation.liveLabel}
                    </p>
                    <p className="text-red-400 font-bold uppercase tracking-widest mt-0.5">
                      FPS: 24.00 SEC • INFRARED SCAN RESOLUTION: 1080P • TELEMETRY CAP
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setActiveCameraStationId(null)}
                  className="p-1 text-slate-400 hover:text-white cursor-pointer bg-slate-900/60 rounded-lg border border-slate-800"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* HUD scan overlay and image camera feed */}
              <div className="relative aspect-video bg-neutral-950 overflow-hidden flex items-center justify-center">
                <img 
                  alt={chosenCamStation.altText} 
                  className="w-full h-full object-cover select-none" 
                  src={chosenCamStation.image}
                  referrerPolicy="no-referrer"
                />

                {/* Digital HUD Crosshairs & telemetry readouts */}
                <div className="absolute inset-0 pointer-events-none border border-indigo-500/20 m-6 flex flex-col justify-between p-4">
                  <div className="flex justify-between items-start text-[9px] font-mono text-[#4edea3]">
                    <span>[REC ACTIVE STROBE]</span>
                    <span>BEARING LAT: 44.59° N / SEC B</span>
                  </div>

                  {/* Aesthetic laser grid marker */}
                  <div className="w-12 h-12 border-t-2 border-l-2 border-indigo-400/50 absolute top-4 left-4"></div>
                  <div className="w-12 h-12 border-t-2 border-r-2 border-indigo-400/50 absolute top-4 right-4"></div>
                  <div className="w-12 h-12 border-b-2 border-l-2 border-indigo-400/50 absolute bottom-4 left-4"></div>
                  <div className="w-12 h-12 border-b-2 border-r-2 border-indigo-400/50 absolute bottom-4 right-4"></div>

                  <div className="flex justify-between items-end text-[9px] font-mono text-[#4edea3]">
                    <span>[COGNITIVE CLASSIFICATION: RIVER_DISCHARGE]</span>
                    <span>ULTRA_TRANSCEIVER: Nom 99.8%</span>
                  </div>
                </div>
              </div>

              {/* Info detail footer bar stats */}
              <div className="p-4 bg-slate-950/90 border-t border-slate-800 flex justify-between items-center text-xs text-on-surface-variant font-sans px-6">
                <div>
                  <span className="font-bold text-white block">Active Diagnostics: {chosenCamStation.name}</span>
                  <p className="text-[10px] text-on-surface-variant/80 mt-0.5">
                    Live Water Level: <span className="font-bold text-[#4edea3]">{chosenCamStation.level.toFixed(2)}m</span> | Offset rate: <span className="font-bold text-[#4edea3]">{chosenCamStation.rateOfChange.toFixed(2)} m/min</span>
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      alert(`Self-cleaning cycle dispatched to camera lens at ${chosenCamStation.name}.`);
                    }}
                    className="cursor-pointer px-3 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[10px] text-white font-sans font-bold uppercase tracking-wider rounded-lg transition-all"
                  >
                    Clean Lens
                  </button>
                  <button
                    onClick={() => {
                      setActiveCameraStationId(null);
                      alert("Closing camera scan stream. Grid continues to log.");
                    }}
                    className="cursor-pointer px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-sans font-bold uppercase tracking-wider rounded-lg transition-all"
                  >
                    Close Feeds
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>

    </div>
  );
}
