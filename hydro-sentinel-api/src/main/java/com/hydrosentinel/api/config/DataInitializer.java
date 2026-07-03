package com.hydrosentinel.api.config;

import com.hydrosentinel.domain.enums.DataSourceType;
import com.hydrosentinel.domain.model.AlertRecipient;
import com.hydrosentinel.domain.model.SystemSettings;
import com.hydrosentinel.domain.repository.AlertRecipientRepository;
import com.hydrosentinel.domain.repository.SensorRepository;
import com.hydrosentinel.domain.repository.StationRepository;
import com.hydrosentinel.domain.repository.SystemSettingsRepository;
import com.hydrosentinel.domain.sensor.DataSourceProvider;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 * Seeds the database with default system settings, alert recipients, stations,
 * and sensors on application startup when the corresponding tables are empty.
 */
@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);
    private static final String CONFIG_ID = "app-config";

    private final SystemSettingsRepository settingsRepo;
    private final AlertRecipientRepository recipientRepo;
    private final StationRepository stationRepo;
    private final SensorRepository sensorRepo;
    private final DataSourceType configuredSource;
    private final Map<DataSourceType, DataSourceProvider> dataSources;

    /**
     * Initializes the database with seed data from the configured data source.
     *
     * @param settingsRepo   repository for system settings
     * @param recipientRepo  repository for alert recipients
     * @param stationRepo    repository for monitoring stations
     * @param sensorRepo     repository for sensors
     * @param dataSource     configured data source type, defaults to {@code MOCK}
     * @param providers      all available {@link DataSourceProvider} beans
     */
    public DataInitializer(SystemSettingsRepository settingsRepo,
                           AlertRecipientRepository recipientRepo,
                           StationRepository stationRepo,
                           SensorRepository sensorRepo,
                           @Value("${app.data-source:MOCK}") String dataSource,
                           List<DataSourceProvider> providers) {
        this.settingsRepo = settingsRepo;
        this.recipientRepo = recipientRepo;
        this.stationRepo = stationRepo;
        this.sensorRepo = sensorRepo;
        this.configuredSource = DataSourceType.valueOf(dataSource.toUpperCase());
        this.dataSources = providers.stream()
                .collect(Collectors.toMap(DataSourceProvider::getType, Function.identity()));
    }

    /** Seeds stations and sensors on startup if the database is empty. */
    @Override
    @Transactional
    public void run(String... args) {
        log.info("Data source configured: {}", configuredSource);

        if (settingsRepo.findById(CONFIG_ID).isEmpty()) {
            log.info("Creating default system settings.");
            settingsRepo.save(new SystemSettings());
        }

        if (recipientRepo.count() == 0) {
            log.info("Seeding default alert recipients.");
            recipientRepo.saveAll(defaultRecipients());
        }

        DataSourceProvider provider = dataSources.get(configuredSource);
        if (provider == null) {
            log.warn("No DataSourceProvider for type {}, falling back to MOCK.", configuredSource);
            provider = dataSources.get(DataSourceType.MOCK);
        }

        if (stationRepo.count() == 0 && provider != null) {
            log.info("Seeding stations from: {}", provider.getType());
            stationRepo.saveAll(provider.fetchStations());
        }

        if (sensorRepo.count() == 0 && provider != null) {
            log.info("Seeding sensors from: {}", provider.getType());
            sensorRepo.saveAll(provider.fetchSensors());
        }

        log.info("Data initialization complete. Stations: {}, Sensors: {}, Recipients: {}",
                stationRepo.count(), sensorRepo.count(), recipientRepo.count());
    }

    private List<AlertRecipient> defaultRecipients() {
        return List.of(
                new AlertRecipient("rec-1", "Elena Rodriguez", "CIVIL DEFENSE LEAD",
                        "e.rodriguez@city.gov", "+1 (555) 012-9923", true, true, "14 Oct, 09:42"),
                new AlertRecipient("rec-2", "Capt. Marcus Thorne", "EMERGENCY SERVICES",
                        "m.thorne@fire.dept", "+1 (555) 928-4400", true, false, "12 Oct, 14:15"),
                new AlertRecipient("rec-3", "Sarah Jenkins", "COMMUNITY REPRESENTATIVE",
                        "s.jenkins@estates.org", "+1 (555) 102-3388", true, true, "10 Oct, 11:30"),
                new AlertRecipient("rec-4", "Devon Miller", "INFRASTRUCTURE MANAGER",
                        "d.miller@watergrid.net", "+1 (555) 772-1190", true, false, "08 Oct, 16:45")
        );
    }
}
