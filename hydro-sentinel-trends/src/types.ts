export type SimulationProfile = 'nominal' | 'heavy-rain' | 'flash-flood' | 'dry';

export type StationHealth = 'nominal' | 'degraded' | 'critical' | 'rebooting';

export type SensorType = 'water-level' | 'flow-rate' | 'battery' | 'solar' | 'telemetry';

export interface SensorState {
  name: string;
  type: SensorType;
  status: 'online' | 'degraded' | 'offline';
  value: string;
  lastPing: string;
}

export type LevelStage = 'normal' | 'advisory' | 'warning' | 'flood';

export interface Station {
  id: string;
  name: string;
  liveLabel: string;
  distance: string;
  level: number;
  rateOfChange: number; // in meters per minute
  sparkline: number[];
  image: string;
  altText: string;
  activeAlert?: string;
  warningState?: boolean;
  sensors: SensorState[];
  health: StationHealth;
  location: string;
}

export interface AlertLog {
  id: string;
  timestamp: string;
  timeAgo: string;
  stationId?: string;
  stationName?: string;
  severity: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  acknowledged: boolean;
  rateOfChange?: number;
}

export interface EvacSector {
  id: string;
  name: string;
  hazardLevel: 'low' | 'medium' | 'high' | 'critical';
  status: 'none' | 'standby' | 'alert' | 'evacuating' | 'cleared';
  population: number;
}

export interface DispatchTeam {
  id: string;
  name: string;
  type: 'recon' | 'rescue' | 'sandbags' | 'medical';
  status: 'idle' | 'dispatched' | 'active' | 'returned';
  eta: string;
  destination: string;
  task: string;
}

export interface ActiveView {
  id: 'monitor' | 'history' | 'sensors' | 'settings';
}

export interface Thresholds {
  normalLimit: number;
  advisoryLimit: number;
  warningLimit: number;
  floodLimit: number;
}
