package com.nathan.traveltracker.controllers;

import com.nathan.traveltracker.dto.UserDTO;
import com.nathan.traveltracker.models.LoginUser;
import com.nathan.traveltracker.models.User;
import com.nathan.traveltracker.services.UserService;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
// import org.springframework.stereotype.Controller;
// import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
// import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
// import org.springframework.web.bind.annotation.RequestParam;


@RestController
// @Controller
@RequestMapping("/api/users")
public class LoginController {
    //Home Page Easy Change
    // String Homepage = "/home";

    @Autowired
    private UserService userService;
//Login Page
    // @GetMapping("/")
    // public String index(Model model) {
    //     model.addAttribute("newUser", new User());
    //     model.addAttribute("newLogin", new LoginUser());
    //     return "index.jsp";
    // }

//Register Account POST method
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody User newUser,
                            BindingResult result,
                            // Model model,
                            HttpSession session) {

        userService.register(newUser, result);
        // System.out.println("Received user: " + newUser);

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
        // System.out.println(responseUser);

        //Log in User after making account
        session.setAttribute("user", newUser);
        return ResponseEntity.ok(responseUser);
    }

//Login Method
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginUser newLogin,
                        BindingResult result,
                        // Model model,
                        HttpSession session) {
        User user = userService.login(newLogin, result);

        if(result.hasErrors()) {
            Map<String, String> loginErrors = new HashMap<>();
            result.getFieldErrors().forEach(err -> {
                loginErrors.put(err.getField(), err.getDefaultMessage());
            });
            return ResponseEntity
                .badRequest()
                .body(Map.of("errors", loginErrors));
        }
        //Log in User
        UserDTO responseUser = new UserDTO(user);
        session.setAttribute("user", user);
        return ResponseEntity.ok(responseUser);
    }

    @GetMapping("/authenticate")
    public ResponseEntity<?> login(HttpSession session){
        User sessionUser = (User) session.getAttribute("user");
        if(sessionUser == null){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("error", "User not logged in"));
        }
        User authorizeUser = userService.getUserById(sessionUser.getId());
        if (authorizeUser == null){
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", "User not found"));
        }
        UserDTO responseUser = new UserDTO(authorizeUser);
        return ResponseEntity.ok(responseUser);
    }
    

//Logout Method
    @GetMapping("/logout")
    public ResponseEntity<?> logout(HttpSession session, HttpServletResponse response) {
        session.invalidate();
        Cookie cookie = new Cookie("JSESSIONID", null);
        cookie.setPath("/");
        cookie.setHttpOnly(true);
        cookie.setMaxAge(0);

        response.addCookie(cookie);
        return ResponseEntity.ok(Map.of("message", "User Successfully logged out"));
    }
}