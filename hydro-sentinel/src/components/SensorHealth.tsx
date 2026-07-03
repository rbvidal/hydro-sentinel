/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Radio, RefreshCw, Cpu, HardDrive, Wifi, ShieldCheck, Hammer } from 'lucide-react';
import { SensorStatus } from '../types';

interface SensorHealthProps {
  sensors: SensorStatus[];
  onCalibrateSensor: (id: string) => void;
  onRefreshAll: () => void;
  sensorHealthRatio: number;
}

export default function SensorHealth({
  sensors,
  onCalibrateSensor,
  onRefreshAll,
  sensorHealthRatio
}: SensorHealthProps) {
  const [calibratingId, setCalibratingId] = useState<string | null>(null);

  const handleCalibrate = (id: string, name: string) => {
    setCalibratingId(id);
    setTimeout(() => {
      onCalibrateSensor(id);
      setCalibratingId(null);
      alert(`Diagnostic reports confirm: [${name}] was successfully re-calibrated. All internal voltage parameters and optical arrays are restored to optimal status levels.`);
    }, 1500);
  };

  return (
    <div className="p-4 md:p-8 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white mb-2">Sensor Array telemetry &amp; Field Nodes</h2>
          <p className="text-xs text-on-surface-variant">
            Vigilant diagnostic monitors for active sensors, ultrasonic radar level gauges, and soil saturation probes.
          </p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={onRefreshAll}
            className="flex items-center gap-2 px-4 py-2 bg-surface-container border border-outline-variant/35 hover:bg-surface-bright text-xs font-bold text-on-surface rounded-xl transition-all cursor-pointer shadow"
          >
            <RefreshCw size={14} className={calibratingId ? 'animate-spin' : ''} />
            <span>Diagnostic Ping System</span>
          </button>
        </div>
      </div>

      {/* Grid Summary Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="glass-card rounded-xl p-5 border border-outline-variant/20 flex items-center gap-4">
          <div className="p-4 rounded-xl bg-tertiary/10 text-tertiary">
            <Cpu size={24} />
          </div>
          <div>
            <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider block">System Aggregates</span>
            <h4 className="font-mono text-2xl font-bold text-white">{sensorHealthRatio}% Safe Nodes</h4>
            <p className="text-xs text-tertiary mt-0.5">Hydraulic loops stabilized</p>
          </div>
        </div>

        <div className="glass-card rounded-xl p-5 border border-outline-variant/20 flex items-center gap-4">
          <div className="p-4 rounded-xl bg-secondary/10 text-secondary">
            <Wifi size={24} />
          </div>
          <div>
            <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider block">Average Latency</span>
            <h4 className="font-mono text-2xl font-bold text-white">42.4 ms</h4>
            <p className="text-xs text-on-surface-variant">Continuous cellular data link</p>
          </div>
        </div>

        <div className="glass-card rounded-xl p-5 border border-outline-variant/20 flex items-center gap-4">
          <div className="p-4 rounded-xl bg-primary-container/10 text-primary-container">
            <HardDrive size={24} />
          </div>
          <div>
            <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider block">Primary Uplink status</span>
            <h4 className="font-mono text-2xl font-bold text-white">Active (SSL TLS)</h4>
            <p className="text-xs text-on-surface-variant">Encrypted peer packet stream</p>
          </div>
        </div>
      </div>

      {/* Main Responsive Grid List */}
      <div className="glass-card rounded-xl overflow-hidden border border-outline-variant/25">
        <div className="p-5 bg-surface-container border-b border-outline-variant/35 flex justify-between items-center">
          <h3 className="font-sans text-xs font-extrabold uppercase tracking-widest text-white flex items-center gap-2">
            <Radio size={16} className="text-secondary animate-pulse" />
            <span>Active Field Sensor Nodes</span>
          </h3>
          <span className="text-xs text-on-surface-variant font-mono">Scope: 8 Primary Hardware Assets</span>
        </div>

        {/* Responsive Table Grid */}
        <div className="overflow-x-auto">
          <table className="w-full text-left font-sans border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant/35 text-[10px] uppercase tracking-wider font-extrabold text-on-surface-variant select-none">
                <th className="py-4 px-5">SENSOR FIELD BLOCK</th>
                <th className="py-4 px-5">HARDWARE TYPE</th>
                <th className="py-4 px-5">PHYSICAL OFFSET LOCATION</th>
                <th className="py-4 px-5">HEALTH RATIO</th>
                <th className="py-4 px-5">CELLULAR LATENCY</th>
                <th className="py-4 px-5 font-mono">LAST HEARTBEAT</th>
                <th className="py-4 px-5 text-right">DIAGNOSTIC CALIBRATION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/15 text-xs">
              {sensors.map((sensor) => {
                const isCalibrating = calibratingId === sensor.id;
                const isOnline = sensor.status === 'online';
                
                return (
                  <tr key={sensor.id} className="hover:bg-surface-bright/25 transition-all">
                    
                    {/* Name/ID */}
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-2.5 h-2.5 rounded-full ${
                          sensor.status === 'online' ? 'bg-tertiary' : 
                          sensor.status === 'degraded' ? 'bg-yellow-400' : 'bg-red-500'
                        }`} />
                        <div>
                          <p className="font-bold text-white">{sensor.name}</p>
                          <p className="font-mono text-[9px] text-on-surface-variant uppercase font-semibold">Asset ID: {sensor.id}</p>
                        </div>
                      </div>
                    </td>

                    {/* Hardware Type */}
                    <td className="py-4 px-5 font-sans text-on-surface-variant font-bold">
                      {sensor.type}
                    </td>

                    {/* Location */}
                    <td className="py-4 px-5 font-mono text-on-surface-variant font-bold text-[11px]">
                      {sensor.location}
                    </td>

                    {/* Health/Uptime */}
                    <td className="py-4 px-5">
                      <div className="space-y-1">
                        <p className="font-mono font-bold text-white text-[11px]">{sensor.uptime}% Uptime</p>
                        <div className="w-24 h-1 bg-surface-container-highest rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${isOnline ? 'bg-tertiary' : 'bg-yellow-400'}`}
                            style={{ width: `${sensor.uptime}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Latency */}
                    <td className="py-4 px-5 font-mono text-white text-[11px]">
                      {sensor.latency} ms
                    </td>

                    {/* Checked Timestamp */}
                    <td className="py-4 px-5 font-mono text-on-surface-variant">
                      {sensor.lastChecked}
                    </td>

                    {/* Calibration sweep action */}
                    <td className="py-4 px-5 text-right">
                      <button
                        onClick={() => handleCalibrate(sensor.id, sensor.name)}
                        disabled={isCalibrating || calibratingId !== null}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 border rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                          isCalibrating 
                            ? 'bg-secondary-container text-on-secondary-container border-transparent animate-pulse'
                            : 'border-outline-variant/40 hover:bg-surface-bright hover:border-secondary/35 text-on-surface'
                        }`}
                      >
                        {isCalibrating ? (
                          <>
                            <RefreshCw size={11} className="animate-spin" />
                            <span>Sweeping...</span>
                          </>
                        ) : (
                          <>
                            <Hammer size={11} className="text-secondary" />
                            <span>Calibrate</span>
                          </>
                        )}
                      </button>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
