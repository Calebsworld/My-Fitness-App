package com.calebcodes.fitness.converter;

import com.calebcodes.fitness.dto.PageDto;
import com.calebcodes.fitness.dto.WorkoutWrapperDto;
import com.calebcodes.fitness.entity.Workout;

import java.util.List;
import java.util.Set;

public class WorkoutMapper {

    public static WorkoutWrapperDto toWorkoutWrapperDto(List<Workout> workouts, PageDto pageDto) {
        return new WorkoutWrapperDto(workouts, pageDto);
    }


}
