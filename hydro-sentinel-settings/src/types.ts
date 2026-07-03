/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Recipient {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  notifyCritical: boolean;
  notifyWarning: boolean;
  lastTested: string;
}

export interface Sensor {
  id: string;
  name: string;
  location: string;
  latitude: number;
  longitude: number;
  status: 'normal' | 'warning' | 'critical';
  waterLevel: number; // in meters (e.g. 1.2m under normal, 4.5m max)
  warningThreshold: number;
  maxThreshold: number;
  flowRate: number; // in m³/s
  battery: number; // percentage
  signal: number; // dBm signal status
  history24h: { time: string; level: number; flow: number }[];
}

export interface Alert {
  id: string;
  timestamp: string;
  sensorId: string;
  sensorName: string;
  level: 'warning' | 'critical';
  message: string;
  status: 'active' | 'acknowledged' | 'resolved';
  resolvedAt?: string;
  notes?: string;
}

export interface SystemConfig {
  rapidRiseSensitivity: number; // slider, 0-100
  criticalLevelSensitivity: number; // slider, 0-100
  quietHoursEnabled: boolean;
  quietHoursRange: string;
  systemHealthNotify: boolean;
  dataRetentionDays: string;
}
