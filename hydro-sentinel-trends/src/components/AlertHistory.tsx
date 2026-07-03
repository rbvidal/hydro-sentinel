import React, { useState } from 'react';
import { 
  History, 
  Trash2, 
  PlusCircle, 
  CheckCircle,
  FileText,
  AlertOctagon,
  TrendingUp,
  Info,
  Search,
  SlidersHorizontal,
  XCircle
} from 'lucide-react';
import { AlertLog, Station } from '../types';

interface AlertHistoryProps {
  alerts: AlertLog[];
  stations: Station[];
  onAcknowledge: (id: string) => void;
  onClearLogs: () => void;
  onAddTestAlert: (severity: 'critical' | 'warning' | 'info', stationId: string, title: string, message: string) => void;
}

export default function AlertHistory({
  alerts,
  stations,
  onAcknowledge,
  onClearLogs,
  onAddTestAlert,
}: AlertHistoryProps) {
  const [severityFilter, setSeverityFilter] = useState<'all' | 'critical' | 'warning' | 'info'>('all');
  const [stationFilter, setStationFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [ackFilter, setAckFilter] = useState<'all' | 'unack' | 'ack'>('all');

  // Interactive local form states for triggering standard alerts
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSeverity, setNewSeverity] = useState<'critical' | 'warning' | 'info'>('warning');
  const [newStationId, setNewStationId] = useState<string>(stations[0]?.id || '');
  const [newTitle, setNewTitle] = useState('');
  const [newMessage, setNewMessage] = useState('');

  // Apply filters
  const filteredAlerts = alerts.filter(alert => {
    const matchesSeverity = severityFilter === 'all' || alert.severity === severityFilter;
    const matchesStation = stationFilter === 'all' || alert.stationId === stationFilter;
    const matchesAck = 
      ackFilter === 'all' || 
      (ackFilter === 'unack' && !alert.acknowledged) || 
      (ackFilter === 'ack' && alert.acknowledged);

    const matchesSearch = 
      searchQuery.trim() === '' || 
      alert.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      alert.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (alert.stationName && alert.stationName.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesSeverity && matchesStation && matchesAck && matchesSearch;
  });

  const triggerAddAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newMessage.trim()) return;
    onAddTestAlert(newSeverity, newStationId, newTitle, newMessage);
    setNewTitle('');
    setNewMessage('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-sans text-xl font-bold text-white flex items-center gap-2">
            <History className="text-primary-brand h-5 w-5" />
            Alert History & Audit Logs
          </h2>
          <p className="text-xs text-on-surface-variant/80">
            Comprehensive ledger of hydrological threshold breaches and automated system responses
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="cursor-pointer px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-sans text-xs font-bold uppercase tracking-wider rounded-lg border border-indigo-500/30 transition-all flex items-center gap-1.5"
          >
            <PlusCircle className="h-4.5 w-4.5" />
            Trigger Test Alert
          </button>
          
          <button
            onClick={onClearLogs}
            className="cursor-pointer px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-red-300 font-sans text-xs font-bold uppercase tracking-wider rounded-lg border border-slate-700 transition-all flex items-center gap-1.5"
          >
            <Trash2 className="h-4.5 w-4.5 text-red-400" />
            Clear Log Ledger
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-card rounded-xl p-5 bg-slate-900/40 space-y-4">
        <div className="flex items-center gap-2 text-indigo-300 text-xs font-bold uppercase tracking-wider font-sans">
          <SlidersHorizontal className="h-4 w-4" />
          Query Filters & Engine
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Text Search */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-on-surface-variant/70" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search history text..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs text-white placeholder-on-surface-variant/50 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          {/* Station Filter */}
          <select
            value={stationFilter}
            onChange={(e) => setStationFilter(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none cursor-pointer"
          >
            <option value="all">All Stations</option>
            {stations.map(s => (
              <option key={s.id} value={s.id}>{s.name} ({s.location})</option>
            ))}
          </select>

          {/* Severity Filter */}
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value as any)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none cursor-pointer"
          >
            <option value="all">All Severities</option>
            <option value="critical">🔴 Critical Alert</option>
            <option value="warning">🟡 Warning Warning</option>
            <option value="info">🔵 Informational Log</option>
          </select>

          {/* Acknowledge Filter */}
          <select
            value={ackFilter}
            onChange={(e) => setAckFilter(e.target.value as any)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="unack">Pending Unacknowledged</option>
            <option value="ack">Resolved / Acknowledged</option>
          </select>

          {/* Active status results count */}
          <div className="flex items-center justify-center p-2 bg-slate-950 rounded-lg border border-slate-800 text-xs font-mono text-indigo-300">
            Matches Mapped: <span className="text-white font-bold ml-1">{filteredAlerts.length}</span>
          </div>
        </div>
      </div>

      {/* Alert Logs Table Grid */}
      <div className="glass-card rounded-xl overflow-hidden border border-outline-variant/10">
        {filteredAlerts.length === 0 ? (
          <div className="p-12 text-center text-on-surface-variant/80 space-y-2">
            <FileText className="h-10 w-10 mx-auto text-indigo-400 opacity-60 animate-pulse" />
            <h4 className="font-semibold text-white">No Matching Alert Logs Found</h4>
            <p className="text-xs max-w-sm mx-auto">
              Current filter parameters yielded zero records. Adjust search inputs or trigger a test alert above.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950 border-b border-slate-800 text-on-surface-variant text-[10px] uppercase font-bold tracking-widest leading-none font-sans">
                  <th className="p-4">Log Timestamp</th>
                  <th className="p-4">Point Identification</th>
                  <th className="p-4">Log Severity</th>
                  <th className="p-4">Alert Trigger Event / Message</th>
                  <th className="p-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-sans text-xs">
                {filteredAlerts.map(alert => {
                  const isCritical = alert.severity === 'critical';
                  const isWarning = alert.severity === 'warning';
                  
                  return (
                    <tr 
                      key={alert.id}
                      className={`transition-colors duration-150 hover:bg-slate-900/40 ${
                        !alert.acknowledged 
                          ? isCritical 
                            ? 'bg-red-950/15' 
                            : isWarning 
                              ? 'bg-amber-500/5' 
                              : '' 
                          : 'opacity-70'
                      }`}
                    >
                      {/* Timestamp */}
                      <td className="p-4 font-mono text-on-surface-variant tracking-normal whitespace-nowrap">
                        <div className="text-white">{alert.timestamp}</div>
                        <div className="text-[10px] text-on-surface-variant/60">{alert.timeAgo}</div>
                      </td>

                      {/* Station Location Name */}
                      <td className="p-4 font-bold whitespace-nowrap">
                        {alert.stationName ? (
                          <div className="text-white">
                            {alert.stationName}
                            <span className="text-[10px] font-mono text-on-surface-variant/60 block">
                              ID: {alert.stationId}
                            </span>
                          </div>
                        ) : (
                          <span className="text-on-surface-variant/70 italic">Whole Basin</span>
                        )}
                      </td>

                      {/* Log Level Badges */}
                      <td className="p-4 whitespace-nowrap">
                        {isCritical ? (
                          <span className="px-2.5 py-1 bg-red-900/40 text-red-300 font-bold uppercase tracking-wider rounded border border-red-800/40 text-[9px] inline-flex items-center gap-1.5 font-sans">
                            <AlertOctagon className="h-3 w-3" /> Critical Alert
                          </span>
                        ) : isWarning ? (
                          <span className="px-2.5 py-1 bg-amber-900/30 text-amber-300 font-bold uppercase tracking-wider rounded border border-amber-800/40 text-[9px] inline-flex items-center gap-1.5 font-sans">
                            <TrendingUp className="h-3 w-3" /> Warning Active
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 bg-slate-800 text-slate-300 font-medium uppercase tracking-wider rounded text-[9px] inline-flex items-center gap-1.5 font-sans border border-slate-700">
                            <Info className="h-3 w-3" /> System Info
                          </span>
                        )}
                      </td>

                      {/* Message details */}
                      <td className="p-4 max-w-md">
                        <div className="text-white font-bold text-xs">{alert.title}</div>
                        <div className="text-on-surface-variant/90 text-[11px] mt-0.5 leading-relaxed">
                          {alert.message}
                        </div>
                      </td>

                      {/* Unacknowledged triggers check */}
                      <td className="p-4 whitespace-nowrap md:min-w-[120px]">
                        {!alert.acknowledged ? (
                          <button
                            onClick={() => onAcknowledge(alert.id)}
                            className="cursor-pointer px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-wider rounded transition-all flex items-center gap-1 text-center"
                          >
                            <CheckCircle className="h-3 w-3" /> Acknowledge
                          </button>
                        ) : (
                          <div className="text-emerald-400 font-bold text-[10px] tracking-wider uppercase flex items-center gap-1">
                            <CheckCircle className="h-3.5 w-3.5" /> Resolved
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Embedded form Modal for triggering custom alerts if requested */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="glass-card max-w-md w-full rounded-xl bg-slate-900 border border-indigo-500/30 overflow-hidden shadow-2xl">
            <div className="p-4 bg-slate-950 border-b border-slate-800 flex justify-between items-center">
              <h3 className="font-bold text-white text-xs uppercase tracking-wider font-sans">
                Trigger Manual Simulation Alert
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-on-surface-variant hover:text-white cursor-pointer"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={triggerAddAlert} className="p-5 space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-sans font-bold tracking-widest text-on-surface-variant uppercase">
                  Alert Severity
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewSeverity('info')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold font-sans uppercase tracking-wider border ${
                      newSeverity === 'info'
                        ? 'bg-slate-800 text-slate-300 border-slate-700'
                        : 'bg-slate-950 text-on-surface-variant/60 border-slate-900 hover:border-slate-800'
                    }`}
                  >
                    🔵 Info
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewSeverity('warning')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold font-sans uppercase tracking-wider border ${
                      newSeverity === 'warning'
                        ? 'bg-amber-950/60 text-amber-300 border-amber-800/40'
                        : 'bg-slate-950 text-on-surface-variant/60 border-slate-900 hover:border-slate-800'
                    }`}
                  >
                    🟡 Warning
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewSeverity('critical')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold font-sans uppercase tracking-wider border ${
                      newSeverity === 'critical'
                        ? 'bg-red-950/60 text-red-300 border-red-800/40'
                        : 'bg-slate-950 text-on-surface-variant/60 border-slate-900 hover:border-slate-800'
                    }`}
                  >
                    🔴 Critical
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-sans font-bold tracking-widest text-on-surface-variant uppercase block">
                  Select Associated Station
                </label>
                <select
                  value={newStationId}
                  onChange={(e) => setNewStationId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                >
                  <option value="">No specific station (Entire basin)</option>
                  {stations.map(st => (
                    <option key={st.id} value={st.id}>{st.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-sans font-bold tracking-widest text-on-surface-variant uppercase block">
                  Alert Title Headline
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Extreme Surge Discharge"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-sans font-bold tracking-widest text-on-surface-variant uppercase block">
                  Detailed Alert Description
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Actionable recommendation description..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 resize-none font-sans"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-sans text-xs font-bold uppercase tracking-wider rounded-xl transition-all border border-indigo-500/20 active:scale-95 cursor-pointer mt-2"
              >
                Dispatch Test Simulated Trigger
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
