package com.calebcodes.fitness.service;

import org.springframework.http.HttpStatusCode;

import java.io.UnsupportedEncodingException;

public interface Auth0AccountService {

    public HttpStatusCode deleteAccount(String idToken) throws UnsupportedEncodingException;

}
