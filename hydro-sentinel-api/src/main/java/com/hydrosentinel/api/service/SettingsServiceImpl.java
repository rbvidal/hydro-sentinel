package com.hydrosentinel.api.service;

import com.hydrosentinel.domain.dto.RecipientDto;
import com.hydrosentinel.domain.dto.SettingsDto;
import com.hydrosentinel.domain.dto.UpdateSettingsRequest;
import com.hydrosentinel.domain.model.AlertRecipient;
import com.hydrosentinel.domain.model.SystemSettings;
import com.hydrosentinel.domain.repository.AlertRecipientRepository;
import com.hydrosentinel.domain.repository.SystemSettingsRepository;
import com.hydrosentinel.domain.service.SettingsService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Manages system settings and alert recipients, providing retrieval, update,
 * and individual recipient modification operations.
 */
@Service
public class SettingsServiceImpl implements SettingsService {

    private static final String CONFIG_ID = "app-config";

    private final SystemSettingsRepository settingsRepo;
    private final AlertRecipientRepository recipientRepo;

    /**
     * Creates the settings service backed by the given repositories.
     *
     * @param settingsRepo  repository for system settings
     * @param recipientRepo repository for alert recipients
     */
    public SettingsServiceImpl(SystemSettingsRepository settingsRepo,
                               AlertRecipientRepository recipientRepo) {
        this.settingsRepo = settingsRepo;
        this.recipientRepo = recipientRepo;
    }

    /** Retrieves the current system configuration and all alert recipients.
     *
     * @return the current system settings combined with all alert recipients */
    @Override
    public SettingsDto getSettings() {
        SystemSettings s = getOrCreate();
        List<RecipientDto> recipients = recipientRepo.findAll().stream()
                .map(r -> new RecipientDto(r.getId(), r.getName(), r.getRole(), r.getEmail(),
                        r.getPhone(), r.isNotifyCritical(), r.isNotifyWarning(), r.getLastTested()))
                .toList();
        return toDto(s, recipients);
    }

    /** Applies non-null fields from the request to the system settings.
     *
     * @param req the settings fields to update (only non-null fields are applied) */
    @Override
    @Transactional
    public SettingsDto updateSettings(UpdateSettingsRequest req) {
        SystemSettings s = getOrCreate();

        if (req.rapidRiseSensitivity() != null) s.setRapidRiseSensitivity(req.rapidRiseSensitivity());
        if (req.criticalLevelSensitivity() != null) s.setCriticalLevelSensitivity(req.criticalLevelSensitivity());
        if (req.quietHoursEnabled() != null) s.setQuietHoursEnabled(req.quietHoursEnabled());
        if (req.quietHoursRange() != null) s.setQuietHoursRange(req.quietHoursRange());
        if (req.systemHealthNotify() != null) s.setSystemHealthNotify(req.systemHealthNotify());
        if (req.dataRetentionDays() != null) s.setDataRetentionDays(req.dataRetentionDays());
        if (req.useJavaApi() != null) s.setUseJavaApi(req.useJavaApi());
        if (req.javaBaseUrl() != null) s.setJavaBaseUrl(req.javaBaseUrl());

        settingsRepo.save(s);
        return getSettings();
    }

    /** Lists all configured alert notification recipients.
     *
     * @return all configured alert recipients */
    @Override
    public List<RecipientDto> getRecipients() {
        return recipientRepo.findAll().stream()
                .map(r -> new RecipientDto(r.getId(), r.getName(), r.getRole(), r.getEmail(),
                        r.getPhone(), r.isNotifyCritical(), r.isNotifyWarning(), r.getLastTested()))
                .toList();
    }

    /**
     * Updates an existing recipient's contact details and notification preferences.
     *
     * @param id  the recipient identifier
     * @param dto the updated fields (only non-null text fields are applied)
     * @return the updated recipient
     */
    @Override
    @Transactional
    public RecipientDto updateRecipient(String id, RecipientDto dto) {
        AlertRecipient r = recipientRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Recipient not found: " + id));
        if (dto.name() != null) r.setName(dto.name());
        if (dto.role() != null) r.setRole(dto.role());
        if (dto.email() != null) r.setEmail(dto.email());
        if (dto.phone() != null) r.setPhone(dto.phone());
        r.setNotifyCritical(dto.notifyCritical());
        r.setNotifyWarning(dto.notifyWarning());
        recipientRepo.save(r);
        return new RecipientDto(r.getId(), r.getName(), r.getRole(), r.getEmail(),
                r.getPhone(), r.isNotifyCritical(), r.isNotifyWarning(), r.getLastTested());
    }

    private SystemSettings getOrCreate() {
        return settingsRepo.findById(CONFIG_ID)
                .orElseGet(() -> settingsRepo.save(new SystemSettings()));
    }

    private SettingsDto toDto(SystemSettings s, List<RecipientDto> recipients) {
        return new SettingsDto(
                s.getRapidRiseSensitivity(),
                s.getCriticalLevelSensitivity(),
                s.isQuietHoursEnabled(),
                s.getQuietHoursRange(),
                s.isSystemHealthNotify(),
                s.getDataRetentionDays(),
                s.isUseJavaApi(),
                s.getJavaBaseUrl(),
                recipients
        );
    }
}
