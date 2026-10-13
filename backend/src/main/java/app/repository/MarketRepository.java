package app.repository;

import app.model.Market;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MarketRepository extends JpaRepository<Market, Long> {

    List<Market> findByStateIgnoreCase(String state);

    List<Market> findByDistrictIgnoreCase(String district);

    Optional<Market> findByNameIgnoreCaseAndDistrictIgnoreCaseAndStateIgnoreCase(
            String name,
            String district,
            String state
    );

    List<Market> findByActiveTrueOrderByNameAsc();
}