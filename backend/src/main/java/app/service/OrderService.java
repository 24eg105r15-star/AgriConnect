package app.service;

import app.dto.OrderRequest;
import app.dto.OrderResponse;
import app.model.BuyerProfile;
import app.model.Listing;
import app.model.ListingStatus;
import app.model.Order;
import app.model.OrderStatus;
import app.model.Role;
import app.model.User;
import app.repository.BuyerProfileRepository;
import app.repository.ListingRepository;
import app.repository.OrderRepository;
import app.repository.UserRepository;
import app.model.FarmerProfile;
import app.dto.FarmerSalesSummary;
import app.repository.FarmerProfileRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Comparator;
import java.util.List;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final ListingRepository listingRepository;
    private final BuyerProfileRepository buyerProfileRepository;
    private final UserRepository userRepository;
    private final FarmerProfileRepository farmerProfileRepository;
  public OrderService(
        OrderRepository orderRepository,
        ListingRepository listingRepository,
        BuyerProfileRepository buyerProfileRepository,
        FarmerProfileRepository farmerProfileRepository,
        UserRepository userRepository) {

    this.orderRepository = orderRepository;
    this.listingRepository = listingRepository;
    this.buyerProfileRepository = buyerProfileRepository;
    this.farmerProfileRepository = farmerProfileRepository;
    this.userRepository = userRepository;
}

    @Transactional
    public OrderResponse createOrder(
            String email,
            OrderRequest request) {

        User user = getUser(email);

        if (user.getRole() != Role.BUYER) {
            throw new AccessDeniedException(
                    "Only buyers can place orders.");
        }

        BuyerProfile buyer = buyerProfileRepository
                .findByUser_Id(user.getId())
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Create your buyer profile first."));

        Listing listing = listingRepository
                .findById(request.getListingId())
                .orElseThrow(() ->
                        new IllegalArgumentException("Listing not found."));

        if (listing.getStatus() != ListingStatus.ACTIVE) {
            throw new IllegalArgumentException(
                    "This listing is not available.");
        }

        BigDecimal quantity = request.getQuantityRequestedQuintals();
        BigDecimal offeredPrice = request.getOfferedPricePerQuintal();

        if (quantity == null || quantity.signum() <= 0) {
            throw new IllegalArgumentException(
                    "Requested quantity must be greater than zero.");
        }

        if (quantity.compareTo(
                listing.getMinimumOrderQuintals()) < 0) {
            throw new IllegalArgumentException(
                    "Requested quantity is below the listing minimum.");
        }

        if (quantity.compareTo(
                listing.getAvailableQuantityQuintals()) > 0) {
            throw new IllegalArgumentException(
                    "Requested quantity exceeds the available quantity.");
        }

        if (offeredPrice == null || offeredPrice.signum() <= 0) {
            throw new IllegalArgumentException(
                    "Offered price must be greater than zero.");
        }

        Order order = new Order();

        order.setListing(listing);
        order.setBuyer(buyer);
        order.setQuantityRequestedQuintals(quantity);
        order.setOfferedPricePerQuintal(offeredPrice);
        order.setBuyerMessage(request.getBuyerMessage());
        order.setStatus(OrderStatus.PENDING);

        return toResponse(orderRepository.save(order));
    }

    
@Transactional(readOnly = true)
public List<OrderResponse> getMyOrders(String email) {
    User user = getUser(email);

    if (user.getRole() != Role.BUYER) {
        throw new AccessDeniedException(
                "This endpoint is for buyers.");
    }

    BuyerProfile buyer = buyerProfileRepository
            .findByUser_Id(user.getId())
            .orElseThrow(() ->
                    new IllegalArgumentException(
                            "Buyer profile not found."));

    return orderRepository
            .findByBuyer_IdOrderByCreatedAtDesc(buyer.getId())
            .stream()
            .map(this::toResponse)
            .toList();
}
@Transactional(readOnly = true)
public List<OrderResponse> getMyFarmerOrders(String email) {
    User user = getUser(email);

    if (user.getRole() != Role.FARMER) {
        throw new AccessDeniedException(
                "This endpoint is for farmers.");
    }

    FarmerProfile farmer = farmerProfileRepository
            .findByUser_Id(user.getId())
            .orElseThrow(() ->
                    new IllegalArgumentException(
                            "Farmer profile not found."));

    return orderRepository
            .findByListing_Farmer_IdOrderByCreatedAtDesc(
                    farmer.getId())
            .stream()
            .map(this::toResponse)
            .toList();
}

@Transactional(readOnly = true)
public FarmerSalesSummary getFarmerSalesSummary(String email) {
    User user = getUser(email);

    if (user.getRole() != Role.FARMER) {
        throw new AccessDeniedException(
                "This endpoint is for farmers.");
    }

    FarmerProfile farmer = farmerProfileRepository
            .findByUser_Id(user.getId())
            .orElseThrow(() ->
                    new IllegalArgumentException(
                            "Farmer profile not found."));

    List<Order> orders = orderRepository
            .findByListing_Farmer_IdOrderByCreatedAtDesc(
                    farmer.getId());

    long pendingOrders = orders.stream()
            .filter(order -> order.getStatus() == OrderStatus.PENDING)
            .count();

    List<Order> completedOrders = orders.stream()
            .filter(order -> order.getStatus() == OrderStatus.COMPLETED)
            .toList();

    BigDecimal totalQuantitySold = completedOrders.stream()
            .map(Order::getQuantityRequestedQuintals)
            .filter(quantity -> quantity != null)
            .reduce(BigDecimal.ZERO, BigDecimal::add);

    BigDecimal totalRevenue = completedOrders.stream()
            .filter(order -> order.getAgreedPricePerQuintal() != null)
            .map(order -> order.getQuantityRequestedQuintals()
                    .multiply(order.getAgreedPricePerQuintal()))
            .reduce(BigDecimal.ZERO, BigDecimal::add);

    FarmerSalesSummary summary = new FarmerSalesSummary();
    summary.setTotalOrders(orders.size());
    summary.setPendingOrders(pendingOrders);
    summary.setCompletedOrders(completedOrders.size());
    summary.setTotalQuantitySold(totalQuantitySold);
    summary.setTotalRevenue(totalRevenue);

    return summary;
}

