package com.hydrosentinel.api.web;

import com.hydrosentinel.domain.service.MonitoringService;
import com.hydrosentinel.domain.dto.StationDto;
import com.hydrosentinel.domain.enums.StationStatus;
import com.hydrosentinel.domain.model.Station;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * REST controller exposing endpoints for simulation state management and reset.
 */
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class SimulationController {

    private final MonitoringService monitoringService;

    /**
     * @param monitoringService the monitoring service backing this controller
     */
    public SimulationController(MonitoringService monitoringService) {
        this.monitoringService = monitoringService;
    }

    /** Resets all station telemetry to default simulation values and clears alert catalogs. */
    @PostMapping("/simulation/reset")
    public Map<String, Object> resetSimulation() {
        List<Station> defaults = List.of(
                new Station("st-5km", "LIVE 5KM", "5KM", 4.51, 0.05, StationStatus.NORMAL,
                        "https://lh3.googleusercontent.com/aida-public/AB6AXuDhKJHVkekk-lJhbNuZQHk2frUPPypGKGOFY0J395LNSlijfFmDE4rskUHnCU6s4XCHp4mD--IjZhJbK_x8wmQRAhuJVcMDB5J-l0Qe9KmGKL-K6r70TRIDe6x13_1n9CXqu91Bge0jbS1OKx5LX7U94fJx2_YrITO2qk3vIpgfkpGSW2bYMrPObDA25s_bkbQk7fGkQeogJYDRXkFjxBNoy-K3IYkzNsrAyfcAyjUB1q1DLxxB3ulMV2Sje6tnGgQ05ITn6y1oD0RS",
                        new double[]{4.38, 4.41, 4.39, 4.42, 4.45, 4.43, 4.48, 4.51}),
                new Station("st-4km", "LIVE 4KM", "4KM", 4.48, 0.00, StationStatus.NORMAL,
                        "https://lh3.googleusercontent.com/aida-public/AB6AXuDqm2Qg__LLdNXewIxQ60HLkLcKsKLM0jFpnpcGtgfdVxC-ZeIYHvWzcPtLKmxFhfeZaMQHScoT1W_0HhdgxQRgBIUR00JPPgYfAUe2FEV1XUFO4A5cqtryjgpelBoH7fbfFiozjY9gyI_0NTLmglNS2WjA5Hnih66B1JHOV1rz7wnHrK1vUId31G0PDK6QtB7UjF42d4LunDM0h_bDydccDwwxxdA7F8OhD_y7UF8v_oJQz7lAGqiehW-nVBUcVeihYnv6zUeNTWBb",
                        new double[]{4.49, 4.48, 4.48, 4.47, 4.49, 4.48, 4.48, 4.48}),
                new Station("st-3km", "ALERT 3KM", "3KM", 5.12, 0.12, StationStatus.ALERT,
                        "https://lh3.googleusercontent.com/aida-public/AB6AXuAQPzApoMY3lw60HVwzVdXA002j0wkuX_SdKDJHSQC17uPGZsL7vSfj5VuE5TF3qQ_WMBOjG0N0duyyI_d3IYK3B42yVRSE5LhIJBch9mG5YWGDAXb5e6--c6AuP1yj_q3HmtbOVYCkZLlMo-StnmE8uV3YdOH9qQIu7O0BFsj7iZux26lmxmFcqfz0jXBRztyV6GGVMmrmaEkP4Ko17IjLLicjQ2uSfffkJdylHISkYQbLAIzSnaOdckzs3lDw30mrDKsSwhpkkPjg",
                        new double[]{4.82, 4.89, 4.93, 4.98, 5.02, 5.05, 5.09, 5.12}),
                new Station("st-2km", "LIVE 2KM", "2KM", 4.31, -0.02, StationStatus.NORMAL,
                        "https://lh3.googleusercontent.com/aida-public/AB6AXuBp5ZObaTwrmZzG_2ZT8_4MoQNJYy5bj80wpRW1mgeIbBPJ15vM9aDt-t3amTHl0mq1RN5_PG1WlDR6bUiQQeVChd54BFiSiIp9EXw-tTdjXshm3m9lacgGqqOPNWj4DHuGKXRosH9GRS79Vq9H0xD2cPirXq4_mNsKOZ29AwQ6IR9dRcLORFIZ43LNPzQClZec0i0z4j-OnuG1QbSqhYqxnpt0tZFk0vHp2CZJWipnIgl2kU9EfeRx9hmEsbiaC3ZZLP02VmdtSOkS",
                        new double[]{4.36, 4.35, 4.34, 4.35, 4.33, 4.32, 4.31, 4.31}),
                new Station("st-1km", "LIVE 1KM", "1KM", 4.28, 0.00, StationStatus.NORMAL,
                        "https://lh3.googleusercontent.com/aida-public/AB6AXuB9UpY1WwolTa-Dol3ad7DIZ5kxYsKlzGCR0r7_IPN9myBkTCoUuJ4KQNPTBpFqpfSXTtK58ielQTRrpqtFcqUzpckUHkC076E_qYdcW0NJceLfDVCELVNCPa_QqS1JtGNxrB_uwSdB56xNcKADPLVw3ntviVxckDXzRJhbj0_lcs_DeAh49K4l9xFy9ht-vgiX2ADJMKDlY35vzynEcEU3O3qT6Z0VDHcXSFdGB3C3kNpoDENyvV_0-oe-Wd4En07cslzfHdZ6ivBl",
                        new double[]{4.28, 4.28, 4.28, 4.28, 4.28, 4.28, 4.28, 4.28})
        );

        List<StationDto> result = monitoringService.resetSimulation(defaults);
        return Map.of("status", "OK", "message",
                "Simulator parameters restored. All station telemetry and alert catalogs reset.", "stations", result);
    }
}
