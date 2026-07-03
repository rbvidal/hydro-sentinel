package com.hydrosentinel.domain.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * DTO carrying station summary data for dashboard display.
 *
 * @param id          unique station identifier
 * @param name        human-readable station name
 * @param distance    proximity label (e.g. "1.2 km")
 * @param level       current water level reading
 * @param rateOfChange rate of water-level change
 * @param status      operational status string
 * @param imageUrl    URL of the station image asset
 * @param history     historical level data points
 */
public record StationDto(
    String id,
    String name,
    String distance,
    double level,
    double rateOfChange,
    String status,
    String imageUrl,
    double[] history
) {
    /** @return the rate of water level change. */
    @JsonProperty("rateOfChange")
    @Override public double rateOfChange() { return rateOfChange; }
}
