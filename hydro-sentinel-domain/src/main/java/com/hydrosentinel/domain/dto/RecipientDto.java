package com.hydrosentinel.domain.dto;

/**
 * DTO representing an alert notification recipient.
 *
 * @param id             unique recipient identifier
 * @param name           recipient display name
 * @param role           recipient role or designation
 * @param email          email address
 * @param phone          phone number
 * @param notifyCritical whether the recipient receives critical alerts
 * @param notifyWarning  whether the recipient receives warning alerts
 * @param lastTested     timestamp of last notification test
 */
public record RecipientDto(
        String id,
        String name,
        String role,
        String email,
        String phone,
        boolean notifyCritical,
        boolean notifyWarning,
        String lastTested
) {}
