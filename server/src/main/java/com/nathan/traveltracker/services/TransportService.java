package com.nathan.traveltracker.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class TransportService {

    @Value("${tfl.api.url}")
    private String baseUrl;

    @Value("${tfl.api.app_id}")
    private String appId;

    @Value("${tfl.api.app_key}")
    private String appKey;

    private final RestTemplate restTemplate = new RestTemplate();

    public List<String> findConnectingLines(String origin, String destination) {
        String url = UriComponentsBuilder.fromHttpUrl(baseUrl + "/Line/Mode/tube/Route")
                .queryParam("app_id", appId)
                .queryParam("app_key", appKey)
                .toUriString();

        LineRoute[] lines = restTemplate.getForObject(url, LineRoute[].class);
        if (lines == null) return List.of();

        List<String> results = new ArrayList<>();
        for (LineRoute line : lines) {
            for (RouteSection section : line.routeSections) {
                List<String> stationNames = section.stationIntervals.stream()
                    .flatMap(interval -> interval.stopPoints.stream())
                    .map(stop -> stop.name.toLowerCase())
                    .collect(Collectors.toList());

                if (stationNames.contains(origin.toLowerCase())) {
                    if (destination == null || destination.isBlank() || stationNames.contains(destination.toLowerCase())) {
                        results.add(line.name);
                    }
                }
            }
        }
        return results;
    }

    static class LineRoute {
        public String name;
        public List<RouteSection> routeSections;
    }

    static class RouteSection {
        public List<StationInterval> stationIntervals;
    }

    static class StationInterval {
        public List<StopPoint> stopPoints;
    }

    static class StopPoint {
        public String name;
    }
}