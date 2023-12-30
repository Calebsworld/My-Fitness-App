package com.calebcodes.fitness.service;

import com.calebcodes.fitness.dto.*;
import com.calebcodes.fitness.entity.Exercise;
import com.calebcodes.fitness.entity.User;
import com.calebcodes.fitness.entity.Workout;
import com.calebcodes.fitness.response.ExerciseResponse;
import com.calebcodes.fitness.response.FileUploadResponse;
import com.calebcodes.fitness.response.UserResponse;
import com.calebcodes.fitness.response.WorkoutResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Set;

@Service
public interface UserService {

    public ResponseEntity<UserResponse> getUserByEmail(String email);
    public ResponseEntity<User> getUserById(Long id);
    public ResponseEntity<UserResponse> addUser(UserDto userDto);

    ResponseEntity<FileUploadResponse> updateUserAvatar(Long id, MultipartFile file) throws IOException;
    public ResponseEntity<UserResponse> deleteUser(Long id);
    public WorkoutWrapperDto getUserWorkouts(Long id, int page, int size);
    public ResponseEntity<Workout> getWorkout(Long id, Long workoutId);
    public ResponseEntity<Set<Exercise>> getExercises(Long id, Long workoutId);
    public ResponseEntity<Exercise> getExercise(Long id, Long exerciseId);
    public ResponseEntity<WorkoutResponse> addOrUpdateWorkout(Long id, Workout workout);
    public ResponseEntity<ExerciseResponse> addExercise(Long id, Long workoutId, ExerciseWrapperDto exerciseDto);
    public ResponseEntity<ExerciseResponse> removeExercise(Long id, Long workoutId, Long exerciseId);
    public ResponseEntity<WorkoutResponse> deleteWorkout(Long id, Long workoutId);

}
