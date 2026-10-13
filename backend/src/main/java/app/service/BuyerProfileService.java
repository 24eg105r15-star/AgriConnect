package app.service;

import app.dto.BuyerProfileRequest;
import app.dto.BuyerProfileResponse;
import app.model.BuyerProfile;
import app.model.Role;
import app.model.User;
import app.repository.BuyerProfileRepository;
import app.repository.UserRepository;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class BuyerProfileService {

    private final BuyerProfileRepository buyerProfileRepository;
    private final UserRepository userRepository;

    public BuyerProfileService(
            BuyerProfileRepository buyerProfileRepository,
            UserRepository userRepository) {

        this.buyerProfileRepository = buyerProfileRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public BuyerProfileResponse saveMyProfile(
            String email,
            BuyerProfileRequest request) {

        User user = getUser(email);
        requireBuyer(user);

        String gstNumber = request.getGstNumber();

        if (gstNumber != null && !gstNumber.isBlank()
                && buyerProfileRepository.existsByGstNumber(gstNumber)
                && !buyerProfileRepository.findByUser_Id(user.getId())
                        .map(existing ->
                                gstNumber.equals(existing.getGstNumber()))
                        .orElse(false)) {

            throw new IllegalArgumentException(
                    "This GST number is already registered.");
        }

        BuyerProfile profile = buyerProfileRepository
                .findByUser_Id(user.getId())
                .orElseGet(BuyerProfile::new);

        profile.setUser(user);
        profile.setBusinessName(request.getBusinessName());
        profile.setBuyerType(request.getBuyerType());
        profile.setPhoneNumber(request.getPhoneNumber());
        profile.setGstNumber(gstNumber);
        profile.setCity(request.getCity());
        profile.setDistrict(request.getDistrict());
        profile.setState(request.getState());
        profile.setPostalCode(request.getPostalCode());

        BuyerProfile saved =
                buyerProfileRepository.save(profile);

        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public BuyerProfileResponse getMyProfile(String email) {

        User user = getUser(email);
        requireBuyer(user);

        BuyerProfile profile = buyerProfileRepository
                .findByUser_Id(user.getId())
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Buyer profile not found. Please create your profile."));

        return toResponse(profile);
    }

    private User getUser(String email) {
        return userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() ->
                        new IllegalArgumentException("User not found."));
    }

    private void requireBuyer(User user) {
        if (user.getRole() != Role.BUYER) {
            throw new AccessDeniedException(
                    "Only buyers can access buyer profiles.");
        }
    }

    private BuyerProfileResponse toResponse(BuyerProfile profile) {

        BuyerProfileResponse response =
                new BuyerProfileResponse();

        response.setId(profile.getId());
        response.setUserId(profile.getUser().getId());
        response.setName(profile.getUser().getName());
        response.setEmail(profile.getUser().getEmail());
        response.setBusinessName(profile.getBusinessName());
        response.setBuyerType(profile.getBuyerType());
        response.setPhoneNumber(profile.getPhoneNumber());
        response.setGstNumber(profile.getGstNumber());
        response.setCity(profile.getCity());
        response.setDistrict(profile.getDistrict());
        response.setState(profile.getState());
        response.setPostalCode(profile.getPostalCode());

        return response;
    }
}