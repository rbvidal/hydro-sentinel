package com.hydrosentinel.sensor.datasource;

import com.hydrosentinel.domain.enums.DataSourceType;
import com.hydrosentinel.domain.enums.SensorStatus;
import com.hydrosentinel.domain.enums.StationStatus;
import com.hydrosentinel.domain.model.Sensor;
import com.hydrosentinel.domain.model.Station;
import com.hydrosentinel.domain.sensor.DataSourceProvider;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Data source that returns hard-coded mock station and sensor data for local development and demo purposes.
 */
@Component
public class MockDataSource implements DataSourceProvider {

    private static final double[] HISTORY_5KM = {4.38, 4.41, 4.39, 4.42, 4.45, 4.43, 4.48, 4.51};
    private static final double[] HISTORY_4KM = {4.49, 4.48, 4.48, 4.47, 4.49, 4.48, 4.48, 4.48};
    private static final double[] HISTORY_3KM = {4.49, 4.48, 4.48, 4.47, 4.49, 4.48, 4.48, 4.48};
    private static final double[] HISTORY_2KM = {4.36, 4.35, 4.34, 4.35, 4.33, 4.32, 4.31, 4.31};
    private static final double[] HISTORY_1KM = {4.28, 4.28, 4.28, 4.28, 4.28, 4.28, 4.28, 4.28};

    private static final String IMG_5KM = "https://lh3.googleusercontent.com/aida-public/AB6AXuDhKJHVkekk-lJhbNuZQHk2frUPPypGKGOFY0J395LNSlijfFmDE4rskUHnCU6s4XCHp4mD--IjZhJbK_x8wmQRAhuJVcMDB5J-l0Qe9KmGKL-K6r70TRIDe6x13_1n9CXqu91Bge0jbS1OKx5LX7U94fJx2_YrITO2qk3vIpgfkpGSW2bYMrPObDA25s_bkbQk7fGkQeogJYDRXkFjxBNoy-K3IYkzNsrAyfcAyjUB1q1DLxxB3ulMV2Sje6tnGgQ05ITn6y1oD0RS";
    private static final String IMG_4KM = "https://lh3.googleusercontent.com/aida-public/AB6AXuDqm2Qg__LLdNXewIxQ60HLkLcKsKLM0jFpnpcGtgfdVxC-ZeIYHvWzcPtLKmxFhfeZaMQHScoT1W_0HhdgxQRgBIUR00JPPgYfAUe2FEV1XUFO4A5cqtryjgpelBoH7fbfFiozjY9gyI_0NTLmglNS2WjA5Hnih66B1JHOV1rz7wnHrK1vUId31G0PDK6QtB7UjF42d4LunDM0h_bDydccDwwxxdA7F8OhD_y7UF8v_oJQz7lAGqiehW-nVBUcVeihYnv6zUeNTWBb";
    private static final String IMG_3KM = "https://lh3.googleusercontent.com/aida-public/AB6AXuAQPzApoMY3lw60HVwzVdXA002j0wkuX_SdKDJHSQC17uPGZsL7vSfj5VuE5TF3qQ_WMBOjG0N0duyyI_d3IYK3B42yVRSE5LhIJBch9mG5YWGDAXb5e6--c6AuP1yj_q3HmtbOVYCkZLlMo-StnmE8uV3YdOH9qQIu7O0BFsj7iZux26lmxmFcqfz0jXBRztyV6GGVMmrmaEkP4Ko17IjLLicjQ2uSfffkJdylHISkYQbLAIzSnaOdckzs3lDw30mrDKsSwhpkkPjg";
    private static final String IMG_2KM = "https://lh3.googleusercontent.com/aida-public/AB6AXuBp5ZObaTwrmZzG_2ZT8_4MoQNJYy5bj80wpRW1mgeIbBPJ15vM9aDt-t3amTHl0mq1RN5_PG1WlDR6bUiQQeVChd54BFiSiIp9EXw-tTdjXshm3m9lacgGqqOPNWj4DHuGKXRosH9GRS79Vq9H0xD2cPirXq4_mNsKOZ29AwQ6IR9dRcLORFIZ43LNPzQClZec0i0z4j-OnuG1QbSqhYqxnpt0tZFk0vHp2CZJWipnIgl2kU9EfeRx9hmEsbiaC3ZZLP02VmdtSOkS";
    private static final String IMG_1KM = "https://lh3.googleusercontent.com/aida-public/AB6AXuB9UpY1WwolTa-Dol3ad7DIZ5kxYsKlzGCR0r7_IPN9myBkTCoUuJ4KQNPTBpFqpfSXTtK58ielQTRrpqtFcqUzpckUHkC076E_qYdcW0NJceLfDVCELVNCPa_QqS1JtGNxrB_uwSdB56xNcKADPLVw3ntviVxckDXzRJhbj0_lcs_DeAh49K4l9xFy9ht-vgiX2ADJMKDlY35vzynEcEU3O3qT6Z0VDHcXSFdGB3C3kNpoDENyvV_0-oe-Wd4En07cslzfHdZ6ivBl";

