package com.hydrosentinel.domain.model;

import com.hydrosentinel.domain.enums.SensorStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

/**
 * A physical or virtual sensor that collects telemetry data.
 */
@Entity
@Table(name = "sensors")
public class Sensor {

    @Id
    private String id;

    @NotBlank
    private String name;

    private String type;

    private String location;

    @Enumerated(EnumType.STRING)
    private SensorStatus status;

    /** Uptime percentage (0–100). */
    private double uptime;

    /** Latency in milliseconds. */
    private double latency;

    private String lastChecked;

    /** No-arg constructor for JPA. */
    public Sensor() {}

    /**
     * Creates a fully-populated Sensor.
     *
     * @param id unique sensor identifier
     * @param name human-readable sensor name
     * @param type sensor type or model
     * @param location physical or logical location of the sensor
     * @param status current operational status
     * @param uptime uptime percentage (0–100)
     * @param latency latency in milliseconds
     * @param lastChecked human-readable timestamp of the last health check
     */
    public Sensor(String id, String name, String type, String location, SensorStatus status,
                  double uptime, double latency, String lastChecked) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.location = location;
        this.status = status;
        this.uptime = uptime;
        this.latency = latency;
        this.lastChecked = lastChecked;
    }

    /** @return the sensor's unique identifier. */
    public String getId() { return id; }
    /** @param id the unique identifier to set. */
    public void setId(String id) { this.id = id; }

    /** @return the sensor's human-readable name. */
    public String getName() { return name; }
    /** @param name the human-readable name to set. */
    public void setName(String name) { this.name = name; }

    /** @return the sensor's type or model. */
    public String getType() { return type; }
    /** @param type the sensor type to set. */
    public void setType(String type) { this.type = type; }

    /** @return the sensor's physical or logical location. */
    public String getLocation() { return location; }
    /** @param location the sensor location to set. */
    public void setLocation(String location) { this.location = location; }

    /** @return the sensor's current operational status. */
    public SensorStatus getStatus() { return status; }
    /** @param status the sensor status to set. */
    public void setStatus(SensorStatus status) { this.status = status; }

    /** @return the sensor's uptime percentage (0-100). */
    public double getUptime() { return uptime; }
    /** @param uptime the uptime percentage to set. */
    public void setUptime(double uptime) { this.uptime = uptime; }

    /** @return the sensor's latency in milliseconds. */
    public double getLatency() { return latency; }
    /** @param latency the latency value to set. */
    public void setLatency(double latency) { this.latency = latency; }

    /** @return the human-readable timestamp of the sensor's last health check. */
    public String getLastChecked() { return lastChecked; }
    /** @param lastChecked the last-checked timestamp to set. */
    public void setLastChecked(String lastChecked) { this.lastChecked = lastChecked; }
}
