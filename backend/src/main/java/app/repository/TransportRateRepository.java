package app.repository;

import app.model.TransportRate;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TransportRateRepository
        extends JpaRepository<TransportRate, Long> {

    Optional<TransportRate>
    findByFromDistrictIgnoreCaseAndToDistrictIgnoreCaseAndStateIgnoreCase(
            String fromDistrict,
            String toDistrict,
            String state
    );

    List<TransportRate> findByStateIgnoreCaseAndActiveTrue(
            String state
    );

    List<TransportRate> findByActiveTrue();
}