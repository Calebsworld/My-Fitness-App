package com.calebcodes.fitness.service;

import com.calebcodes.fitness.dao.ExerciseRepository;
import com.calebcodes.fitness.dao.WorkoutRepository;
import com.calebcodes.fitness.entity.Exercise;
import com.calebcodes.fitness.entity.Workout;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class WorkoutServiceImpl implements WorkoutService {

    private final WorkoutRepository workoutRepository;
    private final ExerciseRepository exerciseRepository;

    @Autowired
    public WorkoutServiceImpl(WorkoutRepository workoutRepository, ExerciseRepository exerciseRepository) {
        this.workoutRepository = workoutRepository;
        this.exerciseRepository = exerciseRepository;
    }

    @Override
    public ResponseEntity<Set<Workout>> getWorkouts() {
        Set<Workout> workouts = new HashSet<>(this.workoutRepository.findAll());
        return new ResponseEntity<>(workouts, HttpStatus.OK);
    }

    @Override
    public ResponseEntity<Set<Exercise>> getExercises(Long id) {
        Set<Exercise> exercises = this.workoutRepository.findById(id).map(workout -> {
            return workout.getExercises();
        }).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Workout not found"));
        return new ResponseEntity<>(exercises, HttpStatus.OK);
    }

    @Override
    public ResponseEntity<String> addOrUpdateWorkout(Workout workout) {
        Optional<Workout> foundWorkout = this.workoutRepository.findByName(workout.getName());

        if (foundWorkout.isPresent()) {
            Workout workoutToUpdate = foundWorkout.get();
            workoutToUpdate.setName(workout.getName());
            workoutToUpdate.setDescription(workout.getDescription());
            this.workoutRepository.save(workoutToUpdate);
            return new ResponseEntity<>("Workout updated successfully", HttpStatus.OK);
        } else {
            this.workoutRepository.save(workout);
            return new ResponseEntity<>("Workout added successfully", HttpStatus.CREATED);
        }
    }


    @Override
    public ResponseEntity<String> addExercise(Long workoutId, Exercise exercise) {
        return workoutRepository.findById(workoutId).map(workout -> {
            workout.addExercise(exercise);
            workoutRepository.save(workout);
            return new ResponseEntity<>("Exercise added successfully", HttpStatus.OK);
        }).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Workout not found"));
    }

    @Override
    public ResponseEntity<String> removeExercise(Long workoutId, Long exerciseId) {
        return workoutRepository.findById(workoutId).map(workout -> {
            Set<Exercise> exercises = workout.getExercises().stream()
                    .filter(exercise -> exercise.getId() != exerciseId)
                    .collect(Collectors.toSet());
            workout.setExercises(exercises);
            workoutRepository.save(workout);
            return new ResponseEntity<>("Exercise removed successfully", HttpStatus.OK);
        }).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Workout not found"));
    }

    @Override
    public ResponseEntity<String> deleteWorkout(Long id) {
        this.workoutRepository.deleteById(id);
        return new ResponseEntity<>("Workout deleted successfully", HttpStatus.OK);
    }
}
