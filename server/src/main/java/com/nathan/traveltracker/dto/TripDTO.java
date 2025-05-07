package com.nathan.traveltracker.dto;

import java.time.Instant;
import java.util.Date;

import com.nathan.traveltracker.models.Trip;

public class TripDTO {
    private Long id;
    private String departureLocation;
    private String departureLocationId;
    private String arrivalLocation;
    private String arrivalLocationId;
    private Integer duration;
    private Date departureDate;
    private Date arrivalDate;
    private String line;
    private String lineName;
    private String status;

    
    public TripDTO(Trip trip) {
        this.id = trip.getId();
        this.departureLocation = trip.getDepartureLocation();
        this.departureLocationId = trip.getDepartureLocationId();
        this.arrivalLocation = trip.getArrivalLocation();
        this.arrivalLocationId = trip.getArrivalLocationId();
        this.duration = trip.getDuration();
        this.departureDate = trip.getDepartureDate();
        this.arrivalDate = trip.getArrivalDate();
        this.line = trip.getLine();
        this.lineName = trip.getLineName();
        Date now = Date.from(Instant.now());
        if (departureDate.after(now)) {
            this.status = "FUTURE";
        } else if (arrivalDate.after(now)) {
            this.status = "PRESENT";
        } else {
            this.status = "PAST";
        }
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

    public String getLine() {
        return line;
    }

    public String getStatus() {
        return status;
    }

    public Integer getDuration(){
        return duration;
    }

    public String getDepartureLocationId(){
        return departureLocationId;
    }

    public String getArrivalLocationId(){
        return arrivalLocationId;
    }

    public String getLineName() {
        return lineName;
    }
    
    
}
