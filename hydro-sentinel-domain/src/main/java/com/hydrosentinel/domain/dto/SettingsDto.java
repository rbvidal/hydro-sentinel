package com.hydrosentinel.domain.dto;

import java.util.List;

/**
 * DTO carrying the full set of system configuration settings.
 *
 * @param rapidRiseSensitivity     sensitivity level for rapid-rise detection
 * @param criticalLevelSensitivity sensitivity level for critical-level detection
 * @param quietHoursEnabled        whether quiet hours are enabled
 * @param quietHoursRange          quiet hours time range (e.g. "22:00-06:00")
 * @param systemHealthNotify       whether system-health notifications are enabled
 * @param dataRetentionDays        data retention period in days
 * @param useJavaApi               whether the Java API integration is active
 * @param javaBaseUrl              base URL for the Java API
 * @param recipients               list of alert notification recipients
 */
public record SettingsDto(
        int rapidRiseSensitivity,
        int criticalLevelSensitivity,

        boolean quietHoursEnabled,
        String quietHoursRange,
        boolean systemHealthNotify,
        String dataRetentionDays,

        boolean useJavaApi,
        String javaBaseUrl,

        List<RecipientDto> recipients
) {}
