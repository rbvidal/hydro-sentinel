package com.hydrosentinel.domain.model;

import com.hydrosentinel.domain.enums.AlertSeverity;
import com.hydrosentinel.domain.enums.AlertStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;

/**
 * A security alert triggered when a station's water level exceeds a configured threshold.
 */
@Entity
@Table(name = "security_alerts")
public class SecurityAlert {

    @Id
    private String id;

    private String stationId;

    @NotBlank
    private String stationName;

    private LocalDateTime timestamp;

    private double level;

    private double threshold;

    @Enumerated(EnumType.STRING)
    private AlertStatus status;

    @Enumerated(EnumType.STRING)
    private AlertSeverity severity;

    @Column(length = 1024)
    private String details;

    /** No-arg constructor for JPA. */
    public SecurityAlert() {}

    /**
     * Creates a fully-populated SecurityAlert.
     *
     * @param id unique alert identifier
     * @param stationId ID of the station that triggered the alert
     * @param stationName name of the station that triggered the alert
     * @param timestamp when the alert was raised
     * @param level water level at the time of the alert
     * @param threshold the threshold that was exceeded
     * @param status current lifecycle status of the alert
     * @param severity severity level of the alert
     * @param details human-readable description of the alert
     */
    public SecurityAlert(String id, String stationId, String stationName, LocalDateTime timestamp,
                         double level, double threshold, AlertStatus status, AlertSeverity severity, String details) {
        this.id = id;
        this.stationId = stationId;
        this.stationName = stationName;
        this.timestamp = timestamp;
        this.level = level;
        this.threshold = threshold;
        this.status = status;
        this.severity = severity;
        this.details = details;
    }

    /** @return the alert's unique identifier. */
    public String getId() { return id; }
    /** @param id the unique identifier to set. */
    public void setId(String id) { this.id = id; }

    /** @return the ID of the station that triggered the alert. */
    public String getStationId() { return stationId; }
    /** @param stationId the station ID to set. */
    public void setStationId(String stationId) { this.stationId = stationId; }

    /** @return the name of the station that triggered the alert. */
    public String getStationName() { return stationName; }
    /** @param stationName the station name to set. */
    public void setStationName(String stationName) { this.stationName = stationName; }

    /** @return the timestamp of when the alert was raised. */
    public LocalDateTime getTimestamp() { return timestamp; }
    /** @param timestamp the alert timestamp to set. */
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }

    /** @return the water level at the time of the alert. */
    public double getLevel() { return level; }
    /** @param level the water level to set. */
    public void setLevel(double level) { this.level = level; }

    /** @return the threshold that was exceeded. */
    public double getThreshold() { return threshold; }
    /** @param threshold the threshold value to set. */
    public void setThreshold(double threshold) { this.threshold = threshold; }

    /** @return the current lifecycle status of the alert. */
    public AlertStatus getStatus() { return status; }
    /** @param status the alert status to set. */
    public void setStatus(AlertStatus status) { this.status = status; }

    /** @return the severity level of the alert. */
    public AlertSeverity getSeverity() { return severity; }
    /** @param severity the alert severity to set. */
    public void setSeverity(AlertSeverity severity) { this.severity = severity; }

    /** @return the human-readable description of the alert. */
    public String getDetails() { return details; }
    /** @param details the alert details to set. */
    public void setDetails(String details) { this.details = details; }
}
