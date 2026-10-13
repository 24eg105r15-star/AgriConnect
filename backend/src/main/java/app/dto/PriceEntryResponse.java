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
public class PriceEntryResponse {

    private Long id;

    private Long cropId;
    private String cropName;

    private Long marketId;
    private String marketName;
    private String district;
    private String state;

    private String variety;
    private LocalDate priceDate;

    private BigDecimal minPrice;
    private BigDecimal maxPrice;
    private BigDecimal modalPrice;

    private String priceUnit;
    private String dataSource;
}