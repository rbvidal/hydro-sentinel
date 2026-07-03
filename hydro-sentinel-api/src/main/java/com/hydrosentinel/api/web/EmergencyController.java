package com.hydrosentinel.api.web;

import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * REST controller exposing endpoints for emergency broadcast operations.
 */
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class EmergencyController {

    /** Simulates broadcasting an emergency warning across all communication channels. */
    @PostMapping("/emergency/broadcast")
    public Map<String, String> broadcastEmergency() {
        return Map.of(
                "status", "BROADCAST",
                "message", "Emergency warning packets dispatched. Civil defense, cellular networks, and local audio sirens activated across all river nodes."
        );
    }
}
