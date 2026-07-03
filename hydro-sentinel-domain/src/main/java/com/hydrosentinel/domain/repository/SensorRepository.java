package com.hydrosentinel.domain.repository;

import com.hydrosentinel.domain.model.Sensor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for {@link Sensor} entities.
 */
@Repository
public interface SensorRepository extends JpaRepository<Sensor, String> {
}
