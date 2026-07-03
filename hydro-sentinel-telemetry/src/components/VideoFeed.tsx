import { useState, useEffect } from "react";
import { Camera, RefreshCw, Radio, Settings, ShieldAlert } from "lucide-react";

interface CameraConfig {
  id: string;
  name: string;
  location: string;
  type: "optical" | "thermal" | "infrared";
  coords: string;
}

const CAMERAS: CameraConfig[] = [
  { id: "cam-spillway", name: "SPILLWAY GATES G1-G4", location: "Upper Reservoir Dam", type: "optical", coords: "N54.128 - W114.502" },
  { id: "cam-outlet", name: "DOWNSTREAM COFFERDAM OUTLET", location: "Primary Spillway Mouth", type: "thermal", coords: "N54.135 - W114.498" },
  { id: "cam-aux", name: "AUXILIARY DISCHARGE RECTIFIER", location: "Surcharge Embankment", type: "infrared", coords: "N54.121 - W114.515" },
];

export default function VideoFeed() {
  const [selectedCam, setSelectedCam] = useState<CameraConfig>(CAMERAS[0]);
  const [timestamp, setTimestamp] = useState<string>("");
  const [staticNoise, setStaticNoise] = useState<boolean>(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimestamp(now.toLocaleTimeString() + " - " + now.toLocaleDateString());
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Trigger slight static distortion occasionally to enhance realism
  useEffect(() => {
    const noiseInterval = setInterval(() => {
      setStaticNoise(true);
      setTimeout(() => setStaticNoise(false), 250);
    }, 6000);
    return () => clearInterval(noiseInterval);
  }, []);

  return (
    <div id="video-feed-container" className="bg-black rounded-lg p-5 border border-[#3B82F6] flex flex-col justify-between h-full relative overflow-hidden">
      
      {/* Feed Title Bar */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3 z-10">
        <div className="flex items-center gap-2">
          <Camera className="w-4 h-4 text-[#3B82F6] animate-pulse" />
          <span className="text-[10px] font-bold text-gray-400 font-sans tracking-widest uppercase">HD OPTICAL & INFRARED TELECONVERSE</span>
        </div>
        
        {/* Pulsating LIVE tag */}
        <div className="flex items-center gap-1.5 bg-red-950/80 border border-red-500/30 px-2 py-0.5 rounded-full">
          <span className="w-1.5 h-1.5 bg-[#EF4444] rounded-full animate-ping" />
          <span className="text-[10px] font-bold tracking-widest text-[#EF4444] font-mono uppercase">LIVE feed</span>
        </div>
      </div>

      {/* Camera Selector Tabs */}
      <div className="grid grid-cols-3 gap-1 mb-3 z-10">
        {CAMERAS.map((cam) => (
          <button
            key={cam.id}
            id={`btn-${cam.id}`}
            onClick={() => {
              setSelectedCam(cam);
              setStaticNoise(true);
              setTimeout(() => setStaticNoise(false), 200);
            }}
            className={`py-1.5 px-2 text-[10px] font-mono rounded border transition-all truncate text-left flex flex-col gap-0.5 ${
              selectedCam.id === cam.id
                ? "bg-[#3B82F6]/20 text-[#adc6ff] border-[#3B82F6]"
                : "bg-[#131b2e]/50 text-gray-400 border-white/5 hover:border-gray-500"
            }`}
          >
            <span className="font-bold block tracking-wider truncate">{cam.name}</span>
            <span className="text-[8px] text-gray-500 truncate block">{cam.type.toUpperCase()}</span>
          </button>
        ))}
      </div>

      {/* Main Screen Feed Frame */}
      <div className="flex-1 min-h-[200px] bg-neutral-950 rounded border border-white/5 relative overflow-hidden flex flex-col justify-between p-4 font-mono text-[9px] text-[#adc6ff]">
        
        {/* Optical Simulation Filter Backgrounds */}
        {selectedCam.type === "thermal" && (
          <div className="absolute inset-0 bg-gradient-to-tr from-purple-950/80 via-amber-950/70 to-red-950/70 opacity-90 mix-blend-color" />
        )}
        {selectedCam.type === "infrared" && (
          <div className="absolute inset-0 bg-emerald-950/40 opacity-90 mix-blend-color" />
        )}

        {/* Dynamic Static HUD Overlay */}
        <div className="absolute inset-0 bg-[#060e20]/20 pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] z-15 opacity-30 pointer-events-none" />

        {/* Static Noise Overlay */}
        {staticNoise && (
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] opacity-20 z-20 pointer-events-none animate-[ping_0.1s_infinite]" />
        )}

        {/* Top HUD Row */}
        <div className="flex justify-between z-10 select-none">
          <div>
            <p className="font-bold text-gray-300 uppercase tracking-widest">{selectedCam.name}</p>
            <p className="text-gray-500 mt-0.5">{selectedCam.coords}</p>
          </div>
          <div className="text-right">
            <p className="text-[#3B82F6] font-bold">REC ● [{selectedCam.type.toUpperCase()}]</p>
            <p className="text-gray-500 mt-0.5">FPS: 30.00 / BUFFER 100%</p>
          </div>
        </div>

        {/* Center crosshair and visual graphics */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 select-none">
          <div className="relative w-16 h-16 border border-white/20 rounded-full flex items-center justify-center">
            {/* Center cross */}
            <div className="w-4 h-0.5 bg-white/40 absolute" />
            <div className="h-4 w-0.5 bg-white/40 absolute" />
            <div className="absolute -top-3 text-[8px] text-gray-500">A_ZOOM X1.0</div>
          </div>
        </div>

        {/* Downstream Simulated Action Video Animation placeholders based on feed type */}
        <div className="absolute inset-0 z-5 flex items-end justify-center pb-8 opacity-30 pointer-events-none">
          {selectedCam.id === "cam-spillway" ? (
            <div className="w-11/12 h-1/2 bg-gradient-to-t from-sky-400/20 to-transparent blur-md rounded-t-full scale-y-75 animate-pulse" />
          ) : selectedCam.id === "cam-outlet" ? (
            <div className="flex gap-4 items-end">
              <div className="w-12 h-20 bg-[#EF4444]/20 blur-md rounded-full animate-bounce" />
              <div className="w-12 h-16 bg-[#F59E0B]/20 blur-md rounded-full animate-ping" />
            </div>
          ) : (
            <div className="w-full h-1/3 border-t border-[#10B981]/20 bg-[#10B981]/5 animate-pulse" />
          )}
        </div>

        {/* Bottom HUD Row */}
        <div className="flex justify-between items-end z-10 select-none border-t border-white/5 pt-2 mt-auto">
          <div>
            <span className="text-gray-400 block tracking-widest uppercase text-[8px]">Current Location</span>
            <span className="text-gray-200 text-[10px] block font-sans tracking-wide font-medium">{selectedCam.location}</span>
          </div>
          <div className="text-right text-gray-400 font-mono text-[9px]">
            {timestamp}
          </div>
        </div>
      </div>

      {/* Feed diagnostic report controls */}
      <div className="mt-3 flex items-center justify-between text-[10px] font-mono border-t border-white/10 pt-3 z-10 select-none">
        <div className="flex items-center gap-1.5 text-[#adc6ff]">
          <Radio className="w-3.5 h-3.5 animate-pulse text-[#3B82F6]" />
          <span>FREQ: 433.92 MHz RF COMM</span>
        </div>
        <button
          id="btn-force-refresh-cam"
          onClick={() => {
            setStaticNoise(true);
            setTimeout(() => setStaticNoise(false), 400);
          }}
          className="text-gray-400 hover:text-white transition flex items-center gap-1 border border-white/10 rounded px-2 py-0.5 bg-white/5 cursor-pointer"
        >
          <RefreshCw className="w-2.5 h-2.5" /> Recalibrate Sensor Optical Feed
        </button>
      </div>
    </div>
  );
}
