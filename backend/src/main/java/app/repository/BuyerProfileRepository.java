package app.repository;

import app.model.BuyerProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BuyerProfileRepository
        extends JpaRepository<BuyerProfile, Long> {

    Optional<BuyerProfile> findByUser_Id(Long userId);

    boolean existsByUser_Id(Long userId);

    boolean existsByGstNumber(String gstNumber);
}