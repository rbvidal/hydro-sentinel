package com.hydrosentinel.domain.dto;

import java.time.LocalDateTime;

/**
 * DTO returned after resolving an alert.
 *
 * @param alertId   resolved alert identifier
 * @param status    resulting alert status
 * @param message   human-readable result message
 * @param timestamp when the resolution was recorded
 */
public record ResolutionResponse(
    String alertId,
    String status,
    String message,
    LocalDateTime timestamp
) {}
