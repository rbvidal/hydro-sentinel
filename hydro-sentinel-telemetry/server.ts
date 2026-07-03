import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Initialize GoogleGenAI SDK lazily and securely on the backend
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("WARNING: GEMINI_API_KEY environment variable is not set. AI Copilot will operate in simulation safe-mode.");
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

app.use(express.json());

// API: Analyze Hydraulic Telemetry and generate localized emergency response draft or status reports
app.post("/api/analyze-telemetry", async (req, res) => {
  try {
    const { sensors, currentAlerts, thresholdConfig, systemStatus, actionLogs } = req.body;

    const client = getGeminiClient();
    if (!client) {
      // Return highly realistic mock hydraulic analyst feedback if no API key is specified
      return res.json({
        analysis: `### [SIMULATION REPORT - NO API KEY SPECIFIED]
**Telemetry Timestamp**: ${new Date().toISOString()}  
**System Integrity Rating**: Stable  

#### 1. CRITICAL ANALYSIS
- Current Sensors: ${sensors.map((s: any) => `${s.name}: ${s.value}${s.unit}`).join(", ")}
- Active Alerts: ${currentAlerts.length > 0 ? currentAlerts.map((a: any) => `[${a.type}] ${a.message}`).join("; ") : "No immediate critical violations"}

#### 2. HYDRAULIC EVALUATION
- Recommended spillway discharge adjustment is 0.0m³/s based on status: *${systemStatus}*.
- Stabilizing trend expected over the next 2 hours. Keep auxiliary flow sensors active.`,
      });
    }

    const prompt = `You are the Lead Hydro-Engineering Artificial Intel Analyst for Hydro-Sentinel, a state-of-the-art hydrological control center.
Your task is to analyze the following real-time system state telemetry and produce a professional, highly descriptive, structured shift log or emergency response dispatch.

### SYSTEM DISPATCH METRICS:
- SYSTEM COMPLIANCE RATE: ${systemStatus}
- CURRENT ACTIVE ALERTS:
${JSON.stringify(currentAlerts, null, 2)}
- DETECTED SENSOR TELEMETRY:
${JSON.stringify(sensors, null, 2)}
- CRITICAL SENSOR SAFE TRESHOLDS:
${JSON.stringify(thresholdConfig, null, 2)}
- RECENT OPERATIONS ACTIONS LOG:
${JSON.stringify(actionLogs, null, 2)}

Provide your output in high-quality Markdown. Make it sound deeply professional, clear, and action-oriented for civil engineers and municipal emergency responders.
Include:
1. **SITUATIONAL SYNOPIS** (A concise evaluation of current hazard exposure and reservoir/waterway safety level).
2. **TELEMETRY ASSIGNMENTS** (Interpret specific measurements from the sensors, noting any anomalies).
3. **MUNICIPAL ACTION PLAN & ALERTS** (Provide exact tactical steps, e.g., spillway adjustments, residential warden notices, sensor validation checks).
Keep descriptions focused purely on fluid dynamics, local hydrology, and emergency contingency protocols. Avoid mentioning internal key architectures or server metrics.`;

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    res.json({ analysis: response.text });
  } catch (error: any) {
    console.error("Gemini API Telemetry analysis failed:", error);
    res.status(500).json({ error: error.message || "Failure in Gemini Analysis Engine" });
  }
});

// Configure Vite integration as middleware depending on environment mode
async function bootstrap() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Bootstrap: Booting app in development mode with Vite middleware.");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Bootstrap: Booting app in production mode serving static /dist assets.");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Hydro-Sentinel Hydro-Engineering Server running at http://0.0.0.0:${PORT}`);
  });
}

bootstrap().catch((err) => {
  console.error("FATAL: Failed to bootstrap Express full-stack runtime", err);
});
