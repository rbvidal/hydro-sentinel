import React, { useRef, useEffect } from 'react';
import { resolveCameraUrl, CAMERA_CONFIG } from '../config/cameraConfig';

interface CameraFeedProps {
  stationId: string;
  distance: string;
  isAlert?: boolean;
  expanded?: boolean;
}

export default function CameraFeed({
  stationId,
  distance,
  isAlert,
  expanded,
}: CameraFeedProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const prevAlertRef = useRef(false);
  const alertIndexRef = useRef(0);

  // When transitioning into alert state, lock in a random variant index.
  if (isAlert && !prevAlertRef.current) {
    const entry = CAMERA_CONFIG[stationId];
    if (entry?.alert && Array.isArray(entry.alert)) {
      alertIndexRef.current = Math.floor(Math.random() * entry.alert.length);
    } else {
      alertIndexRef.current = 0;
    }
  }
  prevAlertRef.current = isAlert ?? false;

  const src = resolveCameraUrl(stationId, isAlert ?? false, alertIndexRef.current);
  const isBasin = stationId === 'st-5km';

  useEffect(() => {
    const el = videoRef.current;
    if (el && src) {
      el.load();
      el.play().catch(() => {});
    }
  }, [src]);

  return (
    <div
      className={`relative overflow-hidden bg-black ${
        expanded ? 'h-[70vh]' : 'h-40'
      }`}
    >
      <video
        ref={videoRef}
        key={src}
        autoPlay
        loop
        muted
        playsInline
        src={src}
        className="w-full h-full object-cover"
      />

      {/* Scan line overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)',
        }}
      />

      {/* LIVE / ALERT badge */}
      <div
        className={`absolute top-3 right-3 flex items-center gap-1.5 px-2 py-1 rounded backdrop-blur z-10 ${
          isAlert ? 'bg-primary-container' : 'bg-black/70'
        }`}
      >
        <span
          className={`w-2 h-2 rounded-full ${
            isAlert ? 'bg-white animate-pulse' : 'bg-green-400 animate-live'
          }`}
        />
        <span
          className={`font-mono text-[9px] font-extrabold tracking-widest ${
            isAlert ? 'text-on-primary-container' : 'text-white'
          }`}
        >
          {isAlert ? 'ALERT' : 'LIVE'}
        </span>
      </div>

      {/* REC indicator */}
      <div className="absolute top-3 left-3 flex items-center gap-2 z-10">
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          <span className="font-mono text-[8px] text-red-400 font-bold tracking-wider">
            REC
          </span>
        </span>
      </div>

      {/* Distance marker */}
      <div className="absolute bottom-3 left-3 z-10">
        <span className="font-mono text-[9px] font-bold tracking-widest uppercase px-1.5 py-0.5 rounded bg-black/50 text-white/80">
          {isBasin ? 'BASIN VIEW' : `RIVER SEG ${distance}`}
        </span>
      </div>
    </div>
  );
}
