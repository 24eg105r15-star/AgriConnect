package app.service;

import app.dto.FarmerProfileRequest;
import app.dto.FarmerProfileResponse;
import app.model.FarmerProfile;
import app.model.Role;
import app.model.User;
import app.repository.FarmerProfileRepository;
import app.repository.UserRepository;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class FarmerProfileService {

    private final FarmerProfileRepository farmerProfileRepository;
    private final UserRepository userRepository;

    public FarmerProfileService(
            FarmerProfileRepository farmerProfileRepository,
            UserRepository userRepository) {

        this.farmerProfileRepository = farmerProfileRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public FarmerProfileResponse saveMyProfile(
            String email,
            FarmerProfileRequest request) {

        User user = getUser(email);
        requireFarmer(user);

        FarmerProfile profile = farmerProfileRepository
                .findByUser_Id(user.getId())
                .orElseGet(FarmerProfile::new);

        profile.setUser(user);
        profile.setPhoneNumber(request.getPhoneNumber());
        profile.setFarmName(request.getFarmName());
        profile.setVillage(request.getVillage());
        profile.setDistrict(request.getDistrict());
        profile.setState(request.getState());
        profile.setPostalCode(request.getPostalCode());

        FarmerProfile saved =
                farmerProfileRepository.save(profile);

        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public FarmerProfileResponse getMyProfile(String email) {

        User user = getUser(email);
        requireFarmer(user);

        FarmerProfile profile = farmerProfileRepository
                .findByUser_Id(user.getId())
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Farmer profile not found. Please create your profile."));

        return toResponse(profile);
    }

    private User getUser(String email) {
        return userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() ->
                        new IllegalArgumentException("User not found."));
    }

    private void requireFarmer(User user) {
        if (user.getRole() != Role.FARMER) {
            throw new AccessDeniedException(
                    "Only farmers can access farmer profiles.");
        }
    }

    private FarmerProfileResponse toResponse(FarmerProfile profile) {

        FarmerProfileResponse response =
                new FarmerProfileResponse();

        response.setId(profile.getId());
        response.setUserId(profile.getUser().getId());
        response.setName(profile.getUser().getName());
        response.setEmail(profile.getUser().getEmail());
        response.setPhoneNumber(profile.getPhoneNumber());
        response.setFarmName(profile.getFarmName());
        response.setVillage(profile.getVillage());
        response.setDistrict(profile.getDistrict());
        response.setState(profile.getState());
        response.setPostalCode(profile.getPostalCode());

        return response;
    }
}