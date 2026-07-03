package com.hydrosentinel.domain.dto;

import com.hydrosentinel.domain.enums.SensorStatus;

/**
 * DTO returned after a sensor calibration cycle.
 *
 * @param sensorId    calibrated sensor identifier
 * @param sensorName  human-readable sensor name
 * @param status      post-calibration sensor status
 * @param uptime      current uptime percentage
 * @param latency     current latency in milliseconds
 * @param lastChecked timestamp of last health check
 * @param message     human-readable result message
 */
public record CalibrationResponse(
    String sensorId,
    String sensorName,
    SensorStatus status,
    double uptime,
    double latency,
    String lastChecked,
    String message
) {}
