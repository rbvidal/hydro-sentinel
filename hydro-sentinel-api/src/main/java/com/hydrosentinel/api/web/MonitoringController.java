package com.hydrosentinel.api.web;

import com.hydrosentinel.domain.service.MonitoringService;
import com.hydrosentinel.domain.dto.FlushResponse;
import com.hydrosentinel.domain.dto.StationDto;
import com.hydrosentinel.domain.dto.TelemetryDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller exposing endpoints for station live readings, flush gate operations, and telemetry.
 */
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class MonitoringController {

    private final MonitoringService monitoringService;

    /**
     * Creates the controller with the given monitoring service.
     *
     * @param monitoringService the monitoring service backing this controller
     */
    public MonitoringController(MonitoringService monitoringService) {
        this.monitoringService = monitoringService;
    }

    /** Returns live water-level readings for all monitoring stations.
     *
     * @return live readings for all monitoring stations */
    @GetMapping("/stations")
    public List<StationDto> getLiveReadings() {
        return monitoringService.getAllStations();
    }

    /** Retrieves a single station's current state.
     *
     * @param id the station identifier */
    @GetMapping("/stations/{id}")
    public StationDto getStation(@PathVariable String id) {
        return monitoringService.getStation(id);
    }

    /** Triggers a gate flush to reduce water level by the target delta.
     *
     * @param id          the station identifier
     * @param targetDelta the target water-level reduction in meters
     * @return the flush operation result
     */
    @PutMapping("/stations/{id}/flush")
    public ResponseEntity<FlushResponse> triggerFlushGate(
            @PathVariable String id,
            @RequestParam(defaultValue = "0.5") double targetDelta) {
        FlushResponse result = monitoringService.flushGate(id, targetDelta);
        return ResponseEntity.accepted().body(result);
    }

    /** Returns aggregate telemetry across all stations and sensors.
     *
     * @return aggregate telemetry including alert counts and station status summaries */
    @GetMapping("/telemetry")
    public TelemetryDto getTelemetry() {
        return monitoringService.getTelemetry();
    }
}
