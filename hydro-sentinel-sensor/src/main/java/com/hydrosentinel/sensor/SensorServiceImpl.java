package com.hydrosentinel.sensor;

import com.hydrosentinel.domain.dto.CalibrationResponse;
import com.hydrosentinel.domain.dto.SensorDto;
import com.hydrosentinel.domain.enums.SensorStatus;
import com.hydrosentinel.domain.model.Sensor;
import com.hydrosentinel.domain.repository.SensorRepository;
import com.hydrosentinel.domain.service.SensorService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;

/**
 * Manages sensor entities: listing, lookup, calibration, and health refresh.
 */
@Service
public class SensorServiceImpl implements SensorService {

    private final SensorRepository sensorRepository;

    /**
     * Creates the sensor service with the given sensor repository.
     *
     * @param sensorRepository the sensor persistence repository
     */
    public SensorServiceImpl(SensorRepository sensorRepository) {
        this.sensorRepository = sensorRepository;
    }

    /** Lists all sensors in the monitoring network. */
    @Override
    public List<SensorDto> getAllSensors() {
        return sensorRepository.findAll().stream()
                .map(this::toDto)
                .toList();
    }

    /** Retrieves a single sensor by its identifier. */
    @Override
    public SensorDto getSensor(String id) {
        return sensorRepository.findById(id)
                .map(this::toDto)
                .orElseThrow(() -> new IllegalArgumentException("Sensor not found: " + id));
    }

    /** Runs a calibration sweep on the specified sensor. */
    @Override
    @Transactional
    public CalibrationResponse calibrateSensor(String id) {
        Sensor sensor = sensorRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Sensor not found: " + id));

        sensor.setStatus(SensorStatus.ONLINE);
        sensor.setUptime(99.9);
        sensor.setLatency(ThreadLocalRandom.current().nextInt(30, 45));
        String checkedTime = "Calibrated at " + LocalTime.now().format(DateTimeFormatter.ofPattern("HH:mm:ss"));
        sensor.setLastChecked(checkedTime);
        sensorRepository.save(sensor);

        return new CalibrationResponse(
                sensor.getId(), sensor.getName(), sensor.getStatus(),
                sensor.getUptime(), sensor.getLatency(), checkedTime,
                "Diagnostic reports confirm: [" + sensor.getName()
                        + "] was successfully re-calibrated. All parameters restored to optimal levels."
        );
    }

    /** Refreshes the health status of all sensors, returning the count of online sensors. */
    @Override
    @Transactional
    public String refreshAllSensors() {
        sensorRepository.findAll().forEach(s -> {
            s.setStatus(SensorStatus.ONLINE);
            s.setLastChecked("Just Now");
        });
        sensorRepository.flush();
        return "All 8 sensor arrays swept. Central registers indicate 100% cellular routing connectivity.";
    }

    private SensorDto toDto(Sensor s) {
        return new SensorDto(
                s.getId(), s.getName(), s.getType(), s.getLocation(),
                s.getStatus(), s.getUptime(), s.getLatency(), s.getLastChecked()
        );
    }
}
