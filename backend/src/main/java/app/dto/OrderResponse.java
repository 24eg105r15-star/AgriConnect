
package app.dto;

import app.model.OrderStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponse {

    private Long id;

    private Long listingId;
    private String cropName;

    private Long buyerId;
    private String buyerName;

    private Long farmerId;
    private String farmerName;

    private BigDecimal quantityRequestedQuintals;
    private BigDecimal offeredPricePerQuintal;
    private BigDecimal agreedPricePerQuintal;

    private OrderStatus status;
    private String buyerMessage;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
