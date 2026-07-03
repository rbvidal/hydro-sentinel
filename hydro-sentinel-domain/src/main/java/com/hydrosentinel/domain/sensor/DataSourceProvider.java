package com.hydrosentinel.domain.sensor;

import com.hydrosentinel.domain.enums.DataSourceType;
import com.hydrosentinel.domain.model.Sensor;
import com.hydrosentinel.domain.model.Station;

import java.util.List;

/**
 * Abstraction for a telemetry data source that provides readings, stations, and sensor metadata.
 */
public interface DataSourceProvider {

    /**
     * Return the type of data source this provider represents (e.g. simulated, live).
     */
    DataSourceType getType();

    /**
     * Fetch the list of monitoring stations from this data source.
     */
    List<Station> fetchStations();

    /**
     * Fetch the list of sensors from this data source.
     */
    List<Sensor> fetchSensors();

    /**
     * Fetch the current rain-level reading (mm).
     */
    double fetchRainLevel();

    /**
     * Fetch the current basin saturation percentage.
     */
    double fetchBasinSaturation();

    /**
     * Fetch the current discharge rate (m³/s).
     */
    double fetchDischargeRate();

    /**
     * Fetch an aggregate sensor-health score (0.0-1.0).
     */
    double fetchSensorHealth();
}
