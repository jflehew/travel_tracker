package com.nathan.traveltracker.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.List;
import java.util.Map;


@Service
public class TransportService {

    @Value("${tfl.api.url}")
    private String baseUrl;

    @Value("${tfl.api.app_id}")
    private String appId;

    @Value("${tfl.api.app_key}")
    private String appKey;

    private final RestTemplate restTemplate = new RestTemplate();

    public Map<String, Object> getJourney(String departureId, String arrivalId) {
        String url = UriComponentsBuilder.fromUriString(baseUrl + "/Journey/JourneyResults/{from}/to/{to}")
                .queryParam("app_id", appId)
                .queryParam("app_key", appKey)
                .buildAndExpand(departureId, arrivalId)
                .toUriString();
    
        return restTemplate.getForObject(url, Map.class);
    }

    public List<Map<String, Object>> getTubeStations(String lineId) {
        String url = UriComponentsBuilder.fromUriString(baseUrl + "/Line/{lineId}/StopPoints")
                .queryParam("app_id", appId)
                .queryParam("app_key", appKey)
                .buildAndExpand(lineId)
                .toUriString();
        List<Map<String, Object>> response = restTemplate.getForObject(url, List.class);
        return response;
    }

    public List<Map<String, Object>> getTubeLines() {
        String url = UriComponentsBuilder.fromUriString(baseUrl + "/Line/Mode/tube")
                .queryParam("app_id", appId)
                .queryParam("app_key", appKey)
                .toUriString();
    
        List<Map<String, Object>> lines = restTemplate.getForObject(url, List.class);
        return lines;
    }

}