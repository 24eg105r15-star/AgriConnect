package app.controller;

import app.dto.MarketResponse;
import app.service.MarketService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/markets")
public class MarketController {

    private final MarketService marketService;

    public MarketController(MarketService marketService) {
        this.marketService = marketService;
    }

    @GetMapping
    public List<MarketResponse> getActiveMarkets() {
        return marketService.getActiveMarkets();
    }

    @GetMapping("/{id}")
    public MarketResponse getMarketById(@PathVariable Long id) {
        return marketService.getMarketById(id);
    }
}