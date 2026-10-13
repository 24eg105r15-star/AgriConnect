package app.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
public class OrderRequest {

    @NotNull(message = "Listing ID is required")
    private Long listingId;

    @NotNull(message = "Requested quantity is required")
    @DecimalMin(value = "0.01",
                message = "Requested quantity must be positive")
    private BigDecimal quantityRequestedQuintals;

    @NotNull(message = "Offer price is required")
    @DecimalMin(value = "0.01",
                message = "Offer price must be positive")
    private BigDecimal offeredPricePerQuintal;

    @Size(max = 1000)
    private String buyerMessage;
}