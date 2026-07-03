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
