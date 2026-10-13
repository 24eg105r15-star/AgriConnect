package app.controller;

import app.dto.CropResponse;
import app.service.CropService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/crops")
public class CropController {

    private final CropService cropService;

    public CropController(CropService cropService) {
        this.cropService = cropService;
    }

    @GetMapping
    public List<CropResponse> getActiveCrops() {
        return cropService.getActiveCrops();
    }

    @GetMapping("/{id}")
    public CropResponse getCropById(@PathVariable Long id) {
        return cropService.getCropById(id);
    }
}