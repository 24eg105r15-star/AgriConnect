package app.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class RatingRequest {

    @NotNull(message = "Transaction ID is required")
    @Positive(message = "Transaction ID must be positive")
    private Long transactionId;

    @NotNull(message = "Rating score is required")
    @Min(value = 1, message = "Minimum rating is 1")
    @Max(value = 5, message = "Maximum rating is 5")
    private Integer score;

    @Size(max = 1000, message = "Comment must not exceed 1000 characters")
    private String comment;
}