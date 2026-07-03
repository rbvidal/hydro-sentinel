package com.hydrosentinel.domain.dto;

/**
 * Request payload for partial updates to system settings. All fields are nullable
 * to support partial (PATCH-style) updates.
 *
 * @param rapidRiseSensitivity     new rapid-rise sensitivity, or null to keep unchanged
 * @param criticalLevelSensitivity new critical-level sensitivity, or null to keep unchanged
 * @param quietHoursEnabled        whether to enable quiet hours, or null to keep unchanged
 * @param quietHoursRange          quiet hours time range, or null to keep unchanged
 * @param systemHealthNotify       whether to enable system-health notifications, or null to keep unchanged
 * @param dataRetentionDays        data retention period, or null to keep unchanged
 * @param useJavaApi               whether to enable Java API integration, or null to keep unchanged
 * @param javaBaseUrl              Java API base URL, or null to keep unchanged
 */
public record UpdateSettingsRequest(
        Integer rapidRiseSensitivity,
        Integer criticalLevelSensitivity,

        Boolean quietHoursEnabled,
        String quietHoursRange,
        Boolean systemHealthNotify,
        String dataRetentionDays,

        Boolean useJavaApi,
        String javaBaseUrl
) {}
