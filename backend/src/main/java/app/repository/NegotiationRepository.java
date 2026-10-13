package app.repository;

import app.model.Negotiation;
import app.model.NegotiationStatus;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface NegotiationRepository
        extends JpaRepository<Negotiation, Long> {

    List<Negotiation> findByOrder_IdOrderByCreatedAtAsc(
            Long orderId
    );

    Optional<Negotiation> findFirstByOrder_IdOrderByCreatedAtDesc(
            Long orderId
    );

    List<Negotiation> findBySender_IdOrderByCreatedAtDesc(
            Long senderId
    );

    List<Negotiation> findByOrder_IdAndStatusOrderByCreatedAtDesc(
            Long orderId,
            NegotiationStatus status
    );
}