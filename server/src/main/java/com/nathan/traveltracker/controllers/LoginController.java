package com.nathan.traveltracker.controllers;

import com.nathan.traveltracker.models.LoginUser;
import com.nathan.traveltracker.models.User;
import com.nathan.traveltracker.services.UserService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;



@Controller
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
    public String register(@Valid @ModelAttribute("newUser") User newUser,
                            BindingResult result,
                            Model model,
                            HttpSession session) {

        userService.register(newUser, result);

        if(result.hasErrors()) {
            model.addAttribute("newLogin", new LoginUser());
            return "index.jsp";
        }

        //Log in User after making account
        session.setAttribute("user", newUser);
        return "redirect:"+Homepage;
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