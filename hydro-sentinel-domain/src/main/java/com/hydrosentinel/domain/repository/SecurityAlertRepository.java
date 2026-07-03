package com.hydrosentinel.domain.repository;

import com.hydrosentinel.domain.enums.AlertSeverity;
import com.hydrosentinel.domain.enums.AlertStatus;
import com.hydrosentinel.domain.model.SecurityAlert;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

/**
 * Spring Data JPA repository for {@link SecurityAlert} entities.
 */
@Repository
public interface SecurityAlertRepository extends JpaRepository<SecurityAlert, String> {

    /**
     * Finds all alerts with the given status.
     */
    List<SecurityAlert> findByStatus(AlertStatus status);

    /**
     * Finds all alerts with the given severity.
     */
    List<SecurityAlert> findBySeverity(AlertSeverity severity);

    /**
     * Finds all alerts matching both the given status and severity.
     */
    List<SecurityAlert> findByStatusAndSeverity(AlertStatus status, AlertSeverity severity);

    /**
     * Counts alerts with the given status.
     */
    long countByStatus(AlertStatus status);
}
