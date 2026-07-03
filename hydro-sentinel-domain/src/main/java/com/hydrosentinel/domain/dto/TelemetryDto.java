package com.hydrosentinel.domain.dto;

/**
 * DTO carrying aggregated telemetry readings for dashboard summary display.
 *
 * @param rainLevel       current rainfall measurement
 * @param basinSaturation basin saturation percentage
 * @param dischargeRate   current discharge rate
 * @param sensorHealth    overall sensor health indicator
 */
public record TelemetryDto(
    double rainLevel,
    double basinSaturation,
    double dischargeRate,
    double sensorHealth
) {}
