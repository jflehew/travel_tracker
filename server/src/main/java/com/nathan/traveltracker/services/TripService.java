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

        return tripRepository.save(newTrip);
    }

    public Trip editTrip(Trip currentTrip, BindingResult result) {

        if(result.hasErrors()) {
            return null;
        }

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
