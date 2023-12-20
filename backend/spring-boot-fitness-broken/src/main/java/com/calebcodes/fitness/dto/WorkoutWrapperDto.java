package com.calebcodes.fitness.dto;

import com.calebcodes.fitness.entity.Workout;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class WorkoutWrapperDto {

    private List<Workout> workouts;
    private PageDto page;

}
