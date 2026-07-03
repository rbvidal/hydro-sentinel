package com.hydrosentinel.domain.service;

import com.hydrosentinel.domain.dto.FlushResponse;
import com.hydrosentinel.domain.dto.StationDto;
import com.hydrosentinel.domain.dto.TelemetryDto;
import com.hydrosentinel.domain.model.Station;

import java.util.List;

/**
 * Service for monitoring flood-control stations, gate operations, and system telemetry.
 */
public interface MonitoringService {

    /**
     * Retrieve all monitored stations.
     */
    List<StationDto> getAllStations();

    /**
     * Retrieve a single monitoring station by its identifier.
     *
     * @param id the station identifier
     */
    StationDto getStation(String id);

    /**
     * Open a station's flood gate by the requested delta to release water.
     *
     * @param stationId the station whose gate should be flushed
     * @param targetDelta the amount by which to open the gate
     */
    FlushResponse flushGate(String stationId, double targetDelta);

    /**
     * Reset the simulation back to the provided set of default stations.
     */
    List<StationDto> resetSimulation(List<Station> defaultStations);

    /**
     * Retrieve current aggregate telemetry for the dashboard.
     */
    TelemetryDto getTelemetry();
}
