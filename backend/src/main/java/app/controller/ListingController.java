package app.controller;

import app.dto.ListingRequest;
import app.dto.ListingResponse;
import app.service.ListingService;

import jakarta.validation.Valid;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/listings")
public class ListingController {

    private final ListingService listingService;

    public ListingController(ListingService listingService) {
        this.listingService = listingService;
    }

    @GetMapping
    public List<ListingResponse> getActiveListings() {
        return listingService.getActiveListings();
    }

    @GetMapping("/my")
    public List<ListingResponse> getMyListings(
            @AuthenticationPrincipal UserDetails user) {
        return listingService.getMyListings(user.getUsername());
    }

    @GetMapping("/{id}")
    public ListingResponse getListingById(@PathVariable Long id) {
        return listingService.getListingById(id);
    }

    @PostMapping
    public ListingResponse createListing(
            @AuthenticationPrincipal UserDetails user,
            @Valid @RequestBody ListingRequest request) {
        return listingService.createListing(
                user.getUsername(), request);
    }
    
@PutMapping("/{id}")
public ListingResponse updateListing(
        @AuthenticationPrincipal UserDetails user,
        @PathVariable Long id,
        @Valid @RequestBody ListingRequest request) {
    return listingService.updateListing(
            user.getUsername(), id, request);
}

}