package com.calebcodes.fitness.controller;

import com.calebcodes.fitness.dto.*;
import com.calebcodes.fitness.entity.Exercise;
import com.calebcodes.fitness.entity.Workout;
import com.calebcodes.fitness.service.WorkoutService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Set;

@RestController
@CrossOrigin("http://localhost:4200")
@RequestMapping(value = "/api/workouts", produces = "application/json")

public class WorkoutController {

    private final WorkoutService workoutService;

    @Autowired
    public WorkoutController(WorkoutService workoutService) {
        this.workoutService = workoutService;
    }

    @GetMapping()
    public ResponseEntity<WorkoutWrapperDto> getWorkouts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
            WorkoutWrapperDto workoutWrapperDto = workoutService.getWorkouts(page, size);
        return new ResponseEntity<>(workoutWrapperDto, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Workout> getWorkout(@PathVariable Long id) { return this.workoutService.getWorkout(id); }

    @GetMapping("/{id}/exercises")
    public ResponseEntity<Set<Exercise>> getExercises(@PathVariable Long id) {
        return this.workoutService.getExercises(id);
    }

    @GetMapping("/{id}/exercises/{exerciseId}")
    public ResponseEntity<Exercise> getExercise(@PathVariable Long id, @PathVariable Long exerciseId) {
        return this.workoutService.getExercise(id, exerciseId);
    }

    @GetMapping("/{id}/exercises/{exerciseId}/workingSets")
    public ResponseEntity<Exercise> getWorkingSets(@PathVariable Long id, @PathVariable Long exerciseId) {
        return this.workoutService.getExercise(id, exerciseId);
    }

    @PostMapping()
    @ResponseBody
    public ResponseEntity<WorkoutResponse> addOrUpdateWorkout(@RequestBody Workout workout) {
        return this.workoutService.addOrUpdateWorkout(workout);
    }

    @PostMapping("/{id}/exercises")
    public ResponseEntity<ExerciseResponse> addExercise(@PathVariable Long id, @RequestBody ExerciseWrapperDto exerciseWrapperDto) {
        return this.workoutService.addExercise(id, exerciseWrapperDto);
    }

    @DeleteMapping("/{workoutId}/exercises/{exerciseId}")
    public ResponseEntity<ExerciseResponse> removeExercise(@PathVariable Long workoutId, @PathVariable Long exerciseId) {
        return workoutService.removeExercise(workoutId, exerciseId);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<WorkoutResponse> deleteWorkout(@PathVariable Long id) {
        return this.workoutService.deleteWorkout(id);
    }


}
