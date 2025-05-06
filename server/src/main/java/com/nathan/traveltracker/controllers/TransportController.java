package com.nathan.traveltracker.controllers;

import com.example.app.service.TransportService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/tfl")
public class TransportController {
    private final TfLService tflService;

    public TfLController(TfLService tflService) {
        this.tflService = tflService;
    }

    @GetMapping("/lines")
    public List<String> getConnectingLines(@RequestParam String origin,
                                            @RequestParam(required = false) String destination) {
        return tflService.findConnectingLines(origin, destination);
    }
}