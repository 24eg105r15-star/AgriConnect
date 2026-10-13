package app.service;

import app.dto.ListingRequest;
import app.dto.ListingResponse;
import app.model.Crop;
import app.model.FarmerProfile;
import app.model.Listing;
import app.model.ListingStatus;
import app.model.Role;
import app.model.User;
import app.repository.CropRepository;
import app.repository.FarmerProfileRepository;
import app.repository.ListingRepository;
import app.repository.UserRepository;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Comparator;
import java.util.List;

@Service
public class ListingService {

    private final ListingRepository listingRepository;
    private final UserRepository userRepository;
    private final FarmerProfileRepository farmerProfileRepository;
    private final CropRepository cropRepository;

    public ListingService(
            ListingRepository listingRepository,
            UserRepository userRepository,
            FarmerProfileRepository farmerProfileRepository,
            CropRepository cropRepository) {

        this.listingRepository = listingRepository;
        this.userRepository = userRepository;
        this.farmerProfileRepository = farmerProfileRepository;
        this.cropRepository = cropRepository;
    }
    
@Transactional
public ListingResponse updateListing(
        String email,
        Long listingId,
        ListingRequest request) {

    User user = getUser(email);

    if (user.getRole() != Role.FARMER) {
        throw new AccessDeniedException(
                "Only farmers can update crop listings.");
    }

    FarmerProfile farmer = farmerProfileRepository
            .findByUser_Id(user.getId())
            .orElseThrow(() ->
                    new IllegalArgumentException(
                            "Farmer profile not found."));

    Listing listing = listingRepository.findById(listingId)
            .orElseThrow(() ->
                    new IllegalArgumentException("Listing not found."));

    if (!listing.getFarmer().getId().equals(farmer.getId())) {
        throw new AccessDeniedException(
                "You can only edit your own crop listings.");
    }

    BigDecimal quantity = request.getAvailableQuantityQuintals();
    BigDecimal minimum = request.getMinimumOrderQuintals();
    BigDecimal price = request.getAskingPricePerQuintal();

    if (quantity == null || quantity.signum() <= 0) {
        throw new IllegalArgumentException(
                "Available quantity must be greater than zero.");
    }

    if (minimum == null || minimum.signum() <= 0
            || minimum.compareTo(quantity) > 0) {
        throw new IllegalArgumentException(
                "Minimum order must be positive and cannot exceed available quantity.");
    }

    if (price == null || price.signum() <= 0) {
        throw new IllegalArgumentException(
                "Asking price must be greater than zero.");
    }

    Crop crop = findOrCreateCrop(request.getCropName());

    listing.setCrop(crop);
    listing.setVariety(request.getVariety());
    listing.setAvailableQuantityQuintals(quantity);
    listing.setMinimumOrderQuintals(minimum);
    listing.setAskingPricePerQuintal(price);
    listing.setQualityGrade(request.getQualityGrade());
    listing.setDescription(request.getDescription());
    listing.setImageUrl(request.getImageUrl());
    listing.setHarvestDate(request.getHarvestDate());
    listing.setAvailableFrom(request.getAvailableFrom());
    listing.setPickupDistrict(request.getPickupDistrict());
    listing.setPickupState(request.getPickupState());
    listing.setTransportArrangement(
            request.getTransportArrangement());

    return toResponse(listingRepository.save(listing));
}

    @Transactional
    public ListingResponse createListing(
            String email,
            ListingRequest request) {

        User user = getUser(email);

        if (user.getRole() != Role.FARMER) {
            throw new AccessDeniedException(
                    "Only farmers can create crop listings.");
        }

        FarmerProfile farmer = farmerProfileRepository
        .findByUser_Id(user.getId())
        .orElseGet(() -> {
            FarmerProfile newProfile = new FarmerProfile();

            newProfile.setUser(user);
            newProfile.setDistrict(
                    request.getPickupDistrict().trim());
            newProfile.setState(
                    request.getPickupState().trim());

            return farmerProfileRepository.save(newProfile);
        });

        Crop crop = findOrCreateCrop(request.getCropName());
        BigDecimal quantity = request.getAvailableQuantityQuintals();
        BigDecimal minimum = request.getMinimumOrderQuintals();
        BigDecimal price = request.getAskingPricePerQuintal();

        if (quantity == null || quantity.signum() <= 0) {
            throw new IllegalArgumentException(
                    "Available quantity must be greater than zero.");
        }

        if (minimum == null || minimum.signum() <= 0
                || minimum.compareTo(quantity) > 0) {
            throw new IllegalArgumentException(
                    "Minimum order must be positive and cannot exceed available quantity.");
        }

        if (price == null || price.signum() <= 0) {
            throw new IllegalArgumentException(
                    "Asking price must be greater than zero.");
        }

        Listing listing = new Listing();

        listing.setFarmer(farmer);
        listing.setCrop(crop);
        listing.setVariety(request.getVariety());
        listing.setAvailableQuantityQuintals(quantity);
        listing.setMinimumOrderQuintals(minimum);
        listing.setAskingPricePerQuintal(price);
        listing.setQualityGrade(request.getQualityGrade());
        listing.setDescription(request.getDescription());
        listing.setImageUrl(request.getImageUrl());
        listing.setHarvestDate(request.getHarvestDate());
        listing.setAvailableFrom(request.getAvailableFrom());
        listing.setPickupDistrict(request.getPickupDistrict());
        listing.setPickupState(request.getPickupState());
        listing.setTransportArrangement(
                request.getTransportArrangement());
        listing.setStatus(ListingStatus.ACTIVE);

        return toResponse(listingRepository.save(listing));
    }

