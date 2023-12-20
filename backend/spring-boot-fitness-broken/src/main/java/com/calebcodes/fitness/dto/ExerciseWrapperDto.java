package com.calebcodes.fitness.dto;

import com.calebcodes.fitness.entity.Exercise;
import com.calebcodes.fitness.entity.WorkingSet;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;
import java.util.stream.Collectors;

@Data
@AllArgsConstructor
public class ExerciseWrapperDto {
    private ExerciseDto exerciseDto;
    private List<WorkingSetDto> workingSetDtos;
    private List<Integer> workingSetIds;




}
