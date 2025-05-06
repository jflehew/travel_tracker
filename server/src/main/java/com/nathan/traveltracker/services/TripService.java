package com.nathan.traveltracker.services;

import com.nathan.traveltracker.models.Trip;
import com.nathan.traveltracker.repositories.TripRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.validation.BindingResult;

import java.util.List;
import java.util.Optional;

@Service
public class TripService {

    @Autowired
    private TripRepository tripRepository;

    public Trip addTrip(Trip  newTrip, BindingResult result) {
        if(result.hasErrors()) {
            return null;
        }
        if (newTrip.getArrivalDate() != null && 
        newTrip.getDepartureDate() != null &&
        !newTrip.getArrivalDate().after(newTrip.getDepartureDate())) {
        result.rejectValue("arrivalDate", "Invalid", "Arrival date must be after departure date.");
        }

        return tripRepository.save(newTrip);
    }

    public Trip editTrip(Long id, Trip currentTrip, BindingResult result) {
        if(result.hasErrors()) {
            return null;
        }
        if (currentTrip.getArrivalDate() != null && 
        currentTrip.getDepartureDate() != null &&
        !currentTrip.getArrivalDate().after(currentTrip.getDepartureDate())) {
        result.rejectValue("arrivalDate", "Invalid", "Arrival date must be after departure date.");
        }
        Optional<Trip> existingTripOpt = tripRepository.findById(id);
        if (existingTripOpt == null){
            return null;
        }
        Trip existingTrip = existingTripOpt.get();
        currentTrip.setId(id);
        currentTrip.setUser(existingTrip.getUser());
        currentTrip.setCreatedAt(existingTrip.getCreatedAt());
        return tripRepository.save(currentTrip);
    }

    public List<Trip> getAllTrips(){
        return tripRepository.findAll();
    }
    public Trip findTrip(Long id) {
        Optional<Trip> optionalTrip = tripRepository.findById(id);
        return optionalTrip.orElse(null);
    }

    public void deleteTripById(Long id) {
        tripRepository.deleteById(id);
    }
}
