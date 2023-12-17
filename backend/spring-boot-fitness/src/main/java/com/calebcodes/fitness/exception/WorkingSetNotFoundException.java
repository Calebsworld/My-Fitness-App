package com.calebcodes.fitness.exception;

public class WorkingSetNotFoundException extends RuntimeException {
    public WorkingSetNotFoundException(String message) {
        super(message);
    }
}
