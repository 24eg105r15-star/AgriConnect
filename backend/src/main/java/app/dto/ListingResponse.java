package app.dto;

import app.model.ListingStatus;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ListingResponse {

    private Long id;

    private Long farmerId;
    private String farmerName;

    private Long cropId;
    private String cropName;
    private String variety;

    private BigDecimal availableQuantityQuintals;
    private BigDecimal minimumOrderQuintals;
    private BigDecimal askingPricePerQuintal;

    private String qualityGrade;
    private String description;
    private String imageUrl;

    private LocalDate harvestDate;
    private LocalDate availableFrom;

    private String pickupDistrict;
    private String pickupState;
    private String transportArrangement;

    private ListingStatus status;
    private LocalDateTime createdAt;
}