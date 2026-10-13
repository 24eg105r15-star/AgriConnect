package app.service;

import app.model.TransportRate;
import app.repository.TransportRateRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
public class TransportRateService {

    private final TransportRateRepository transportRateRepository;

    public TransportRateService(
            TransportRateRepository transportRateRepository) {
        this.transportRateRepository = transportRateRepository;
    }

    @Transactional(readOnly = true)
    public BigDecimal calculateTransportCost(
            String fromDistrict,
            String toDistrict,
            BigDecimal distanceKm,
            BigDecimal quantityQuintals) {

        if (distanceKm == null || distanceKm.signum() < 0
                || quantityQuintals == null
                || quantityQuintals.signum() < 0) {
            throw new IllegalArgumentException(
                    "Distance and quantity must be non-negative.");
        }

        TransportRate rate = transportRateRepository.findAll()
                .stream()
                .filter(TransportRate::isActive)
                .filter(item ->
                        item.getFromDistrict()
                                .equalsIgnoreCase(fromDistrict))
                .filter(item ->
                        item.getToDistrict()
                                .equalsIgnoreCase(toDistrict))
                .findFirst()
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Transport rate not found for this route."));

        return rate.getRatePerKmPerQuintal()
                .multiply(distanceKm)
                .multiply(quantityQuintals);
    }
}