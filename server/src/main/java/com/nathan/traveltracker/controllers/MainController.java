package com.nathan.traveltracker.controllers;

import com.nathan.traveltracker.models.Trip;
import com.nathan.traveltracker.models.Trip;
import com.nathan.traveltracker.services.TripService;
import com.nathan.traveltracker.services.TripService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

@Controller
public class MainController {

    @Autowired
    private TripService tripService;

//  Home/Display All
    @GetMapping("/home")
    public String index(Model model,
                        HttpSession session) {
        model.addAttribute("user", session.getAttribute("user"));
        model.addAttribute("trips", tripService.getAllTrips());
        //Return Home if Not Logged in.
        if (session.getAttribute("user") == null) {
            return "redirect:/";
        }
        return "home.jsp";
    }

    //Add Trip Page
    @GetMapping("/trips/new")
    public String addBook( @ModelAttribute("newTrip") Trip newTrip,
                           Model model,
                           HttpSession session){

        model.addAttribute("user", session.getAttribute("user"));
        //Return Home if Not Logged in.
        if (session.getAttribute("user") == null) {
            return "redirect:/";
        }
        return "addTrip.jsp";
    }

    //Create Trip Method
    @PostMapping("/trips/createTrip")
    public String addTrip(@Valid @ModelAttribute("newTrip")Trip newTrip,
                          BindingResult result,
                          Model model,
                          HttpSession session){

        tripService.addTrip(newTrip, result);
        if(result.hasErrors()) {
            model.addAttribute("user",session.getAttribute("user"));
            return "addTrip.jsp";
        }


        return "redirect:/home";
    }

    //Trip Info
    @GetMapping("/trips/{tripId}")
    public String tripInfo(@PathVariable("tripId")Long tripId,
                           @ModelAttribute("newTrip") Trip newTrip,
                           Model model,
                           HttpSession session){
        model.addAttribute("trip", tripService.findTrip(tripId));
        model.addAttribute("user", session.getAttribute("user"));
        //Return Home if Not Logged in.
        if (session.getAttribute("user") == null) {
            return "redirect:/";
        }
        return "tripInfo.jsp";
    }



    //Edit Page
    @GetMapping("/trips/edit/{tripId}")
    public String editBook(@PathVariable("tripId")Long tripId,
                           Model model,
                           HttpSession session){

        model.addAttribute("editTrip", tripService.findTrip(tripId));
        //Return Home if Not Logged in.
        if (session.getAttribute("user") == null) {
            return "redirect:/";
        }
        model.addAttribute("user",session.getAttribute("user"));
        return "editTrip.jsp";
    }

    //PUT request
    @RequestMapping(value = "/trips/{tripId}",  method =RequestMethod.PUT)
    public String submitEdit(@Valid
                             @ModelAttribute("editTrip") Trip trip,
                             BindingResult result,
                             Model model,
                             HttpSession session){

        model.addAttribute(session.getAttribute("user"));

        if(result.hasErrors()) {
            model.addAttribute("trip", trip);
            return "editTrip.jsp";
        }

        tripService.editTrip(trip, result);
        return "redirect:/trips/{tripId}";
    }

    //DELETE Method
    @GetMapping("/trips/delete/{tripId}")
    public String deleteTrip(@PathVariable Long tripId, HttpSession session) {
        Trip trip = tripService.findTrip(tripId);

        tripService.deleteTripById(tripId);
        return "redirect:/home";

    }

}
