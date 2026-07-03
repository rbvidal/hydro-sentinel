import { useState } from 'react';
import {
  Users,
  Sliders,
  Clock,
  Shield,
  Database,
  Save,
  RotateCcw,
} from 'lucide-react';
import { SettingsRecipient, SettingsSystemConfig } from '../types';

const INITIAL_RECIPIENTS: SettingsRecipient[] = [
  { id: 'rec-1', name: 'Elena Rodriguez', role: 'CIVIL DEFENSE LEAD', email: 'e.rodriguez@city.gov', phone: '+1 (555) 012-9923', notifyCritical: true, notifyWarning: true, lastTested: '14 Oct, 09:42' },
  { id: 'rec-2', name: 'Capt. Marcus Thorne', role: 'EMERGENCY SERVICES', email: 'm.thorne@fire.dept', phone: '+1 (555) 928-4400', notifyCritical: true, notifyWarning: false, lastTested: '12 Oct, 14:15' },
  { id: 'rec-3', name: 'Sarah Jenkins', role: 'COMMUNITY REPRESENTATIVE', email: 's.jenkins@estates.org', phone: '+1 (555) 102-3388', notifyCritical: true, notifyWarning: true, lastTested: '10 Oct, 11:30' },
  { id: 'rec-4', name: 'Devon Miller', role: 'INFRASTRUCTURE MANAGER', email: 'd.miller@watergrid.net', phone: '+1 (555) 772-1190', notifyCritical: true, notifyWarning: false, lastTested: '08 Oct, 16:45' },
];

const DEFAULT_CONFIG: SettingsSystemConfig = {
  rapidRiseSensitivity: 85,
  criticalLevelSensitivity: 92,
  quietHoursEnabled: true,
  quietHoursRange: '22:00 - 06:00 (Non-critical)',
  systemHealthNotify: true,
  dataRetentionDays: '90 Days (Recommended)',
};

