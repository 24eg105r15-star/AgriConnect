package app.controller;

import app.dto.OrderRequest;
import app.dto.OrderResponse;
import app.service.OrderService;
import app.dto.FarmerSalesSummary;
import jakarta.validation.Valid;
import app.dto.CounterOfferRequest;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

@PutMapping("/{id}/accept")
public OrderResponse acceptOrder(
        @PathVariable Long id,
        @AuthenticationPrincipal UserDetails user) {
    return orderService.acceptOrder(id, user.getUsername());
}

@PutMapping("/{id}/reject")
public OrderResponse rejectOrder(
        @PathVariable Long id,
        @AuthenticationPrincipal UserDetails user) {
    return orderService.rejectOrder(id, user.getUsername());
}

@PutMapping("/{id}/counter-offer")
public OrderResponse counterOffer(
        @PathVariable Long id,
        @Valid @RequestBody CounterOfferRequest request,
        @AuthenticationPrincipal UserDetails user) {
    return orderService.counterOffer(
            id,
            user.getUsername(),
            request.getCounterOfferPricePerQuintal());
}

    @PostMapping
    public OrderResponse createOrder(
            @AuthenticationPrincipal UserDetails user,
            @Valid @RequestBody OrderRequest request) {
        return orderService.createOrder(
                user.getUsername(), request);
    }

    @GetMapping("/my")
    public List<OrderResponse> getMyOrders(
            @AuthenticationPrincipal UserDetails user) {
        return orderService.getMyOrders(user.getUsername());
    }
    
@GetMapping("/farmer/my")
public List<OrderResponse> getMyFarmerOrders(
        @AuthenticationPrincipal UserDetails user) {
    return orderService.getMyFarmerOrders(
            user.getUsername());
}

@GetMapping("/farmer/sales-summary")
public FarmerSalesSummary getFarmerSalesSummary(
        @AuthenticationPrincipal UserDetails user) {
    return orderService.getFarmerSalesSummary(
            user.getUsername());
}


@PutMapping("/{id}/counter-offer/accept")
public OrderResponse acceptCounterOffer(
        @PathVariable Long id,
        @AuthenticationPrincipal UserDetails user) {
    return orderService.respondToCounterOffer(
            id, user.getUsername(), true);
}

@PutMapping("/{id}/counter-offer/reject")
public OrderResponse rejectCounterOffer(
        @PathVariable Long id,
        @AuthenticationPrincipal UserDetails user) {
    return orderService.respondToCounterOffer(
            id, user.getUsername(), false);
}


    @GetMapping("/{id}")
    public OrderResponse getOrderById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails user) {
        return orderService.getOrderById(
                id, user.getUsername());
    }
}