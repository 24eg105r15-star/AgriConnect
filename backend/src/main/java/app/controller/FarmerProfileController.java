package app.controller;

import app.dto.FarmerProfileRequest;
import app.dto.FarmerProfileResponse;
import app.service.FarmerProfileService;

import jakarta.validation.Valid;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/farmer/profile")
public class FarmerProfileController {

    private final FarmerProfileService farmerProfileService;

    public FarmerProfileController(
            FarmerProfileService farmerProfileService) {
        this.farmerProfileService = farmerProfileService;
    }

    @GetMapping
    public FarmerProfileResponse getMyProfile(
            @AuthenticationPrincipal UserDetails user) {
        return farmerProfileService.getMyProfile(user.getUsername());
    }

    @PutMapping
    public FarmerProfileResponse saveMyProfile(
            @AuthenticationPrincipal UserDetails user,
            @Valid @RequestBody FarmerProfileRequest request) {
        return farmerProfileService.saveMyProfile(
                user.getUsername(), request);
    }
}