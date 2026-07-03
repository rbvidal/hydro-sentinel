package com.hydrosentinel.domain.dto;

import java.time.LocalDateTime;

/**
 * Request payload for resolving an alert.
 *
 * @param resolutionTime when the alert was resolved
 * @param notes          resolution notes
 */
public record ResolutionRequest(
    LocalDateTime resolutionTime,
    String notes
) {}
