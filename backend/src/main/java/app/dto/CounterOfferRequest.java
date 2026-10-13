
package app.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public class CounterOfferRequest {

    @NotNull(message = "Counter-offer price is required.")
    @DecimalMin(
        value = "0.01",
        message = "Counter-offer price must be greater than zero."
    )
    private BigDecimal counterOfferPricePerQuintal;

    public BigDecimal getCounterOfferPricePerQuintal() {
        return counterOfferPricePerQuintal;
    }

    public void setCounterOfferPricePerQuintal(
            BigDecimal counterOfferPricePerQuintal) {
        this.counterOfferPricePerQuintal = counterOfferPricePerQuintal;
    }
}
