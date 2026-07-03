package com.hydrosentinel.domain.repository;

import com.hydrosentinel.domain.model.Station;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for {@link Station} entities.
 */
@Repository
public interface StationRepository extends JpaRepository<Station, String> {
}
