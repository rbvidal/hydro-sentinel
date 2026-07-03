package com.hydrosentinel.domain.repository;

import com.hydrosentinel.domain.model.SystemSettings;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for {@link SystemSettings} entities.
 */
@Repository
public interface SystemSettingsRepository extends JpaRepository<SystemSettings, String> {
}
