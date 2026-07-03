import { useState } from "react";
import { Map, Pin, Crosshair, HelpCircle } from "lucide-react";
import { TelemetrySensor } from "../types";

interface HydroMapProps {
  sensors: TelemetrySensor[];
  onSelectSensor: (sensorId: string) => void;
  selectedSensorId?: string;
}

export default function HydroMap({ sensors, onSelectSensor, selectedSensorId }: HydroMapProps) {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  // Map sensor names to pixel positions on our visual schematic SVG map
  const MapNodes = [
    { id: "sen-wl-01", x: 80, y: 55, name: "Reservoir Core Reservoir Level Gauge" },
    { id: "sen-wl-02", x: 190, y: 70, name: "Auxiliary Spillway Overflow Gauge" },
    { id: "sen-fr-01", x: 290, y: 110, name: "Main Outlet Dam Hydro-Gage" },
    { id: "sen-wq-01", x: 380, y: 165, name: "Downstream Basin Water Quality Monitor" },
    { id: "sen-pr-01", x: 150, y: 150, name: "Catchment Zone Precip-Sensor" },
  ];

  return (
    <div id="hydro-schematic-map" className="bg-[#131b2e]/90 rounded-lg p-6 border border-white/10 backdrop-blur-md flex flex-col justify-between h-full">
      {/* Schematic Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4 select-none">
        <div>
          <span className="text-[10px] text-gray-400 uppercase tracking-widest font-mono">Topographical HUD</span>
          <h3 className="text-sm font-semibold text-gray-200 uppercase tracking-wide flex items-center gap-1.5">
            <Map className="w-4 h-4 text-[#3B82F6]" /> Hydraulic Grid & Catchment Map
          </h3>
        </div>
        <div className="text-right font-mono text-[9px] text-[#adc6ff]">
          <span>SECON: W1 // ZONE 4</span>
        </div>
      </div>

      {/* SVG Canvas Map Box */}
      <div className="flex-1 min-h-[220px] bg-[#060e20] rounded border border-white/5 relative overflow-hidden">
        
        {/* Subtle grid lines as structural command center accents */}
        <div className="absolute inset-0 bg-[#060e20]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

        {/* Dynamic Vector schematic paths representing riverways and dam walls */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 460 220" preserveAspectRatio="none">
          <defs>
            <linearGradient id="riverGradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#1e3a8a" />
              <stop offset="50%" stopColor="#2563eb" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>
          </defs>

          {/* Core Basin outline / River Channel */}
          <path
            d="M 20,40 Q 120,50 160,80 T 260,110 T 360,150 T 440,180"
            fill="none"
            stroke="url(#riverGradient)"
            strokeWidth="24"
            opacity="0.25"
            strokeLinecap="round"
          />

          <path
            d="M 20,40 Q 120,50 160,80 T 260,110 T 360,150 T 440,180"
            fill="none"
            stroke="#3B82F6"
            strokeWidth="6"
            opacity="0.8"
            strokeLinecap="round"
          />

          {/* Dam Weir boundary line cross marker */}
          <line x1="220" y1="50" x2="220" y2="150" stroke="#ffb3ad" strokeWidth="4" strokeDasharray="3 3" opacity="0.6" />
          <text x="210" y="45" fill="#ffb3ad" fontSize="8" fontFamily="monospace" textAnchor="end">CONTROL BARRIER WEIR</text>

          {/* Flow Direction arrow indications */}
          <path d="M 120,55 L 128,51 L 128,59 Z" fill="#adc6ff" />
          <path d="M 330,138 L 338,134 L 338,142 Z" fill="#adc6ff" />
        </svg>

        {/* Loop and plot interactive physical sensor beacons */}
        {MapNodes.map((node) => {
          const associatedSensor = sensors.find((s) => s.id === node.id);
          if (!associatedSensor) return null;

          const isSelected = selectedSensorId === node.id;
          const status = associatedSensor.status;

          // Compute color codes for health lights
          const pulseColor =
            status === "Critical"
              ? "bg-[#EF4444]"
              : status === "Warning"
                ? "bg-[#F59E0B]"
                : "bg-[#10B981]";

          const ringColor =
            status === "Critical"
              ? "border-[#EF4444]"
              : status === "Warning"
                ? "border-[#F59E0B]"
                : "border-[#10B981]";

          return (
            <div
              key={node.id}
              className="absolute pointer-events-auto"
              style={{
                left: `${(node.x / 460) * 100}%`,
                top: `${(node.y / 220) * 100}%`,
                transform: "translate(-50%, -50%)",
              }}
            >
              {/* Core interactive beacon container */}
              <button
                id={`beacon-${node.id}`}
                onClick={() => onSelectSensor(node.id)}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
                className="relative group focus:outline-none flex items-center justify-center cursor-pointer"
                aria-label={`Select ${associatedSensor.name}`}
              >
                {/* Expand indicator when selected */}
                {isSelected && (
                  <span className="absolute -inset-4 border border-cyan-400 rounded-full animate-spin [animation-duration:8s] pointer-events-none" />
                )}

                {/* Ring wave pulsator */}
                <span className={`absolute inline-flex h-8 w-8 rounded-full opacity-60 animate-ping ${
                  status === "Critical" ? "bg-red-500/30" : status === "Warning" ? "bg-amber-500/30" : "bg-emerald-500/30"
                }`} />

                {/* Physical solid node button */}
                <div
                  className={`w-4.5 h-4.5 rounded-full border-2 flex items-center justify-center bg-[#0b1326] transition-all shadow-md ${
                    isSelected ? "border-cyan-400 scale-120" : ringColor
                  }`}
                >
                  <div className={`w-2.5 h-2.5 rounded-full ${pulseColor}`} />
                </div>

                {/* Floating tooltip popover standard or hovered */}
                {(hoveredNode === node.id || isSelected) && (
                  <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-[#0b1326] border border-white/10 p-2 rounded shadow-2xl z-25 min-w-[130px] pointer-events-none select-none text-[10px] font-mono whitespace-nowrap">
                    <p className="text-gray-400 uppercase tracking-widest text-[8px]">
                      {associatedSensor.name}
                    </p>
                    <p className="text-xs font-bold text-gray-200 mt-1">
                      {associatedSensor.value.toFixed(2)} {associatedSensor.unit}
                    </p>
                    <p className={`text-[8px] font-bold ${
                      status === "Critical" ? "text-red-400" : status === "Warning" ? "text-amber-400" : "text-emerald-400"
                    }`}>
                      STATUS: {status.toUpperCase()}
                    </p>
                  </div>
                )}
              </button>
            </div>
          );
        })}

        {/* North compass indicator */}
        <div className="absolute top-3 left-3 bg-[#0b1326]/80 p-2.5 rounded border border-white/5 font-mono text-[9px] text-gray-400 text-center flex flex-col items-center pointer-events-none select-none">
          <Crosshair className="w-4 h-4 text-[#3B82F6] mb-0.5 animate-spin [animation-duration:12s]" />
          <span>GRID N</span>
        </div>
      </div>

      {/* Map Legend */}
      <div className="mt-3 grid grid-cols-3 text-[10px] font-mono border-t border-white/10 pt-3 select-none">
        <div className="flex items-center gap-1.5 text-emerald-400">
          <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] inline-block" />
          <span>Nominal Base level</span>
        </div>
        <div className="flex items-center gap-1.5 text-amber-400">
          <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B] inline-block" />
          <span>Surplus flow threshold</span>
        </div>
        <div className="flex items-center gap-1.5 text-red-400">
          <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444] inline-block" />
          <span>Surcharge flood stage</span>
        </div>
      </div>
    </div>
  );
}
