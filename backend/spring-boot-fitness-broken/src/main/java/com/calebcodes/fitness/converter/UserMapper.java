package com.calebcodes.fitness.converter;

import com.calebcodes.fitness.dto.UserDto;
import com.calebcodes.fitness.response.UserResponse;
import com.calebcodes.fitness.entity.User;

public class UserMapper {

    public static UserDto toUserDto(User user) {
        UserDto userDto = new UserDto();
        userDto.setFirstName(user.getFirstName());
        userDto.setLastName(user.getLastName());
        userDto.setAvatar(user.getAvatar());
        return userDto;
    }

    public static User toUser(UserDto userDto) {
        User user = new User();
        user.setFirstName(userDto.getFirstName());
        user.setLastName(userDto.getLastName());
        user.setEmail(userDto.getEmail());
        user.setAvatar(userDto.getAvatar());
        return user;
    }

    public static UserResponse toUserResponse(User userToReturn, int status, String message) {
        return new UserResponse(userToReturn, message, status);
    }
}
