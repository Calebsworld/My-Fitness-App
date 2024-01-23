package com.calebcodes.fitness.dto;

import com.calebcodes.fitness.entity.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserWithImage {

    private User user;
    private String image;

}
