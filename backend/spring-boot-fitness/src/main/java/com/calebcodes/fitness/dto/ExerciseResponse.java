package com.calebcodes.fitness.dto;

import com.calebcodes.fitness.entity.Exercise;
import com.calebcodes.fitness.entity.WorkingSet;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class ExerciseResponse {

    private String message;
    private Exercise exercise;
    private int status;

}
