/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Search, Filter, ShieldAlert, CheckCircle2, RefreshCw, Layers } from 'lucide-react';
import { SecurityAlert } from '../types';

interface AlertHistoryProps {
  alerts: SecurityAlert[];
  onResolveAlert: (id: string) => void;
  onRefresh: () => void;
}

export default function AlertHistory({ alerts, onResolveAlert, onRefresh }: AlertHistoryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Filter history based on inputs
  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch = 
      alert.stationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.id.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesSeverity = severityFilter === 'all' || alert.severity === severityFilter;
    const matchesStatus = statusFilter === 'all' || alert.status === statusFilter;
    
    return matchesSearch && matchesSeverity && matchesStatus;
  });

  return (
    <div className="p-4 md:p-8 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white mb-2">Vigilance Logs &amp; Incident Records</h2>
          <p className="text-xs text-on-surface-variant">
            Historic and ongoing incident records mapped across safety thresholds. All events represent direct alert responses.
          </p>
        </div>
        <button 
          onClick={onRefresh}
          className="flex items-center gap-2 px-4 py-2 bg-surface-container border border-outline-variant/35 hover:bg-surface-bright text-xs font-bold text-on-surface rounded-xl transition-all cursor-pointer shadow"
        >
          <RefreshCw size={14} className="hover:rotate-180 transition-transform duration-500" />
          <span>Refresh Incident Logs</span>
        </button>
      </div>

      {/* Interactive Logs Filtering & Search HUD */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-surface-container-low border border-outline-variant/20 rounded-xl">
        {/* Search */}
        <div className="md:col-span-2 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant" size={17} />
          <input 
            type="text"
            placeholder="Search by Station name, details, or alert ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-surface-container-highest border border-outline-variant/25 rounded-lg py-2.5 pl-10 pr-4 text-xs font-sans text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-secondary transition-all"
          />
        </div>

        {/* Severity filter */}
        <div className="relative">
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="w-full appearance-none bg-surface-container-highest border border-outline-variant/25 rounded-lg py-2.5 px-4 text-xs font-sans text-on-surface focus:outline-none focus:border-secondary cursor-pointer"
          >
            <option value="all">📁 All Severities</option>
            <option value="critical">🔴 Critical Alerts</option>
            <option value="high">🟠 High Urgency</option>
            <option value="medium">🟡 Medium State</option>
            <option value="low">🟡 Low Notification</option>
          </select>
        </div>

        {/* Status filter */}
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full appearance-none bg-surface-container-highest border border-outline-variant/25 rounded-lg py-2.5 px-4 text-xs font-sans text-on-surface focus:outline-none focus:border-secondary cursor-pointer"
          >
            <option value="all">📝 All Statuses</option>
            <option value="active">⚠️ Ongoing Active</option>
            <option value="resolved">✅ Resolved Tasks</option>
          </select>
        </div>
      </div>

      {/* Main Responsive Table Wrapper */}
      <div className="glass-card rounded-xl overflow-hidden border border-outline-variant/25">
        
        {/* Desktop Table - Hidden on Mobile */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left font-sans border-collapse">
            <thead>
              <tr className="bg-surface-container-high border-b border-outline-variant/35 text-[10px] uppercase tracking-wider font-extrabold text-on-surface-variant select-none">
                <th className="py-4 px-5">INCIDENT ID</th>
                <th className="py-4 px-5">STATION</th>
                <th className="py-4 px-5">TIMESTAMP</th>
                <th className="py-4 px-5">RECORDED LEVEL</th>
                <th className="py-4 px-5">SEVERITY</th>
                <th className="py-4 px-5">DESCRIPTION</th>
                <th className="py-4 px-5">STATUS</th>
                <th className="py-4 px-5 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/15 font-sans">
              {filteredAlerts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-xs text-on-surface-variant font-medium">
                    No matching alert incident records found in active database scope.
                  </td>
                </tr>
              ) : (
                filteredAlerts.map((alert) => {
                  const isActive = alert.status === 'active';
                  return (
                    <tr 
                      key={alert.id} 
                      className={`hover:bg-surface-bright/20 transition-all ${
                        isActive ? 'bg-red-950/5' : ''
                      }`}
                    >
                      {/* ID */}
                      <td className="py-4 px-5 font-mono text-xs text-on-surface-variant font-bold">
                        {alert.id}
                      </td>
                      
                      {/* Station */}
                      <td className="py-4 px-5 text-xs text-white font-bold">
                        {alert.stationName}
                      </td>
                      
                      {/* Timestamp */}
                      <td className="py-4 px-5 font-mono text-xs text-on-surface-variant">
                        {alert.timestamp}
                      </td>
                      
                      {/* Recorded levels */}
                      <td className="py-4 px-5 font-mono text-xs text-white">
                        <span className={isActive ? 'text-primary' : 'text-tertiary'}>
                          {alert.level.toFixed(2)}m
                        </span>
                        <span className="text-[10px] text-on-surface-variant/50 ml-1">
                          (Thresh: {alert.threshold.toFixed(2)}m)
                        </span>
                      </td>
                      
                      {/* Severity */}
                      <td className="py-4 px-5 text-xs">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                          alert.severity === 'critical' ? 'bg-red-500/10 text-primary-container border border-red-500/20' :
                          alert.severity === 'high' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' :
                          alert.severity === 'medium' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' :
                          'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                        }`}>
                          {alert.severity}
                        </span>
                      </td>
                      
                      {/* Detail details */}
                      <td className="py-4 px-5 text-xs text-on-surface/85 max-w-[200px] truncate" title={alert.details}>
                        {alert.details}
                      </td>
                      
                      {/* Status */}
                      <td className="py-4 px-5 text-xs">
                        <div className="flex items-center gap-1.5">
                          <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-primary-container animate-pulse' : 'bg-tertiary'}`} />
                          <span className={`${isActive ? 'text-primary font-bold' : 'text-tertiary'}`}>
                            {isActive ? 'Ongoing Active' : 'Resolved'}
                          </span>
                        </div>
                      </td>

                      {/* Action */}
                      <td className="py-4 px-5 text-right">
                        {isActive ? (
                          <button
                            onClick={() => onResolveAlert(alert.id)}
                            className="bg-stone-800 hover:bg-stone-750 text-tertiary px-3 py-1 border border-tertiary/30 rounded text-[10px] font-bold tracking-wider hover:border-tertiary transition-all cursor-pointer"
                          >
                            ACK &amp; RESOLVE
                          </button>
                        ) : (
                          <span className="text-on-surface-variant/40 text-[10px] font-bold tracking-wider uppercase select-none">
                            ARCHIVED
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile View Card List - Visible on small screens only */}
        <div className="block md:hidden divide-y divide-outline-variant/15 max-h-[600px] overflow-y-auto">
          {filteredAlerts.length === 0 ? (
            <div className="py-12 text-center text-xs text-on-surface-variant font-medium p-4">
              No matching alert incident records found.
            </div>
          ) : (
            filteredAlerts.map((alert) => {
              const isActive = alert.status === 'active';
              return (
                <div 
                  key={alert.id} 
                  className={`p-4 space-y-3 ${isActive ? 'bg-red-950/10' : 'bg-surface-container-low/40'}`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-mono text-[10px] text-on-surface-variant block uppercase font-bold text-secondary">
                        INCIDENT {alert.id}
                      </span>
                      <h4 className="font-bold text-white text-sm">{alert.stationName}</h4>
                    </div>
                    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                      alert.severity === 'critical' ? 'bg-red-500/15 text-primary-container' :
                      alert.severity === 'high' ? 'bg-orange-500/15 text-orange-400' :
                      'bg-blue-500/15 text-blue-400'
                    }`}>
                      {alert.severity}
                    </span>
                  </div>

                  <div className="text-xs space-y-1 bg-black/20 p-2.5 rounded-lg border border-outline-variant/15">
                    <div className="flex justify-between">
                      <span className="text-on-surface-variant">Timestamp:</span>
                      <span className="font-mono text-on-surface">{alert.timestamp}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-on-surface-variant">Physical level:</span>
                      <span className="font-mono text-white font-bold">{alert.level.toFixed(2)}m (Th: {alert.threshold}m)</span>
                    </div>
                    <p className="text-on-surface-variant mt-1.5 text-[11px] leading-relaxed border-t border-outline-variant/10 pt-1">
                      {alert.details}
                    </p>
                  </div>

                  <div className="flex justify-between items-center bg-surface-container p-2 rounded-lg border border-outline-variant/10">
                    <div className="flex items-center gap-1.5 text-xs">
                      <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-primary animate-pulse' : 'bg-tertiary'}`} />
                      <span className={isActive ? 'text-primary font-bold' : 'text-tertiary'}>
                        {isActive ? 'Ongoing Urgent alert' : 'Successfully Resolved'}
                      </span>
                    </div>
                    
                    {isActive ? (
                      <button
                        onClick={() => onResolveAlert(alert.id)}
                        className="bg-black hover:bg-stone-900 border border-tertiary/40 text-tertiary px-3 py-1.5 rounded text-[10px] font-bold tracking-wider cursor-pointer active:scale-95"
                      >
                        RESOLVE
                      </button>
                    ) : (
                      <span className="text-on-surface-variant/40 text-[9px] font-bold tracking-widest uppercase">
                        CLOSED
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
        
      </div>
    </div>
  );
}
