package com.hydrosentinel.sensor.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * External sensor API connection settings, bound from {@code app.external-sensor-api.*} configuration keys.
 */
@Component
@ConfigurationProperties(prefix = "app.external-sensor-api")
public class ExternalSensorApiProperties {

    /** Base URL of the external sensor API. */
    private String baseUrl = "https://api.hydrosentinel.example.com/v1";
    /** Bearer token for API authentication. */
    private String apiKey = "";
    /** Connection timeout in milliseconds. */
    private int connectTimeoutMs = 5000;
    /** Read timeout in milliseconds. */
    private int readTimeoutMs = 10000;
    /** API endpoint paths. */
    private Endpoints endpoints = new Endpoints();

    /** Returns the configured base URL. @return the base URL of the external sensor API */
    public String getBaseUrl() { return baseUrl; }
    /** Sets the base URL for the external sensor API. */
    public void setBaseUrl(String baseUrl) { this.baseUrl = baseUrl; }
    /** Returns the configured API key. @return the Bearer token for API authentication */
    public String getApiKey() { return apiKey; }
    /** Sets the Bearer token for API authentication. */
    public void setApiKey(String apiKey) { this.apiKey = apiKey; }
    /** Returns the configured connection timeout. @return the connection timeout in milliseconds */
    public int getConnectTimeoutMs() { return connectTimeoutMs; }
    /** Sets the connection timeout in milliseconds. */
    public void setConnectTimeoutMs(int connectTimeoutMs) { this.connectTimeoutMs = connectTimeoutMs; }
    /** Returns the configured read timeout. @return the read timeout in milliseconds */
    public int getReadTimeoutMs() { return readTimeoutMs; }
    /** Sets the read timeout in milliseconds. */
    public void setReadTimeoutMs(int readTimeoutMs) { this.readTimeoutMs = readTimeoutMs; }
    /** Returns the API endpoint paths configuration. @return the API endpoint paths */
    public Endpoints getEndpoints() { return endpoints; }
    /** Sets the API endpoint paths. */
    public void setEndpoints(Endpoints endpoints) { this.endpoints = endpoints; }

    /**
     * URI path segments for each external sensor API resource.
     */
    public static class Endpoints {
        private String stations = "/stations";
        private String sensors = "/sensors";
        private String rainLevel = "/telemetry/rain";
        private String basinSaturation = "/telemetry/saturation";
        private String dischargeRate = "/telemetry/discharge";
        private String sensorHealth = "/telemetry/health";

        /** Returns the stations endpoint path. @return the stations endpoint path */
        public String getStations() { return stations; }
        /** Sets the stations endpoint path. */
        public void setStations(String stations) { this.stations = stations; }
        /** Returns the sensors endpoint path. @return the sensors endpoint path */
        public String getSensors() { return sensors; }
        /** Sets the sensors endpoint path. */
        public void setSensors(String sensors) { this.sensors = sensors; }
        /** Returns the rain level telemetry endpoint path. @return the rain level telemetry endpoint path */
        public String getRainLevel() { return rainLevel; }
        /** Sets the rain level telemetry endpoint path. */
        public void setRainLevel(String rainLevel) { this.rainLevel = rainLevel; }
        /** Returns the basin saturation telemetry endpoint path. @return the basin saturation telemetry endpoint path */
        public String getBasinSaturation() { return basinSaturation; }
        /** Sets the basin saturation telemetry endpoint path. */
        public void setBasinSaturation(String basinSaturation) { this.basinSaturation = basinSaturation; }
        /** Returns the discharge rate telemetry endpoint path. @return the discharge rate telemetry endpoint path */
        public String getDischargeRate() { return dischargeRate; }
        /** Sets the discharge rate telemetry endpoint path. */
        public void setDischargeRate(String dischargeRate) { this.dischargeRate = dischargeRate; }
        /** Returns the sensor health telemetry endpoint path. @return the sensor health telemetry endpoint path */
        public String getSensorHealth() { return sensorHealth; }
        /** Sets the sensor health telemetry endpoint path. */
        public void setSensorHealth(String sensorHealth) { this.sensorHealth = sensorHealth; }
    }
}
