package com.hydrosentinel.api.web;

import com.hydrosentinel.domain.service.SensorService;
import com.hydrosentinel.domain.dto.CalibrationResponse;
import com.hydrosentinel.domain.dto.SensorDto;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * REST controller exposing endpoints for sensor listing, retrieval, calibration, and refresh.
 */
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class SensorController {

    private final SensorService sensorService;

    /**
     * Creates the controller with the given sensor service.
     *
     * @param sensorService the sensor service backing this controller
     */
    public SensorController(SensorService sensorService) {
        this.sensorService = sensorService;
    }

    /** Lists all sensors in the monitoring network.
     *
     * @return all sensors in the system */
    @GetMapping("/sensors")
    public List<SensorDto> getAllSensors() {
        return sensorService.getAllSensors();
    }

    /** Retrieves a single sensor by its identifier.
     *
     * @param id the sensor identifier */
    @GetMapping("/sensors/{id}")
    public SensorDto getSensor(@PathVariable String id) {
        return sensorService.getSensor(id);
    }

    /** Runs a calibration sweep on the specified sensor.
     *
     * @param id the sensor identifier */
    @PostMapping("/sensors/{id}/calibrate")
    public CalibrationResponse calibrateSensor(@PathVariable String id) {
        return sensorService.calibrateSensor(id);
    }

    /** Triggers a refresh of all sensor readings from external data sources. */
    @PostMapping("/sensors/refresh")
    public Map<String, String> refreshAllSensors() {
        String message = sensorService.refreshAllSensors();
        return Map.of("status", "OK", "message", message);
    }
}
