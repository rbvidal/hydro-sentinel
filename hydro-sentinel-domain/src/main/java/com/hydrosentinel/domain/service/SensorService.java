package com.hydrosentinel.domain.service;

import com.hydrosentinel.domain.dto.CalibrationResponse;
import com.hydrosentinel.domain.dto.SensorDto;

import java.util.List;

/**
 * Service for managing water-level sensors and their calibration.
 */
public interface SensorService {

    /**
     * Retrieve all registered sensors.
     */
    List<SensorDto> getAllSensors();

    /**
     * Retrieve a single sensor by its identifier.
     *
     * @param id the sensor identifier
     */
    SensorDto getSensor(String id);

    /**
     * Trigger a calibration routine for the specified sensor.
     *
     * @param id the sensor identifier
     */
    CalibrationResponse calibrateSensor(String id);

    /**
     * Query the latest readings from every registered sensor and return the number refreshed.
     */
    String refreshAllSensors();
}
