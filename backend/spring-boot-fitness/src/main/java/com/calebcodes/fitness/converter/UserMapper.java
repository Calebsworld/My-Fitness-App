package com.calebcodes.fitness.converter;

import com.calebcodes.fitness.dto.UserDto;
import com.calebcodes.fitness.response.UserResponse;
import com.calebcodes.fitness.entity.User;

public class UserMapper {

    public static UserDto toUserDto(User user) {
        UserDto userDto = new UserDto();
        userDto.setFirstName(user.getFirstName());
        userDto.setLastName(user.getLastName());
        return userDto;
    }

    public static User toUser(UserDto userDto) {
        User user = new User();
        user.setFirstName(userDto.getFirstName());
        user.setLastName(userDto.getLastName());
        user.setEmail(userDto.getEmail());
        return user;
    }

    public static UserResponse toUserResponse(User userToReturn, String imgData, int status, String message) {
        return new UserResponse(userToReturn, imgData, message, status);
    }
}
