/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ShieldAlert, AlertTriangle, CloudLightning, X, Siren, Send } from 'lucide-react';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  stationsCount: number;
}

export default function EmergencyModal({ isOpen, onClose, stationsCount }: EmergencyModalProps) {
  if (!isOpen) return null;

  const handleBroadcast = () => {
    alert("ALERT: Emergency broad warning packets dispatched!\nCivil defense, cellular networks (SMS cell broadcasts), and local audio sirens across all river nodes are broadcasted.");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
      {/* Modal Card */}
      <div className="w-full max-w-xl bg-surface border-2 border-primary-container rounded-2xl overflow-hidden shadow-2xl shadow-red-500/10 animate-scaleUp">
        
        {/* Header warnings banner */}
        <div className="bg-primary-container p-5 text-on-primary-container flex justify-between items-start">
          <div className="flex gap-4 items-center">
            <div className="bg-white/20 p-2 rounded-lg text-white">
              <Siren className="animate-spin" size={24} />
            </div>
            <div>
              <h3 className="font-sans text-lg font-extrabold tracking-wide uppercase">Tactical Emergency Protocol</h3>
              <p className="text-xs text-on-primary-container/80 font-medium">AUTHORIZED OPERATORS ONLY • SECURE TERMINAL LINK</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded bg-black/10 hover:bg-black/20 text-on-primary-container transition-all cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content body */}
        <div className="p-6 space-y-6">
          <div className="flex gap-3 bg-red-500/10 border border-primary-container/30 px-3.5 py-3 rounded-lg text-primary text-xs font-sans leading-relaxed">
            <AlertTriangle className="text-primary shrink-0 mt-0.5" size={16} />
            <p>
              Entering this protocol authorizes manual override control of high-pressure sluice valves. It triggers local evacuation sirens and cellular carrier warnings in a <strong className="font-bold underline">5-kilometer exclusion zone</strong> surrounding the Waterfall Basin.
            </p>
          </div>

          {/* Sluice Checklist */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-white">Active System Checklists</h4>
            <div className="space-y-2 font-mono text-xs text-on-surface-variant">
              
              <div className="flex justify-between items-center bg-surface-container p-2.5 rounded border border-outline-variant/15">
                <span className="flex items-center gap-2 text-white">
                  <span className="w-2 h-2 rounded-full bg-primary-container animate-ping" />
                  1. Local Siren Horns
                </span>
                <span className="text-primary-container font-bold text-[10px] tracking-widest">READY TO BLOW</span>
              </div>

              <div className="flex justify-between items-center bg-surface-container p-2.5 rounded border border-outline-variant/15">
                <span className="flex items-center gap-2 text-white">
                  <span className="w-2 h-2 rounded-full bg-primary-container animate-ping" />
                  2. Civil Protection SMS System
                </span>
                <span className="text-primary-container font-bold text-[10px] tracking-widest">35,214 CELL TARGETS</span>
              </div>

              <div className="flex justify-between items-center bg-surface-container p-2.5 rounded border border-outline-variant/15">
                <span className="flex items-center gap-2 text-white">
                  <span className="w-2 h-2 rounded-full bg-tertiary" />
                  3. Valve Override Interlocks
                </span>
                <span className="text-tertiary font-bold text-[10px] tracking-widest">DISENGAGED (OPEN)</span>
              </div>
              
            </div>
          </div>

          {/* Action options */}
          <div className="grid grid-cols-2 gap-4">
            {/* Safe cancel */}
            <button
              onClick={onClose}
              className="py-3 px-4 bg-surface-bright hover:bg-surface-container-highest border border-outline-variant/30 text-xs font-bold uppercase tracking-wider text-on-surface rounded-xl transition-all cursor-pointer text-center"
            >
              SAFE RETURN
            </button>
            {/* Deploy Alerts */}
            <button
              onClick={handleBroadcast}
              className="py-3 px-4 bg-primary-container text-on-primary-container hover:opacity-95 text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-red-500/20 text-center cursor-pointer flex items-center justify-center gap-2"
            >
              <Send size={14} />
              <span>SOUND DISASTER SIRENS</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
