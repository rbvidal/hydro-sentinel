package com.hydrosentinel.api.web;

import com.hydrosentinel.domain.dto.RecipientDto;
import com.hydrosentinel.domain.dto.SettingsDto;
import com.hydrosentinel.domain.dto.UpdateSettingsRequest;
import com.hydrosentinel.domain.service.SettingsService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller exposing endpoints for system settings and alert recipient management.
 */
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class SettingsController {

    private final SettingsService settingsService;

    /**
     * Creates the controller with the given settings service.
     *
     * @param settingsService the settings service backing this controller
     */
    public SettingsController(SettingsService settingsService) {
        this.settingsService = settingsService;
    }

    /** Returns the current system configuration and all recipients.
     *
     * @return the current system settings combined with all recipients */
    @GetMapping("/settings")
    public SettingsDto getSettings() {
        return settingsService.getSettings();
    }

    /** Applies the given updates to the system settings.
     *
     * @param request the settings fields to update */
    @PutMapping("/settings")
    public SettingsDto updateSettings(@RequestBody UpdateSettingsRequest request) {
        return settingsService.updateSettings(request);
    }

    /** Lists all configured alert notification recipients.
     *
     * @return all configured alert recipients */
    @GetMapping("/settings/recipients")
    public List<RecipientDto> getRecipients() {
        return settingsService.getRecipients();
    }

    /** Updates a recipient's contact details and notification preferences.
     *
     * @param id        the recipient identifier
     * @param recipient the updated recipient fields
     * @return the updated recipient */
    @PutMapping("/settings/recipients/{id}")
    public RecipientDto updateRecipient(@PathVariable String id, @RequestBody RecipientDto recipient) {
        return settingsService.updateRecipient(id, recipient);
    }
}
