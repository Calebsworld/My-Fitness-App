package com.calebcodes.fitness.service;

import com.calebcodes.fitness.converter.ExerciseMapper;
import com.calebcodes.fitness.dao.ExerciseRepository;
import com.calebcodes.fitness.dao.UserRepository;
import com.calebcodes.fitness.dao.WorkingSetRepository;
import com.calebcodes.fitness.dao.WorkoutRepository;
import com.calebcodes.fitness.dto.*;
import com.calebcodes.fitness.entity.Exercise;
import com.calebcodes.fitness.entity.WorkingSet;
import com.calebcodes.fitness.entity.Workout;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class WorkoutServiceImpl implements WorkoutService {


    private final WorkoutRepository workoutRepository;
    private final ExerciseRepository exerciseRepository;
    private final WorkingSetRepository workingSetRepository;

    @Autowired
    public WorkoutServiceImpl(WorkoutRepository workoutRepository, ExerciseRepository exerciseRepository,
                              WorkingSetRepository workingSetRepository) {
        this.workoutRepository = workoutRepository;
        this.exerciseRepository = exerciseRepository;
        this.workingSetRepository = workingSetRepository;
    }

    @Override
    public WorkoutWrapperDto getWorkouts(int page, int size) {

        Page<Workout> requestPage = this.workoutRepository.findAll(PageRequest.of(page, size));
        List<Workout> workouts = requestPage.getContent().stream().collect(Collectors.toList());
        PageDto pageDto = new PageDto(page, size, requestPage.getTotalPages(), requestPage.getTotalElements());
        WorkoutWrapperDto workoutWrapperDto = new WorkoutWrapperDto(workouts, pageDto);
        return workoutWrapperDto;
    }

    // if we added a user, we would have to retrieve the user by id, then retrieve the workout that belongs to the user
    @Override
    public ResponseEntity<Workout> getWorkout(Long id) {
        Optional<Workout> foundWorkout = this.workoutRepository.findById(id);
        if (foundWorkout.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Workout not found");
        }
        return new ResponseEntity<>(foundWorkout.get(), HttpStatus.OK);
    }


    @Override
    public ResponseEntity<Set<Exercise>> getExercises(Long id) {
        Set<Exercise> exercises = this.workoutRepository.findById(id).map(workout -> {
            return workout.getExercises();
        }).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Workout not found"));
        return new ResponseEntity<>(exercises, HttpStatus.OK);
    }

    @Override
    public ResponseEntity<Exercise> getExercise(Long id, Long exerciseId) {
        this.workoutRepository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Workout not found"));
        Optional<Exercise> foundExercise = this.exerciseRepository.findById(exerciseId);
        if (foundExercise.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Exercise not found");
        }
        return new ResponseEntity<>(foundExercise.get(), HttpStatus.OK);
    }


    @Override
    public ResponseEntity<WorkoutResponse> addOrUpdateWorkout(Workout workout) {

        if (workout.getId() == null) {
            this.workoutRepository.save(workout);
            return new ResponseEntity<>(new WorkoutResponse(workout.getId(), workout.getName(), workout.getDescription(),
                    "Workout added successfully", HttpStatus.CREATED.value()), HttpStatus.CREATED);
        }

        Optional<Workout> w = this.workoutRepository.findById(workout.getId());
        if (w.isPresent() && w.get().getName().equals(workout.getName())) {
            return new ResponseEntity<>(new WorkoutResponse(workout.getId(), workout.getName(), workout.getDescription(),
                    "Workout already exists", HttpStatus.BAD_REQUEST.value()), HttpStatus.BAD_REQUEST);
        } else {
            workout.setExercises(w.get().getExercises());
            Workout workoutToUpdate = w.get();
            workoutToUpdate.setName(workout.getName());
            workoutToUpdate.setDescription(workout.getDescription());
            this.workoutRepository.save(workoutToUpdate);
            return new ResponseEntity<>(new WorkoutResponse(workoutToUpdate.getId(), workoutToUpdate.getName(), workoutToUpdate.getDescription(),
                    "Workout updated successfully", HttpStatus.OK.value()), HttpStatus.OK);
        }
    }

    @Override
    public ResponseEntity<ExerciseResponse> addExercise(Long workoutId, ExerciseWrapperDto exerciseWrapperDto) {
        Workout foundWorkout = workoutRepository.findById(workoutId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Workout not found"));

        ExerciseDto exerciseDto = exerciseWrapperDto.getExerciseDto();
        Exercise exercise = ExerciseMapper.fromExerciseDto(exerciseDto);
        List<WorkingSetDto> workingSetDto = exerciseWrapperDto.getWorkingSetDtos();
        List<WorkingSet> workingSets = ExerciseMapper.fromWorkingSetDtoList(workingSetDto);
        List<Integer> workingSetIds = exerciseWrapperDto.getWorkingSetIds();

        Exercise existingExercise = foundWorkout.getExercises().stream()
                .filter(e -> e.getName().equals(exercise.getName()))
                .findFirst()
                .orElse(null);

        if (existingExercise != null) {
            // Handle removals first
            if (workingSetIds != null) {
                for (Integer workingSetId : workingSetIds) {
                    WorkingSet foundWorkingSet = workingSetRepository.findById(workingSetId)
                            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "WorkingSet not found"));
                    existingExercise.removeWorkingSet(foundWorkingSet);
                    workingSetRepository.delete(foundWorkingSet);
                }
            }

            // Then handle additions
            if (workingSets != null) {
                for (WorkingSet workingSet : workingSets) {
                    // Ensuring the workingSet is a managed entity before adding to exercise
                    WorkingSet savedWorkingSet = workingSetRepository.save(workingSet);
                    existingExercise.addWorkingSet(savedWorkingSet);
                }
            }

            // Save the updated workout
            workoutRepository.save(foundWorkout);

            Exercise exerciseToReturn = foundWorkout.getExercises().stream()
                    .filter(e -> e.getName().equals(exercise.getName()))
                    .findFirst()
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Exercise not found"));
            return new ResponseEntity<>(new ExerciseResponse("Exercise updated successfully", exerciseToReturn, HttpStatus.OK.value()), HttpStatus.OK);
        } else {
            if (workingSets != null) {
                for (WorkingSet workingSet : workingSets) {
                    exercise.addWorkingSet(workingSet);
                }
            }

            foundWorkout.addExercise(exercise);
            workoutRepository.save(foundWorkout);
            Exercise exerciseToReturn = foundWorkout.getExercises().stream()
                    .filter(e -> e.getName().equals(exercise.getName()))
                    .findFirst()
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Exercise not found"));
            return new ResponseEntity<>(new ExerciseResponse("Exercise added successfully", exerciseToReturn, HttpStatus.CREATED.value()), HttpStatus.CREATED);
        }
    }

    @Override
    public ResponseEntity<ExerciseResponse> removeExercise(Long workoutId, Long exerciseId) {


        Workout foundWorkout = workoutRepository.findById(workoutId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Workout not found"));

        Exercise foundExercise = foundWorkout.getExercises().stream()
                .filter(exercise -> exercise.getId().equals(exerciseId))
                .findFirst()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Exercise not found"));

        foundWorkout.removeExercise(foundExercise);
        workoutRepository.save(foundWorkout);
        return new ResponseEntity<>(new ExerciseResponse("Exercise removed successfully", foundExercise, HttpStatus.OK.value()), HttpStatus.OK);
    }

    @Override
    public ResponseEntity<WorkoutResponse> deleteWorkout(Long id) {
        Optional<Workout> foundWorkout = this.workoutRepository.findById(id);
        if (foundWorkout.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Workout not found");
        }
        Workout workout = foundWorkout.get();
        this.workoutRepository.deleteById(id);
        return new ResponseEntity<>(new WorkoutResponse(workout.getId(), workout.getName(), workout.getDescription(),
                "Workout deleted successfully", HttpStatus.OK.value()), HttpStatus.OK);
    }

}
