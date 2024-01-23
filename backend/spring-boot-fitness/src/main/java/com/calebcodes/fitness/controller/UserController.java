package com.calebcodes.fitness.controller;

import com.calebcodes.fitness.dto.*;
import com.calebcodes.fitness.entity.Exercise;
import com.calebcodes.fitness.entity.User;
import com.calebcodes.fitness.entity.Workout;
import com.calebcodes.fitness.exception.DeleteUserException;
import com.calebcodes.fitness.response.ExerciseResponse;
import com.calebcodes.fitness.response.FileUploadResponse;
import com.calebcodes.fitness.response.UserResponse;
import com.calebcodes.fitness.response.WorkoutResponse;
import com.calebcodes.fitness.service.Auth0AccountService;
import com.calebcodes.fitness.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.Set;

@RestController
@RequestMapping(value = "/api")
public class UserController {

    private final UserService userService;
    private final Auth0AccountService auth0AccountService;

    @Autowired
    public UserController(UserService userService, Auth0AccountService auth0AccountService) {
        this.userService = userService;
        this.auth0AccountService = auth0AccountService;
    }

    @GetMapping("/public/{email}")
    public ResponseEntity<UserResponse> getUserByEmail(@PathVariable String email) {
        return this.userService.getUserByEmail(email);
    }

    @PostMapping("/public/users")
    @PreAuthorize("hasAuthority('create:users')")
    public ResponseEntity<UserResponse> addUser(@RequestBody UserDto userDto) {
        return userService.addUser(userDto);
    }

    @PutMapping("/private/users/{id}/avatar")
    @PreAuthorize("hasAuthority('upload:avatar')")
    public ResponseEntity<UserResponse> UpdateUserAvatar(@PathVariable Long id,
                                                               @RequestParam("file") MultipartFile file) throws IOException {
        return userService.updateUserAvatar(id, file);
    }

    @DeleteMapping("/private/users/{id}")
    @PreAuthorize("hasAuthority('delete:users')")
    public ResponseEntity<UserResponse> deleteUser(@PathVariable Long id, @RequestHeader HttpHeaders headers) {
        String idToken = headers.getFirst("X-ID-Token");
        HttpStatusCode statusCode = null;
        try {
            statusCode = this.auth0AccountService.deleteAccount(idToken);
        } catch (UnsupportedEncodingException e) {
            throw new DeleteUserException("Error deleting account");
        }
        if (statusCode != HttpStatus.NO_CONTENT) {
            throw new DeleteUserException("Error deleting account");
        }
        return this.userService.deleteUser(id);
    }

    @GetMapping("/private/users/{id}/workouts")
    @PreAuthorize("hasAuthority('read:workouts')")
    public WorkoutWrapperDto getUserWorkouts(
            @PathVariable Long id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return userService.getUserWorkouts(id, page, size);
    }

    @GetMapping("/private/users/{id}/workouts/{workoutId}")
    @PreAuthorize("hasAuthority('read:workouts')")
    public ResponseEntity<Workout> getWorkout(
            @PathVariable Long id,
            @PathVariable Long workoutId) {
        return userService.getWorkout(id, workoutId);
    }

    @GetMapping("/private/users/{id}/workouts/{workoutId}/exercises")
    @PreAuthorize("hasAuthority('read:exercises')")
    public ResponseEntity<Set<Exercise>> getExercises(
            @PathVariable Long id,
            @PathVariable Long workoutId) {
        return userService.getExercises(id, workoutId);
    }

    @GetMapping("/private/users/{id}/workouts/{workoutId}/exercises/{exerciseId}")
    @PreAuthorize("hasAuthority('read:exercises')")
    public ResponseEntity<Exercise> getExercise(
            @PathVariable Long id,
            @PathVariable Long workoutId,
            @PathVariable Long exerciseId) {
        return userService.getExercise(id, exerciseId);
    }

    @PostMapping("/private/users/{id}/workouts")
    @PreAuthorize("hasAuthority('add/update:workouts')")
    public ResponseEntity<WorkoutResponse> addOrUpdateWorkout(
            @PathVariable Long id,
            @RequestBody Workout workout) {
        return userService.addOrUpdateWorkout(id, workout);
    }

    @PostMapping("/private/users/{id}/workouts/{workoutId}/exercises")
    @PreAuthorize("hasAuthority('create:exercises')")
    public ResponseEntity<ExerciseResponse> addOrUpdateExercise(
            @PathVariable Long id,
            @PathVariable Long workoutId,
            @RequestBody ExerciseWrapperDto exerciseDto) {
        return userService.addExercise(id, workoutId, exerciseDto);
    }

    @DeleteMapping("/private/users/{id}/workouts/{workoutId}/exercises/{exerciseId}")
    @PreAuthorize("hasAuthority('delete:exercises')")
    public ResponseEntity<ExerciseResponse> removeExercise(
            @PathVariable Long id,
            @PathVariable Long workoutId,
            @PathVariable Long exerciseId) {
        return userService.removeExercise(id, workoutId, exerciseId);
    }

    @DeleteMapping("/private/users/{id}/workouts/{workoutId}")
    @PreAuthorize("hasAuthority('delete:workouts')")
    public ResponseEntity<WorkoutResponse> deleteWorkout(
            @PathVariable Long id,
            @PathVariable Long workoutId) {
        return userService.deleteWorkout(id, workoutId);
    }




}
