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
import com.calebcodes.fitness.exception.*;
import com.calebcodes.fitness.response.ExerciseResponse;
import com.calebcodes.fitness.response.UserResponse;
import com.calebcodes.fitness.response.WorkoutResponse;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
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
            throw new UserExistsException("User with id: " + user.getId() + "already exists");
        }
        User userToReturn = this.userRepository.save(user);
        return new ResponseEntity<>(UserMapper.toUserResponse(userToReturn, 201,
                "User with id: " + userToReturn.getId() + "successfully created"), HttpStatus.CREATED);
    }

    @Override
    public ResponseEntity<String> updateUserAvatar(Long id, MultipartFile file) {
        User user = this.getUserByIdOrThrow(id);

        System.out.println(file);

//        User userToReturn = this.userRepository.save(user);
//        return new ResponseEntity<UserResponse>(UserMapper.toUserResponse(userToReturn, 201,
//                "User with id: " + userToReturn.getId() + " avatar upload success"), HttpStatus.CREATED);
        return ResponseEntity.ok("File uploaded successfully");
    }

    @Override
    public ResponseEntity<UserResponse> deleteUser(Long id) {
        User user = this.getUserByIdOrThrow(id);
        this.userRepository.deleteById(id);
        return new ResponseEntity<UserResponse>(UserMapper.toUserResponse(user, 200,
                "Successfully deleted user with id:" + user.getId()), HttpStatus.OK);
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
        User user = this.getUserByIdOrThrow(id);
        user.getWorkouts().size();
        Exercise exercise = user.getWorkouts().stream()
                .flatMap(w -> w.getExercises().stream())
                .filter(e -> e.getId().equals(exerciseId))
                .findFirst()
                .orElseThrow(() -> new ExerciseNotFoundException ("Exercise with id: " + exerciseId + "not found"));
        return new ResponseEntity<>(exercise, HttpStatus.OK);
    }

    @Override
    public ResponseEntity<WorkoutResponse> addOrUpdateWorkout(Long id, Workout workout) {
        User user = this.getUserByIdOrThrow(id);
        user.getWorkouts().size();
        if (workout.getId() == null) {
            if (!user.getWorkouts().contains(workout)) {
                user.addWorkout(workout);
                this.userRepository.save(user);
            }
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

        Exercise existingExercise = this.getExerciseFromWorkoutById(workout, exercise.getId());

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
        if (exercise == null) {
            throw new ExerciseNotFoundException("Exercise with id: " + exerciseId + " not found");
        }
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
//        this.workoutRepository.deleteById(workoutId);
        return new ResponseEntity<>(new WorkoutResponse(workout.getId(), workout.getName(), workout.getDescription(),
                "Workout deleted successfully", HttpStatus.OK.value()), HttpStatus.OK);
    }

    private User getUserByIdOrThrow(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User not found with id:" + id ));
    }

    private User getUserByEmailOrThrow(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User with email: " + email + " not found"));
    }

    private Workout getWorkoutByIdOrThrow(User user, Long workoutId) {
        return user.getWorkouts().stream()
                .filter(w -> w.getId().equals(workoutId))
                .findFirst()
                .orElseThrow(() -> new WorkoutNotFoundException("Workout with id: " + workoutId + " not found"));
    }

    private Exercise getExerciseByIdOrThrow(Workout workout, Long exerciseId) {
        return workout.getExercises().stream()
                .filter(e -> e.getId().equals(exerciseId))
                .findFirst()
                .orElseThrow(() -> new ExerciseNotFoundException("Exercise with id: " + exerciseId + "not found"));
    }

    private WorkingSet getWorkingSetByIdOrThrow(int workingSetId) {
        return workingSetRepository.findById(workingSetId)
                .orElseThrow(() -> new WorkingSetNotFoundException("Working set with id: " + workingSetId + " not found"));

    }

    private Exercise getExerciseFromWorkoutByName(Workout workout, String exerciseName) {
        return workout.getExercises().stream()
                .filter(e -> e.getName().equals(exerciseName))
                .findFirst()
                .orElse(null);
    }

    private Exercise getExerciseFromWorkoutById(Workout workout, Long exerciseId) {
        return workout.getExercises().stream()
                .filter(e -> e.getId().equals(exerciseId))
                .findFirst()
                .orElse(null);
    }





}
