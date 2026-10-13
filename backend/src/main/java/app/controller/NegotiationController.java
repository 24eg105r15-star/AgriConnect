package app.controller;

import app.dto.NegotiationRequest;
import app.dto.NegotiationResponse;
import app.service.NegotiationService;

import jakarta.validation.Valid;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders/{orderId}/negotiations")
public class NegotiationController {

    private final NegotiationService negotiationService;

    public NegotiationController(
            NegotiationService negotiationService) {
        this.negotiationService = negotiationService;
    }

    @PostMapping
    public NegotiationResponse createNegotiation(
            @PathVariable Long orderId,
            @AuthenticationPrincipal UserDetails user,
            @Valid @RequestBody NegotiationRequest request) {
        return negotiationService.createNegotiation(
                orderId, user.getUsername(), request);
    }

    @GetMapping
    public List<NegotiationResponse> getNegotiations(
            @PathVariable Long orderId,
            @AuthenticationPrincipal UserDetails user) {
        return negotiationService.getOrderNegotiations(
                orderId, user.getUsername());
    }
}