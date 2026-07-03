package com.hydrosentinel.domain.dto;

import java.time.LocalDateTime;

/**
 * DTO returned after a flush operation at a monitoring station.
 *
 * @param stationId      affected station identifier
 * @param previousLevel  water level before flush
 * @param newLevel       water level after flush
 * @param delta          difference between previous and new level
 * @param gatePosition   gate position during flush
 * @param timestamp      when the flush occurred
 * @param message        human-readable result message
 */
public record FlushResponse(
    String stationId,
    double previousLevel,
    double newLevel,
    double delta,
    String gatePosition,
    LocalDateTime timestamp,
    String message
) {}
