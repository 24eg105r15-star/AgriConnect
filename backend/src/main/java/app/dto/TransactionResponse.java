
package app.dto;

import app.model.PaymentStatus;
import app.model.DeliveryStatus;
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
public class TransactionResponse {

    private Long id;
    private Long orderId;

    private String cropName;

    private BigDecimal finalQuantityQuintals;
    private BigDecimal finalPricePerQuintal;
    private BigDecimal totalAmount;

    private PaymentStatus paymentStatus;
    private DeliveryStatus deliveryStatus;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

