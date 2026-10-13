package app.repository;

import app.model.Rating;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RatingRepository extends JpaRepository<Rating, Long> {

    List<Rating> findByReviewee_IdOrderByCreatedAtDesc(
            Long userId
    );

    List<Rating> findByReviewer_IdOrderByCreatedAtDesc(
            Long userId
    );

    List<Rating> findByTransaction_Id(Long transactionId);

    Optional<Rating> findByTransaction_IdAndReviewer_Id(
            Long transactionId,
            Long reviewerId
    );

    boolean existsByTransaction_IdAndReviewer_Id(
            Long transactionId,
            Long reviewerId
    );
}