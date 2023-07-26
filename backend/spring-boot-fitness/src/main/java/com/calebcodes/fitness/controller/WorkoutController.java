package com.calebcodes.fitness.controller;

import com.calebcodes.fitness.entity.Exercise;
import com.calebcodes.fitness.entity.Workout;
import com.calebcodes.fitness.service.WorkoutService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.Set;

@RestController
@CrossOrigin("http://localhost:4200")
@RequestMapping("/api/workouts")

public class WorkoutController {

    private final WorkoutService workoutService;

    @Autowired
    public WorkoutController(WorkoutService workoutService) {
        this.workoutService = workoutService;
    }

    @GetMapping("/")
    public ResponseEntity<Set<Workout>> getWorkouts() {
        return this.workoutService.getWorkouts();
    }

    @GetMapping("/{id}/exercises")
    public ResponseEntity<Set<Exercise>> getExercises(@PathVariable Long id) {
        return this.workoutService.getExercises(id);
    }

    @PostMapping("/")
    public ResponseEntity<String> addOrUpdateWorkout(@RequestBody Workout workout) {
        return this.workoutService.addOrUpdateWorkout(workout);
    }

    @PostMapping("/{id}/exercises")
    public ResponseEntity<String> addExercise(@PathVariable Long id, @RequestBody Exercise exercise) {
        return this.workoutService.addExercise(id, exercise);
    }

    @DeleteMapping("/{workoutId}/exercises/{exerciseId}")
    public ResponseEntity<String> removeExercise(@PathVariable Long workoutId, @PathVariable Long exerciseId) {
        return workoutService.removeExercise(workoutId, exerciseId);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteWorkout(@PathVariable Long id) {
        return this.workoutService.deleteWorkout(id);
    }


}
