package app.service;

import app.dto.TransactionResponse;
import app.model.DeliveryStatus;
import app.model.Order;
import app.model.OrderStatus;
import app.model.PaymentStatus;
import app.model.Transaction;
import app.model.User;
import app.repository.OrderRepository;
import app.repository.TransactionRepository;
import app.repository.UserRepository;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;

    public TransactionService(
            TransactionRepository transactionRepository,
            OrderRepository orderRepository,
            UserRepository userRepository) {

        this.transactionRepository = transactionRepository;
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public TransactionResponse createTransaction(
            Long orderId,
            String email) {

        User user = getUser(email);

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Order not found."));

        boolean isBuyer = order.getBuyer().getUser().getId()
                .equals(user.getId());

        boolean isFarmer = order.getListing().getFarmer()
                .getUser().getId().equals(user.getId());

        if (!isBuyer && !isFarmer
                && !user.getRole().name().equals("ADMIN")) {
            throw new AccessDeniedException(
                    "You cannot create a transaction for this order.");
        }

        if (order.getStatus() != OrderStatus.ACCEPTED) {
            throw new IllegalArgumentException(
                    "The order must be accepted before creating a transaction.");
        }

        if (transactionRepository.existsByOrder_Id(orderId)) {
            throw new IllegalArgumentException(
                    "A transaction already exists for this order.");
        }

        BigDecimal quantity = order.getQuantityRequestedQuintals();
        BigDecimal price = order.getAgreedPricePerQuintal();

        if (price == null || quantity == null) {
            throw new IllegalArgumentException(
                    "The order must have an agreed price and quantity.");
        }

        Transaction transaction = new Transaction();

        transaction.setOrder(order);
        transaction.setFinalQuantityQuintals(quantity);
        transaction.setFinalPricePerQuintal(price);
        transaction.setTotalAmount(quantity.multiply(price));
        transaction.setPaymentStatus(PaymentStatus.PENDING);
        transaction.setDeliveryStatus(DeliveryStatus.PENDING);

        return toResponse(transactionRepository.save(transaction));
    }

    @Transactional(readOnly = true)
    public TransactionResponse getTransactionByOrder(
            Long orderId,
            String email) {

        User user = getUser(email);

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Order not found."));

        boolean isBuyer = order.getBuyer().getUser().getId()
                .equals(user.getId());

        boolean isFarmer = order.getListing().getFarmer().getUser().getId()
                .equals(user.getId());

        if (!isBuyer && !isFarmer
                && !user.getRole().name().equals("ADMIN")) {
            throw new AccessDeniedException(
                    "You cannot view this transaction.");
        }

        Transaction transaction = transactionRepository
                .findByOrder_Id(orderId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Transaction not found for this order."));

        return toResponse(transaction);
    }

    private User getUser(String email) {
        return userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() ->
                        new IllegalArgumentException("User not found."));
    }

    private TransactionResponse toResponse(Transaction transaction) {
        TransactionResponse response = new TransactionResponse();

        response.setId(transaction.getId());
        response.setOrderId(transaction.getOrder().getId());
        response.setFinalQuantityQuintals(
                transaction.getFinalQuantityQuintals());
        response.setFinalPricePerQuintal(
                transaction.getFinalPricePerQuintal());
        response.setTotalAmount(transaction.getTotalAmount());
        response.setPaymentStatus(transaction.getPaymentStatus());
        response.setDeliveryStatus(transaction.getDeliveryStatus());
        response.setCreatedAt(transaction.getCreatedAt());

        return response;
    }
}