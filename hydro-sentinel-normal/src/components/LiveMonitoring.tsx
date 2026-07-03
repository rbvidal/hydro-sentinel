/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  CloudRain, 
  Droplet, 
  Gauge, 
  Sliders, 
  CheckCircle, 
  AlertTriangle,
  Play,
  RotateCcw
} from 'lucide-react';
import { StationData } from '../types';

interface LiveMonitoringProps {
  stations: StationData[];
  onFlushStation: (id: string) => void;
  onResetSimulation: () => void;
  rainLevel: number;
  basinSaturation: number;
  dischargeRate: number;
  sensorHealth: number;
}

export default function LiveMonitoring({
  stations,
  onFlushStation,
  onResetSimulation,
  rainLevel,
  basinSaturation,
  dischargeRate,
  sensorHealth
}: LiveMonitoringProps) {
  
  // Calculate active alerts based on thresholds (> 5.0m is critical warning)
  const activeAlerts = stations.filter(s => s.level >= 5.0).length;
  
  // Determine global alert status of the basin
  const basinIsAlert = activeAlerts > 0;

  // Convert array of history data into precise dynamic SVG path points
  const getSvgPathPoints = (history: number[], min: number, max: number): string => {
    if (!history || history.length === 0) return 'M 0 10 L 100 10';
    const width = 140;
    const height = 30;
    const pointsCount = history.length;
    const xStep = width / (pointsCount - 1 || 1);
    
    return history.map((val, idx) => {
      const x = idx * xStep;
      // Scale value between 0 and height
      const range = max - min || 1;
      const normalizedY = ((val - min) / range) * height;
      // Invert Y for SVG coordinates
      const y = height - normalizedY;
      return `${idx === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
    }).join(' ');
  };

  return (
    <div className="p-4 md:p-8 space-y-6">
      {/* Simulation Controller HUD Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3.5 bg-surface-container-low border border-outline-variant/20 rounded-xl gap-3">
        <div>
          <h4 className="text-xs font-bold font-mono tracking-wider text-secondary">
            PHYSICAL SIMULATOR ENGINE (ACTUAL METRICS)
          </h4>
          <p className="text-xs text-on-surface-variant">
            Data is updating live. Use the flushing triggers below each camera feed to drop water levels.
          </p>
        </div>
        <button 
          onClick={onResetSimulation}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-bright hover:bg-surface-container-highest border border-outline-variant/30 text-xs text-on-surface font-semibold rounded-lg transition-all cursor-pointer"
        >
          <RotateCcw size={13} />
          <span>Reset Simulation</span>
        </button>
      </div>

      {/* Top Overview Cards (Waterfall Basin Status & Active Alerts) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Waterfall Basin Capacity Status */}
        <div className="lg:col-span-2 glass-card rounded-xl p-6 flex flex-col justify-between min-h-[160px] border border-outline-variant/30">
          <div>
            <p className="font-sans text-xs font-bold tracking-widest text-on-surface-variant/80 uppercase mb-2">
              WATERFALL BASIN STATUS
            </p>
            <div className="flex flex-wrap items-end gap-3">
              <h2 className={`font-sans text-4xl font-extrabold tracking-tight ${basinIsAlert ? 'text-primary-container animate-pulse' : 'text-tertiary'}`}>
                {basinIsAlert ? 'CRITICAL LIMIT' : 'NORMAL'}
              </h2>
              <p className="font-sans text-sm text-on-surface/70 pb-1">
                {basinIsAlert ? 'Emergency overflow measures initialized' : '1.2m below threshold'}
              </p>
            </div>
          </div>
          
          <div className="mt-6">
            <div className="flex justify-between items-center text-xs font-mono text-on-surface-variant/90 mb-2">
              <span className="uppercase tracking-widest font-sans font-bold">Inflow Intake Limit</span>
              <span className="font-bold">35% Cap</span>
            </div>
            <div className="h-2.5 w-full bg-surface-container-highest rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-700 ${basinIsAlert ? 'bg-primary-container' : 'bg-tertiary'}`} 
                style={{ width: basinIsAlert ? '82%' : '35%' }}
              />
            </div>
          </div>
        </div>

        {/* Active Alerts HUD widget */}
        <div className={`glass-card rounded-xl p-6 flex flex-col justify-between border ${basinIsAlert ? 'border-primary-container/60 bg-primary-container/10' : 'border-outline-variant/20'}`}>
          <div className="flex justify-between items-start">
            <div>
              <p className="font-sans text-xs font-bold tracking-widest text-on-surface-variant/80 uppercase mb-2">
                ACTIVE ALERTS
              </p>
              <h2 className={`font-sans text-4xl font-extrabold tracking-tight font-mono ${basinIsAlert ? 'text-primary' : 'text-on-surface'}`}>
                {activeAlerts < 10 ? `0${activeAlerts}` : activeAlerts}
              </h2>
            </div>
            <div className={`p-2.5 rounded-lg ${basinIsAlert ? 'bg-red-500/10 border border-red-500/30 text-primary-container' : 'bg-surface-container-highest border border-outline-variant/20 text-tertiary'}`}>
              {basinIsAlert ? <AlertTriangle size={20} className="animate-bounce" /> : <CheckCircle size={20} />}
            </div>
          </div>
          
          <div className="mt-4">
            <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs leading-none font-semibold ${
              basinIsAlert 
                ? 'bg-red-500/10 text-primary border border-red-500/20' 
                : 'bg-tertiary/10 text-tertiary border border-tertiary/20'
            }`}>
              {basinIsAlert 
                ? 'ALERT: Immediate physical attention required at 3KM' 
                : 'All systems functioning nominally'}
            </span>
          </div>
        </div>
      </div>

      {/* Monitoring Grid (5 Stations) */}
      <div className="space-y-3">
        <h3 className="font-sans text-xs font-bold tracking-widest text-on-surface-variant/80 uppercase px-1">
          RIVER MEASUREMENT POINTS (UPSTREAM DISTANCE)
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-5">
          {stations.map((station) => {
            const isAlert = station.level >= 5.0;
            const absoluteChange = Math.abs(station.rateOfChange);
            const trendLabel = station.rateOfChange > 0 
              ? `+${absoluteChange.toFixed(2)}` 
              : station.rateOfChange < 0 
                ? `-${absoluteChange.toFixed(2)}` 
                : '0.00';
                
            return (
              <div 
                key={station.id} 
                className={`glass-card rounded-xl overflow-hidden group flex flex-col justify-between transition-all duration-300 border ${
                  isAlert 
                    ? 'border-primary-container/60 bg-red-950/20 shadow-lg shadow-red-500/5' 
                    : 'border-outline-variant/20 hover:border-secondary/40'
                }`}
              >
                {/* Station Video Container */}
                <div className="relative h-40 bg-surface-container-lowest overflow-hidden">
                  <img 
                    alt={station.name} 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transform scale-102 group-hover:scale-105 transition-transform duration-500 opacity-60 group-hover:opacity-85"
                    src={station.imageUrl}
                  />
                  {/* Absolute Badge */}
                  <div className={`absolute top-3 right-3 flex items-center gap-1.5 px-2 py-1 rounded backdrop-blur ${
                    isAlert ? 'bg-primary-container' : 'bg-black/70'
                  }`}>
                    <span className={`w-2 h-2 rounded-full ${isAlert ? 'bg-white animate-pulse' : 'bg-primary animate-live'}`} />
                    <span className={`font-mono text-[9px] font-extrabold tracking-widest ${isAlert ? 'text-on-primary-container' : 'text-white'}`}>
                      {isAlert ? 'ALERT 3KM' : `LIVE ${station.distance}`}
                    </span>
                  </div>
                </div>

                {/* Station Readings Container */}
                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className={`text-[10px] uppercase tracking-widest font-bold ${isAlert ? 'text-primary' : 'text-on-surface-variant/70'}`}>
                        LEVEL ({station.name})
                      </p>
                      <p className={`font-mono text-2xl font-bold tracking-tight shrink-0 ${isAlert ? 'text-primary' : 'text-on-surface'}`}>
                        {station.level.toFixed(2)}m
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`font-mono text-xs font-bold leading-normal ${
                        station.rateOfChange > 0 
                          ? 'text-primary' 
                          : station.rateOfChange < 0 
                            ? 'text-tertiary' 
                            : 'text-on-surface-variant/80'
                      }`}>
                        {trendLabel}
                      </p>
                      <p className="text-[9px] uppercase tracking-wider font-bold text-on-surface-variant/50">M/MIN</p>
                    </div>
                  </div>

                  {/* Sparkline Graph Chart */}
                  <div className="h-8 flex items-center justify-center relative">
                    <svg className="w-full h-full" viewBox="0 0 140 30" preserveAspectRatio="none">
                      <path 
                        d={getSvgPathPoints(station.history, 4.0, 5.3)} 
                        fill="none" 
                        stroke={isAlert ? '#ff5451' : '#4edea3'} 
                        strokeWidth="2" 
                        className={isAlert ? 'sparkline-svg-alert' : 'sparkline-svg'}
                      />
                    </svg>
                  </div>

                  {/* Action Flush Trigger */}
                  <button
                    onClick={() => onFlushStation(station.id)}
                    className={`w-full py-2 border rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                      isAlert 
                        ? 'bg-primary-container text-on-primary-container border-transparent hover:opacity-90' 
                        : 'border-outline-variant/40 hover:bg-surface-bright hover:border-secondary/40 text-on-surface'
                    }`}
                  >
                    {isAlert ? '⚠️ FLUSH ACCORD GATE' : 'FLUSH GATE'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Secondary Telemetry Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Rain Level */}
        <div className="glass-card rounded-xl p-5 border-l-4 border-secondary border border-outline-variant/20 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-1">
            <p className="font-sans text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">RAIN LEVEL</p>
            <CloudRain size={16} className="text-secondary animate-bounce" />
          </div>
          <div>
            <h4 className="font-mono text-3xl font-extrabold tracking-tight text-on-surface">
              {rainLevel} <span className="text-sm font-normal text-on-surface-variant font-sans">mm/h</span>
            </h4>
            <p className="text-xs text-secondary/80 mt-1">Steady precipitation</p>
          </div>
        </div>

        {/* Basin Saturation */}
        <div className="glass-card rounded-xl p-5 border-l-4 border-tertiary border border-outline-variant/20 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-1">
            <p className="font-sans text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">BASIN SATURATION</p>
            <Droplet size={16} className="text-tertiary animate-pulse" />
          </div>
          <div>
            <h4 className="font-mono text-3xl font-extrabold tracking-tight text-on-surface">
              {basinSaturation.toFixed(2)}<span className="text-sm font-normal text-on-surface-variant font-sans">%</span>
            </h4>
            <p className="text-xs text-tertiary/80 mt-1">Moderate retention ratio</p>
          </div>
        </div>

        {/* Upstream Discharge */}
        <div className="glass-card rounded-xl p-5 border-l-4 border-secondary border border-outline-variant/20 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-1">
            <p className="font-sans text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">DISCHARGE RATE</p>
            <Gauge size={16} className="text-secondary" />
          </div>
          <div>
            <h4 className="font-mono text-3xl font-extrabold tracking-tight text-on-surface">
              {dischargeRate.toFixed(1)} <span className="text-sm font-normal text-on-surface-variant font-sans">k m³/s</span>
            </h4>
            <p className="text-xs text-on-surface-variant/70 mt-1">Stable system outflow</p>
          </div>
        </div>

        {/* System Sensor Health */}
        <div className="glass-card rounded-xl p-5 border-l-4 border-tertiary border border-outline-variant/20 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-1">
            <p className="font-sans text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">SENSOR HEALTH</p>
            <Sliders size={16} className="text-tertiary hover:rotate-45 transition-transform" />
          </div>
          <div>
            <h4 className="font-mono text-3xl font-extrabold tracking-tight text-on-surface">
              {sensorHealth}<span className="text-sm font-normal text-on-surface-variant font-sans">%</span>
            </h4>
            <div className="flex gap-1.5 items-center mt-1">
              <div className="w-1.5 h-1.5 rounded-full bg-tertiary animate-ping" />
              <p className="text-xs text-tertiary">All nodes online</p>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}
