package com.hydrosentinel.domain.dto;

import com.hydrosentinel.domain.enums.AlertSeverity;
import com.hydrosentinel.domain.enums.AlertStatus;
import java.time.LocalDateTime;

/**
 * DTO representing an alert tied to a station's water-level breach.
 *
 * @param id          unique alert identifier
 * @param stationId   associated station identifier
 * @param stationName human-readable station name
 * @param timestamp   when the alert was raised
 * @param level       water level at alert time
 * @param threshold   breach threshold value
 * @param status      current alert lifecycle status
 * @param severity    alert severity classification
 * @param details     free-text alert details
 */
public record AlertDto(
    String id,
    String stationId,
    String stationName,
    LocalDateTime timestamp,
    double level,
    double threshold,
    AlertStatus status,
    AlertSeverity severity,
    String details
) {}
