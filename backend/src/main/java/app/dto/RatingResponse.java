
package app.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RatingResponse {

    private Long id;
    private Long transactionId;

    private Long reviewerId;
    private String reviewerName;

    private Long revieweeId;
    private String revieweeName;

    private Integer score;
    private String comment;
    private LocalDateTime createdAt;
}
