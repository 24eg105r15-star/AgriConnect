package app.service;

import app.dto.PriceEntryResponse;
import app.model.PriceEntry;
import app.repository.PriceEntryRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;

@Service
public class PriceEntryService {

    private final PriceEntryRepository priceEntryRepository;

    public PriceEntryService(
            PriceEntryRepository priceEntryRepository) {
        this.priceEntryRepository = priceEntryRepository;
    }

    @Transactional(readOnly = true)
    public List<PriceEntryResponse> getLatestPrices() {
        return priceEntryRepository.findAll()
                .stream()
                .sorted(Comparator.comparing(
                        PriceEntry::getPriceDate,
                        Comparator.reverseOrder()))
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<PriceEntryResponse> getPricesByCrop(Long cropId) {
        return priceEntryRepository.findAll()
                .stream()
                .filter(price ->
                        price.getCrop().getId().equals(cropId))
                .sorted(Comparator.comparing(
                        PriceEntry::getPriceDate,
                        Comparator.reverseOrder()))
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<PriceEntryResponse> getPricesByMarket(Long marketId) {
        return priceEntryRepository.findAll()
                .stream()
                .filter(price ->
                        price.getMarket().getId().equals(marketId))
                .sorted(Comparator.comparing(
                        PriceEntry::getPriceDate,
                        Comparator.reverseOrder()))
                .map(this::toResponse)
                .toList();
    }

    private PriceEntryResponse toResponse(PriceEntry price) {
        PriceEntryResponse response = new PriceEntryResponse();

        response.setId(price.getId());
        response.setCropId(price.getCrop().getId());
        response.setCropName(price.getCrop().getName());

        response.setMarketId(price.getMarket().getId());
        response.setMarketName(price.getMarket().getName());
        response.setDistrict(price.getMarket().getDistrict());
        response.setState(price.getMarket().getState());

        response.setVariety(price.getVariety());
        response.setPriceDate(price.getPriceDate());
        response.setMinPrice(price.getMinPrice());
        response.setMaxPrice(price.getMaxPrice());
        response.setModalPrice(price.getModalPrice());
        response.setPriceUnit(price.getPriceUnit());
        response.setDataSource(price.getDataSource());

        return response;
    }
}