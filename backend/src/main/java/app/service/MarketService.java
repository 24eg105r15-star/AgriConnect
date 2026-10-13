package app.service;

import app.dto.MarketResponse;
import app.model.Market;
import app.repository.MarketRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;

@Service
public class MarketService {

    private final MarketRepository marketRepository;

    public MarketService(MarketRepository marketRepository) {
        this.marketRepository = marketRepository;
    }

    @Transactional(readOnly = true)
    public List<MarketResponse> getActiveMarkets() {
        return marketRepository.findAll()
                .stream()
                .filter(Market::isActive)
                .sorted(Comparator.comparing(
                        Market::getName,
                        String.CASE_INSENSITIVE_ORDER))
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public MarketResponse getMarketById(Long id) {
        Market market = marketRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException("Market not found."));

        return toResponse(market);
    }

    private MarketResponse toResponse(Market market) {
        MarketResponse response = new MarketResponse();

        response.setId(market.getId());
        response.setName(market.getName());
        response.setDistrict(market.getDistrict());
        response.setState(market.getState());
        response.setLatitude(market.getLatitude());
        response.setLongitude(market.getLongitude());
        response.setMarketCode(market.getMarketCode());
        response.setActive(market.isActive());

        return response;
    }
}