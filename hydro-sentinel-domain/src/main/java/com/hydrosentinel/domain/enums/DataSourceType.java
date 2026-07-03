package com.hydrosentinel.domain.enums;

/**
 * Enumerates the sources from which telemetry data is ingested.
 */
public enum DataSourceType {
    /** Simulated data source for testing and development. */
    MOCK,
    /** Real data sourced from an external telemetry provider. */
    EXTERNAL
}
