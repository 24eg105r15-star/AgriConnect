package app.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(
    name = "transport_rates",
    uniqueConstraints = @UniqueConstraint(
        name = "uk_transport_route",
        columnNames = {"from_district", "to_district", "state"}
    )
)
@Getter
@Setter
@NoArgsConstructor
public class TransportRate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "from_district", nullable = false, length = 100)
    private String fromDistrict;

    @Column(name = "to_district", nullable = false, length = 100)
    private String toDistrict;

    @Column(nullable = false, length = 100)
    private String state;

    @Column(
        name = "rate_per_km_per_quintal",
        nullable = false,
        precision = 12,
        scale = 2
    )
    private BigDecimal ratePerKmPerQuintal;

    @Column(nullable = false)
    private boolean active = true;

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