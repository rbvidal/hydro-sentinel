import { useState } from 'react';
import { CloudRain } from 'lucide-react';

const hoverPercentages = Array.from({ length: 11 }, (_, i) => (i / 10) * 100);

/** Precipitation bar heights (percentage) for 10 hourly slots. */
const PRECIP_BARS = [
  { h: 20, mm: 1.2 },
  { h: 25, mm: 2.4 },
  { h: 45, mm: 4.5 },
  { h: 70, mm: 7.2 },
  { h: 85, mm: 9.5 },
  { h: 100, mm: 12.0 },
  { h: 75, mm: 8.4 },
  { h: 50, mm: 5.1 },
  { h: 30, mm: 3.0 },
  { h: 15, mm: 0.8 },
];

export default function HistoricalTrends() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <div className="space-y-4">
      <h3 className="font-sans font-bold text-xs text-on-surface-variant tracking-wider uppercase px-1">
        24-Hour Historical Hydrology & Precipitation Trends
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* River Level Trend (multi-line SVG) */}
        <div className="lg:col-span-2 glass-card rounded-xl p-6 flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
            <div>
              <p className="font-sans font-bold text-[10px] text-on-surface-variant tracking-widest uppercase">
                River Hydrological Level Trend (Meters)
              </p>
              <p className="text-[11px] text-on-surface-variant/70">
                Continuous multi-gauge readings mapped across 24h timeline
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <span className="text-[10px] font-sans font-bold tracking-wider text-on-surface-variant/80">
                  3KM Station
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <span className="text-[10px] font-sans font-bold tracking-wider text-on-surface-variant/80">
                  5KM Station
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
                <span className="text-[10px] font-sans font-bold tracking-wider text-on-surface-variant/80">
                  Basin Avg
                </span>
              </div>
            </div>
          </div>

          {/* SVG Chart */}
          <div className="h-48 w-full relative group/plotter border border-slate-800/40 rounded-lg p-2 bg-slate-950/30">
            <svg
              className="w-full h-full"
              preserveAspectRatio="none"
              viewBox="0 0 400 100"
            >
              {/* Threshold lines */}
              <line x1="0" x2="400" y1="20" y2="20" stroke="#f43f5e" strokeWidth="1" strokeDasharray="3 3" opacity="0.3" />
              <line x1="0" x2="400" y1="45" y2="45" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3 3" opacity="0.3" />
              <line x1="0" x2="400" y1="70" y2="70" stroke="#fbbf24" strokeWidth="1" strokeDasharray="3 3" opacity="0.3" />

              {/* Grid lines */}
              {[10, 35, 60, 85].map((y) => (
                <line key={y} x1="0" x2="400" y1={y} y2={y} stroke="#334155" strokeWidth="0.5" opacity="0.15" />
              ))}

              {/* 5KM path (emerald, stable) */}
              <path
                className="stroke-emerald-400"
                d="M0,80 L40,75 L80,78 L120,70 L160,65 L200,68 L240,60 L280,55 L320,58 L360,51 L400,47"
                fill="none" strokeWidth="2"
              />

              {/* 3KM path (red, rising) */}
              <path
                className="stroke-red-400"
                d="M0,60 L40,62 L80,55 L120,58 L160,50 L200,45 L240,48 L280,35 L320,29 L360,22 L400,12"
                fill="none" strokeWidth="2.5"
              />

              {/* Basin Average path (sky, dashed) */}
              <path
                className="stroke-sky-400"
                d="M0,85 L40,81 L80,84 L120,85 L160,82 L200,80 L240,81 L280,78 L320,79 L360,76 L400,75"
                fill="none" strokeWidth="1.5" strokeDasharray="1 1"
              />

              {/* Hover bars */}
              {hoverPercentages.map((pct, idx) => (
                <line
                  key={idx}
                  x1={`${pct}%`} x2={`${pct}%`} y1="0" y2="100"
                  stroke="#818cf8" strokeWidth="1.5"
                  opacity={hoveredIdx === idx ? 0.4 : 0}
                  className="transition-opacity"
                />
              ))}
            </svg>

            {/* Hover targets */}
            <div className="absolute inset-0 flex">
              {hoverPercentages.map((_, idx) => (
                <div
                  key={idx}
                  className="flex-1 cursor-crosshair"
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                />
              ))}
            </div>

            {/* Stage labels */}
            <div className="absolute right-3 top-2 h-full flex flex-col justify-between pointer-events-none select-none text-right">
              <span className="text-[8px] font-bold text-red-500/80 tracking-wider">FLOOD STAGE</span>
              <span className="text-[8px] font-bold text-amber-500/80 tracking-wider">WARNING</span>
              <span className="text-[8px] font-bold text-yellow-400/80 tracking-wider">ADVISORY</span>
            </div>

            {/* Hover tooltip */}
            {hoveredIdx !== null && (
              <div className="absolute top-2 left-3 bg-slate-900/90 border border-indigo-500/50 rounded-lg p-2 flex gap-3 text-[10px] font-mono shadow-2xl backdrop-blur-md">
                <div>
                  <span className="text-white/50">TIME:</span>{' '}
                  <span className="text-indigo-300 font-bold">
                    -{24 - Math.round(hoveredIdx * 2.4)}H UTC
                  </span>
                </div>
                <div>
                  <span className="text-red-400">3KM:</span>{' '}
                  <span className="text-white font-bold">
                    {(5.14 - (10 - hoveredIdx) * 0.08).toFixed(2)}m
                  </span>
                </div>
                <div>
                  <span className="text-emerald-400">5KM:</span>{' '}
                  <span className="text-white font-bold">
                    {(4.53 - (10 - hoveredIdx) * 0.03).toFixed(2)}m
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* X-axis labels */}
          <div className="flex justify-between px-1 text-[10px] font-sans font-bold text-on-surface-variant/40">
            <span>24 HOURS AGO</span>
            <span>12 HOURS AGO</span>
            <span>NOW</span>
          </div>
        </div>

        {/* Precipitation Log */}
        <div className="glass-card rounded-xl p-6 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-sans font-bold text-[10px] text-on-surface-variant tracking-widest uppercase">
                Precipitation Log (MM)
              </p>
              <p className="text-[11px] text-on-surface-variant/70">
                Accumulated volume mapped by hour
              </p>
            </div>
            <CloudRain className="text-sky-400 h-5 w-5" />
          </div>

          {/* Bar chart */}
          <div className="h-48 w-full relative flex items-end gap-1 px-1 py-2 bg-slate-950/20 rounded-lg border border-slate-800/30">
            {PRECIP_BARS.map((bar, i) => (
              <div
                key={i}
                className="flex-1 bg-sky-500/60 hover:bg-sky-500/85 transition-colors rounded-t-sm group relative cursor-pointer"
                style={{ height: `${bar.h}%` }}
              >
                <span className="absolute bottom-full left-1/2 -translate-x-1/2 bg-slate-900 text-white rounded text-[8px] p-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {bar.mm}mm
                </span>
              </div>
            ))}
          </div>

          <p className="text-center font-sans font-bold text-[10px] text-on-surface-variant/40 uppercase tracking-widest">
            Accumulated Hourly Volume Logs
          </p>
        </div>
      </div>
    </div>
  );
}