    @Transactional(readOnly = true)
    public List<ListingResponse> getActiveListings() {
        return listingRepository.findAll()
                .stream()
                .filter(listing ->
                        listing.getStatus() == ListingStatus.ACTIVE)
                .sorted(Comparator.comparing(
                        Listing::getCreatedAt,
                        Comparator.nullsLast(Comparator.reverseOrder())))
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public ListingResponse getListingById(Long id) {
        Listing listing = listingRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException("Listing not found."));

        return toResponse(listing);
    }

    @Transactional(readOnly = true)
    public List<ListingResponse> getMyListings(String email) {
        User user = getUser(email);

        if (user.getRole() != Role.FARMER) {
            throw new AccessDeniedException(
                    "Only farmers can view their farmer listings.");
        }

        FarmerProfile farmer = farmerProfileRepository
                .findByUser_Id(user.getId())
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Farmer profile not found."));

        return listingRepository.findAll()
                .stream()
                .filter(listing ->
                        listing.getFarmer().getId()
                                .equals(farmer.getId()))
                .sorted(Comparator.comparing(
                        Listing::getCreatedAt,
                        Comparator.nullsLast(Comparator.reverseOrder())))
                .map(this::toResponse)
                .toList();
    }

    private User getUser(String email) {
        return userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() ->
                        new IllegalArgumentException("User not found."));
    }
    
private Crop findOrCreateCrop(String name) {
    if (name == null || name.isBlank()) {
        throw new IllegalArgumentException("Crop name is required.");
    }

    String cropName = name.trim();

    Crop existingCrop = cropRepository.findAll()
            .stream()
            .filter(crop -> crop.getName() != null
                    && crop.getName().trim()
                            .equalsIgnoreCase(cropName))
            .findFirst()
            .orElse(null);

    if (existingCrop != null) {
        if (!existingCrop.isActive()) {
            existingCrop.setActive(true);
            return cropRepository.save(existingCrop);
        }

        return existingCrop;
    }

    Crop newCrop = new Crop();
    newCrop.setName(cropName);
    newCrop.setActive(true);

    return cropRepository.save(newCrop);
}


    private ListingResponse toResponse(Listing listing) {
        ListingResponse response = new ListingResponse();

        response.setId(listing.getId());
        response.setFarmerId(listing.getFarmer().getId());
        response.setFarmerName(listing.getFarmer().getUser().getName());
        response.setCropId(listing.getCrop().getId());
        response.setCropName(listing.getCrop().getName());

        response.setVariety(listing.getVariety());
        response.setAvailableQuantityQuintals(
                listing.getAvailableQuantityQuintals());
        response.setMinimumOrderQuintals(
                listing.getMinimumOrderQuintals());
        response.setAskingPricePerQuintal(
                listing.getAskingPricePerQuintal());
        response.setQualityGrade(listing.getQualityGrade());
        response.setDescription(listing.getDescription());
        response.setImageUrl(listing.getImageUrl());
        response.setHarvestDate(listing.getHarvestDate());
        response.setAvailableFrom(listing.getAvailableFrom());
        response.setPickupDistrict(listing.getPickupDistrict());
        response.setPickupState(listing.getPickupState());
        response.setTransportArrangement(
                listing.getTransportArrangement());
        response.setStatus(listing.getStatus());
        response.setCreatedAt(listing.getCreatedAt());

        return response;
    }
}