
package app.dto;

import app.model.NegotiationStatus;
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
public class NegotiationResponse {

    private Long id;
    private Long orderId;

    private Long senderUserId;
    private String senderName;

    private BigDecimal proposedQuantityQuintals;
    private BigDecimal proposedPricePerQuintal;

    private String message;
    private NegotiationStatus status;
    private LocalDateTime createdAt;
}
