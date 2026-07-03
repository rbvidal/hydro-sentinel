package com.hydrosentinel.domain.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

/**
 * Application-wide system settings persisted as a singleton row.
 */
@Entity
@Table(name = "system_settings")
public class SystemSettings {

    @Id
    private String id = "app-config";

    @Min(0) @Max(100)
    private int rapidRiseSensitivity = 85;

    @Min(0) @Max(100)
    private int criticalLevelSensitivity = 92;

    private boolean quietHoursEnabled = true;
    private String quietHoursRange = "22:00 - 06:00 (Non-critical)";
    private boolean systemHealthNotify = true;
    private String dataRetentionDays = "90 Days (Recommended)";

    private boolean useJavaApi = false;
    private String javaBaseUrl = "http://localhost:8080/api";

    /** No-arg constructor for JPA. */
    public SystemSettings() {}

    /** @return the singleton row identifier. */
    public String getId() { return id; }
    /** @param id the row identifier to set. */
    public void setId(String id) { this.id = id; }

    /** @return the sensitivity threshold for rapid water rise detection (0-100). */
    public int getRapidRiseSensitivity() { return rapidRiseSensitivity; }
    /** @param rapidRiseSensitivity the rapid rise sensitivity to set. */
    public void setRapidRiseSensitivity(int rapidRiseSensitivity) { this.rapidRiseSensitivity = rapidRiseSensitivity; }

    /** @return the sensitivity threshold for critical water level detection (0-100). */
    public int getCriticalLevelSensitivity() { return criticalLevelSensitivity; }
    /** @param criticalLevelSensitivity the critical level sensitivity to set. */
    public void setCriticalLevelSensitivity(int criticalLevelSensitivity) { this.criticalLevelSensitivity = criticalLevelSensitivity; }

    /** @return whether quiet hours notification suppression is enabled. */
    public boolean isQuietHoursEnabled() { return quietHoursEnabled; }
    /** @param quietHoursEnabled whether to enable quiet hours. */
    public void setQuietHoursEnabled(boolean quietHoursEnabled) { this.quietHoursEnabled = quietHoursEnabled; }

    /** @return the configured quiet hours time range string. */
    public String getQuietHoursRange() { return quietHoursRange; }
    /** @param quietHoursRange the quiet hours range to set. */
    public void setQuietHoursRange(String quietHoursRange) { this.quietHoursRange = quietHoursRange; }

    /** @return whether system health notifications are enabled. */
    public boolean isSystemHealthNotify() { return systemHealthNotify; }
    /** @param systemHealthNotify whether to enable system health notifications. */
    public void setSystemHealthNotify(boolean systemHealthNotify) { this.systemHealthNotify = systemHealthNotify; }

    /** @return the configured data retention period. */
    public String getDataRetentionDays() { return dataRetentionDays; }
    /** @param dataRetentionDays the data retention period to set. */
    public void setDataRetentionDays(String dataRetentionDays) { this.dataRetentionDays = dataRetentionDays; }

    /** @return whether the Java API data source is enabled. */
    public boolean isUseJavaApi() { return useJavaApi; }
    /** @param useJavaApi whether to enable the Java API data source. */
    public void setUseJavaApi(boolean useJavaApi) { this.useJavaApi = useJavaApi; }

    /** @return the base URL for the Java API data source. */
    public String getJavaBaseUrl() { return javaBaseUrl; }
    /** @param javaBaseUrl the base URL to set. */
    public void setJavaBaseUrl(String javaBaseUrl) { this.javaBaseUrl = javaBaseUrl; }
}
