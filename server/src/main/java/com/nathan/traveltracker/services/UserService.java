package com.nathan.traveltracker.services;


import com.nathan.traveltracker.models.LoginUser;
import com.nathan.traveltracker.models.User;
import com.nathan.traveltracker.repositories.UserRepository;
import org.mindrot.jbcrypt.BCrypt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.validation.BindingResult;

import java.util.Optional;



@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    // This method will be called from the controller
    // whenever a user submits a registration form.

    public User register(User newUser, BindingResult result) {

        // Reject if email is taken (present in database)
        Optional<User> potentialUser = userRepository.findByEmail(newUser.getEmail());
        if (potentialUser.isPresent()){
            result.rejectValue("email","Already Exists" ,"Another account already uses this email!");
        }

        // Reject if password doesn't match confirmation
        if(!newUser.getPassword().equals(newUser.getConfirm())) {
            result.rejectValue("confirm", "Matches", "'Confirm Password' must match Password!");
        }
        // Return null if result has errors
        if(result.hasErrors()) {
            // Exit the method and go back to the controller
            // to handle the response
            return null;
        }
        // Hash and set password, save user to database
        String hashed = BCrypt.hashpw(newUser.getPassword(), BCrypt.gensalt());
        newUser.setPassword(hashed);
        userRepository.save(newUser);
        return newUser;

    }

    // This method will be called from the controller
    // whenever a user submits a login form.
    public User login(LoginUser newLoginObject, BindingResult result) {
        // TO-DO - Reject values:

        // Find user in the DB by email
        Optional<User> potentialUser = userRepository.findByEmail(newLoginObject.getLoginEmail());
        if (potentialUser.isEmpty()){
            // Reject if NOT present
            result.rejectValue("loginEmail","Matches" ,"an account does not exist with this email");
            return null;
        }

        User user = potentialUser.get();

        // Reject if BCrypt password match fails
        if(!BCrypt.checkpw(newLoginObject.getLoginPassword(), user.getPassword())) {
            result.rejectValue("loginPassword", "Matches", "Invalid Password!");
            return null;
        }


        // Return null if result has errors
        if (result.hasErrors()){
                return null;
        }
        // Otherwise, return the user object
        return user;
    }


}
