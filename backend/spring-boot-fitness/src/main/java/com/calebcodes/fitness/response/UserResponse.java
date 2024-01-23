package com.calebcodes.fitness.response;

import com.calebcodes.fitness.dto.UserDto;
import com.calebcodes.fitness.entity.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {

    private User user;
    private String imgData;
    private String message;
    private int status;

}
