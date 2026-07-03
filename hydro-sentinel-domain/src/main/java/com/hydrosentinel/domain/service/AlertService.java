package com.hydrosentinel.domain.service;

import com.hydrosentinel.domain.dto.AlertDto;
import com.hydrosentinel.domain.dto.ResolutionResponse;
import com.hydrosentinel.domain.enums.AlertSeverity;
import com.hydrosentinel.domain.enums.AlertStatus;

import java.util.List;

/**
 * Service for querying, filtering, and resolving flood alerts.
 */
public interface AlertService {

    /**
     * Retrieve alerts, optionally filtered by status and/or severity.
     *
     * @param status the alert status filter, or {@code null} for all statuses
     * @param severity the alert severity filter, or {@code null} for all severities
     */
    List<AlertDto> getAlerts(AlertStatus status, AlertSeverity severity);

    /**
     * Retrieve a single alert by its identifier.
     *
     * @param id the alert identifier
     */
    AlertDto getAlert(String id);

    /**
     * Mark an alert as resolved with optional resolution notes.
     *
     * @param id the alert identifier
     * @param notes optional notes describing the resolution
     */
    ResolutionResponse resolveAlert(String id, String notes);

    /**
     * Count alerts that are currently in an active (non-resolved) state.
     */
    long countActiveAlerts();
}
