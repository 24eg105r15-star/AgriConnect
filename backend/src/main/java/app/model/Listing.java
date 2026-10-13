package app.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "listings")
@Getter
@Setter
@NoArgsConstructor
public class Listing {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "farmer_profile_id", nullable = false)
    private FarmerProfile farmer;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "crop_id", nullable = false)
    private Crop crop;

    @Column(nullable = false, length = 120)
    private String variety;

    @Column(name = "available_quantity_quintals",
            nullable = false, precision = 12, scale = 2)
    private BigDecimal availableQuantityQuintals;

    @Column(name = "minimum_order_quintals",
            nullable = false, precision = 12, scale = 2)
    private BigDecimal minimumOrderQuintals;

    @Column(name = "asking_price_per_quintal",
            nullable = false, precision = 12, scale = 2)
    private BigDecimal askingPricePerQuintal;

    @Column(name = "quality_grade", nullable = false, length = 50)
    private String qualityGrade;

    @Column(length = 1000)
    private String description;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @Column(name = "harvest_date")
    private LocalDate harvestDate;

    @Column(name = "available_from", nullable = false)
    private LocalDate availableFrom;

    @Column(name = "pickup_district", nullable = false, length = 100)
    private String pickupDistrict;

    @Column(name = "pickup_state", nullable = false, length = 100)
    private String pickupState;

    @Column(name = "transport_arrangement",
            nullable = false, length = 30)
    private String transportArrangement = "BUYER_ARRANGES";

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ListingStatus status = ListingStatus.DRAFT;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        createdAt = now;
        updatedAt = now;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}