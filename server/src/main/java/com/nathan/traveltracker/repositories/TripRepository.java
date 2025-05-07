package com.nathan.traveltracker.repositories;

import com.nathan.traveltracker.models.Trip;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface TripRepository extends CrudRepository<Trip, Long> {
    List<Trip> findAll();
    List<Trip> findByUser_Id(Long userId);
    void deleteById(Long id);
}
