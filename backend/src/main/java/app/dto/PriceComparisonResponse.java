package app.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PriceComparisonResponse {

    private Long cropId;
    private String cropName;
    private String variety;

    private Long marketId;
    private String marketName;
    private String district;
    private String state;

    private LocalDate priceDate;

    private BigDecimal minPrice;
    private BigDecimal maxPrice;
    private BigDecimal modalPrice;

    private BigDecimal estimatedDistanceKm;
    private BigDecimal transportCostPerQuintal;
    private BigDecimal netPricePerQuintal;
}