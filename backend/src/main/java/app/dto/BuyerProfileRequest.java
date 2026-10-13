
package app.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class BuyerProfileRequest {

    @NotBlank(message = "Business name is required")
    @Size(max = 180)
    private String businessName;

    @NotBlank(message = "Buyer type is required")
    @Size(max = 40)
    private String buyerType;

    @Size(max = 20)
    private String phoneNumber;

    @Size(max = 20)
    private String gstNumber;

    @Size(max = 150)
    private String city;

    @NotBlank(message = "District is required")
    @Size(max = 100)
    private String district;

    @NotBlank(message = "State is required")
    @Size(max = 100)
    private String state;

    @Size(max = 10)
    private String postalCode;
}
