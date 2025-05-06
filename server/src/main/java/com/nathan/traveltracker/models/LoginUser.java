package com.nathan.traveltracker.models;

import jakarta.validation.constraints.NotEmpty;

public class LoginUser {

    @NotEmpty(message="Email is required!")
    private String email;

    @NotEmpty(message="Password is required!")
    private String password;

    public LoginUser() {}

    public String getEmail() {
        return email;
    }

    public void setEmail(String loginEmail) {
        this.email = loginEmail;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String loginPassword) {
        this.password = loginPassword;
    }

}