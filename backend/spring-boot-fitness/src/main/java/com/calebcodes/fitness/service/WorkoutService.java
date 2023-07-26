package com.calebcodes.fitness.service;

import com.calebcodes.fitness.entity.Exercise;
import com.calebcodes.fitness.entity.Workout;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
public interface WorkoutService {

    public ResponseEntity<Set<Workout>> getWorkouts();
    public ResponseEntity<Set<Exercise>> getExercises(Long id);

    public ResponseEntity<String> addOrUpdateWorkout(Workout workout);
    public ResponseEntity<String> addExercise(Long id, Exercise exerciseId);
    public ResponseEntity<String> removeExercise(Long workoutId, Long exerciseId);
    public ResponseEntity<String> deleteWorkout(Long id);



}
