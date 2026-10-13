
package app.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BuyerProfileResponse {

    private Long id;
    private Long userId;

    private String name;
    private String email;

    private String businessName;
    private String buyerType;
    private String phoneNumber;
    private String gstNumber;

    private String city;
    private String district;
    private String state;
    private String postalCode;

    private boolean verified;
}
