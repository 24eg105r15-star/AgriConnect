package app.controller;

import app.service.TransportRateService;

import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/api/transport")
public class TransportRateController {

    private final TransportRateService transportRateService;

    public TransportRateController(
            TransportRateService transportRateService) {
        this.transportRateService = transportRateService;
    }

    @GetMapping("/cost")
    public Map<String, Object> calculateCost(
            @RequestParam String fromDistrict,
            @RequestParam String toDistrict,
            @RequestParam BigDecimal distanceKm,
            @RequestParam BigDecimal quantityQuintals) {

        BigDecimal cost =
                transportRateService.calculateTransportCost(
                        fromDistrict,
                        toDistrict,
                        distanceKm,
                        quantityQuintals);

        return Map.of(
                "fromDistrict", fromDistrict,
                "toDistrict", toDistrict,
                "distanceKm", distanceKm,
                "quantityQuintals", quantityQuintals,
                "estimatedTransportCost", cost);
    }
}