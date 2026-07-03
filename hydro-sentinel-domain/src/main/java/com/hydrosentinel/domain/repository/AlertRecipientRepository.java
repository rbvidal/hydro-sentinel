package com.hydrosentinel.domain.repository;

import com.hydrosentinel.domain.model.AlertRecipient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for {@link AlertRecipient} entities.
 */
@Repository
public interface AlertRecipientRepository extends JpaRepository<AlertRecipient, String> {
}
