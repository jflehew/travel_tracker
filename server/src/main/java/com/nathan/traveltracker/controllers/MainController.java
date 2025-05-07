package com.nathan.traveltracker.controllers;

import com.nathan.traveltracker.dto.TripDTO;
import com.nathan.traveltracker.models.Trip;
import com.nathan.traveltracker.models.User;
import com.nathan.traveltracker.services.TripService;
import com.nathan.traveltracker.services.UserService;

import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;



@RestController
@RequestMapping("/api/trips")
public class MainController {

    @Autowired
    private TripService tripService;
    @Autowired
    private UserService userService;

    @GetMapping("/get/all")
    public ResponseEntity<?> getAllTrips(HttpSession session) {
        User user = (User) session.getAttribute("user");
        List<Trip> allTrips = tripService.getAllTrips(user.getId());
        List<TripDTO> responseTrips = allTrips.stream()
            .map(TripDTO::new)
            .collect(Collectors.toList());
        return ResponseEntity.ok(responseTrips);
    }
    

    @PostMapping("/create")
    public ResponseEntity<?> addTrip(
                            @Valid 
                            @RequestBody Trip newTrip,
                            BindingResult result
                            ){
        User tripUser = userService.getUserById(newTrip.getUserId());
        if (tripUser == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("errors", "Invalid user ID"));
        }
        newTrip.setUser(tripUser);
        Trip savedTrip = tripService.addTrip(newTrip, result);
        if(result.hasErrors()) {
            Map<String, String> tripErrors = new HashMap<>();
            result.getFieldErrors().forEach(err -> {
                tripErrors.put(err.getField(), err.getDefaultMessage());
            });
            return ResponseEntity
                .badRequest()
                .body(Map.of("errors", tripErrors));
        }
        
        TripDTO responseTrip = new TripDTO(savedTrip);
        return ResponseEntity.ok(responseTrip);
    }

    @GetMapping("/get/one/{tripId}")
    public ResponseEntity<?> tripInfo(@PathVariable Long tripId){
        Trip selectedTrip = tripService.findTrip(tripId);
        if(selectedTrip == null){
            return ResponseEntity
                .badRequest()
                .body(Map.of("errors","Trip Id does not exist" ));
        }
        TripDTO responseTrip = new TripDTO(selectedTrip);
        return ResponseEntity.ok(responseTrip);
    }

    @PutMapping("/update/{tripId}")
    public ResponseEntity<?> editTrip(
                        @PathVariable Long tripId,
                        @Valid
                        @RequestBody Trip updatedTrip,
                        BindingResult result
    ){
        Trip savedTrip = tripService.editTrip(tripId, updatedTrip, result);
        if(result.hasErrors()) {
            Map<String, String> tripErrors = new HashMap<>();
            result.getFieldErrors().forEach(err -> {
                tripErrors.put(err.getField(), err.getDefaultMessage());
            });
            return ResponseEntity
                .badRequest()
                .body(Map.of("errors", tripErrors));
        }
        TripDTO responseTrip = new TripDTO(savedTrip);
        return ResponseEntity.ok(responseTrip);
    }

    @DeleteMapping("/delete/{tripId}")
    public ResponseEntity<?> deleteTrip(@PathVariable Long tripId) {
        Trip trip = tripService.findTrip(tripId);
        if (trip == null){
            return ResponseEntity
                .badRequest()
                .body(Map.of("errors","Trip Id does not exist" )); 
        }
        tripService.deleteTripById(tripId);;
        return ResponseEntity.ok(Map.of("Success", "Trip Successfully Deleted"));
    }

}
