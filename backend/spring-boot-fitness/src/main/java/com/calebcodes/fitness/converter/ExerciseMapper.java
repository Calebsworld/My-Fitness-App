package com.calebcodes.fitness.converter;

import com.calebcodes.fitness.dto.ExerciseDto;
import com.calebcodes.fitness.dto.ExerciseWrapperDto;
import com.calebcodes.fitness.dto.WorkingSetDto;
import com.calebcodes.fitness.entity.Exercise;
import com.calebcodes.fitness.entity.WorkingSet;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class ExerciseMapper {

    public static ExerciseDto toExerciseDto(Exercise exercise) {
        ExerciseDto dto = new ExerciseDto();
        dto.setId(exercise.getId());
        dto.setName(exercise.getName());
        dto.setDescription(exercise.getDescription());
        dto.setTarget(exercise.getTarget());
        dto.setBodyPart(exercise.getBodyPart());
        dto.setEquipment(exercise.getEquipment());
        dto.setGifUrl(exercise.getGifUrl());
        return dto;
    }

    public static Exercise fromExerciseDto(ExerciseDto dto) {
        Exercise exercise = new Exercise();
        exercise.setId(dto.getId());
        exercise.setName(dto.getName());
        exercise.setDescription(dto.getDescription());
        exercise.setTarget(dto.getTarget());
        exercise.setBodyPart(dto.getBodyPart());
        exercise.setEquipment(dto.getEquipment());
        exercise.setGifUrl(dto.getGifUrl());
        //... other fields...
        return exercise;
    }

    public static WorkingSetDto toWorkingSetDto(WorkingSet workingSet) {
        WorkingSetDto dto = new WorkingSetDto();
        dto.setId(workingSet.getId());
        dto.setReps(workingSet.getReps());
        dto.setWeight(workingSet.getWeight());
        return dto;
    }
    public static List<WorkingSet> fromWorkingSetDtoList(List<WorkingSetDto> dtoList) {
        List<WorkingSet> workingSets = new ArrayList<>();
        for (WorkingSetDto dto : dtoList) {
            WorkingSet workingSet = new WorkingSet();
            workingSet.setId(dto.getId());
            workingSet.setReps(dto.getReps());
            workingSet.setWeight(dto.getWeight());
            workingSets.add(workingSet);
        }
        return workingSets;
    }


    public static ExerciseWrapperDto toExerciseWrapperDto(Exercise exercise, List<WorkingSet> workingSets, List<Integer> workingSetIds) {
        ExerciseDto exerciseDto = toExerciseDto(exercise);
        List<WorkingSetDto> workingSetDtos = workingSets.stream().map(ExerciseMapper::toWorkingSetDto).collect(Collectors.toList());
        return new ExerciseWrapperDto(exerciseDto, workingSetDtos, workingSetIds);
    }


// Similarly, you can have a fromExerciseWrapperDto() if required.



}
