package com.hydrosentinel.domain.enums;

/**
 * Operational status of a monitoring station.
 */
public enum StationStatus {
    /** Station readings are within normal range. */
    NORMAL,
    /** Station readings are approaching alert thresholds. */
    WARNING,
    /** Station readings have exceeded alert thresholds. */
    ALERT
}
