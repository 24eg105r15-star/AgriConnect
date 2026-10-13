
package app.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
public class ListingRequest {

    @NotBlank(message = "Crop name is required")
    @Size(max = 120, message = "Crop name cannot exceed 120 characters")
    private String cropName;

    @NotBlank(message = "Variety is required")
    @Size(max = 120)
    private String variety;

    @NotNull
    @DecimalMin(value = "0.01",
            message = "Available quantity must be positive")
    private BigDecimal availableQuantityQuintals;

    @NotNull
    @DecimalMin(value = "0.01",
            message = "Minimum order quantity must be positive")
    private BigDecimal minimumOrderQuintals;

    @NotNull
    @DecimalMin(value = "0.01",
            message = "Asking price must be positive")
    private BigDecimal askingPricePerQuintal;

    @NotBlank(message = "Quality grade is required")
    @Size(max = 50)
    private String qualityGrade;

    @Size(max = 1000)
    private String description;

    @Size(max = 500)
    private String imageUrl;

    private LocalDate harvestDate;

    @NotNull(message = "Available-from date is required")
    private LocalDate availableFrom;

    @NotBlank
    @Size(max = 100)
    private String pickupDistrict;

    @NotBlank
    @Size(max = 100)
    private String pickupState;

    @NotBlank(message = "Transport arrangement is required")
    private String transportArrangement = "BUYER_ARRANGES";
}
