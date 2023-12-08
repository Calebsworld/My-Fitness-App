package com.calebcodes.fitness.service;

import com.calebcodes.fitness.converter.ExerciseMapper;
import com.calebcodes.fitness.converter.UserMapper;
import com.calebcodes.fitness.dao.UserRepository;
import com.calebcodes.fitness.dao.WorkingSetRepository;
import com.calebcodes.fitness.dao.WorkoutRepository;
import com.calebcodes.fitness.dto.*;
import com.calebcodes.fitness.entity.Exercise;
import com.calebcodes.fitness.entity.User;
import com.calebcodes.fitness.entity.WorkingSet;
import com.calebcodes.fitness.entity.Workout;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Transactional
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final WorkoutRepository workoutRepository;
    private final WorkingSetRepository workingSetRepository;
    private final EntityManager entityManager;

    @Autowired
    public UserServiceImpl(UserRepository userRepository, WorkoutRepository workoutRepository, WorkingSetRepository workingSetRepository, EntityManager entityManager) {
        this.userRepository = userRepository;
        this.workoutRepository = workoutRepository;
        this.workingSetRepository = workingSetRepository;
        this.entityManager = entityManager;
    }

    @Override
    public ResponseEntity<UserResponse> getUserByEmail(String email) {
        Optional<User> user = this.userRepository.findByEmail(email);
        if (user.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return new ResponseEntity<>(UserMapper.toUserResponse(user.get(), 200,
                "User with email: " + email + " successfully retrieved"), HttpStatus.OK);
    }

    @Override
    public ResponseEntity<User> getUserById(Long id) {
        User user = this.getUserByIdOrThrow(id);
        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    @Override
    public ResponseEntity<UserResponse> addUser(UserDto userDto) {
        User user = UserMapper.toUser(userDto);
        System.out.println(user);
        if (user.getId() != null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User already exists");
        }
        User userToReturn = this.userRepository.save(user);
        return new ResponseEntity<>(UserMapper.toUserResponse(userToReturn, 201,
                "User with id: " + userToReturn.getId() + "successfully created"), HttpStatus.CREATED);
    }

    @Override
    public ResponseEntity<UserResponse> updateUser(UserDto userDto) {
        User user = UserMapper.toUser(userDto);
        if (user.getId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User does not exist");
        }
        User userToReturn = this.userRepository.save(user);
        return new ResponseEntity<UserResponse>(UserMapper.toUserResponse(userToReturn, 201,
                "User with id: " + userToReturn.getId() + "successfully updated"), HttpStatus.CREATED);
    }

    @Override
    public ResponseEntity<UserResponse> deleteUser(Long id) {
        Optional<User> user = this.userRepository.findById(id);
        if (user.isEmpty()) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
        this.userRepository.deleteById(id);
        return new ResponseEntity<UserResponse>(UserMapper.toUserResponse(user.get(), 200,
                "Successfully deleted user with id:" + user.get().getId()), HttpStatus.OK);
    }

    @Override
    public WorkoutWrapperDto getUserWorkouts(Long id, int page, int size) {
        User user = this.getUserByIdOrThrow(id);
        Page<Workout> requestPage = this.workoutRepository.findWorkoutsByUserId(id, PageRequest.of(page, size));
        List<Workout> workouts = requestPage.getContent().stream().collect(Collectors.toList());
        PageDto pageDto = new PageDto(page, size, requestPage.getTotalPages(), requestPage.getTotalElements());
        WorkoutWrapperDto workoutWrapperDto = new WorkoutWrapperDto(workouts, pageDto);
        return workoutWrapperDto;
    }

    @Override
    public ResponseEntity<Workout> getWorkout(Long id, Long workoutId) {
        User user = this.getUserByIdOrThrow(id);
        Workout workout = this.getWorkoutByIdOrThrow(user, workoutId);
        return new ResponseEntity<>(workout, HttpStatus.OK);
    }

    @Override
    public ResponseEntity<Set<Exercise>> getExercises(Long id, Long workoutId) {
        User user = this.getUserByIdOrThrow(id);
        Workout workout = this.getWorkoutByIdOrThrow(user, workoutId);
        return new ResponseEntity<>(workout.getExercises(), HttpStatus.OK);
    }

    @Override
    public ResponseEntity<Exercise> getExercise(Long id, Long exerciseId) {
        return null;
    }

    @Override
    public ResponseEntity<WorkoutResponse> addOrUpdateWorkout(Long id, Workout workout) {
        User user = this.getUserByIdOrThrow(id);
        if (workout.getId() == null) {
            user.addWorkout(workout);
            this.userRepository.save(user);
            this.entityManager.refresh(user);
            Long workoutId = user.getWorkouts().stream()
                    .filter(w -> w.getName().equals(workout.getName()))
                    .findFirst()
                    .get()
                    .getId();
            return new ResponseEntity<>(new WorkoutResponse(workoutId, workout.getName(), workout.getDescription(),
                    "Workout added successfully", HttpStatus.CREATED.value()), HttpStatus.CREATED);
        }

        Workout foundWorkout = this.getWorkoutByIdOrThrow(user, workout.getId());
        if (foundWorkout.getName().equals(workout.getName())) {
            return new ResponseEntity<>(new WorkoutResponse(workout.getId(), workout.getName(), workout.getDescription(),
                    "Workout already exists", HttpStatus.BAD_REQUEST.value()), HttpStatus.BAD_REQUEST);
        }
        foundWorkout.setExercises(workout.getExercises());
        foundWorkout.setName(workout.getName());
        foundWorkout.setDescription(workout.getDescription());
        this.userRepository.save(user);
        return new ResponseEntity<>(new WorkoutResponse(foundWorkout.getId(), foundWorkout.getName(),
                foundWorkout.getDescription(), "Workout updated successfully", HttpStatus.CREATED.value()), HttpStatus.CREATED);
    }

    @Override
    public ResponseEntity<ExerciseResponse> addExercise(Long id, Long workoutId, ExerciseWrapperDto exerciseWrapperDto) {
        User user = this.getUserByIdOrThrow(id);
        Workout workout = this.getWorkoutByIdOrThrow(user, workoutId);

        ExerciseDto exerciseDto = exerciseWrapperDto.getExerciseDto();
        Exercise exercise = ExerciseMapper.fromExerciseDto(exerciseDto);
        List<WorkingSetDto> workingSetDto = exerciseWrapperDto.getWorkingSetDtos();
        List<WorkingSet> workingSets = ExerciseMapper.fromWorkingSetDtoList(workingSetDto);
        List<Integer> workingSetIds = exerciseWrapperDto.getWorkingSetIds();

        Exercise existingExercise = this.getExerciseFromWorkoutByName(workout, exercise.getName());

        if (existingExercise != null) {
            // Handle removals first
            if (workingSetIds != null) {
                for (Integer workingSetId : workingSetIds) {
                    WorkingSet workingSet = this.getWorkingSetByIdOrThrow(workingSetId);
                    existingExercise.removeWorkingSet(workingSet);
                    workingSetRepository.delete(workingSet);
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
            userRepository.save(user);
            Exercise exerciseToReturn = this.getExerciseFromWorkoutByName(workout, exercise.getName());
            return new ResponseEntity<>(new ExerciseResponse("Exercise updated successfully", exerciseToReturn, HttpStatus.OK.value()), HttpStatus.OK);
        } else {
            if (workingSets != null) {
                for (WorkingSet workingSet : workingSets) {
                    exercise.addWorkingSet(workingSet);
                }
            }
            workout.addExercise(exercise);
            userRepository.save(user);
            Exercise exerciseToReturn = this.getExerciseFromWorkoutByName(workout, exercise.getName());
            return new ResponseEntity<>(new ExerciseResponse("Exercise added successfully", exerciseToReturn, HttpStatus.CREATED.value()), HttpStatus.CREATED);
        }
    }

    @Override
    public ResponseEntity<ExerciseResponse> removeExercise(Long id, Long workoutId, Long exerciseId) {
        User user = this.getUserByIdOrThrow(id);
        Workout workout = this.getWorkoutByIdOrThrow(user, workoutId);
        Exercise exercise = this.getExerciseFromWorkoutById(workout, exerciseId);
        workout.removeExercise(exercise);
        userRepository.save(user);
        return new ResponseEntity<>(new ExerciseResponse("Exercise removed successfully", exercise, HttpStatus.OK.value()), HttpStatus.OK);
    }

    @Override
    public ResponseEntity<WorkoutResponse> deleteWorkout(Long id, Long workoutId) {
        User user = this.getUserByIdOrThrow(id);
        Workout workout = this.getWorkoutByIdOrThrow(user, workoutId);
        user.removeWorkout(workout);
        this.userRepository.save(user);
        return new ResponseEntity<>(new WorkoutResponse(workout.getId(), workout.getName(), workout.getDescription(),
                "Workout deleted successfully", HttpStatus.OK.value()), HttpStatus.OK);
    }

    private User getUserByIdOrThrow(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }

    private User getUserByEmailOrThrow(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }

    private Workout getWorkoutByIdOrThrow(User user, Long workoutId) {
        return user.getWorkouts().stream()
                .filter(w -> w.getId().equals(workoutId))
                .findFirst()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Workout not found"));
    }

    private Exercise getExerciseByIdOrThrow(Workout workout, Long exerciseId) {
        return workout.getExercises().stream()
                .filter(e -> e.getId().equals(exerciseId))
                .findFirst()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Exercise not found"));
    }

    private WorkingSet getWorkingSetByIdOrThrow(int workingSetId) {
        return workingSetRepository.findById(workingSetId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "WorkingSet not found"));
    }

    private Exercise getExerciseFromWorkoutByName(Workout workout, String exerciseName) {
        return workout.getExercises().stream()
                .filter(e -> e.getName().equals(exerciseName))
                .findFirst()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Exercise not found"));
    }

    private Exercise getExerciseFromWorkoutById(Workout workout, Long exerciseId) {
        return workout.getExercises().stream()
                .filter(e -> e.getId().equals(exerciseId))
                .findFirst()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Exercise not found"));
    }





}
