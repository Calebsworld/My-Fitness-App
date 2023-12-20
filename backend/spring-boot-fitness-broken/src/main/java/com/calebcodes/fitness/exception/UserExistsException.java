package com.calebcodes.fitness.exception;

public class UserExistsException extends RuntimeException{

    public UserExistsException(String message){
        super(message);
    }

}
