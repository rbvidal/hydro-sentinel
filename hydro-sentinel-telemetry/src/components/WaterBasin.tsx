import { motion } from "motion/react";
import { Waves, Sliders, AlertTriangle } from "lucide-react";

interface WaterBasinProps {
  currentLevel: number; // in meters (e.g. 0 to 12)
  maxCapacity: number; // peak allowed height (e.g. 10m)
  warningThreshold: number; // e.g. 7.5m
  criticalThreshold: number; // e.g. 9.5m
  spillwayGateOpen: number; // percentage (0 - 100%)
  setSpillwayGateOpen: (open: number) => void;
  dischargeRate: number; // m3/s
}

export default function WaterBasin({
  currentLevel,
  maxCapacity = 10,
  warningThreshold,
  criticalThreshold,
  spillwayGateOpen,
  setSpillwayGateOpen,
  dischargeRate,
}: WaterBasinProps) {
  // Convert current level to percentage of max capacity
  const levelPercentage = Math.min((currentLevel / maxCapacity) * 100, 100);

  // Determine current overall visual state
  const isCritical = currentLevel >= criticalThreshold;
  const isWarning = currentLevel >= warningThreshold && currentLevel < criticalThreshold;

  const statusColor = isCritical
    ? "text-red-400 border-red-500/30"
    : isWarning
      ? "text-amber-400 border-amber-500/30"
      : "text-blue-400 border-blue-500/30";

  return (
    <div id="water-basin-visualizer" className="bg-[#131b2e]/90 rounded-lg p-6 border border-white/10 backdrop-blur-md flex flex-col justify-between h-full">
      {/* Visual Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
        <div>
          <span className="text-[10px] text-gray-400 uppercase tracking-widest font-mono">Simulated Asset</span>
          <h3 className="text-sm font-semibold text-gray-200 uppercase tracking-wide">Primary Spillway Retention Reservoir</h3>
        </div>
        <div className={`flex items-center gap-2 px-2.5 py-1 rounded-full border bg-white/5 ${statusColor}`}>
          <Waves className={`w-4 h-4 ${isCritical ? "animate-bounce" : ""}`} />
          <span className="text-xs font-mono font-semibold">
            {isCritical ? "CRITICAL OUTFLOW" : isWarning ? "HIGH STORAGE" : "NORMAL NOMINAL"}
          </span>
        </div>
      </div>

      {/* Cross Section Schematic Container */}
      <div className="flex-1 min-h-[220px] relative bg-[#060e20] rounded border border-white/5 overflow-hidden flex flex-row">
        
        {/* Left Side: Water level bar markers */}
        <div className="w-14 flex flex-col justify-between items-end pr-2 py-3 border-r border-white/5 font-mono text-[10px] text-gray-500 select-none">
          <div className="flex items-center gap-1 text-red-400">
            <span>{maxCapacity}m</span>
            <div className="w-1.5 h-0.5 bg-red-400" />
          </div>
          <div className="flex items-center gap-1 text-red-500 font-semibold">
            <span>Crit: {criticalThreshold}m</span>
            <div className="w-2 h-0.5 bg-red-500" />
          </div>
          <div className="flex items-center gap-1 text-amber-500 font-semibold">
            <span>Warn: {warningThreshold}m</span>
            <div className="w-2 h-0.5 bg-amber-500" />
          </div>
          <div className="flex items-center gap-1 text-blue-400">
            <span>5.0m</span>
            <div className="w-1.5 h-0.5 bg-blue-500/50" />
          </div>
          <div className="flex items-center gap-1">
            <span>0.0m</span>
            <div className="w-1.5 h-0.5 bg-gray-500" />
          </div>
        </div>

        {/* Center Canvas: Visual Schematic of the Reservoir & Dam Wall */}
        <div className="flex-1 relative overflow-hidden">
          
          {/* Threshold alert lines overlay */}
          <div
            className="absolute left-0 right-0 border-t border-dashed border-red-500 z-20 pointer-events-none"
            style={{ bottom: `${(criticalThreshold / maxCapacity) * 100}%` }}
          >
            <div className="absolute right-2 -top-4 text-[9px] bg-red-950/90 text-red-400 border border-red-500/30 px-1.5 py-0.5 rounded font-mono flex items-center gap-1">
              <AlertTriangle className="w-2.5 h-2.5" /> CRITICAL EVACUATION LINE
            </div>
          </div>

          <div
            className="absolute left-0 right-0 border-t border-dashed border-amber-500/70 z-20 pointer-events-none"
            style={{ bottom: `${(warningThreshold / maxCapacity) * 100}%` }}
          >
            <div className="absolute left-2 -top-4 text-[9px] bg-amber-950/90 text-amber-400 border border-amber-500/30 px-1.5 py-0.5 rounded font-mono">
              SPILLWAY ACTION REQUIRED
            </div>
          </div>

          {/* Liquid Hydro Volume */}
          <motion.div
            id="fluid-fill"
            className="absolute bottom-0 left-0 right-14 bg-gradient-to-t from-blue-900/80 to-sky-500/60 z-10"
            animate={{ height: `${levelPercentage}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Liquid overlay surface wave simulation */}
            <div className="absolute -top-1.5 left-0 right-0 h-3 bg-sky-400/50 animate-pulse overflow-hidden rounded-t-full" />
            <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.03)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.03)_50%,rgba(255,255,255,0.03)_75%,transparent_75%,transparent)] bg-[length:20px_20px] opacity-40 animate-[water-slide_20s_linear_infinite]" />
          </motion.div>

          {/* Schematic Dam Block Wall representation on the right */}
          <div className="absolute right-0 top-0 bottom-0 w-14 bg-[#31394d] border-l border-white/10 z-15 flex flex-col justify-end">
            <div className="h-6 w-full bg-[#222a3d] border-b border-white/10 flex items-center justify-center">
              <span className="font-mono text-[8px] text-gray-400">CREST</span>
            </div>
            {/* Gate Area indicator */}
            <div className="h-16 w-full relative bg-[#060e20] border-y border-white/10 flex items-center justify-center">
              <div 
                className="absolute inset-x-0 bottom-0 bg-red-600/20 border-t border-red-500" 
                style={{ height: `${100 - spillwayGateOpen}%` }} 
              />
              <span className="z-10 font-mono text-[9px] text-[#adc6ff] text-center px-1 font-bold">
                GATE<br />{spillwayGateOpen}%
              </span>
            </div>
            <div className="h-16 w-full bg-[#131b2e] flex items-center justify-center">
              <span className="font-mono text-[8px] text-gray-400">ANCHOR</span>
            </div>
          </div>

          {/* Overlay: Current Depth Value Floating Indicator inside reservoir */}
          <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none select-none">
            <div className="bg-[#0b1326]/90 border border-white/10 p-2.5 rounded-lg text-center backdrop-blur-md">
              <p className="text-[10px] text-gray-400 font-mono tracking-wider">DEPTH TELEMETRY</p>
              <h4 className="text-xl font-bold text-[#dae2fd] font-mono leading-none mt-1">
                {currentLevel.toFixed(2)}m
              </h4>
              <p className="text-[9px] text-[#adc6ff] font-mono mt-0.5">
                {((currentLevel / maxCapacity) * 100).toFixed(0)}% Reservoir Capacity
              </p>
            </div>
          </div>

          {/* Discharge Flow Graphic: Shows high force streams if gate is open and level is high */}
          {spillwayGateOpen > 0 && levelPercentage > 20 && (
            <div className="absolute right-14 bottom-1/4 h-8 z-25 flex items-center pointer-events-none">
              <div className="w-16 h-4 bg-gradient-to-r from-cyan-400 to-sky-600/10 rounded-r opacity-80 animate-ping" />
              <div className="absolute left-0 w-12 h-2 bg-white rounded-r animate-pulse" />
            </div>
          )}
        </div>
      </div>

      {/* Interactive Controls & Discharge Summary */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-white/10 pt-4">
        {/* Spillway gate manipulator slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-gray-300 font-sans flex items-center gap-1.5 uppercase tracking-wide">
              <Sliders className="w-3.5 h-3.5 text-[#3B82F6]" /> Manual Spillway Gate Gate-01
            </label>
            <span className="text-xs font-mono font-semibold text-[#adc6ff]">
              {spillwayGateOpen}% Open
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono text-gray-500">CLOSED</span>
            <input
              id="spillway-gate-input"
              type="range"
              min="0"
              max="100"
              value={spillwayGateOpen}
              onChange={(e) => setSpillwayGateOpen(Number(e.target.value))}
              className="flex-1 h-1.5 bg-[#060e20] rounded-lg appearance-none cursor-pointer accent-[#3B82F6] border border-white/5 focus:outline-none focus:border-[#3B82F6]"
            />
            <span className="text-[10px] font-mono text-[#3B82F6]">100% FLOOD</span>
          </div>
        </div>

        {/* Output Metrics */}
        <div className="grid grid-cols-2 gap-2 bg-[#060e20]/80 p-2.5 rounded border border-white/5 font-mono">
          <div>
            <span className="text-[9px] text-gray-400 block uppercase">Outflow Vol</span>
            <span className="text-sm font-semibold text-[#adc6ff] block">{dischargeRate.toFixed(1)} m³/s</span>
          </div>
          <div>
            <span className="text-[9px] text-gray-400 block uppercase">Evacuation Risk</span>
            <span className={`text-sm font-bold block ${isCritical ? "text-red-400" : isWarning ? "text-amber-400" : "text-emerald-400"}`}>
              {isCritical ? "CRITICAL" : isWarning ? "ELEVATED" : "SAFE / LOW"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
