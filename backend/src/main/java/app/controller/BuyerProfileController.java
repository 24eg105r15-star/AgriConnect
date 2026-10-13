package app.controller;

import app.dto.BuyerProfileRequest;
import app.dto.BuyerProfileResponse;
import app.service.BuyerProfileService;

import jakarta.validation.Valid;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/buyer/profile")
public class BuyerProfileController {

    private final BuyerProfileService buyerProfileService;

    public BuyerProfileController(
            BuyerProfileService buyerProfileService) {
        this.buyerProfileService = buyerProfileService;
    }

    @GetMapping
    public BuyerProfileResponse getMyProfile(
            @AuthenticationPrincipal UserDetails user) {
        return buyerProfileService.getMyProfile(user.getUsername());
    }

    @PutMapping
    public BuyerProfileResponse saveMyProfile(
            @AuthenticationPrincipal UserDetails user,
            @Valid @RequestBody BuyerProfileRequest request) {
        return buyerProfileService.saveMyProfile(
                user.getUsername(), request);
    }
}