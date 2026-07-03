/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface StationData {
  id: string;
  name: string;
  distance: string;
  level: number;
  rateOfChange: number;
  status: 'normal' | 'warning' | 'alert';
  imageUrl: string;
  history: number[];
}

export interface SecurityAlert {
  id: string;
  stationId: string;
  stationName: string;
  timestamp: string;
  level: number;
  threshold: number;
  status: 'active' | 'resolved';
  severity: 'low' | 'medium' | 'high' | 'critical';
  details: string;
}

export interface SensorStatus {
  id: string;
  name: string;
  type: string;
  location: string;
  status: 'online' | 'degraded' | 'offline';
  uptime: number; // percentage
  latency: number; // ms
  lastChecked: string;
}

export interface IntegrationConfig {
  useJavaApi: boolean;
  javaBaseUrl: string;
}

/* ── Telemetry Dashboard types ── */

export type TelemetrySensorStatus = 'Normal' | 'Warning' | 'Critical';

export interface TelemetrySensor {
  id: string;
  name: string;
  value: number;
  unit: string;
  icon: string;
  status: TelemetrySensorStatus;
  history: number[];
  latitude: number;
  longitude: number;
  locationName: string;
  category: 'level' | 'flow' | 'quality' | 'precipitation';
}

export interface TelemetryAlert {
  id: string;
  timestamp: string;
  sensorId?: string;
  type: TelemetrySensorStatus;
  message: string;
  acknowledged: boolean;
}

export interface TelemetryThresholdConfig {
  waterLevelWarning: number;
  waterLevelCritical: number;
  flowRateWarning: number;
  flowRateCritical: number;
  precipitationWarning: number;
  precipitationCritical: number;
}

export interface TelemetryOperatorAction {
  id: string;
  timestamp: string;
  operator: string;
  action: string;
  status: 'SUCCESS' | 'FAILED' | 'PENDING';
  category: 'spillway' | 'system' | 'siren' | 'dispatch';
}

/* ── Settings Dashboard types ── */

export interface SettingsRecipient {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  notifyCritical: boolean;
  notifyWarning: boolean;
  lastTested: string;
}

export interface SettingsSystemConfig {
  rapidRiseSensitivity: number;
  criticalLevelSensitivity: number;
  quietHoursEnabled: boolean;
  quietHoursRange: string;
  systemHealthNotify: boolean;
  dataRetentionDays: string;
}
