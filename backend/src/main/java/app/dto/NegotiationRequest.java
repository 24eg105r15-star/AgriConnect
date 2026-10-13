
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
public class NegotiationRequest {

    @NotNull(message = "Quantity is required")
    @DecimalMin("0.01")
    private BigDecimal proposedQuantityQuintals;

    @NotNull(message = "Proposed price is required")
    @DecimalMin("0.01")
    private BigDecimal proposedPricePerQuintal;

    @Size(max = 1000)
    private String message;
}
