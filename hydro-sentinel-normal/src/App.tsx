/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import LiveMonitoring from './components/LiveMonitoring';
import AlertHistory from './components/AlertHistory';
import SensorHealth from './components/SensorHealth';
import SettingsPanel from './components/SettingsPanel';
import EmergencyModal from './components/EmergencyModal';

import { StationData, SecurityAlert, SensorStatus, IntegrationConfig } from './types';
import { Activity, ShieldAlert, Radio, Settings as SettingsIcon } from 'lucide-react';

export default function App() {
  // Navigation State
  const [currentTab, setCurrentTab] = useState<string>('live');
  const [isEmergencyOpen, setIsEmergencyOpen] = useState<boolean>(false);

  // Configuration settings (for Java Spring integration)
  const [config, setConfig] = useState<IntegrationConfig>({
    useJavaApi: false,
    javaBaseUrl: 'http://localhost:8080/api/hydro-sentinel'
  });

  // Secondary Telemetry constants/state
  const [rainLevel, setRainLevel] = useState<number>(12); // mm/h
  const [basinSaturation, setBasinSaturation] = useState<number>(64.01); // %
  const [dischargeRate, setDischargeRate] = useState<number>(1.2); // k m³/s
  const [sensorHealth, setSensorHealth] = useState<number>(100); // %

  // Simulated Station State (matching core dashboard mock parameters)
  const [stations, setStations] = useState<StationData[]>([
    {
      id: 'st-5km',
      name: 'LIVE 5KM',
      distance: '5KM',
      level: 4.51,
      rateOfChange: 0.05,
      status: 'normal',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDhKJHVkekk-lJhbNuZQHk2frUPPypGKGOFY0J395LNSlijfFmDE4rskUHnCU6s4XCHp4mD--IjZhJbK_x8wmQRAhuJVcMDB5J-l0Qe9KmGKL-K6r70TRIDe6x13_1n9CXqu91Bge0jbS1OKx5LX7U94fJx2_YrITO2qk3vIpgfkpGSW2bYMrPObDA25s_bkbQk7fGkQeogJYDRXkFjxBNoy-K3IYkzNsrAyfcAyjUB1q1DLxxB3ulMV2Sje6tnGgQ05ITn6y1oD0RS',
      history: [4.38, 4.41, 4.39, 4.42, 4.45, 4.43, 4.48, 4.51]
    },
    {
      id: 'st-4km',
      name: 'LIVE 4KM',
      distance: '4KM',
      level: 4.48,
      rateOfChange: 0.00,
      status: 'normal',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDqm2Qg__LLdNXewIxQ60HLkLcKsKLM0jFpnpcGtgfdVxC-ZeIYHvWzcPtLKmxFhfeZaMQHScoT1W_0HhdgxQRgBIUR00JPPgYfAUe2FEV1XUFO4A5cqtryjgpelBoH7fbfFiozjY9gyI_0NTLmglNS2WjA5Hnih66B1JHOV1rz7wnHrK1vUId31G0PDK6QtB7UjF42d4LunDM0h_bDydccDwwxxdA7F8OhD_y7UF8v_oJQz7lAGqiehW-nVBUcVeihYnv6zUeNTWBb',
      history: [4.49, 4.48, 4.48, 4.47, 4.49, 4.48, 4.48, 4.48]
    },
    {
      id: 'st-3km',
      name: 'ALERT 3KM',
      distance: '3KM',
      level: 5.12, // ALERT state (> 5.0m trigger threshold)
      rateOfChange: 0.12,
      status: 'alert',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAQPzApoMY3lw60HVwzVdXA002j0wkuX_SdKDJHSQC17uPGZsL7vSfj5VuE5TF3qQ_WMBOjG0N0duyyI_d3IYK3B42yVRSE5LhIJBch9mG5YWGDAXb5e6--c6AuP1yj_q3HmtbOVYCkZLlMo-StnmE8uV3YdOH9qQIu7O0BFsj7iZux26lmxmFcqfz0jXBRztyV6GGVMmrmaEkP4Ko17IjLLicjQ2uSfffkJdylHISkYQbLAIzSnaOdckzs3lDw30mrDKsSwhpkkPjg',
      history: [4.82, 4.89, 4.93, 4.98, 5.02, 5.05, 5.09, 5.12]
    },
    {
      id: 'st-2km',
      name: 'LIVE 2KM',
      distance: '2KM',
      level: 4.31,
      rateOfChange: -0.02,
      status: 'normal',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBp5ZObaTwrmZzG_2ZT8_4MoQNJYy5bj80wpRW1mgeIbBPJ15vM9aDt-t3amTHl0mq1RN5_PG1WlDR6bUiQQeVChd54BFiSiIp9EXw-tTdjXshm3m9lacgGqqOPNWj4DHuGKXRosH9GRS79Vq9H0xD2cPirXq4_mNsKOZ29AwQ6IR9dRcLORFIZ43LNPzQClZec0i0z4j-OnuG1QbSqhYqxnpt0tZFk0vHp2CZJWipnIgl2kU9EfeRx9hmEsbiaC3ZZLP02VmdtSOkS',
      history: [4.36, 4.35, 4.34, 4.35, 4.33, 4.32, 4.31, 4.31]
    },
    {
      id: 'st-1km',
      name: 'LIVE 1KM',
      distance: '1KM',
      level: 4.28,
      rateOfChange: 0.00,
      status: 'normal',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB9UpY1WwolTa-Dol3ad7DIZ5kxYsKlzGCR0r7_IPN9myBkTCoUuJ4KQNPTBpFqpfSXTtK58ielQTRrpqtFcqUzpckUHkC076E_qYdcW0NJceLfDVCELVNCPa_QqS1JtGNxrB_uwSdB56xNcKADPLVw3ntviVxckDXzRJhbj0_lcs_DeAh49K4l9xFy9ht-vgiX2ADJMKDlY35vzynEcEU3O3qT6Z0VDHcXSFdGB3C3kNpoDENyvV_0-oe-Wd4En07cslzfHdZ6ivBl',
      history: [4.28, 4.28, 4.28, 4.28, 4.28, 4.28, 4.28, 4.28]
    }
  ]);

  // Simulated Alert Event Log
  const [alerts, setAlerts] = useState<SecurityAlert[]>([
    {
      id: 'AL-9204',
      stationId: 'st-3km',
      stationName: 'Station 3KM Upstream',
      timestamp: '2026-06-14 05:14:02',
      level: 5.12,
      threshold: 5.00,
      status: 'active',
      severity: 'critical',
      details: 'Abrupt water level increase (+0.12 m/min) detected across ultrasonic sensor arrays. Sluice interlock disengagement recommended.'
    },
    {
      id: 'AL-9182',
      stationId: 'st-5km',
      stationName: 'Station 5KM Upstream',
      timestamp: '2026-06-14 02:44:11',
      level: 4.88,
      threshold: 4.80,
      status: 'resolved',
      severity: 'high',
      details: 'Preventative high margin trigger warning. Normalization completed after custom Accord gate adjustment.'
    },
    {
      id: 'AL-8942',
      stationId: 'st-2km',
      stationName: 'Station 2KM Upstream',
      timestamp: '2026-06-13 18:30:15',
      level: 4.65,
      threshold: 4.60,
      status: 'resolved',
      severity: 'medium',
      details: 'Minor optical wave occlusion detected during rain storm. Re-calibrated array parameters successfully.'
    }
  ]);

  // Simulated Sensor Statuses
  const [sensors, setSensors] = useState<SensorStatus[]>([
    { id: 'SEN-RAD-5KM', name: 'Ultrasonic Radar 5KM', type: ' ultrasonic radar RF', location: 'Upstream Basin Edge', status: 'online', uptime: 99.8, latency: 42, lastChecked: 'Just Now' },
    { id: 'SEN-RAD-4KM', name: 'Ultrasonic Radar 4KM', type: ' ultrasonic radar RF', location: 'Forest Bend Anchor', status: 'online', uptime: 99.9, latency: 45, lastChecked: 'Just Now' },
    { id: 'SEN-RAD-3KM', name: 'Ultrasonic Radar 3KM', type: ' high accuracy radar', location: 'Bridge Sluice Gate 3', status: 'online', uptime: 98.4, latency: 51, lastChecked: 'Just Now' },
    { id: 'SEN-RAD-2KM', name: 'Ultrasonic Radar 2KM', type: ' light wave radar', location: 'Canal Entrance Pylon', status: 'online', uptime: 99.6, latency: 38, lastChecked: 'Just Now' },
    { id: 'SEN-RAD-1KM', name: 'Ultrasonic Radar 1KM', type: ' acoustic wave sounder', location: 'Inlet Drain wall', status: 'online', uptime: 100.0, latency: 36, lastChecked: 'Just Now' },
    { id: 'SEN-PLU-01', name: 'Tipping-Bucket Pluviometer', type: ' rain precipitation collector', location: 'Command Hub Roof', status: 'online', uptime: 99.7, latency: 41, lastChecked: 'Just Now' },
    { id: 'SEN-SAT-01', name: 'Hydraulic saturation probe', type: ' soil moisture tester', location: 'Waterfall Ridge Slope', status: 'online', uptime: 99.2, latency: 48, lastChecked: 'Just Now' },
    { id: 'SEN-DIS-01', name: 'Doppler flow speed detector', type: ' microwave velocity radar', location: 'Primary Outflow Tunnel', status: 'online', uptime: 99.8, latency: 44, lastChecked: 'Just Now' },
  ]);

  // Action: Manual Gate Flush Simulation (Reduces Water Level)
  const handleFlushStation = (stationId: string) => {
    // Perform instant visual reduction in levels
    setStations(prevStations => 
      prevStations.map(station => {
        if (station.id === stationId) {
          const freshHistory = [...station.history];
          // Drop level by 0.85m to mimic flushing water
          const loweredLevel = Math.max(4.1, station.level - 0.85);
          freshHistory.shift();
          freshHistory.push(loweredLevel);

          return {
            ...station,
            level: loweredLevel,
            rateOfChange: -0.15, // now dropping
            status: 'normal',
            history: freshHistory
          };
        }
        return station;
      })
    );

    // Resolve any active alerts mapped to this station
    setAlerts(prevAlerts => 
      prevAlerts.map(alert => {
        if (alert.stationId === stationId && alert.status === 'active') {
          return {
            ...alert,
            status: 'resolved' as const
          };
        }
        return alert;
      })
    );

    // Notify user
    const tgt = stations.find(s => s.id === stationId);
    alert(`COMMAND SENT: Sluice valve override disengaged at ${tgt?.name || 'Station'}. Inflow is being diverted, lowering levels. Status response: '202 Accepted'.`);
  };

  // Action: Manually Resolve an active Alert from incident tracker
  const handleResolveAlert = (alertId: string) => {
    setAlerts(prevAlerts => 
      prevAlerts.map(alert => {
        if (alert.id === alertId) {
          // Find station id to flush it to normal ranges
          setTimeout(() => {
            handleFlushStation(alert.stationId);
          }, 300);

          return { ...alert, status: 'resolved' as const };
        }
        return alert;
      })
    );
  };

  // Reset entire simulation schema to catalog defaults
  const handleResetSimulation = () => {
    setStations([
      {
        id: 'st-5km',
        name: 'LIVE 5KM',
        distance: '5KM',
        level: 4.51,
        rateOfChange: 0.05,
        status: 'normal',
        imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDhKJHVkekk-lJhbNuZQHk2frUPPypGKGOFY0J395LNSlijfFmDE4rskUHnCU6s4XCHp4mD--IjZhJbK_x8wmQRAhuJVcMDB5J-l0Qe9KmGKL-K6r70TRIDe6x13_1n9CXqu91Bge0jbS1OKx5LX7U94fJx2_YrITO2qk3vIpgfkpGSW2bYMrPObDA25s_bkbQk7fGkQeogJYDRXkFjxBNoy-K3IYkzNsrAyfcAyjUB1q1DLxxB3ulMV2Sje6tnGgQ05ITn6y1oD0RS',
        history: [4.38, 4.41, 4.39, 4.42, 4.45, 4.43, 4.48, 4.51]
      },
      {
        id: 'st-4km',
        name: 'LIVE 4KM',
        distance: '4KM',
        level: 4.48,
        rateOfChange: 0.00,
        status: 'normal',
        imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDqm2Qg__LLdNXewIxQ60HLkLcKsKLM0jFpnpcGtgfdVxC-ZeIYHvWzcPtLKmxFhfeZaMQHScoT1W_0HhdgxQRgBIUR00JPPgYfAUe2FEV1XUFO4A5cqtryjgpelBoH7fbfFiozjY9gyI_0NTLmglNS2WjA5Hnih66B1JHOV1rz7wnHrK1vUId31G0PDK6QtB7UjF42d4LunDM0h_bDydccDwwxxdA7F8OhD_y7UF8v_oJQz7lAGqiehW-nVBUcVeihYnv6zUeNTWBb',
        history: [4.49, 4.48, 4.48, 4.47, 4.49, 4.48, 4.48, 4.48]
      },
      {
        id: 'st-3km',
        name: 'ALERT 3KM',
        distance: '3KM',
        level: 5.12,
        rateOfChange: 0.12,
        status: 'alert',
        imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAQPzApoMY3lw60HVwzVdXA002j0wkuX_SdKDJHSQC17uPGZsL7vSfj5VuE5TF3qQ_WMBOjG0N0duyyI_d3IYK3B42yVRSE5LhIJBch9mG5YWGDAXb5e6--c6AuP1yj_q3HmtbOVYCkZLlMo-StnmE8uV3YdOH9qQIu7O0BFsj7iZux26lmxmFcqfz0jXBRztyV6GGVMmrmaEkP4Ko17IjLLicjQ2uSfffkJdylHISkYQbLAIzSnaOdckzs3lDw30mrDKsSwhpkkPjg',
        history: [4.82, 4.89, 4.93, 4.98, 5.02, 5.05, 5.09, 5.12]
      },
      {
        id: 'st-2km',
        name: 'LIVE 2KM',
        distance: '2KM',
        level: 4.31,
        rateOfChange: -0.02,
        status: 'normal',
        imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBp5ZObaTwrmZzG_2ZT8_4MoQNJYy5bj80wpRW1mgeIbBPJ15vM9aDt-t3amTHl0mq1RN5_PG1WlDR6bUiQQeVChd54BFiSiIp9EXw-tTdjXshm3m9lacgGqqOPNJYy5bj80wpRW1mgeIbBPJ15vM9aDt-t3amTHl0mq1RN5_PG1WlDR6bUiQQeVChd54BFiSiIp9EXw-tTdjXshm3m9lacgGqqOPNWj4DHuGKXRosH9GRS79Vq9H0xD2cPirXq4_mNsKOZ29AwQ6IR9dRcLORFIZ43LNPzQClZec0i0z4j-OnuG1QbSqhYqxnpt0tZFk0vHp2CZJWipnIgl2kU9EfeRx9hmEsbiaC3ZZLP02VmdtSOkS',
        history: [4.36, 4.35, 4.34, 4.35, 4.33, 4.32, 4.31, 4.31]
      },
      {
        id: 'st-1km',
        name: 'LIVE 1KM',
        distance: '1KM',
        level: 4.28,
        rateOfChange: 0.00,
        status: 'normal',
        imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB9UpY1WwolTa-Dol3ad7DIZ5kxYsKlzGCR0r7_IPN9myBkTCoUuJ4KQNPTBpFqpfSXTtK58ielQTRrpqtFcqUzpckUHkC076E_qYdcW0NJceLfDVCELVNCPa_QqS1JtGNxrB_uwSdB56xNcKADPLVw3ntviVxckDXzRJhbj0_lcs_DeAh49K4l9xFy9ht-vgiX2ADJMKDlY35vzynEcEU3O3qT6Z0VDHcXSFdGB3C3kNpoDENyvV_0-oe-Wd4En07cslzfHdZ6ivBl',
        history: [4.28, 4.28, 4.28, 4.28, 4.28, 4.28, 4.28, 4.28]
      }
    ]);

    setAlerts([
      {
        id: 'AL-9204',
        stationId: 'st-3km',
        stationName: 'Station 3KM Upstream',
        timestamp: '2026-06-14 05:14:02',
        level: 5.12,
        threshold: 5.00,
        status: 'active',
        severity: 'critical',
        details: 'Abrupt water level increase (+0.12 m/min) detected across ultrasonic sensor arrays. Sluice interlock disengagement recommended.'
      },
      {
        id: 'AL-9182',
        stationId: 'st-5km',
        stationName: 'Station 5KM Upstream',
        timestamp: '2026-06-14 02:44:11',
        level: 4.88,
        threshold: 4.80,
        status: 'resolved',
        severity: 'high',
        details: 'Preventative high margin trigger warning. Normalization completed after custom Accord gate adjustment.'
      },
      {
        id: 'AL-8942',
        stationId: 'st-2km',
        stationName: 'Station 2KM Upstream',
        timestamp: '2026-06-13 18:30:15',
        level: 4.65,
        threshold: 4.60,
        status: 'resolved',
        severity: 'medium',
        details: 'Minor optical wave occlusion detected during rain storm. Re-calibrated array parameters successfully.'
      }
    ]);

    setRainLevel(12);
    setBasinSaturation(64.01);
    setDischargeRate(1.2);
    setSensorHealth(100);
    alert("Simulator parameters restored. All station telemetry and alert catalogs are reset.");
  };

  // Manual diagnostics ping system calibration sweep
  const handleCalibrateSensor = (sensorId: string) => {
    setSensors(prev => 
      prev.map(s => {
        if (s.id === sensorId) {
          const freshTime = new Date().toLocaleTimeString();
          return {
            ...s,
            status: 'online',
            uptime: 99.9,
            latency: Math.floor(Math.random() * 15) + 30, // low latency on target
            lastChecked: `Calibrated at ${freshTime}`
          };
        }
        return s;
      })
    );
  };

  // Continuous physical telemetry simulation tick loop
  useEffect(() => {
    const interval = setInterval(() => {
      // 1. Gently fluctuate weather factors
      setRainLevel(prev => {
        const drift = (Math.random() - 0.5) * 0.4;
        return Math.max(0, Math.min(48, parseFloat((prev + drift).toFixed(1))));
      });

      setBasinSaturation(prev => {
        const delta = (Math.random() - 0.45) * 0.08; // slightly upwards
        return Math.max(10, Math.min(100, parseFloat((prev + delta).toFixed(2))));
      });

      setDischargeRate(prev => {
        const shift = (Math.random() - 0.5) * 0.05;
        return Math.max(0.1, Math.min(5.0, parseFloat((prev + shift).toFixed(2))));
      });

      // 2. Marginally drift station water levels
      setStations(prevStations => 
        prevStations.map(station => {
          // If station 3km is in ALERT and hasn't been flushed, let it drift slightly higher
          const isAlert3km = station.id === 'st-3km' && station.level >= 5.0;
          let delta = 0;
          
          if (isAlert3km) {
            // alert continues to rise gradually unless flushed
            delta = (Math.random() - 0.3) * 0.015; // bias rising
          } else {
            // standard safe stations float around baseline
            delta = (Math.random() - 0.5) * 0.02;
          }

          const nextLevel = Math.max(3.8, parseFloat((station.level + delta).toFixed(2)));
          
          // Capture new layout coordinate trends
          const updatedHistory = [...station.history];
          updatedHistory.shift();
          updatedHistory.push(nextLevel);

          // Calculate current rate of change
          const computedRate = delta * 4; // amplified for visual resolution

          return {
            ...station,
            level: nextLevel,
            rateOfChange: computedRate,
            history: updatedHistory
          };
        })
      );
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  const activeAlertsCount = alerts.filter(a => a.status === 'active').length;

  return (
    <div className="flex h-screen overflow-hidden bg-background text-on-surface select-none font-sans">
      
      {/* Side Navigation panel (Visible on Desktop) */}
      <Sidebar 
        currentTab={currentTab} 
        onChangeTab={setCurrentTab} 
        onTriggerEmergency={() => setIsEmergencyOpen(true)}
        activeAlertsCount={activeAlertsCount}
      />

      {/* Main Content scope area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        
        {/* Top Header status metrics */}
        <Header 
          currentTab={currentTab} 
          activeAlertsCount={activeAlertsCount}
          onClearAlerts={() => {
            setAlerts(prev => prev.map(a => ({ ...a, status: 'resolved' })));
            alert("All central alert incident records resolved to ARCHIVE.");
          }}
          useJavaApi={config.useJavaApi}
        />

        {/* Dynamic Inner Tab Router */}
        <main className="flex-1 overflow-y-auto pb-20 md:pb-6">
          {currentTab === 'live' && (
            <LiveMonitoring 
              stations={stations} 
              onFlushStation={handleFlushStation}
              onResetSimulation={handleResetSimulation}
              rainLevel={rainLevel}
              basinSaturation={basinSaturation}
              dischargeRate={dischargeRate}
              sensorHealth={sensorHealth}
            />
          )}

          {currentTab === 'history' && (
            <AlertHistory 
              alerts={alerts} 
              onResolveAlert={handleResolveAlert}
              onRefresh={() => alert("Central Spring REST Alert catalog synchronized. Status 200 OK.")}
            />
          )}

          {currentTab === 'sensors' && (
            <SensorHealth 
              sensors={sensors}
              onCalibrateSensor={handleCalibrateSensor}
              onRefreshAll={() => {
                alert("Simulated API dispatch: Swept all 8 microwave, ultrasonic, and capacitive sensor arrays. Central registers indicate 100% cellular routing connectivity.");
              }}
              sensorHealthRatio={sensorHealth}
            />
          )}

          {currentTab === 'integration' && (
            <SettingsPanel 
              config={config} 
              onUpdateConfig={setConfig}
            />
          )}
        </main>

        {/* Bottom Navigation Hub (Visible on Mobile Only) */}
        <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center h-16 bg-surface-container/90 backdrop-blur-lg border-t border-outline-variant/30 shadow-lg px-4">
          <button
            onClick={() => setCurrentTab('live')}
            className={`flex flex-col items-center justify-center p-2.5 transition-all ${
              currentTab === 'live' 
                ? 'text-secondary-container font-extrabold scale-105' 
                : 'text-on-surface-variant hover:text-white'
            }`}
          >
            <Activity size={18} />
            <span className="text-[9px] uppercase tracking-wider mt-0.5">Monitor</span>
          </button>
          
          <button
            onClick={() => setCurrentTab('history')}
            className={`flex flex-col items-center justify-center p-2.5 transition-all relative ${
              currentTab === 'history' 
                ? 'text-secondary-container font-extrabold scale-105' 
                : 'text-on-surface-variant hover:text-white'
            }`}
          >
            <ShieldAlert size={18} />
            <span className="text-[9px] uppercase tracking-wider mt-0.5">Alerts</span>
            {activeAlertsCount > 0 && (
              <span className="absolute top-2 right-4 w-1.5 h-1.5 bg-primary-container rounded-full animate-ping" />
            )}
          </button>

          <button
            onClick={() => setCurrentTab('sensors')}
            className={`flex flex-col items-center justify-center p-2.5 transition-all ${
              currentTab === 'sensors' 
                ? 'text-secondary-container font-extrabold scale-105' 
                : 'text-on-surface-variant hover:text-white'
            }`}
          >
            <Radio size={18} />
            <span className="text-[9px] uppercase tracking-wider mt-0.5">Sensors</span>
          </button>

          <button
            onClick={() => setCurrentTab('integration')}
            className={`flex flex-col items-center justify-center p-2.5 transition-all ${
              currentTab === 'integration' 
                ? 'text-secondary-container font-extrabold scale-105' 
                : 'text-on-surface-variant hover:text-white'
            }`}
          >
            <SettingsIcon size={18} />
            <span className="text-[9px] uppercase tracking-wider mt-0.5">Settings</span>
          </button>
        </nav>

      </div>

      {/* Auxiliary Global Emergency Modal drawer */}
      <EmergencyModal 
        isOpen={isEmergencyOpen} 
        onClose={() => setIsEmergencyOpen(false)} 
        stationsCount={stations.length}
      />

    </div>
  );
}
