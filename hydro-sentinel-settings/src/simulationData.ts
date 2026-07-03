/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Recipient, Sensor, Alert, SystemConfig } from './types';

export const INITIAL_RECIPIENTS: Recipient[] = [
  {
    id: 'rec-1',
    name: 'Elena Rodriguez',
    role: 'CIVIL DEFENSE LEAD',
    email: 'e.rodriguez@city.gov',
    phone: '+1 (555) 012-9923',
    notifyCritical: true,
    notifyWarning: true,
    lastTested: '14 Oct, 09:42'
  },
  {
    id: 'rec-2',
    name: 'Capt. Marcus Thorne',
    role: 'EMERGENCY SERVICES',
    email: 'm.thorne@fire.dept',
    phone: '+1 (555) 928-4400',
    notifyCritical: true,
    notifyWarning: false,
    lastTested: '12 Oct, 14:15'
  },
  {
    id: 'rec-3',
    name: 'Sarah Jenkins',
    role: 'COMMUNITY REPRESENTATIVE',
    email: 's.jenkins@estates.org',
    phone: '+1 (555) 102-3388',
    notifyCritical: true,
    notifyWarning: true,
    lastTested: '10 Oct, 11:30'
  },
  {
    id: 'rec-4',
    name: 'Devon Miller',
    role: 'INFRASTRUCTURE MANAGER',
    email: 'd.miller@watergrid.net',
    phone: '+1 (555) 772-1190',
    notifyCritical: true,
    notifyWarning: false,
    lastTested: '08 Oct, 16:45'
  }
];

// Helper to generate a 24-hour historical array
const generateHistory = (baseLevel: number, variance: number, trendUp: boolean = false) => {
  const points = [];
  const hours = Array.from({ length: 24 }, (_, i) => {
    const hr = (15 + i) % 24;
    return `${hr.toString().padStart(2, '0')}:00`;
  });
  
  for (let i = 0; i < 24; i++) {
    const trendShift = trendUp ? (i / 23) * 0.4 : 0;
    const noise = (Math.sin(i / 3) * 0.15) + (Math.cos(i / 1.5) * variance);
    const level = parseFloat((baseLevel + trendShift + noise).toFixed(2));
    const flow = parseFloat((level * 8.5 + (noise * 4)).toFixed(1));
    points.push({
      time: hours[i],
      level: Math.max(0.1, level),
      flow: Math.max(1.0, flow)
    });
  }
  return points;
};

export const INITIAL_SENSORS: Sensor[] = [
  {
    id: 'sns-1',
    name: 'Reservoir Peak Sensor A-1',
    location: 'North Spillway Wall',
    latitude: 34.0522,
    longitude: -118.2437,
    status: 'normal',
    waterLevel: 2.15,
    warningThreshold: 3.20,
    maxThreshold: 4.50,
    flowRate: 18.2,
    battery: 94,
    signal: -58,
    history24h: generateHistory(2.10, 0.08)
  },
  {
    id: 'sns-2',
    name: 'Sluice Gate C Bypass',
    location: 'Downstream Inflow Channel',
    latitude: 34.0612,
    longitude: -118.2512,
    status: 'warning',
    waterLevel: 3.42,
    warningThreshold: 3.00,
    maxThreshold: 4.20,
    flowRate: 35.6,
    battery: 89,
    signal: -72,
    history24h: generateHistory(2.95, 0.15, true)
  },
  {
    id: 'sns-3',
    name: 'Delta Estuary Tide Meter',
    location: 'Estuary Interface Node',
    latitude: 34.0221,
    longitude: -118.2105,
    status: 'normal',
    waterLevel: 1.05,
    warningThreshold: 2.20,
    maxThreshold: 3.00,
    flowRate: 8.4,
    battery: 15, // Highlighting low battery system health trigger!
    signal: -85,
    history24h: generateHistory(1.00, 0.25)
  },
  {
    id: 'sns-4',
    name: 'Mountain Tributary Station',
    location: 'Upstream Gorge Reach',
    latitude: 34.1105,
    longitude: -118.2891,
    status: 'critical',
    waterLevel: 4.85, // Beyond critical threshold!
    warningThreshold: 3.50,
    maxThreshold: 4.50,
    flowRate: 74.3,
    battery: 98,
    signal: -45,
    history24h: generateHistory(3.80, 0.35, true)
  }
];

export const INITIAL_ALERTS: Alert[] = [
  {
    id: 'alt-1',
    timestamp: '14 Jun, 16:12',
    sensorId: 'sns-4',
    sensorName: 'Mountain Tributary Station',
    level: 'critical',
    message: 'Water level (4.85m) has breached MAXIMUM safety threshold (4.50m). Rapid runoff detected.',
    status: 'active'
  },
  {
    id: 'alt-2',
    timestamp: '14 Jun, 15:30',
    sensorId: 'sns-2',
    sensorName: 'Sluice Gate C Bypass',
    level: 'warning',
    message: 'Water level (3.42m) has exceeded warning threshold (3.00m). Discharge is accelerating.',
    status: 'active'
  },
  {
    id: 'alt-3',
    timestamp: '13 Jun, 11:20',
    sensorId: 'sns-3',
    sensorName: 'Delta Estuary Tide Meter',
    level: 'warning',
    message: 'High tide surge detected at Estuary Node. Water levels temporarily elevated.',
    status: 'resolved',
    resolvedAt: '13 Jun, 13:45',
    notes: 'Surge subsided in line with tidal reports. Automatic closure verified.'
  }
];

export const INITIAL_CONFIG: SystemConfig = [
  {
    rapidRiseSensitivity: 85,
    criticalLevelSensitivity: 92,
    quietHoursEnabled: true,
    quietHoursRange: '22:00 - 06:00 (Non-critical)',
    systemHealthNotify: true,
    dataRetentionDays: '90 Days (Recommended)'
  }
][0];
