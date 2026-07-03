package com.hydrosentinel.domain.model;

import com.hydrosentinel.domain.enums.StationStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import java.util.Arrays;

/**
 * A monitoring station that tracks water levels at a specific location.
 */
@Entity
@Table(name = "stations")
public class Station {

    @Id
    private String id;

    @NotBlank
    private String name;

    private String distance;

    @DecimalMin("0.0")
    private double level;

    private double rateOfChange;

    @Enumerated(EnumType.STRING)
    private StationStatus status;

    @Column(length = 2048)
    private String imageUrl;

    @Column(length = 1024)
    @Convert(converter = DoubleArrayConverter.class)
    private double[] history;

    /** No-arg constructor for JPA. */
    public Station() {}

    /**
     * Creates a fully-populated Station.
     *
     * @param id unique station identifier
     * @param name human-readable station name
     * @param distance display string for distance from reference point
     * @param level current water level reading
     * @param rateOfChange rate of water level change
     * @param status current operational status
     * @param imageUrl URL of the station image
     * @param history recent water level history values
     */
    public Station(String id, String name, String distance, double level, double rateOfChange,
                   StationStatus status, String imageUrl, double[] history) {
        this.id = id;
        this.name = name;
        this.distance = distance;
        this.level = level;
        this.rateOfChange = rateOfChange;
        this.status = status;
        this.imageUrl = imageUrl;
        this.history = history;
    }

    /** @return the station's unique identifier. */
    public String getId() { return id; }
    /** @param id the unique identifier to set. */
    public void setId(String id) { this.id = id; }

    /** @return the station's human-readable name. */
    public String getName() { return name; }
    /** @param name the human-readable name to set. */
    public void setName(String name) { this.name = name; }

    /** @return a display string for the station's distance from a reference point. */
    public String getDistance() { return distance; }
    /** @param distance the distance label to set. */
    public void setDistance(String distance) { this.distance = distance; }

    /** @return the station's current water level reading. */
    public double getLevel() { return level; }
    /** @param level the water level reading to set. */
    public void setLevel(double level) { this.level = level; }

    /** @return the rate of water level change at this station. */
    public double getRateOfChange() { return rateOfChange; }
    /** @param rateOfChange the rate of change to set. */
    public void setRateOfChange(double rateOfChange) { this.rateOfChange = rateOfChange; }

    /** @return the station's current operational status. */
    public StationStatus getStatus() { return status; }
    /** @param status the operational status to set. */
    public void setStatus(StationStatus status) { this.status = status; }

    /** @return the URL of the station's image. */
    public String getImageUrl() { return imageUrl; }
    /** @param imageUrl the image URL to set. */
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    /** @return the station's recent water level history values. */
    public double[] getHistory() { return history; }
    /** @param history the history values to set. */
    public void setHistory(double[] history) { this.history = history; }

    /**
     * JPA converter that serializes a {@code double[]} to/from a comma-separated string
     * in brackets (e.g. {@code [1.0, 2.5]}).
     */
    @Converter
    public static class DoubleArrayConverter implements AttributeConverter<double[], String> {
        /**
         * Converts a {@code double[]} array to its comma-separated string representation.
         *
         * @param attribute the array to convert
         * @return the bracket-enclosed, comma-separated string form
         */
        @Override
        public String convertToDatabaseColumn(double[] attribute) {
            if (attribute == null) return "[]";
            return Arrays.toString(attribute);
        }

        /**
         * Converts a comma-separated database string back to a {@code double[]} array.
         *
         * @param dbData the bracket-enclosed, comma-separated database column value
         * @return the parsed double array, or an empty array if the input is blank or {@code "[]"}
         */
        @Override
        public double[] convertToEntityAttribute(String dbData) {
            if (dbData == null || dbData.isBlank() || "[]".equals(dbData)) return new double[0];
            return Arrays.stream(
                    dbData.replace("[", "").replace("]", "").split(","))
                    .mapToDouble(s -> Double.parseDouble(s.trim()))
                    .toArray();
        }
    }
}
