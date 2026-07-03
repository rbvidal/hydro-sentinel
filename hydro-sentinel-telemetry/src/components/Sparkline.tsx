import { useMemo } from "react";

interface SparklineProps {
  data: number[];
  status: "Normal" | "Warning" | "Critical";
  width?: number;
  height?: number;
}

export default function Sparkline({ data, status, width = 180, height = 48 }: SparklineProps) {
  const points = useMemo(() => {
    if (!data || data.length === 0) return "";
    const max = Math.max(...data, 1);
    const min = Math.min(...data, 0);
    const range = max - min || 1;

    return data
      .map((val, index) => {
        const x = (index / (data.length - 1)) * width;
        // Invert Y because SVG coordinates start from top-left (0,0)
        const y = height - ((val - min) / range) * (height * 0.8) - 4;
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(" ");
  }, [data, width, height]);

  const lineColor = useMemo(() => {
    if (status === "Critical") return "#EF4444"; // Alert Red
    if (status === "Warning") return "#F59E0B";  // Warning Amber
    return "#3B82F6"; // Safe Blue / Primary Water Blue
  }, [status]);

  const glowId = useMemo(() => `glow-${status.toLowerCase()}`, [status]);

  // Create coordinates for the gradient underfill closed path
  const fillPoints = useMemo(() => {
    if (!points) return "";
    const firstPointX = "0.0";
    const lastPointX = width.toFixed(1);
    const bottomY = height.toFixed(1);
    return `${firstPointX},${bottomY} ${points} ${lastPointX},${bottomY}`;
  }, [points, width, height]);

  return (
    <div className="relative" style={{ width, height }}>
      <svg width={width} height={height} className="overflow-visible" aria-label="Sensor 24hr trend graph">
        <defs>
          {/* Subtle horizontal grid lines */}
          <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={lineColor} stopOpacity={0.25} />
            <stop offset="100%" stopColor={lineColor} stopOpacity={0.0} />
          </linearGradient>

          {/* Glow filter */}
          <filter id={glowId} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Dynamic Area Underfill */}
        {fillPoints && (
          <polygon
            points={fillPoints}
            fill="url(#areaGradient)"
            className="transition-all duration-500 ease-in-out"
          />
        )}

        {/* Dynamic Sparkline Path */}
        {points && (
          <polyline
            fill="none"
            stroke={lineColor}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={points}
            filter={`url(#${glowId})`}
            className="transition-all duration-500 ease-in-out"
          />
        )}

        {/* Pulsating End Node */}
        {data && data.length > 0 && (
          <circle
            cx={width}
            cy={(height - ((data[data.length - 1] - Math.min(...data, 0)) / (Math.max(...data, 1) - Math.min(...data, 0) || 1)) * (height * 0.8) - 4).toFixed(1)}
            r="3"
            fill={lineColor}
            className="animate-pulse"
          />
        )}
      </svg>
    </div>
  );
}
