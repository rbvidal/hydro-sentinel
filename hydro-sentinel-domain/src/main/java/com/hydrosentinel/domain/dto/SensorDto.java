package com.hydrosentinel.domain.dto;

import com.hydrosentinel.domain.enums.SensorStatus;

/**
 * DTO carrying sensor metadata and health status for UI display.
 *
 * @param id          unique sensor identifier
 * @param name        human-readable sensor name
 * @param type        sensor type description
 * @param location    location label
 * @param status      current operational status
 * @param uptime      uptime percentage
 * @param latency     response latency in milliseconds
 * @param lastChecked timestamp of last health check
 */
public record SensorDto(
    String id,
    String name,
    String type,
    String location,
    SensorStatus status,
    double uptime,
    double latency,
    String lastChecked
) {}
