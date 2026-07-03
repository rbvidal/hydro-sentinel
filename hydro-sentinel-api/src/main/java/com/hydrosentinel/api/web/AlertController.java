package com.hydrosentinel.api.web;

import com.hydrosentinel.domain.service.AlertService;
import com.hydrosentinel.domain.dto.AlertDto;
import com.hydrosentinel.domain.dto.ResolutionRequest;
import com.hydrosentinel.domain.dto.ResolutionResponse;
import com.hydrosentinel.domain.enums.AlertSeverity;
import com.hydrosentinel.domain.enums.AlertStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller exposing endpoints for alert querying, retrieval, and resolution.
 */
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class AlertController {

    private final AlertService alertService;

    /**
     * Creates the controller with the given alert service.
     *
     * @param alertService the alert service backing this controller
     */
    public AlertController(AlertService alertService) {
        this.alertService = alertService;
    }

    /** Lists alerts, optionally filtered by status and severity.
     *
     * @param status   optional filter by alert status
     * @param severity optional filter by alert severity
     * @return matching alerts */
    @GetMapping("/alerts")
    public List<AlertDto> getAlerts(
            @RequestParam(required = false) AlertStatus status,
            @RequestParam(required = false) AlertSeverity severity) {
        return alertService.getAlerts(status, severity);
    }

    /** Retrieves a single alert by its identifier.
     *
     * @param id the alert identifier */
    @GetMapping("/alerts/{id}")
    public AlertDto getAlert(@PathVariable String id) {
        return alertService.getAlert(id);
    }

    /** Marks an alert as resolved with optional notes.
     *
     * @param id      the alert identifier
     * @param request resolution details
     * @return the resolution result */
    @PostMapping("/alerts/{id}/resolve")
    public ResponseEntity<ResolutionResponse> resolveAlert(
            @PathVariable String id,
            @RequestBody(required = false) ResolutionRequest request) {
        String notes = request != null ? request.notes() : null;
        ResolutionResponse response = alertService.resolveAlert(id, notes);
        return ResponseEntity.ok(response);
    }
}
