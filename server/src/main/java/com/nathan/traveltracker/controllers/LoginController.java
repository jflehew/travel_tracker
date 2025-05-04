package com.nathan.traveltracker.controllers;

import com.nathan.traveltracker.dto.UserDTO;
import com.nathan.traveltracker.models.LoginUser;
import com.nathan.traveltracker.models.User;
import com.nathan.traveltracker.services.UserService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
// import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
public class LoginController {
    //Home Page Easy Change
    String Homepage = "/home";

    @Autowired
    private UserService userService;
//Login Page
    @GetMapping("/")
    public String index(Model model) {
        model.addAttribute("newUser", new User());
        model.addAttribute("newLogin", new LoginUser());
        return "index.jsp";
    }

//Register Account POST method
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody User newUser,
                            BindingResult result,
                            // Model model,
                            HttpSession session) {

        userService.register(newUser, result);
        System.out.println("Received user: " + newUser);

        if(result.hasErrors()) {
            // model.addAttribute("newLogin", new LoginUser());
            // List<String> errorMessages = result.getAllErrors().stream()
            //     .map(error -> error.getDefaultMessage())
            //     .toList();
            Map<String, String> userErrors = new HashMap<>();
            result.getFieldErrors().forEach(err -> {
                userErrors.put(err.getField(), err.getDefaultMessage());
            });
            return ResponseEntity
                .badRequest()
                .body(Map.of("errors", userErrors));
        }

        UserDTO responseUser = new UserDTO(newUser);
        System.out.println(responseUser);

        //Log in User after making account
        session.setAttribute("user", newUser);
        return ResponseEntity.ok(responseUser);
    }

//Login Method
    @PostMapping("/login")
    public String login(@Valid @ModelAttribute("newLogin") LoginUser newLogin,
                        BindingResult result,
                        Model model,
                        HttpSession session) {

        User user = userService.login(newLogin, result);

        if(result.hasErrors()) {
            model.addAttribute("newUser", new User());
            return "index.jsp";
        }
        //Log in User
        session.setAttribute("user", user);
        return "redirect:"+Homepage;
    }

//Logout Method
    @GetMapping("/logout")
    public String logout(HttpSession session) {
        session.invalidate();
        return "redirect:/";
    }
}