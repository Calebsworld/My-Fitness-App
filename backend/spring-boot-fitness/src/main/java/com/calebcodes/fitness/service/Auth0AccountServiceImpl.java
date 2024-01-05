package com.calebcodes.fitness.service;

import com.calebcodes.fitness.response.auth0.TokenResponse;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class Auth0AccountServiceImpl implements Auth0AccountService {

    private final RestTemplate restTemplate;
    private final String deleteUserApiUrl;
    private final String tokenApiUrl;
    private final String clientId;
    private final String clientSecret;
    private final String audience;

    public Auth0AccountServiceImpl(RestTemplate restTemplate,
                                   @Value("${okta.oauth2.management.identifier}") String deleteUserApiUrl,
                                   @Value("${okta.oauth2.issuer}") String tokenApiUrl,
                                   @Value("${okta.oauth2.client.id}") String clientId,
                                   @Value("${okta.oauth2.client.secret}") String clientSecret,
                                   @Value("${okta.oauth2.management.identifier}") String audience) {
        this.restTemplate = restTemplate;
        this.deleteUserApiUrl = deleteUserApiUrl;
        this.tokenApiUrl = tokenApiUrl;
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.audience = audience;
    }

    @Override
    public void deleteAccount(String auth0Id) {
        if (auth0Id == null) {
            throw new IllegalArgumentException("idToken cannot be null");
        }
        String url = deleteUserApiUrl + "users/" + auth0Id;
        try {
            String accessToken = getAccessToken();

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(accessToken);

            HttpEntity<String> entity = new HttpEntity<>(headers);
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.DELETE, entity, String.class);
            System.out.println(response.getBody());
        } catch (RestClientException e) {
            // Handle the exception
            throw new RuntimeException("Error deleting account", e);
        }
    }

    private String getAccessToken() {
        String url = tokenApiUrl + "oauth/token";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, String> map = new HashMap<>();
        map.put("client_id", clientId);
        map.put("client_secret", clientSecret);
        map.put("audience", audience);
        map.put("grant_type", "client_credentials");

        HttpEntity<Map<String, String>> entity = new HttpEntity<>(map, headers);

        try {
            ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);
            ObjectMapper mapper = new ObjectMapper();
            TokenResponse tokenResponse = mapper.readValue(response.getBody(), TokenResponse.class);
            return tokenResponse.getAccess_token(); // Extract and return the access token
        } catch (RestClientException | JsonProcessingException e) {
            throw new RuntimeException("Error getting access token", e);
        }
    }

}
