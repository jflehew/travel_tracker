package com.nathan.traveltracker.repositories;

import com.nathan.traveltracker.models.Trip;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface TripRepository extends CrudRepository<Trip, Long> {
    List<Trip> findAll();
    void deleteById(Long id);
}
