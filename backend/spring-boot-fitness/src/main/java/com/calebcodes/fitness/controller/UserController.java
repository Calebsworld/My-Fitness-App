package com.calebcodes.fitness.controller;

import com.calebcodes.fitness.dto.*;
import com.calebcodes.fitness.entity.Exercise;
import com.calebcodes.fitness.entity.User;
import com.calebcodes.fitness.entity.Workout;
import com.calebcodes.fitness.service.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Optional;
import java.util.Set;

@RestController
@CrossOrigin("http://localhost:4200")
@RequestMapping(value = "/api/users", produces = "application/json")
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("user/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return this.userService.getUserById(id);
    }

    @GetMapping("/{email}")
    public ResponseEntity<UserResponse> getUserByEmail(@PathVariable String email) {
        return this.userService.getUserByEmail(email);
    }

    @PostMapping()
    public ResponseEntity<UserResponse> addUser(@RequestBody UserDto userDto) {
        return userService.addUser(userDto);
    }

    // Porbably going to take a File object as a parameter
    @PutMapping()
    public ResponseEntity<UserResponse> UpdateUser(@RequestBody UserDto userDto) {
        return this.userService.updateUser(userDto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<UserResponse> deleteUser(@PathVariable Long id) {
        return this.userService.deleteUser(id);
    }

    @GetMapping("/{id}/workouts")
    public WorkoutWrapperDto getUserWorkouts(
            @PathVariable Long id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return userService.getUserWorkouts(id, page, size);
    }

    @GetMapping("/{id}/workouts/{workoutId}")
    public ResponseEntity<Workout> getWorkout(
            @PathVariable Long id,
            @PathVariable Long workoutId) {
        return userService.getWorkout(id, workoutId);
    }

    @GetMapping("/{id}/workouts/{workoutId}/exercises")
    public ResponseEntity<Set<Exercise>> getExercises(
            @PathVariable Long id,
            @PathVariable Long workoutId) {
        return userService.getExercises(id, workoutId);
    }

    @GetMapping("/{id}/workouts/{workoutId}/exercises/{exerciseId}")
    public ResponseEntity<Exercise> getExercise(
            @PathVariable Long id,
            @PathVariable Long workoutId,
            @PathVariable Long exerciseId) {
        return userService.getExercise(id, exerciseId);
    }

    @PostMapping("/{id}/workouts")
    public ResponseEntity<WorkoutResponse> addOrUpdateWorkout(
            @PathVariable Long id,
            @RequestBody Workout workout) {
        return userService.addOrUpdateWorkout(id, workout);
    }

    @PostMapping("/{id}/workouts/{workoutId}/exercises")
    public ResponseEntity<ExerciseResponse> addExercise(
            @PathVariable Long id,
            @PathVariable Long workoutId,
            @RequestBody ExerciseWrapperDto exerciseDto) {
        return userService.addExercise(id, workoutId, exerciseDto);
    }

    @DeleteMapping("/{id}/workouts/{workoutId}/exercises/{exerciseId}")
    public ResponseEntity<ExerciseResponse> removeExercise(
            @PathVariable Long id,
            @PathVariable Long workoutId,
            @PathVariable Long exerciseId) {
        return userService.removeExercise(id, workoutId, exerciseId);
    }

    @DeleteMapping("/{id}/workouts/{workoutId}")
    public ResponseEntity<WorkoutResponse> deleteWorkout(
            @PathVariable Long id,
            @PathVariable Long workoutId) {
        return userService.deleteWorkout(id, workoutId);
    }


}
