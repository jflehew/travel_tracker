package com.nathan.traveltracker.validators;

import java.util.Date;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class FutureDateValidator implements ConstraintValidator<FutureDate, Date> {

    @Override
    public boolean isValid(Date date, ConstraintValidatorContext context){
        if (date == null) return false;
        return date.after(new Date());
    }
    
}