    /** @return {@link DataSourceType#MOCK} */
    @Override
    public DataSourceType getType() {
        return DataSourceType.MOCK;
    }

    /** Returns hardcoded demo stations for development and testing. */
    @Override
    public List<Station> fetchStations() {
        return List.of(
                new Station("st-5km", "LIVE 5KM", "5KM", 4.51, 0.05, StationStatus.NORMAL, IMG_5KM, HISTORY_5KM),
                new Station("st-4km", "LIVE 4KM", "4KM", 4.48, 0.00, StationStatus.NORMAL, IMG_4KM, HISTORY_4KM),
                new Station("st-3km", "LIVE 3KM", "3KM", 4.48, 0.00, StationStatus.NORMAL, IMG_3KM, HISTORY_3KM),
                new Station("st-2km", "LIVE 2KM", "2KM", 4.31, -0.02, StationStatus.NORMAL, IMG_2KM, HISTORY_2KM),
                new Station("st-1km", "LIVE 1KM", "1KM", 4.28, 0.00, StationStatus.NORMAL, IMG_1KM, HISTORY_1KM)
        );
    }

    /** Returns hardcoded demo sensors for development and testing. */
    @Override
    public List<Sensor> fetchSensors() {
        return List.of(
                new Sensor("SEN-RAD-5KM", "Ultrasonic Radar 5KM", "ultrasonic radar RF", "Upstream Basin Edge", SensorStatus.ONLINE, 99.8, 42, "Just Now"),
                new Sensor("SEN-RAD-4KM", "Ultrasonic Radar 4KM", "ultrasonic radar RF", "Forest Bend Anchor", SensorStatus.ONLINE, 99.9, 45, "Just Now"),
                new Sensor("SEN-RAD-3KM", "Ultrasonic Radar 3KM", "high accuracy radar", "Bridge Sluice Gate 3", SensorStatus.ONLINE, 98.4, 51, "Just Now"),
                new Sensor("SEN-RAD-2KM", "Ultrasonic Radar 2KM", "light wave radar", "Canal Entrance Pylon", SensorStatus.ONLINE, 99.6, 38, "Just Now"),
                new Sensor("SEN-RAD-1KM", "Ultrasonic Radar 1KM", "acoustic wave sounder", "Inlet Drain wall", SensorStatus.ONLINE, 100.0, 36, "Just Now"),
                new Sensor("SEN-PLU-01", "Tipping-Bucket Pluviometer", "rain precipitation collector", "Command Hub Roof", SensorStatus.ONLINE, 99.7, 41, "Just Now"),
                new Sensor("SEN-SAT-01", "Hydraulic saturation probe", "soil moisture tester", "Waterfall Ridge Slope", SensorStatus.ONLINE, 99.2, 48, "Just Now"),
                new Sensor("SEN-DIS-01", "Doppler flow speed detector", "microwave velocity radar", "Primary Outflow Tunnel", SensorStatus.ONLINE, 99.8, 44, "Just Now")
        );
    }

    /** Returns a fixed mock rain level value in millimeters. */
    @Override
    public double fetchRainLevel() { return 12.0; }

    /** Returns a fixed mock basin saturation percentage. */
    @Override
    public double fetchBasinSaturation() { return 64.01; }

    /** Returns a fixed mock discharge rate in cubic meters per second. */
    @Override
    public double fetchDischargeRate() { return 1.2; }

    /** Returns a fixed mock sensor health percentage (always 100%). */
    @Override
    public double fetchSensorHealth() { return 100.0; }
}
