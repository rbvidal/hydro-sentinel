package com.hydrosentinel.sensor;

import com.hydrosentinel.domain.dto.FlushResponse;
import com.hydrosentinel.domain.dto.StationDto;
import com.hydrosentinel.domain.dto.TelemetryDto;
import com.hydrosentinel.domain.enums.StationStatus;
import com.hydrosentinel.domain.model.Station;
import com.hydrosentinel.domain.repository.StationRepository;
import com.hydrosentinel.domain.service.MonitoringService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Manages monitoring stations: listing, lookup, gate flushing, simulation reset, and telemetry aggregation.
 */
@Service
public class MonitoringServiceImpl implements MonitoringService {

    private final StationRepository stationRepository;

    /**
     * Creates the monitoring service with the given station repository.
     *
     * @param stationRepository the station persistence repository
     */
    public MonitoringServiceImpl(StationRepository stationRepository) {
        this.stationRepository = stationRepository;
    }

    /** Returns live readings for all monitoring stations. */
    @Override
    public List<StationDto> getAllStations() {
        return stationRepository.findAll().stream()
                .map(this::toDto)
                .toList();
    }

    /** Retrieves a single station by its identifier. */
    @Override
    public StationDto getStation(String id) {
        return stationRepository.findById(id)
                .map(this::toDto)
                .orElseThrow(() -> new IllegalArgumentException("Station not found: " + id));
    }

    /**
     * Reduces water level at the given station and shifts its history window accordingly.
     *
     * @param stationId the station to flush
     * @param targetDelta the amount (in meters) to reduce the water level
     * @return the result of the flush operation including before/after levels
     */
    @Override
    @Transactional
    public FlushResponse flushGate(String stationId, double targetDelta) {
        Station station = stationRepository.findById(stationId)
                .orElseThrow(() -> new IllegalArgumentException("Station not found: " + stationId));

        double previousLevel = station.getLevel();
        double newLevel = Math.max(3.8, previousLevel - targetDelta);

        double[] history = station.getHistory();
        if (history != null && history.length > 0) {
            double[] updatedHistory = new double[history.length];
            System.arraycopy(history, 1, updatedHistory, 0, history.length - 1);
            updatedHistory[history.length - 1] = newLevel;
            station.setHistory(updatedHistory);
        }

        station.setLevel(newLevel);
        station.setRateOfChange(-0.15);
        station.setStatus(StationStatus.NORMAL);
        stationRepository.save(station);

        return new FlushResponse(
                stationId, previousLevel, newLevel, -targetDelta,
                "OPEN_FULLY", LocalDateTime.now(),
                "Gate flush executed. Level reduced from " + String.format("%.2f", previousLevel)
                        + "m to " + String.format("%.2f", newLevel) + "m."
        );
    }

    /**
     * Replaces all persisted stations with the provided default set.
     *
     * @param defaultStations the stations to seed after clearing the database
     * @return the newly persisted stations as DTOs
     */
    @Override
    @Transactional
    public List<StationDto> resetSimulation(List<Station> defaultStations) {
        stationRepository.deleteAll();
        stationRepository.saveAll(defaultStations);
        return stationRepository.findAll().stream().map(this::toDto).toList();
    }

    /** Returns aggregate telemetry across all stations and alerts. */
    @Override
    public TelemetryDto getTelemetry() {
        List<Station> stations = stationRepository.findAll();
        double sensorHealth = stations.isEmpty() ? 100.0
                : stations.stream().mapToDouble(s -> s.getStatus() == StationStatus.NORMAL ? 100.0 : 75.0)
                        .average().orElse(100.0);
        return new TelemetryDto(12.0, 64.01, 1.2, sensorHealth);
    }

    private StationDto toDto(Station s) {
        return new StationDto(
                s.getId(), s.getName(), s.getDistance(), s.getLevel(),
                s.getRateOfChange(), s.getStatus().name().toLowerCase(),
                s.getImageUrl(), s.getHistory()
        );
    }
}
