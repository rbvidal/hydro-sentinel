package com.hydrosentinel.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

/**
 * Spring Boot entry point for the Hydro Sentinel flood monitoring and alert management platform.
 */
@SpringBootApplication(scanBasePackages = "com.hydrosentinel")
@EntityScan("com.hydrosentinel")
@EnableJpaRepositories("com.hydrosentinel")
@ConfigurationPropertiesScan("com.hydrosentinel")
public class HydroSentinelApplication {

    /** Launches the Spring Boot application. */
    public static void main(String[] args) {
        SpringApplication.run(HydroSentinelApplication.class, args);
    }
}
