package app.repository;

import app.model.Listing;
import app.model.ListingStatus;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ListingRepository extends JpaRepository<Listing, Long> {

    List<Listing> findByStatusOrderByCreatedAtDesc(
            ListingStatus status
    );

    List<Listing> findByCrop_IdAndStatusOrderByCreatedAtDesc(
            Long cropId,
            ListingStatus status
    );

    List<Listing> findByFarmer_IdOrderByCreatedAtDesc(
            Long farmerProfileId
    );

    List<Listing> findByFarmer_IdAndStatusOrderByCreatedAtDesc(
            Long farmerProfileId,
            ListingStatus status
    );

    List<Listing> findByPickupDistrictIgnoreCaseAndStatus(
            String pickupDistrict,
            ListingStatus status
    );
}