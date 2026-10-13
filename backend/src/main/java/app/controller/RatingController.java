package app.controller;

import app.dto.RatingRequest;
import app.dto.RatingResponse;
import app.service.RatingService;

import jakarta.validation.Valid;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ratings")
public class RatingController {

    private final RatingService ratingService;

    public RatingController(RatingService ratingService) {
        this.ratingService = ratingService;
    }

    @PostMapping
    public RatingResponse createRating(
            @AuthenticationPrincipal UserDetails user,
            @Valid @RequestBody RatingRequest request) {

        return ratingService.createRating(
                user.getUsername(), request);
    }

    @GetMapping("/user/{userId}")
    public List<RatingResponse> getRatingsForUser(
            @PathVariable Long userId) {

        return ratingService.getRatingsForUser(userId);
    }
}