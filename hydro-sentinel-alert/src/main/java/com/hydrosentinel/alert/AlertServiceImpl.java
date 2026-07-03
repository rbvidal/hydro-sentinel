package com.hydrosentinel.alert;

import com.hydrosentinel.domain.dto.AlertDto;
import com.hydrosentinel.domain.dto.ResolutionResponse;
import com.hydrosentinel.domain.enums.AlertSeverity;
import com.hydrosentinel.domain.enums.AlertStatus;
import com.hydrosentinel.domain.model.SecurityAlert;
import com.hydrosentinel.domain.repository.SecurityAlertRepository;
import com.hydrosentinel.domain.service.AlertService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Manages security alerts including filtered querying, retrieval, resolution, and active-alert counting.
 */
@Service
public class AlertServiceImpl implements AlertService {

    private final SecurityAlertRepository alertRepository;

    /**
     * Creates the alert service with the given alert repository.
     *
     * @param alertRepository repository for security alerts
     */
    public AlertServiceImpl(SecurityAlertRepository alertRepository) {
        this.alertRepository = alertRepository;
    }

    /**
     * Lists alerts, optionally filtered by status and severity.
     *
     * @param status   optional filter by alert status, or {@code null} for all
     * @param severity optional filter by alert severity, or {@code null} for all
     * @return alerts matching the given filters
     */
    @Override
    public List<AlertDto> getAlerts(AlertStatus status, AlertSeverity severity) {
        List<SecurityAlert> alerts;
        if (status != null && severity != null) {
            alerts = alertRepository.findByStatusAndSeverity(status, severity);
        } else if (status != null) {
            alerts = alertRepository.findByStatus(status);
        } else if (severity != null) {
            alerts = alertRepository.findBySeverity(severity);
        } else {
            alerts = alertRepository.findAll();
        }
        return alerts.stream().map(this::toDto).toList();
    }

    /** Retrieves a single alert by its identifier. @param id the alert identifier */
    @Override
    public AlertDto getAlert(String id) {
        return alertRepository.findById(id)
                .map(this::toDto)
                .orElseThrow(() -> new IllegalArgumentException("Alert not found: " + id));
    }

    /**
     * Marks an alert as resolved with optional resolution notes.
     *
     * @param id    the alert identifier
     * @param notes optional resolution notes, may be {@code null} or blank
     * @return the resolution result indicating whether the alert was resolved
     */
    @Override
    @Transactional
    public ResolutionResponse resolveAlert(String id, String notes) {
        SecurityAlert alert = alertRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Alert not found: " + id));

        if (alert.getStatus() == AlertStatus.RESOLVED) {
            return new ResolutionResponse(id, "resolved",
                    "Alert was already resolved.", LocalDateTime.now());
        }

        alert.setStatus(AlertStatus.RESOLVED);
        alertRepository.save(alert);

        return new ResolutionResponse(
                id, "resolved",
                "Incident successfully acknowledged and cleared. " +
                        (notes != null && !notes.isBlank() ? "Notes: " + notes : ""),
                LocalDateTime.now()
        );
    }

    /** Returns the count of currently active (unresolved) alerts. @return the number of currently active (unresolved) alerts */
    @Override
    public long countActiveAlerts() {
        return alertRepository.countByStatus(AlertStatus.ACTIVE);
    }

    private AlertDto toDto(SecurityAlert a) {
        return new AlertDto(
                a.getId(), a.getStationId(), a.getStationName(), a.getTimestamp(),
                a.getLevel(), a.getThreshold(), a.getStatus(), a.getSeverity(), a.getDetails()
        );
    }
}
