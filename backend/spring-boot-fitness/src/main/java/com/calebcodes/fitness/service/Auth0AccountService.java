package com.calebcodes.fitness.service;

import java.io.UnsupportedEncodingException;

public interface Auth0AccountService {

    public void deleteAccount(String idToken) throws UnsupportedEncodingException;

}
