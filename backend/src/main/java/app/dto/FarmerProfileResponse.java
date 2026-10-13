
package app.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class FarmerProfileResponse {

    private Long id;
    private Long userId;

    private String name;
    private String email;

    private String phoneNumber;
    private String farmName;
    private String village;
    private String district;
    private String state;
    private String postalCode;

    private boolean verified;
}
