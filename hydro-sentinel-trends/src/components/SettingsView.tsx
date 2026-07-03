import { Sliders, BellRing, Eye, Volume2, ShieldAlert, CheckCircle } from 'lucide-react';
import { Thresholds, SimulationProfile } from '../types';

interface SettingsViewProps {
  thresholds: Thresholds;
  setThresholds: (t: Thresholds) => void;
  simulationProfile: SimulationProfile;
  setSimulationProfile: (p: SimulationProfile) => void;
  sirensEnabled: boolean;
  setSirensEnabled: (b: boolean) => void;
  emailSimEnabled: boolean;
  setEmailSimEnabled: (b: boolean) => void;
}

export default function SettingsView({
  thresholds,
  setThresholds,
  simulationProfile,
  setSimulationProfile,
  sirensEnabled,
  setSirensEnabled,
  emailSimEnabled,
  setEmailSimEnabled,
}: SettingsViewProps) {
  
  const handleThresholdChange = (key: keyof Thresholds, val: number) => {
    setThresholds({
      ...thresholds,
      [key]: parseFloat(val.toFixed(2))
    });
  };

  const testSirens = () => {
    alert("📢 [TEST ALARM DISPATCHED] Sounding simulated 130dB command center sirens. Flashing control room warning strobe light bars.");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-sans text-xl font-bold text-white flex items-center gap-2">
          <Sliders className="text-primary-brand h-5 w-5" />
          System Parameter Configuration & Settings
        </h2>
        <p className="text-xs text-on-surface-variant/80">
          Set safe water levels, customize system response policies, and select climate profiles
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Threshold limits settings */}
        <div className="lg:col-span-2 glass-card rounded-xl p-6 bg-slate-900/40 space-y-5">
          <div className="flex items-center gap-2 text-indigo-300 text-xs font-bold uppercase tracking-wider font-sans border-b border-slate-800 pb-3">
            <ShieldAlert className="h-4.5 w-4.5" />
            Core Gauge Safety Levels & Trigger Thresholds
          </div>

          <div className="space-y-5">
            {/* Flood Stage Warning */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-sans font-bold text-red-400">🚨 CRITICAL FLOOD LIMIT</span>
                <span className="font-mono bg-red-950/40 text-red-300 border border-red-900/30 px-2 py-0.5 rounded text-[10px]">
                  {thresholds.floodLimit.toFixed(2)} Meters Depth
                </span>
              </div>
              <input 
                type="range"
                min="4.80"
                max="5.50"
                step="0.05"
                value={thresholds.floodLimit}
                onChange={(e) => handleThresholdChange('floodLimit', parseFloat(e.target.value))}
                className="w-full accent-red-500 cursor-pointer h-2 bg-slate-950 rounded-lg appearance-none"
              />
              <p className="text-[10px] text-on-surface-variant/75">
                Surpassing this limit immediately triggers critical flashing red overlays, notifies rescue squads, and issues alerts.
              </p>
            </div>

            {/* Rising Rapidly Stage */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-sans font-bold text-orange-400">⚠️ PREVENTION WARNING LIMIT</span>
                <span className="font-mono bg-orange-950/40 text-orange-300 border border-orange-900/30 px-2 py-0.5 rounded text-[10px]">
                  {thresholds.warningLimit.toFixed(2)} Meters Depth
                </span>
              </div>
              <input 
                type="range"
                min="4.30"
                max="4.79"
                step="0.05"
                value={thresholds.warningLimit}
                onChange={(e) => handleThresholdChange('warningLimit', parseFloat(e.target.value))}
                className="w-full accent-orange-500 cursor-pointer h-2 bg-slate-950 rounded-lg appearance-none"
              />
              <p className="text-[10px] text-on-surface-variant/75">
                Activates local sirens warning alerts. System flags rising rates.
              </p>
            </div>

            {/* Advisory Stage */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-sans font-bold text-yellow-400">⚡ COMPLIANCE ADVISORY LIMIT</span>
                <span className="font-mono bg-yellow-950/40 text-yellow-300 border border-yellow-900/30 px-2 py-0.5 rounded text-[10px]">
                  {thresholds.advisoryLimit.toFixed(2)} Meters Depth
                </span>
              </div>
              <input 
                type="range"
                min="3.90"
                max="4.29"
                step="0.05"
                value={thresholds.advisoryLimit}
                onChange={(e) => handleThresholdChange('advisoryLimit', parseFloat(e.target.value))}
                className="w-full accent-yellow-400 cursor-pointer h-2 bg-slate-950 rounded-lg appearance-none"
              />
              <p className="text-[10px] text-on-surface-variant/75">
                Sends automated status logging emails to water resource agency officers for oversight.
              </p>
            </div>

            {/* Normal level */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-sans font-bold text-emerald-400">✔️ OPTIMAL BASIN RUNOFF</span>
                <span className="font-mono bg-emerald-950/40 text-emerald-300 border border-emerald-900/30 px-2 py-0.5 rounded text-[10px]">
                  3.80 Meters Base
                </span>
              </div>
              <p className="text-[10px] text-on-surface-variant/75">
                Optimal ecological riverbed hydration levels. Standard flow-rate vectors are maintained.
              </p>
            </div>
          </div>
        </div>

        {/* Right column system options & test utilities */}
        <div className="space-y-4">
          
          {/* Simulation Climate profiles */}
          <div className="glass-card rounded-xl p-6 bg-slate-900/40 space-y-4">
            <div className="flex items-center gap-2 text-indigo-300 text-xs font-bold uppercase tracking-wider font-sans border-b border-slate-800 pb-3">
              <BellRing className="h-4.5 w-4.5" />
              Response Policies & Alarms
            </div>

            <div className="space-y-3">
              {/* Sirens enabled */}
              <div className="flex items-center justify-between p-3.5 bg-slate-950/60 rounded-xl border border-slate-800/60">
                <div>
                  <p className="text-xs font-bold text-white font-sans">Simulate Command Sirens</p>
                  <p className="text-[10px] text-on-surface-variant/80">Strobe light flashing upon warning stage</p>
                </div>
                <input
                  type="checkbox"
                  checked={sirensEnabled}
                  onChange={(e) => setSirensEnabled(e.target.checked)}
                  className="h-4 w-4 bg-slate-950 border-slate-800 rounded accent-indigo-500 cursor-pointer"
                />
              </div>

              {/* Email simulation */}
              <div className="flex items-center justify-between p-3.5 bg-slate-950/60 rounded-xl border border-slate-800/60">
                <div>
                  <p className="text-xs font-bold text-white font-sans">Broadcast Warning Broadcasts</p>
                  <p className="text-[10px] text-on-surface-variant/80">Auto broadcast emergency RSS data feeds</p>
                </div>
                <input
                  type="checkbox"
                  checked={emailSimEnabled}
                  onChange={(e) => setEmailSimEnabled(e.target.checked)}
                  className="h-4 w-4 bg-slate-950 border-slate-800 rounded accent-indigo-500 cursor-pointer"
                />
              </div>

              {/* Test siren button */}
              <button
                onClick={testSirens}
                className="cursor-pointer w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-sans text-xs font-bold uppercase tracking-wider rounded-xl border border-slate-700 transition-all flex items-center justify-center gap-1.5"
              >
                <Volume2 className="h-4.5 w-4.5 text-amber-300" />
                Fire Test Alarm Sequence
              </button>
            </div>
          </div>

          {/* Quick instructions manual */}
          <div className="glass-card rounded-xl p-5 bg-slate-950/30 border border-slate-800 text-xs text-on-surface-variant space-y-2">
            <h4 className="font-bold text-white uppercase tracking-wider text-[10px] font-sans">
              Hydro-Sentinel Calibration Manual
            </h4>
            <p className="leading-relaxed">
              Before calibrating depths, verify that all downstream transponders are fully registered in the <span className="text-white font-bold">Diagnostic Center</span>. If any transmitter registers below 95% health, issue a remote diagnostic reboot to restart solar array controllers and RF loops.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
