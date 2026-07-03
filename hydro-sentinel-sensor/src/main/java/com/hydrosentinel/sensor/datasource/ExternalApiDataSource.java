package com.hydrosentinel.sensor.datasource;

import com.hydrosentinel.domain.enums.DataSourceType;
import com.hydrosentinel.domain.model.Sensor;
import com.hydrosentinel.domain.model.Station;
import com.hydrosentinel.domain.sensor.DataSourceProvider;
import com.hydrosentinel.sensor.config.ExternalSensorApiProperties;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.client.ClientHttpRequestFactory;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.util.Collections;
import java.util.List;

/**
 * Data source that fetches live station and sensor telemetry from a remote REST API.
 * Falls back to empty results and zero values when the API is unreachable.
 */
@Component
public class ExternalApiDataSource implements DataSourceProvider {

    private static final Logger log = LoggerFactory.getLogger(ExternalApiDataSource.class);
    private static final ParameterizedTypeReference<List<Station>> STATION_LIST = new ParameterizedTypeReference<>() {};
    private static final ParameterizedTypeReference<List<Sensor>> SENSOR_LIST = new ParameterizedTypeReference<>() {};

    private final RestClient restClient;
    private final ExternalSensorApiProperties.Endpoints endpoints;

    /**
     * Creates the data source from the provided API properties.
     *
     * @param props configuration properties for the external sensor API
     */
    public ExternalApiDataSource(ExternalSensorApiProperties props) {
        this.endpoints = props.getEndpoints();
        this.restClient = RestClient.builder()
                .requestFactory(requestFactory(props))
                .baseUrl(props.getBaseUrl())
                .defaultHeader("Authorization", "Bearer " + props.getApiKey())
                .build();
    }

    private static ClientHttpRequestFactory requestFactory(ExternalSensorApiProperties p) {
        var factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(java.time.Duration.ofMillis(p.getConnectTimeoutMs()));
        factory.setReadTimeout(java.time.Duration.ofMillis(p.getReadTimeoutMs()));
        return factory;
    }

    /** @return {@link DataSourceType#EXTERNAL} */
    @Override
    public DataSourceType getType() {
        return DataSourceType.EXTERNAL;
    }

    /** Fetches stations from the remote API, returning an empty list on failure. */
    @Override
    public List<Station> fetchStations() {
        try {
            List<Station> result = restClient.get()
                    .uri(endpoints.getStations())
                    .retrieve()
                    .body(STATION_LIST);
            return result != null ? result : Collections.emptyList();
        } catch (Exception e) {
            log.error("Failed to fetch stations from external API: {}", e.getMessage());
            return Collections.emptyList();
        }
    }

    /** Fetches sensors from the remote API, returning an empty list on failure. */
    @Override
    public List<Sensor> fetchSensors() {
        try {
            List<Sensor> result = restClient.get()
                    .uri(endpoints.getSensors())
                    .retrieve()
                    .body(SENSOR_LIST);
            return result != null ? result : Collections.emptyList();
        } catch (Exception e) {
            log.error("Failed to fetch sensors from external API: {}", e.getMessage());
            return Collections.emptyList();
        }
    }

    /** Fetches rain level from the external telemetry endpoint, returning 0.0 on failure. */
    @Override
    public double fetchRainLevel() {
        return fetchDouble(endpoints.getRainLevel(), "rain level");
    }

    /** Fetches basin saturation from the external telemetry endpoint, returning 0.0 on failure. */
    @Override
    public double fetchBasinSaturation() {
        return fetchDouble(endpoints.getBasinSaturation(), "basin saturation");
    }

    /** Fetches discharge rate from the external telemetry endpoint, returning 0.0 on failure. */
    @Override
    public double fetchDischargeRate() {
        return fetchDouble(endpoints.getDischargeRate(), "discharge rate");
    }

    /** Fetches sensor health from the external telemetry endpoint, returning 0.0 on failure. */
    @Override
    public double fetchSensorHealth() {
        return fetchDouble(endpoints.getSensorHealth(), "sensor health");
    }

    private double fetchDouble(String path, String label) {
        try {
            Double value = restClient.get()
                    .uri(path)
                    .retrieve()
                    .body(Double.class);
            return value != null ? value : 0.0;
        } catch (Exception e) {
            log.error("Failed to fetch {} from external API: {}", label, e.getMessage());
            return 0.0;
        }
    }
}
