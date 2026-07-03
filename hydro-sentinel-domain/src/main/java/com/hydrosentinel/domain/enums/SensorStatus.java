package com.hydrosentinel.domain.enums;

/**
 * Operational status of a sensor.
 */
public enum SensorStatus {
    /** Sensor is operating normally. */
    ONLINE,
    /** Sensor is operating with reduced functionality. */
    DEGRADED,
    /** Sensor is not reporting data. */
    OFFLINE
}
