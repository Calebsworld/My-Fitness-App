package com.calebcodes.fitness.exception;

public class WorkoutNotFoundException extends RuntimeException {

    public WorkoutNotFoundException(String message) {
        super(message);
    }

}
