package com.calebcodes.fitness.response.auth0;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TokenResponse {

    private String access_token;
    private String scope;
    private String expires_in;
    private String token_type;

}