@Transactional
public OrderResponse acceptOrder(Long orderId, String email) {
    User user = getUser(email);

    if (user.getRole() != Role.FARMER) {
        throw new AccessDeniedException(
                "Only farmers can accept orders.");
    }

    Order order = getFarmerOrder(orderId, user);

    if (order.getStatus() != OrderStatus.PENDING) {
        throw new IllegalArgumentException(
                "Only pending orders can be accepted.");
    }

    order.setAgreedPricePerQuintal(
            order.getOfferedPricePerQuintal());
    order.setStatus(OrderStatus.ACCEPTED);

    return toResponse(orderRepository.save(order));
}

@Transactional
public OrderResponse rejectOrder(Long orderId, String email) {
    User user = getUser(email);

    if (user.getRole() != Role.FARMER) {
        throw new AccessDeniedException(
                "Only farmers can reject orders.");
    }

    Order order = getFarmerOrder(orderId, user);

    if (order.getStatus() != OrderStatus.PENDING) {
        throw new IllegalArgumentException(
                "Only pending orders can be rejected.");
    }

    order.setStatus(OrderStatus.REJECTED);

    return toResponse(orderRepository.save(order));
}

@Transactional
public OrderResponse counterOffer(
        Long orderId,
        String email,
        BigDecimal counterOfferPrice) {

    User user = getUser(email);

    if (user.getRole() != Role.FARMER) {
        throw new AccessDeniedException(
                "Only farmers can make counter-offers.");
    }

    if (counterOfferPrice == null
            || counterOfferPrice.signum() <= 0) {
        throw new IllegalArgumentException(
                "Counter-offer price must be greater than zero.");
    }

    Order order = getFarmerOrder(orderId, user);

    if (order.getStatus() != OrderStatus.PENDING) {
        throw new IllegalArgumentException(
                "Only pending orders can receive a counter-offer.");
    }

    order.setAgreedPricePerQuintal(counterOfferPrice);
    order.setStatus(OrderStatus.COUNTER_OFFERED);

    return toResponse(orderRepository.save(order));
}

private Order getFarmerOrder(Long orderId, User user) {
    Order order = orderRepository.findById(orderId)
            .orElseThrow(() ->
                    new IllegalArgumentException("Order not found."));

    boolean isOwner = order.getListing()
            .getFarmer()
            .getUser()
            .getId()
            .equals(user.getId());

    if (!isOwner) {
        throw new AccessDeniedException(
                "You cannot manage an order for another farmer's listing.");
    }

    return order;
}

@Transactional
public OrderResponse respondToCounterOffer(
        Long orderId,
        String email,
        boolean accept) {

    User user = getUser(email);

    if (user.getRole() != Role.BUYER) {
        throw new AccessDeniedException(
                "Only buyers can respond to counter-offers.");
    }

    Order order = orderRepository.findById(orderId)
            .orElseThrow(() ->
                    new IllegalArgumentException("Order not found."));

    boolean isOwner = order.getBuyer()
            .getUser()
            .getId()
            .equals(user.getId());

    if (!isOwner) {
        throw new AccessDeniedException(
                "You cannot respond to another buyer's order.");
    }

    if (order.getStatus() != OrderStatus.COUNTER_OFFERED) {
        throw new IllegalArgumentException(
                "This order does not have a pending counter-offer.");
    }

    if (accept) {
        order.setStatus(OrderStatus.ACCEPTED);
    } else {
        order.setStatus(OrderStatus.REJECTED);
    }

    return toResponse(orderRepository.save(order));
}


    @Transactional(readOnly = true)
    public OrderResponse getOrderById(Long id, String email) {
        User user = getUser(email);

        Order order = orderRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException("Order not found."));

        boolean isBuyer = order.getBuyer().getUser().getId()
                .equals(user.getId());

        boolean isFarmer = order.getListing().getFarmer()
                .getUser().getId().equals(user.getId());

        if (!isBuyer && !isFarmer && user.getRole() != Role.ADMIN) {
            throw new AccessDeniedException(
                    "You cannot view this order.");
        }

        return toResponse(order);
    }

    private User getUser(String email) {
        return userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() ->
                        new IllegalArgumentException("User not found."));
    }

    private OrderResponse toResponse(Order order) {
        OrderResponse response = new OrderResponse();

        response.setId(order.getId());
        response.setListingId(order.getListing().getId());
        response.setCropName(order.getListing().getCrop().getName());
        response.setBuyerId(order.getBuyer().getId());
        response.setBuyerName(order.getBuyer().getUser().getName());
        response.setFarmerId(order.getListing().getFarmer().getId());
        response.setFarmerName(
                order.getListing().getFarmer().getUser().getName());

        response.setQuantityRequestedQuintals(
                order.getQuantityRequestedQuintals());
        response.setOfferedPricePerQuintal(
                order.getOfferedPricePerQuintal());
        response.setAgreedPricePerQuintal(
                order.getAgreedPricePerQuintal());
        response.setStatus(order.getStatus());
        response.setBuyerMessage(order.getBuyerMessage());
        response.setCreatedAt(order.getCreatedAt());

        return response;
    }
}