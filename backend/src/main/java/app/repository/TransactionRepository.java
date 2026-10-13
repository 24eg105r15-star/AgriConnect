package app.repository;

import app.model.Transaction;
import app.model.PaymentStatus;
import app.model.DeliveryStatus;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TransactionRepository
        extends JpaRepository<Transaction, Long> {

    Optional<Transaction> findByOrder_Id(Long orderId);

    boolean existsByOrder_Id(Long orderId);

    List<Transaction> findByPaymentStatusOrderByCreatedAtDesc(
            PaymentStatus paymentStatus
    );

    List<Transaction> findByDeliveryStatusOrderByCreatedAtDesc(
            DeliveryStatus deliveryStatus
    );

    List<Transaction> findAllByOrderByCreatedAtDesc();
}