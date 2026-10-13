package app.repository;

import app.model.Order;
import app.model.OrderStatus;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByBuyer_IdOrderByCreatedAtDesc(
            Long buyerProfileId
    );

    List<Order> findByListing_Farmer_IdOrderByCreatedAtDesc(
            Long farmerProfileId
    );

    List<Order> findByStatusOrderByCreatedAtDesc(
            OrderStatus status
    );

    List<Order> findByBuyer_IdAndStatusOrderByCreatedAtDesc(
            Long buyerProfileId,
            OrderStatus status
    );

    List<Order> findByListing_IdOrderByCreatedAtDesc(
            Long listingId
    );
}