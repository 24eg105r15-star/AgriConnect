package app.controller;

import app.dto.PriceEntryResponse;
import app.service.PriceEntryService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/prices")
public class PriceEntryController {

    private final PriceEntryService priceEntryService;

    public PriceEntryController(PriceEntryService priceEntryService) {
        this.priceEntryService = priceEntryService;
    }

    @GetMapping
    public List<PriceEntryResponse> getLatestPrices() {
        return priceEntryService.getLatestPrices();
    }

    @GetMapping("/crop/{cropId}")
    public List<PriceEntryResponse> getPricesByCrop(
            @PathVariable Long cropId) {
        return priceEntryService.getPricesByCrop(cropId);
    }

    @GetMapping("/market/{marketId}")
    public List<PriceEntryResponse> getPricesByMarket(
            @PathVariable Long marketId) {
        return priceEntryService.getPricesByMarket(marketId);
    }
}