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


    public User register(User newUser, BindingResult result) {

        Optional<User> potentialUser = userRepository.findByEmail(newUser.getEmail());
        if (potentialUser.isPresent()){
            result.rejectValue("email","Already Exists" ,"Another account already uses this email!");
        }

        if(!newUser.getPassword().equals(newUser.getConfirmPassword())) {
            result.rejectValue("confirmPassword", "Matches", "'Confirm Password' must match Password!");
        }
        if(result.hasErrors()) {
            return null;
        }
        String hashed = BCrypt.hashpw(newUser.getPassword(), BCrypt.gensalt());
        newUser.setPassword(hashed);
        userRepository.save(newUser);
        return newUser;

    }

    public User login(LoginUser newLoginObject, BindingResult result) {
        Optional<User> potentialUser = userRepository.findByEmail(newLoginObject.getEmail());
        if (potentialUser.isEmpty()){
            result.rejectValue("email","Matches" ,"Email does not exist, please create an account.");
            return null;
        }

        User user = potentialUser.get();

        // Reject if BCrypt password match fails
        if(!BCrypt.checkpw(newLoginObject.getPassword(), user.getPassword())) {
            result.rejectValue("password", "Matches", "Invalid Password.");
            return null;
        }

        if (result.hasErrors()){
                return null;
        }
        return user;
    }

    public User getUserById(Long Id){
        Optional<User> potentialUser = userRepository.findById(Id);
        if(potentialUser.isEmpty()){
            return null;
        }
        User user = potentialUser.get();
        return user;
    }

}
