
package app.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(
    name = "buyer_profiles",
    uniqueConstraints = {
        @UniqueConstraint(
            name = "uk_buyer_user",
            columnNames = "user_id"
        ),
        @UniqueConstraint(
            name = "uk_buyer_gst",
            columnNames = "gst_number"
        )
    }
)
@Getter
@Setter
@NoArgsConstructor
public class BuyerProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "business_name", nullable = false, length = 180)
    private String businessName;

    @Column(name = "buyer_type", nullable = false, length = 40)
    private String buyerType;

    @Column(name = "phone_number", length = 20)
    private String phoneNumber;

    @Column(name = "gst_number", length = 20)
    private String gstNumber;

    @Column(length = 150)
    private String city;

    @Column(nullable = false, length = 100)
    private String district;

    @Column(nullable = false, length = 100)
    private String state;

    @Column(name = "postal_code", length = 10)
    private String postalCode;
}
