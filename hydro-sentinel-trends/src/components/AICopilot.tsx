import React, { useState } from 'react';
import { 
  Bot, 
  Send, 
  Eye, 
  Sparkles, 
  CheckCircle, 
  AlertTriangle, 
  X, 
  TrendingUp, 
  ShieldAlert,
  Loader2
} from 'lucide-react';
import { Station, SimulationProfile } from '../types';

interface AICopilotProps {
  stations: Station[];
  simulationProfile: SimulationProfile;
  rainLevel: number;
}

export default function AICopilot({
  stations,
  simulationProfile,
  rainLevel,
}: AICopilotProps) {
  const [messages, setMessages] = useState<Array<{ sender: 'ai' | 'user'; text: string; date: string }>>([
    {
      sender: 'ai',
      text: "👋 Active Hydro-Sentinel Predictive AI service initialized. I am continuously assessing sensor array drifts and weather anomalies to issue hydraulic forecasts. How can I assist with your emergency management dispatch or bypass planning?",
      date: "Just Now"
    }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [loading, setLoading] = useState(false);

  // Dynamic risk calculation based on current simulated levels
  const highStatusStations = stations.filter(s => s.level > 4.8);
  const riskIndex = highStatusStations.length * 30 + (rainLevel > 30 ? 40 : rainLevel > 15 ? 20 : 5);
  const computedRisk = Math.min(riskIndex, 100);

  const determineStatus = () => {
    if (computedRisk > 70) return { label: 'CRITICAL SHORE BREACH THREAT', color: 'text-red-400 bg-red-950/20 border-red-500/20' };
    if (computedRisk > 40) return { label: 'ELEVATED RUNOFF THREAT', color: 'text-amber-400 bg-amber-950/20 border-amber-500/20' };
    return { label: 'STABLE CATCHMENT LEVEL', color: 'text-emerald-400 bg-emerald-500/5 border-emerald-500/10' };
  };

  const statusObj = determineStatus();

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim() || loading) return;

    const userMsg = inputVal.trim();
    setMessages(prev => [...prev, { sender: 'user', text: userMsg, date: "Just Now" }]);
    setInputVal('');
    setLoading(true);

    // Simulate standard professional hydraulic analyzer reply
    setTimeout(() => {
      let aiResponse = "";
      const lowerQuery = userMsg.toLowerCase();

      if (lowerQuery.includes('status') || lowerQuery.includes('river') || lowerQuery.includes('level')) {
        aiResponse = `📊 [HYDRAULIC AUDIT]: Currently reading level variations across the 5 upstream sectors. Peak levels registered at 3KM Gauge (${stations.find(s => s.id === '3km')?.level.toFixed(2)}m). Model projects +${(rainLevel * 0.015).toFixed(3)}m/hr accumulation if precipitation remains at ${rainLevel.toFixed(1)}mm/hr.`;
      } else if (lowerQuery.includes('gate') || lowerQuery.includes('release') || lowerQuery.includes('spillway')) {
        aiResponse = "🌊 [SPILLWAY GATE DIRECTIVE]: Under active surges, reservoir release gates should be opened sequentially. Adjusting physical gates to 40% will discharge enough cubic volume (approx 1.8M³/S) to reduce the 3KM point crest back below critical warning indices in about 45 minutes.";
      } else if (lowerQuery.includes('evacuate') || lowerQuery.includes('sector') || lowerQuery.includes('rescue')) {
        aiResponse = "🚨 [DISPATCH RECONNAISSANCE]: In accordance with emergency protocols, Sector B or sites adjacent to 3KM and 2KM with structural hazard levels configured to 'CRITICAL' must activate evacuation route strobe lines and deploy the specialized sandbags squads immediately.";
      } else {
        aiResponse = `🧠 [HYDRAULIC PREDICTION MODEL]: Environmental profile detected: '${simulationProfile.replace('-', ' ').toUpperCase()}'. Current cumulative risk factor is ${computedRisk}%. Ultrasonic transreceiver telemetry is nominal. Recommendations: (1) Maintain bypass canal monitoring, (2) Keep emergency teams on immediate rescue standby.`;
      }

      setMessages(prev => [...prev, { sender: 'ai', text: aiResponse, date: "Just Now" }]);
      setLoading(false);
    }, 900);
  };

  return (
    <div className="glass-card rounded-xl p-5 bg-slate-900/60 border border-indigo-500/20 flex flex-col h-[520px]">
      
      {/* Copilot Header */}
      <div className="flex justify-between items-center pb-3 border-b border-slate-800/80 shrink-0">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-indigo-600 rounded-lg">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-sans font-extrabold text-white text-xs uppercase tracking-wider">
              Hydro-Sentinel Vigilant AI Assistant
            </h3>
            <p className="text-[10px] text-on-surface-variant/80 font-sans">
              Continuous predictive runoff forecasting and spillway advising agent
            </p>
          </div>
        </div>

        {/* Live danger pill */}
        <span className={`px-2.5 py-0.5 rounded text-[9px] font-sans font-bold uppercase tracking-wider border ${statusObj.color}`}>
          {statusObj.label} ({computedRisk}%)
        </span>
      </div>

      {/* Messages Scrollbox */}
      <div className="flex-1 overflow-y-auto py-4 space-y-3 px-1">
        {messages.map((m, idx) => (
          <div 
            key={idx} 
            className={`flex flex-col max-w-[85%] ${
              m.sender === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'
            }`}
          >
            <div className={`p-3.5 rounded-xl text-xs font-sans leading-relaxed ${
              m.sender === 'user'
                ? 'bg-indigo-600 text-white rounded-br-none shadow-md border border-indigo-500/30'
                : 'bg-slate-950 border border-slate-800/80 text-on-surface-variant/95 rounded-bl-none shadow-inner'
            }`}>
              {m.text}
            </div>
            <span className="text-[8px] font-mono text-on-surface-variant/40 uppercase mt-1 tracking-wider px-1">
              {m.sender === 'user' ? 'Operator' : 'Predictive System AI'} • {m.date}
            </span>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 mr-auto bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-on-surface-variant/80 max-w-[80%] font-sans">
            <Loader2 className="h-4 w-4 animate-spin text-indigo-400" />
            Analyzing telemetry drift indices...
          </div>
        )}
      </div>

      {/* Chat bottom entry form */}
      <form onSubmit={handleSendMessage} className="pt-3 border-t border-slate-800 shrink-0 flex gap-2">
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder="Ask AI Copilot for water prognosis, release gate advises..."
          className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-on-surface-variant/50 focus:border-indigo-500 focus:outline-none"
        />
        <button
          type="submit"
          disabled={!inputVal.trim() || loading}
          className="cursor-pointer p-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-all border border-indigo-500/20 active:scale-95 disabled:opacity-40 disabled:scale-100"
        >
          <Send className="h-4.5 w-4.5" />
        </button>
      </form>

      <div className="text-[9px] text-on-surface-variant/45 mt-2 text-center uppercase tracking-wider font-mono">
        🤖 AI predictions are configured with Google Gemini backend capability thresholds.
      </div>

    </div>
  );
}
