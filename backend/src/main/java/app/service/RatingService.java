package app.service;

import app.dto.RatingRequest;
import app.dto.RatingResponse;
import app.model.Rating;
import app.model.Transaction;
import app.model.User;
import app.repository.RatingRepository;
import app.repository.TransactionRepository;
import app.repository.UserRepository;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;

@Service
public class RatingService {

    private final RatingRepository ratingRepository;
    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;

    public RatingService(
            RatingRepository ratingRepository,
            TransactionRepository transactionRepository,
            UserRepository userRepository) {

        this.ratingRepository = ratingRepository;
        this.transactionRepository = transactionRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public RatingResponse createRating(
            String email,
            RatingRequest request) {

        User reviewer = getUser(email);

        Transaction transaction = transactionRepository
                .findById(request.getTransactionId())
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Transaction not found."));

        User buyer = transaction.getOrder()
                .getBuyer().getUser();

        User farmer = transaction.getOrder()
                .getListing().getFarmer().getUser();

        User reviewee;

        if (buyer.getId().equals(reviewer.getId())) {
            reviewee = farmer;
        } else if (farmer.getId().equals(reviewer.getId())) {
            reviewee = buyer;
        } else {
            throw new AccessDeniedException(
                    "Only participants in the transaction can leave a rating.");
        }

        if (request.getScore() == null
                || request.getScore() < 1
                || request.getScore() > 5) {
            throw new IllegalArgumentException(
                    "Rating score must be between 1 and 5.");
        }

        boolean alreadyRated = ratingRepository.findAll()
                .stream()
                .anyMatch(rating ->
                        rating.getTransaction().getId()
                                .equals(transaction.getId())
                        && rating.getReviewer().getId()
                                .equals(reviewer.getId()));

        if (alreadyRated) {
            throw new IllegalArgumentException(
                    "You have already rated this transaction.");
        }

        Rating rating = new Rating();

        rating.setTransaction(transaction);
        rating.setReviewer(reviewer);
        rating.setReviewee(reviewee);
        rating.setScore(request.getScore());
        rating.setComment(request.getComment());

        return toResponse(ratingRepository.save(rating));
    }

    @Transactional(readOnly = true)
    public List<RatingResponse> getRatingsForUser(Long userId) {
        return ratingRepository.findAll()
                .stream()
                .filter(rating ->
                        rating.getReviewee().getId().equals(userId))
                .sorted(Comparator.comparing(
                        Rating::getCreatedAt,
                        Comparator.nullsLast(Comparator.reverseOrder())))
                .map(this::toResponse)
                .toList();
    }

    private User getUser(String email) {
        return userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() ->
                        new IllegalArgumentException("User not found."));
    }

    private RatingResponse toResponse(Rating rating) {
        RatingResponse response = new RatingResponse();

        response.setId(rating.getId());
        response.setTransactionId(rating.getTransaction().getId());
        response.setReviewerId(rating.getReviewer().getId());
        response.setReviewerName(rating.getReviewer().getName());
        response.setRevieweeId(rating.getReviewee().getId());
        response.setRevieweeName(rating.getReviewee().getName());
        response.setScore(rating.getScore());
        response.setComment(rating.getComment());
        response.setCreatedAt(rating.getCreatedAt());

        return response;
    }
}