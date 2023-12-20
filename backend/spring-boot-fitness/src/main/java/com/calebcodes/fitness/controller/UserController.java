package com.calebcodes.fitness.controller;

import com.calebcodes.fitness.dto.*;
import com.calebcodes.fitness.entity.Exercise;
import com.calebcodes.fitness.entity.User;
import com.calebcodes.fitness.entity.Workout;
import com.calebcodes.fitness.response.ExerciseResponse;
import com.calebcodes.fitness.response.UserResponse;
import com.calebcodes.fitness.response.WorkoutResponse;
import com.calebcodes.fitness.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Set;

@RestController
@CrossOrigin("http://localhost:4200")
@RequestMapping(value = "/api", produces = "application/json")
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/public/users/user/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return this.userService.getUserById(id);
    }

    @GetMapping("/public/{email}")
    public ResponseEntity<UserResponse> getUserByEmail(@PathVariable String email) {
        return this.userService.getUserByEmail(email);
    }

    @PostMapping("/public/users")
    public ResponseEntity<UserResponse> addUser(@RequestBody UserDto userDto) {
        return userService.addUser(userDto);
    }

    @PostMapping("/private/users/{id}/avatar")
//    @PreAuthorize("hasAuthority('upload:avatar')")
    public ResponseEntity<String> UpdateUserAvatar(@PathVariable Long id,
                                                         @RequestParam("file") MultipartFile file) throws IOException {
        try {
            return userService.updateUserAvatar(id, file);
        } catch (IOException e) {
            throw new IOException("Could not upload file: " + file.getOriginalFilename());
        }
    }

    @DeleteMapping("/private/users/{id}")
//    @PreAuthorize("hasAuthority('delete:user')")
    public ResponseEntity<UserResponse> deleteUser(@PathVariable Long id) {
        return this.userService.deleteUser(id);
    }

    @GetMapping("/private/users/{id}/workouts")
    public WorkoutWrapperDto getUserWorkouts(
            @PathVariable Long id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return userService.getUserWorkouts(id, page, size);
    }

    @GetMapping("/private/users/{id}/workouts/{workoutId}")
    public ResponseEntity<Workout> getWorkout(
            @PathVariable Long id,
            @PathVariable Long workoutId) {
        return userService.getWorkout(id, workoutId);
    }

    @GetMapping("/private/users/{id}/workouts/{workoutId}/exercises")
    public ResponseEntity<Set<Exercise>> getExercises(
            @PathVariable Long id,
            @PathVariable Long workoutId) {
        return userService.getExercises(id, workoutId);
    }

    @GetMapping("/private/users/{id}/workouts/{workoutId}/exercises/{exerciseId}")
    public ResponseEntity<Exercise> getExercise(
            @PathVariable Long id,
            @PathVariable Long workoutId,
            @PathVariable Long exerciseId) {
        return userService.getExercise(id, exerciseId);
    }

    @PostMapping("/private/users/{id}/workouts")
    public ResponseEntity<WorkoutResponse> addOrUpdateWorkout(
            @PathVariable Long id,
            @RequestBody Workout workout) {
        return userService.addOrUpdateWorkout(id, workout);
    }

    @PostMapping("/private/users/{id}/workouts/{workoutId}/exercises")
    public ResponseEntity<ExerciseResponse> addExercise(
            @PathVariable Long id,
            @PathVariable Long workoutId,
            @RequestBody ExerciseWrapperDto exerciseDto) {
        return userService.addExercise(id, workoutId, exerciseDto);
    }

    @DeleteMapping("/private/users/{id}/workouts/{workoutId}/exercises/{exerciseId}")
    public ResponseEntity<ExerciseResponse> removeExercise(
            @PathVariable Long id,
            @PathVariable Long workoutId,
            @PathVariable Long exerciseId) {
        return userService.removeExercise(id, workoutId, exerciseId);
    }

    @DeleteMapping("/private/users/{id}/workouts/{workoutId}")
    public ResponseEntity<WorkoutResponse> deleteWorkout(
            @PathVariable Long id,
            @PathVariable Long workoutId) {
        return userService.deleteWorkout(id, workoutId);
    }


}
