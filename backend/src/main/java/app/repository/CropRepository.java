package app.repository;

import app.model.Crop;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CropRepository extends JpaRepository<Crop, Long> {

    Optional<Crop> findByNameIgnoreCase(String name);

    boolean existsByNameIgnoreCase(String name);

    List<Crop> findByActiveTrueOrderByNameAsc();
}