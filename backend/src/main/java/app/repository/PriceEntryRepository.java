package app.repository;

import app.model.PriceEntry;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface PriceEntryRepository
        extends JpaRepository<PriceEntry, Long> {

    List<PriceEntry>
    findByCrop_IdAndMarket_IdAndPriceDateBetweenOrderByPriceDateAsc(
            Long cropId,
            Long marketId,
            LocalDate startDate,
            LocalDate endDate
    );

    List<PriceEntry> findByCrop_IdAndPriceDateOrderByModalPriceDesc(
            Long cropId,
            LocalDate priceDate
    );

    List<PriceEntry> findByMarket_IdAndPriceDate(
            Long marketId,
            LocalDate priceDate
    );

    List<PriceEntry> findByCrop_IdOrderByPriceDateDesc(Long cropId);
}