export default function SettingsDashboard() {
  const [recipients, setRecipients] = useState<SettingsRecipient[]>(INITIAL_RECIPIENTS);
  const [config, setConfig] = useState<SettingsSystemConfig>(DEFAULT_CONFIG);
  const [saved, setSaved] = useState(false);

  const toggleRecipientNotify = (id: string, field: 'notifyCritical' | 'notifyWarning') => {
    setRecipients(prev =>
      prev.map(r => (r.id === id ? { ...r, [field]: !r[field] } : r)),
    );
    setSaved(false);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    setRecipients(INITIAL_RECIPIENTS);
    setConfig(DEFAULT_CONFIG);
    setSaved(false);
  };

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-6xl mx-auto text-[#dae2fd] font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white">System Configuration</h2>
          <p className="text-xs text-on-surface-variant mt-1">
            Alert recipient management, threshold calibration, and operational rules
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-4 py-2 bg-surface-bright hover:bg-surface-container-highest border border-outline-variant/30 text-xs text-on-surface font-semibold rounded-lg transition-all cursor-pointer"
          >
            <RotateCcw size={13} />
            Reset
          </button>
          <button
            onClick={handleSave}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              saved
                ? 'bg-emerald-600 text-white'
                : 'bg-blue-600 hover:bg-blue-500 text-white'
            }`}
          >
            <Save size={13} />
            {saved ? 'Saved' : 'Save Configuration'}
          </button>
        </div>
      </div>

      {/* Panel 1 — Alert Recipient Management Table */}
      <div className="glass-card rounded-xl p-6 border border-outline-variant/20">
        <div className="flex items-center gap-2 mb-5">
          <Users className="h-5 w-5 text-blue-400" />
          <h3 className="font-sans text-sm font-bold uppercase tracking-wider text-white">
            Alert Recipient Management
          </h3>
          <span className="text-[10px] font-mono text-on-surface-variant ml-2">
            ({recipients.length} contacts)
          </span>
        </div>

        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left font-sans border-collapse text-xs">
            <thead>
              <tr className="bg-surface-container-high border-b border-outline-variant/25 text-[10px] uppercase tracking-wider font-extrabold text-on-surface-variant">
                <th className="py-3 px-4">Name / Organization</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Contact Channels</th>
                <th className="py-3 px-4 text-center w-24">Critical</th>
                <th className="py-3 px-4 text-center w-24">Warning</th>
                <th className="py-3 px-4">Last Tested</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {recipients.map(r => (
                <tr key={r.id} className="hover:bg-surface-bright/20 transition-colors">
                  <td className="py-3 px-4">
                    <p className="font-bold text-white">{r.name}</p>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-[10px] font-mono font-bold text-blue-300 bg-blue-500/10 px-2 py-0.5 rounded">
                      {r.role}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="space-y-0.5">
                      <p className="font-mono text-[11px] text-on-surface-variant">{r.email}</p>
                      <p className="font-mono text-[10px] text-on-surface-variant/60">{r.phone}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <input
                      type="checkbox"
                      checked={r.notifyCritical}
                      onChange={() => toggleRecipientNotify(r.id, 'notifyCritical')}
                      className="w-4 h-4 accent-red-500 cursor-pointer"
                    />
                  </td>
                  <td className="py-3 px-4 text-center">
                    <input
                      type="checkbox"
                      checked={r.notifyWarning}
                      onChange={() => toggleRecipientNotify(r.id, 'notifyWarning')}
                      className="w-4 h-4 accent-amber-500 cursor-pointer"
                    />
                  </td>
                  <td className="py-3 px-4 font-mono text-[10px] text-on-surface-variant/60">
                    {r.lastTested}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden space-y-3">
          {recipients.map(r => (
            <div key={r.id} className="bg-surface-container-low/60 rounded-lg p-4 border border-outline-variant/15 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold text-white text-sm">{r.name}</p>
                  <span className="text-[10px] font-mono font-bold text-blue-300 bg-blue-500/10 px-2 py-0.5 rounded">{r.role}</span>
                </div>
              </div>
              <div className="text-[10px] font-mono text-on-surface-variant space-y-0.5">
                <p>{r.email}</p>
                <p>{r.phone}</p>
              </div>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-[10px] text-red-300 cursor-pointer">
                  <input type="checkbox" checked={r.notifyCritical} onChange={() => toggleRecipientNotify(r.id, 'notifyCritical')} className="w-3.5 h-3.5 accent-red-500" />
                  Critical
                </label>
                <label className="flex items-center gap-2 text-[10px] text-amber-300 cursor-pointer">
                  <input type="checkbox" checked={r.notifyWarning} onChange={() => toggleRecipientNotify(r.id, 'notifyWarning')} className="w-3.5 h-3.5 accent-amber-500" />
                  Warning
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Panel 2 — System Configuration Sliders */}
      <div className="glass-card rounded-xl p-6 border border-outline-variant/20">
        <div className="flex items-center gap-2 mb-5">
          <Sliders className="h-5 w-5 text-amber-400" />
          <h3 className="font-sans text-sm font-bold uppercase tracking-wider text-white">
            Threshold Sensitivity Configuration
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Rapid Rise Sensitivity */}
          <div className="bg-surface-container-low/60 rounded-lg p-5 border border-outline-variant/10 space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-white uppercase tracking-wider">
                Rapid Rise Rate Sensitivity
              </label>
              <span className="font-mono text-sm font-bold text-amber-400">
                {config.rapidRiseSensitivity}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={config.rapidRiseSensitivity}
              onChange={e =>
                setConfig(prev => ({ ...prev, rapidRiseSensitivity: Number(e.target.value) }))
              }
              className="w-full h-2 bg-surface-container-highest rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
            <div className="flex justify-between text-[9px] font-mono text-on-surface-variant/50">
              <span>Low Sensitivity</span>
              <span>High Sensitivity</span>
            </div>
            <p className="text-[10px] text-on-surface-variant/70">
              Triggers alerts when water level rise exceeds configured rate threshold.
            </p>
          </div>

          {/* Critical Level Sensitivity */}
          <div className="bg-surface-container-low/60 rounded-lg p-5 border border-outline-variant/10 space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-white uppercase tracking-wider">
                Critical Level Water Depth
              </label>
              <span className="font-mono text-sm font-bold text-red-400">
                {config.criticalLevelSensitivity}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={config.criticalLevelSensitivity}
              onChange={e =>
                setConfig(prev => ({ ...prev, criticalLevelSensitivity: Number(e.target.value) }))
              }
              className="w-full h-2 bg-surface-container-highest rounded-lg appearance-none cursor-pointer accent-red-500"
            />
            <div className="flex justify-between text-[9px] font-mono text-on-surface-variant/50">
              <span>Lower Threshold</span>
              <span>Higher Threshold</span>
            </div>
            <p className="text-[10px] text-on-surface-variant/70">
              Defines the water depth at which critical flood alerts are dispatched.
            </p>
          </div>
        </div>
      </div>

      {/* Panel 3 — Operational Rules */}
      <div className="glass-card rounded-xl p-6 border border-outline-variant/20">
        <div className="flex items-center gap-2 mb-5">
          <Clock className="h-5 w-5 text-emerald-400" />
          <h3 className="font-sans text-sm font-bold uppercase tracking-wider text-white">
            Operational Rules
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Quiet Hours */}
          <div className="bg-surface-container-low/60 rounded-lg p-5 border border-outline-variant/10 space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-blue-400" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">Quiet Hours</span>
              </div>
              <p className="text-[10px] text-on-surface-variant/70 mb-3">
                Suppress non-critical notifications during designated quiet periods.
              </p>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-on-surface-variant">
                {config.quietHoursEnabled ? config.quietHoursRange : 'Disabled'}
              </span>
              <button
                onClick={() =>
                  setConfig(prev => ({ ...prev, quietHoursEnabled: !prev.quietHoursEnabled }))
                }
                className={`relative w-10 h-5 rounded-full transition-colors cursor-pointer ${
                  config.quietHoursEnabled ? 'bg-emerald-500' : 'bg-surface-container-highest'
                }`}
              >
                <div
                  className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                    config.quietHoursEnabled ? 'translate-x-5' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* System Health Notify */}
          <div className="bg-surface-container-low/60 rounded-lg p-5 border border-outline-variant/10 space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-4 w-4 text-emerald-400" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">System Health</span>
              </div>
              <p className="text-[10px] text-on-surface-variant/70 mb-3">
                Send diagnostic alerts when sensor hardware reports degraded status.
              </p>
            </div>
            <div className="flex items-center justify-between">
              <span className={`text-[10px] font-mono ${config.systemHealthNotify ? 'text-emerald-400' : 'text-on-surface-variant/50'}`}>
                {config.systemHealthNotify ? 'Monitoring Active' : 'Monitoring Off'}
              </span>
              <button
                onClick={() =>
                  setConfig(prev => ({ ...prev, systemHealthNotify: !prev.systemHealthNotify }))
                }
                className={`relative w-10 h-5 rounded-full transition-colors cursor-pointer ${
                  config.systemHealthNotify ? 'bg-emerald-500' : 'bg-surface-container-highest'
                }`}
              >
                <div
                  className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                    config.systemHealthNotify ? 'translate-x-5' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Data Retention */}
          <div className="bg-surface-container-low/60 rounded-lg p-5 border border-outline-variant/10 space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Database className="h-4 w-4 text-purple-400" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">Data Retention</span>
              </div>
              <p className="text-[10px] text-on-surface-variant/70 mb-3">
                Configure how long telemetry logs and alert records are stored.
              </p>
            </div>
            <select
              value={config.dataRetentionDays}
              onChange={e =>
                setConfig(prev => ({ ...prev, dataRetentionDays: e.target.value }))
              }
              className="w-full bg-surface-container-highest border border-outline-variant/20 rounded-lg py-2 px-3 text-xs font-mono text-white cursor-pointer focus:outline-none focus:border-blue-500"
            >
              <option value="30 Days">30 Days</option>
              <option value="90 Days (Recommended)">90 Days (Recommended)</option>
              <option value="180 Days">180 Days</option>
              <option value="365 Days">365 Days</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
