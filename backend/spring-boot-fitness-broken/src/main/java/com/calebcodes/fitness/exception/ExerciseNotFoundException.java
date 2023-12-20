package com.calebcodes.fitness.exception;

public class ExerciseNotFoundException extends RuntimeException{

    public ExerciseNotFoundException(String message) {
        super(message);
    }

}
