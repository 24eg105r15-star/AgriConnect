
package app.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class FarmerProfileRequest {

    @Size(max = 20)
    private String phoneNumber;

    @Size(max = 150)
    private String farmName;

    @Size(max = 150)
    private String village;

    @NotBlank(message = "District is required")
    @Size(max = 100)
    private String district;

    @NotBlank(message = "State is required")
    @Size(max = 100)
    private String state;

    @Size(max = 10)
    private String postalCode;
}
