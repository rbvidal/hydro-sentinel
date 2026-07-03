/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Terminal, 
  Code, 
  Globe, 
  Check, 
  Copy, 
  Send, 
  Link, 
  Coffee,
  HelpCircle,
  Activity,
  RefreshCw
} from 'lucide-react';
import { IntegrationConfig } from '../types';

interface SettingsPanelProps {
  config: IntegrationConfig;
  onUpdateConfig: (newConfig: IntegrationConfig) => void;
}

export default function SettingsPanel({ config, onUpdateConfig }: SettingsPanelProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [testEndpoint, setTestEndpoint] = useState<'getStations' | 'flushGate' | 'resolveAlert'>('getStations');
  const [testResult, setTestResult] = useState<any | null>(null);
  const [testLoading, setTestLoading] = useState(false);
  const [testLatency, setTestLatency] = useState<number | null>(null);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleToggleMode = (useJava: boolean) => {
    onUpdateConfig({
      ...config,
      useJavaApi: useJava
    });
  };

  const handleUrlChange = (url: string) => {
    onUpdateConfig({
      ...config,
      javaBaseUrl: url
    });
  };

  // Run simulated REST Client test call
  const runTestCall = () => {
    setTestLoading(true);
    setTestResult(null);
    const start = performance.now();

    setTimeout(() => {
      const end = performance.now();
      setTestLatency(Math.round(end - start));
      setTestLoading(false);

      if (testEndpoint === 'getStations') {
        setTestResult({
          status: 200,
          statusText: "OK",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Server": "Tomcat/10.1 (Spring Boot 3.2.5)"
          },
          body: [
            { id: "st-5km", name: "Station 5KM", level: 4.52, rateOfChange: 0.05, status: "normal" },
            { id: "st-3km", name: "Station 3KM", level: 5.12, rateOfChange: 0.12, status: "alert" }
          ]
        });
      } else if (testEndpoint === 'flushGate') {
        setTestResult({
          status: 202,
          statusText: "Accepted",
          headers: {
            "Content-Type": "application/json"
          },
          body: {
            transactionId: "tx-f9103a-cce",
            stationId: "st-3km",
            operatorId: "control-node-01",
            gatePosition: "OPEN_FULLY",
            simulatedFlushDelta: -0.85,
            timestamp: new Date().toISOString()
          }
        });
      } else {
        setTestResult({
          status: 200,
          statusText: "OK",
          headers: {
            "Content-Type": "application/json"
          },
          body: {
            message: "Incident successfully acknowledged and cleared in central Spring catalog.",
            clearedAlertId: "al-9102",
            timestamp: new Date().toISOString()
          }
        });
      }
    }, 800);
  };

  // Pre-configured elegant code snippets mapping to standard Spring RestControllers
  const codeSnippets = {
    getStations: {
      java: `package com.hydrosentinel.controller;

import com.hydrosentinel.model.Station;
import com.hydrosentinel.service.MonitoringService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*") // Allow React client communication
public class MonitoringController {

    private final MonitoringService service;

    public MonitoringController(MonitoringService service) {
        this.service = service;
    }

    @GetMapping("/stations")
    public List<Station> getLiveReadings() {
        return service.retrieveAllActiveStations();
    }
}`,
      js: `/**
 * Fetches current water levels and rates of change for all stations
 * @param {string} baseUrl - Spring Boot Host Address
 */
async function fetchStationMetrics(baseUrl) {
  try {
    const response = await fetch(\`\${baseUrl}/stations\`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(\`HTTP error! status: \${response.status}\`);
    }
    
    const data = await response.json();
    console.log('Successfully loaded Java telemetry:', data);
    return data;
  } catch (error) {
    console.error('Failed fetching data from Java REST endpoints:', error);
    throw error;
  }
}`
    },
    flushGate: {
      java: `@PutMapping("/stations/{id}/flush")
public ResponseEntity<FlushResponse> triggerFlushGate(
        @PathVariable String id,
        @RequestParam(defaultValue = "0.5") double targetDelta) {
        
    FlushResponse result = service.executeHydraulicFlush(id, targetDelta);
    return ResponseEntity.accepted().body(result);
}`,
      js: `/**
 * Sends highly critical request instructing server to pull gates, lowering overflow speeds
 * @param {string} baseUrl - Server address
 * @param {string} stationId - e.g., 'st-3km'
 */
async function triggerHydraulicFlush(baseUrl, stationId) {
  try {
    const targetUrl = \`\${baseUrl}/stations/\${stationId}/flush?targetDelta=0.85\`;
    const response = await fetch(targetUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer operator-token-sentinel-vault'
      }
    });

    if (response.status === 202) {
      const receipt = await response.json();
      console.log('Java endpoint accepted gate flush queue request:', receipt);
      return receipt;
    } else {
      throw new Error(\`Unexpected response status: \${response.status}\`);
    }
  } catch (err) {
    console.error('Critical physical trigger interface fault:', err);
    throw err;
  }
}`
    },
    resolveAlert: {
      java: `@PostMapping("/incidents/resolve")
public ResponseEntity<?> acknowledgeIncident(@RequestBody ResolutionPayload payload) {
    boolean success = service.processResolutionCatalog(payload);
    if (success) {
        return ResponseEntity.ok(Map.of("message", "Incident successfully acknowledged and cleared"));
    }
    return ResponseEntity.badRequest().body("Incident not found or already closed");
}`,
      js: `/**
 * Resolves outstanding sirens and documents action in central Java incident catalog
 * @param {string} baseUrl - Server root URL
 * @param {string} incidentId - Target alert ID to close
 */
async function acknowledgeControlIncident(baseUrl, incidentId) {
  try {
    const response = await fetch(\`\${baseUrl}/incidents/resolve\`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: incidentId,
        resolutionTime: new Date().toISOString(),
        notes: "Central hydraulic command button manually resolved warning levels"
      })
    });

    if (response.ok) {
      const confirmation = await response.json();
      return confirmation;
    }
    throw new Error('Spring Server rejected incident authorization closure');
  } catch (error) {
    console.error('Failed updating incident catalog status:', error);
    throw error;
  }
}`
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-6">
      {/* Settings Title */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white mb-2">Java Integration Workshop &amp; API Settings</h2>
        <p className="text-xs text-on-surface-variant">
          Connect this real-time monitoring interface directly with your corporate Java, Spring Boot, or Jakarta EE REST web services.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Column 1: API Configuration & Gateway modes */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-card rounded-xl p-5 border border-outline-variant/20 space-y-5">
            <h3 className="font-sans text-xs font-bold uppercase tracking-widest text-white flex items-center gap-2">
              <Globe size={15} className="text-secondary" />
              <span>DASHBOARD DATA BRIDGE</span>
            </h3>

            {/* Toggle Modes */}
            <div className="space-y-3">
              <span className="text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold block">Data stream mode</span>
              <div className="grid grid-cols-1 gap-2">
                
                {/* Node Simulation Mode button */}
                <button
                  onClick={() => handleToggleMode(false)}
                  className={`py-3 px-4 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                    !config.useJavaApi 
                      ? 'bg-secondary-container/15 border-secondary text-secondary-container font-extrabold shadow shadow-secondary/10' 
                      : 'border-outline-variant/20 hover:border-outline-variant/60 text-on-surface-variant'
                  }`}
                >
                  <div>
                    <p className="text-xs text-white">Express Simulation Engine</p>
                    <p className="text-[10px] text-on-surface-variant opacity-80 mt-0.5">Continuous safe testing fluctuations</p>
                  </div>
                  {!config.useJavaApi && <Check size={16} className="text-secondary" />}
                </button>

                {/* Java Integration Mode button */}
                <button
                  onClick={() => handleToggleMode(true)}
                  className={`py-3 px-4 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                    config.useJavaApi 
                      ? 'bg-secondary-container/15 border-secondary text-secondary-container font-extrabold shadow shadow-secondary/10' 
                      : 'border-outline-variant/20 hover:border-outline-variant/60 text-on-surface-variant'
                  }`}
                >
                  <div>
                    <p className="text-xs text-white">Enterprise Java REST API</p>
                    <p className="text-[10px] text-on-surface-variant opacity-80 mt-0.5">CORS-compliant fetch requests</p>
                  </div>
                  {config.useJavaApi && <Check size={16} className="text-secondary" />}
                </button>

              </div>
            </div>

            {/* Java endpoint inputs */}
            <div className="space-y-3">
              <label className="text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold block">
                Java Spring Boot Endpoint URL
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Link size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
                  <input
                    type="text"
                    value={config.javaBaseUrl}
                    onChange={(e) => handleUrlChange(e.target.value)}
                    disabled={!config.useJavaApi}
                    placeholder="http://localhost:8080/api"
                    className="w-full bg-surface-container-highest border border-outline-variant/25 rounded-lg py-2 pl-9 pr-3 text-xs font-mono text-white placeholder:text-on-surface-variant/30 focus:outline-none focus:border-secondary transition-all disabled:opacity-50"
                  />
                </div>
              </div>
              <p className="text-[9px] text-on-surface-variant/70 leading-normal">
                Spring boot server must include <code className="font-mono bg-black/40 text-primary px-1 rounded">@CrossOrigin(origins = "*")</code> to satisfy iframe sandbox constraints.
              </p>
            </div>
          </div>

          {/* Quick Info block */}
          <div className="bg-surface-container-low border border-outline-variant/15 rounded-xl p-5 space-y-3">
            <h4 className="text-xs font-bold text-white flex items-center gap-1.5 uppercase tracking-wider">
              <Coffee size={14} className="text-secondary" />
              <span>Spring Schema Model</span>
            </h4>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              We mapped Hydro-Sentinel data payloads to match standard Jackson ObjectMapper serialization rules used by Java JAX-RS / Spring REST projects. Change levels, trigger alarms, and hit endpoints continuously to observe live telemetry.
            </p>
          </div>
        </div>

        {/* Column 2 & 3: Java REST Spring annotations vs JS fetch code block */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card rounded-xl border border-outline-variant/20 overflow-hidden flex flex-col h-full">
            <div className="p-4 bg-surface-container border-b border-outline-variant/35 flex flex-wrap gap-2 justify-between items-center">
              <div className="flex items-center gap-2">
                <Code size={15} className="text-secondary" />
                <span className="text-xs font-bold uppercase tracking-widest text-white">REST API ROUTING WORKSHOP</span>
              </div>

              {/* Endpoint Tabs select */}
              <div className="flex gap-1 bg-surface-container-low p-1 rounded-lg border border-outline-variant/20">
                <button
                  onClick={() => setTestEndpoint('getStations')}
                  className={`px-3 py-1.5 text-[10px] rounded font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    testEndpoint === 'getStations' ? 'bg-secondary-container text-on-secondary-container' : 'text-on-surface-variant hover:text-white'
                  }`}
                >
                  GET STATIONS
                </button>
                <button
                  onClick={() => setTestEndpoint('flushGate')}
                  className={`px-3 py-1.5 text-[10px] rounded font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    testEndpoint === 'flushGate' ? 'bg-secondary-container text-on-secondary-container' : 'text-on-surface-variant hover:text-white'
                  }`}
                >
                  PUT FLUSH
                </button>
                <button
                  onClick={() => setTestEndpoint('resolveAlert')}
                  className={`px-3 py-1.5 text-[10px] rounded font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    testEndpoint === 'resolveAlert' ? 'bg-secondary-container text-on-secondary-container' : 'text-on-surface-variant hover:text-white'
                  }`}
                >
                  POST RESOLVE
                </button>
              </div>
            </div>

            {/* Code presentation */}
            <div className="p-5 space-y-5 flex-1">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 h-full">
                
                {/* Java Side Block */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[10px] text-on-surface-variant font-bold uppercase tracking-wider bg-surface-container-high py-1 px-3.5 rounded-t-lg border-x border-t border-outline-variant/20">
                    <span className="flex items-center gap-1"><Coffee size={11} /> Spring Boot Java Payload</span>
                    <button
                      onClick={() => handleCopy('java', codeSnippets[testEndpoint].java)}
                      className="hover:text-white flex items-center gap-1 cursor-pointer"
                    >
                      {copiedId === 'java' ? <Check size={11} className="text-tertiary" /> : <Copy size={11} />}
                      <span>{copiedId === 'java' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <pre className="p-3.5 bg-black/50 text-[11px] font-mono leading-relaxed rounded-b-lg border border-outline-variant/20 text-blue-200 overflow-x-auto max-h-[340px] select-all">
                    {codeSnippets[testEndpoint].java}
                  </pre>
                </div>

                {/* JS Fetch Side Block */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[10px] text-on-surface-variant font-bold uppercase tracking-wider bg-surface-container-high py-1 px-3.5 rounded-t-lg border-x border-t border-outline-variant/20">
                    <span className="flex items-center gap-1"><Terminal size={11} /> JavaScript Fetch() Call</span>
                    <button
                      onClick={() => handleCopy('js', codeSnippets[testEndpoint].js)}
                      className="hover:text-white flex items-center gap-1 cursor-pointer"
                    >
                      {copiedId === 'js' ? <Check size={11} className="text-tertiary" /> : <Copy size={11} />}
                      <span>{copiedId === 'js' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <pre className="p-3.5 bg-black/50 text-[11px] font-mono leading-relaxed rounded-b-lg border border-outline-variant/20 text-emerald-200 overflow-x-auto max-h-[340px] select-all">
                    {codeSnippets[testEndpoint].js}
                  </pre>
                </div>

              </div>

              {/* API Client Playground section */}
              <div className="mt-4 border-t border-outline-variant/25 pt-5 space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Activity size={14} className="text-secondary animate-pulse" />
                    <h4 className="text-xs font-bold uppercase tracking-widest text-white">REUSE &amp; TEST CONNECTION</h4>
                  </div>
                  <button
                    onClick={runTestCall}
                    disabled={testLoading}
                    className="flex items-center gap-1.5 px-4.5 py-2.5 bg-secondary-container hover:bg-opacity-95 text-xs text-on-secondary-container font-extrabold uppercase rounded-lg transition-all shadow shadow-secondary/15 cursor-pointer disabled:opacity-50"
                  >
                    {testLoading ? (
                      <>
                        <RefreshCw size={12} className="animate-spin" />
                        <span>SENDING PACKETS...</span>
                      </>
                    ) : (
                      <>
                        <Send size={11} />
                        <span>TEST CURRENT ENDPOINT</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Return Result display panel */}
                {testResult && (
                  <div className="bg-surface-container-lowest border border-outline-variant/25 rounded-lg p-4 space-y-3 animate-fadeIn">
                    <div className="flex flex-wrap justify-between items-center text-[10px] font-mono border-b border-outline-variant/15 pb-2.5">
                      <div className="flex gap-4">
                        <span>STATUS: <strong className="text-tertiary font-bold">{testResult.status} {testResult.statusText}</strong></span>
                        <span>LATENCY: <strong className="text-white font-bold">{testLatency} ms</strong></span>
                      </div>
                      <span className="text-on-surface-variant/50 uppercase font-bold text-[9px] tracking-widest">DRY RUN CLIENT OUTPUT</span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {/* Headers */}
                      <div className="md:col-span-1 space-y-1">
                        <span className="text-[9px] text-on-surface-variant font-bold uppercase tracking-wider block">Response Headers</span>
                        <pre className="p-2.5 bg-black/40 text-[10px] font-mono rounded border border-outline-variant/10 text-on-surface-variant leading-relaxed">
                          {JSON.stringify(testResult.headers, null, 2)}
                        </pre>
                      </div>
                      {/* Body Output */}
                      <div className="md:col-span-2 space-y-1">
                        <span className="text-[9px] text-on-surface-variant font-bold uppercase tracking-wider block">JSON Response Body</span>
                        <pre className="p-2.5 bg-black/40 text-[10px] font-mono rounded border border-outline-variant/10 text-primary leading-relaxed whitespace-pre overflow-x-auto max-h-[160px]">
                          {JSON.stringify(testResult.body, null, 2)}
                        </pre>
                      </div>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
