package app.service;

import app.dto.CropResponse;
import app.model.Crop;
import app.repository.CropRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;

@Service
public class CropService {

    private final CropRepository cropRepository;

    public CropService(CropRepository cropRepository) {
        this.cropRepository = cropRepository;
    }

    @Transactional(readOnly = true)
    public List<CropResponse> getActiveCrops() {
        return cropRepository.findAll()
                .stream()
                .filter(Crop::isActive)
                .sorted(Comparator.comparing(
                        Crop::getName,
                        String.CASE_INSENSITIVE_ORDER))
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public CropResponse getCropById(Long id) {
        Crop crop = cropRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException("Crop not found."));

        return toResponse(crop);
    }

    private CropResponse toResponse(Crop crop) {
        CropResponse response = new CropResponse();

        response.setId(crop.getId());
        response.setName(crop.getName());
        response.setCategory(crop.getCategory());
        response.setDescription(crop.getDescription());
        response.setActive(crop.isActive());

        return response;
    }
}