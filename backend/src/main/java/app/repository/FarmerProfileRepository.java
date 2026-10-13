package app.repository;

import app.model.FarmerProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface FarmerProfileRepository
        extends JpaRepository<FarmerProfile, Long> {

    Optional<FarmerProfile> findByUser_Id(Long userId);

    boolean existsByUser_Id(Long userId);
}