package com.hydrosentinel.domain.service;

import com.hydrosentinel.domain.dto.RecipientDto;
import com.hydrosentinel.domain.dto.SettingsDto;
import com.hydrosentinel.domain.dto.UpdateSettingsRequest;

import java.util.List;

/**
 * Service for managing global system settings and alert notification recipients.
 */
public interface SettingsService {

    /**
     * Retrieve the current system settings.
     */
    SettingsDto getSettings();

    /**
     * Update system settings with the given request payload.
     */
    SettingsDto updateSettings(UpdateSettingsRequest request);

    /**
     * List all configured alert notification recipients.
     */
    List<RecipientDto> getRecipients();

    /**
     * Update a single recipient's details.
     *
     * @param id the recipient identifier
     * @param recipient the updated recipient data
     */
    RecipientDto updateRecipient(String id, RecipientDto recipient);
}
