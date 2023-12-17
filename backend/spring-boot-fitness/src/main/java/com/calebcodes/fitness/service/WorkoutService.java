package com.calebcodes.fitness.service;

import com.calebcodes.fitness.dto.*;
import com.calebcodes.fitness.entity.Exercise;
import com.calebcodes.fitness.entity.Workout;
import com.calebcodes.fitness.response.ExerciseResponse;
import com.calebcodes.fitness.response.WorkoutResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
public interface WorkoutService {
    public WorkoutWrapperDto getWorkouts(int page, int size);
    public ResponseEntity<Workout> getWorkout(Long id);
    public ResponseEntity<Set<Exercise>> getExercises(Long id);
    public ResponseEntity<Exercise> getExercise(Long id, Long exerciseId);
    public ResponseEntity<WorkoutResponse> addOrUpdateWorkout(Workout workout);
    public ResponseEntity<ExerciseResponse> addExercise(Long id, ExerciseWrapperDto exerciseDto);
    public ResponseEntity<ExerciseResponse> removeExercise(Long workoutId, Long exerciseId);
    public ResponseEntity<WorkoutResponse> deleteWorkout(Long id);



}
