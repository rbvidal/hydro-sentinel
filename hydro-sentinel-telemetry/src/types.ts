export type SensorStatus = "Normal" | "Warning" | "Critical";

export interface Sensor {
  id: string;
  name: string;
  value: number;
  unit: string;
  icon: string;
  status: SensorStatus;
  history: number[]; // Last 12 hourly readings for the sparkline
  latitude: number;
  longitude: number;
  locationName: string;
  category: "level" | "flow" | "quality" | "precipitation";
}

export interface Alert {
  id: string;
  timestamp: string;
  sensorId?: string;
  type: SensorStatus;
  message: string;
  acknowledged: boolean;
}

export interface ThresholdConfig {
  waterLevelWarning: number;
  waterLevelCritical: number;
  flowRateWarning: number;
  flowRateCritical: number;
  precipitationWarning: number;
  precipitationCritical: number;
}

export interface OperatorAction {
  id: string;
  timestamp: string;
  operator: string;
  action: string;
  status: "SUCCESS" | "FAILED" | "PENDING";
  category: "spillway" | "system" | "siren" | "dispatch";
}
