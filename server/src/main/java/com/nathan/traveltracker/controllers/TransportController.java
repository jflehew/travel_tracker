package com.nathan.traveltracker.controllers;

import com.nathan.traveltracker.services.TransportService;
// import com.example.app.service.TransportService;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tfl")
public class TransportController {
    private final TransportService tflService;

    public TransportController(TransportService tflService) {
        this.tflService = tflService;
    }

    // @GetMapping("/lines")
    // public List<String> getConnectingLines(@RequestParam String origin,
    //                                         @RequestParam(required = false) String destination) {
    //     return tflService.findConnectingLines(origin, destination);
    // }

    @GetMapping("/journey")
    public Map<String, Object> getJourney(
            @RequestParam String departureId,
            @RequestParam String arrivalId) {
        return tflService.getJourney(departureId, arrivalId);
    }

    @GetMapping("/stations")
    public List<Map<String, Object>> getStations(
        @RequestParam String lineId
    ) {
        return tflService.getTubeStations(lineId);
    }

    @GetMapping("/lines")
    public List<Map<String, Object>> getLines() {
        return tflService.getTubeLines();
    }

}