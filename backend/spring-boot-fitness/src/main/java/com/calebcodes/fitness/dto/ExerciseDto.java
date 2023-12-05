package com.calebcodes.fitness.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;



@Data
@AllArgsConstructor
@NoArgsConstructor
public class ExerciseDto {

    private Long id;
    private String name;
    private String description;
    private String target;
    private String bodyPart;
    private String equipment;
    private String gifUrl;
}
