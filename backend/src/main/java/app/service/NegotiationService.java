package app.service;

import app.dto.NegotiationRequest;
import app.dto.NegotiationResponse;
import app.model.Negotiation;
import app.model.NegotiationStatus;
import app.model.Order;
import app.model.User;
import app.repository.NegotiationRepository;
import app.repository.OrderRepository;
import app.repository.UserRepository;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Comparator;
import java.util.List;

@Service
public class NegotiationService {

    private final NegotiationRepository negotiationRepository;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;

    public NegotiationService(
            NegotiationRepository negotiationRepository,
            OrderRepository orderRepository,
            UserRepository userRepository) {

        this.negotiationRepository = negotiationRepository;
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public NegotiationResponse createNegotiation(
            Long orderId,
            String email,
            NegotiationRequest request) {

        User sender = getUser(email);

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Order not found."));

        boolean isBuyer = order.getBuyer().getUser().getId()
                .equals(sender.getId());

        boolean isFarmer = order.getListing().getFarmer()
                .getUser().getId().equals(sender.getId());

        if (!isBuyer && !isFarmer) {
            throw new AccessDeniedException(
                    "Only the buyer or farmer involved in this order can negotiate.");
        }

        BigDecimal quantity = request.getProposedQuantityQuintals();
        BigDecimal price = request.getProposedPricePerQuintal();

        if (quantity == null || quantity.signum() <= 0) {
            throw new IllegalArgumentException(
                    "Proposed quantity must be greater than zero.");
        }

        if (price == null || price.signum() <= 0) {
            throw new IllegalArgumentException(
                    "Proposed price must be greater than zero.");
        }

        Negotiation negotiation = new Negotiation();

        negotiation.setOrder(order);
        negotiation.setSender(sender);
        negotiation.setProposedQuantityQuintals(quantity);
        negotiation.setProposedPricePerQuintal(price);
        negotiation.setMessage(request.getMessage());
        negotiation.setStatus(NegotiationStatus.OPEN);

        return toResponse(negotiationRepository.save(negotiation));
    }

    @Transactional(readOnly = true)
    public List<NegotiationResponse> getOrderNegotiations(
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

        if (!isBuyer && !isFarmer && user.getRole().name().equals("ADMIN") == false) {
            throw new AccessDeniedException(
                    "You cannot view negotiations for this order.");
        }

        return negotiationRepository.findAll()
                .stream()
                .filter(negotiation ->
                        negotiation.getOrder().getId().equals(orderId))
                .sorted(Comparator.comparing(
                        Negotiation::getCreatedAt,
                        Comparator.nullsLast(Comparator.naturalOrder())))
                .map(this::toResponse)
                .toList();
    }

    private User getUser(String email) {
        return userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() ->
                        new IllegalArgumentException("User not found."));
    }

    private NegotiationResponse toResponse(Negotiation negotiation) {
    NegotiationResponse response = new NegotiationResponse();

    response.setId(negotiation.getId());
    response.setOrderId(negotiation.getOrder().getId());

    response.setSenderUserId(
            negotiation.getSender().getId());

    response.setSenderName(
            negotiation.getSender().getName());

    response.setProposedQuantityQuintals(
            negotiation.getProposedQuantityQuintals());

    response.setProposedPricePerQuintal(
            negotiation.getProposedPricePerQuintal());

    response.setMessage(negotiation.getMessage());
    response.setStatus(negotiation.getStatus());
    response.setCreatedAt(negotiation.getCreatedAt());

    return response;
}
}