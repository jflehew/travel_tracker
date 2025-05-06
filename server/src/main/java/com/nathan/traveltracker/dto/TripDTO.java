package com.nathan.traveltracker.dto;

import java.util.Date;

import com.nathan.traveltracker.models.Trip;

public class TripDTO {
    private Long id;
    private String departureLocation;
    private String arrivalLocation;
    private String apiID;
    private Date departureDate;
    private Date arrivalDate;
    private String routeName;
    private String status;

    
    public TripDTO(Trip trip) {
        this.id = trip.getId();
        this.departureLocation = trip.getDepartureLocation();
        this.arrivalLocation = trip.getArrivalLocation();
        this.apiID = trip.getApiID();
        this.departureDate = trip.getDepartureDate();
        this.arrivalDate = trip.getArrivalDate();
        this.routeName = trip.getRouteName();
        this.status = trip.getStatus();
    }
    
    public Long getId() {
        return id;
    }

    public String getDepartureLocation() {
        return departureLocation;
    }

    public String getArrivalLocation() {
        return arrivalLocation;
    }

    public Date getDepartureDate() {
        return departureDate;
    }

    public Date getArrivalDate() {
        return arrivalDate;
    }

    public String getRouteName() {
        return routeName;
    }

    public String getStatus() {
        return status;
    }

    public String getApiID(){
        return apiID;
    }
    
    
}
