package com.hydrosentinel.domain.enums;

/**
 * Severity level of an alert, in increasing order of urgency.
 */
public enum AlertSeverity {
    /** Low-priority alert requiring routine attention. */
    LOW,
    /** Medium-priority alert requiring timely review. */
    MEDIUM,
    /** High-priority alert requiring prompt action. */
    HIGH,
    /** Critical alert requiring immediate response. */
    CRITICAL
}
