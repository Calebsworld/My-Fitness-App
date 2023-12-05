package com.calebcodes.fitness.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class WorkingSetDto {

    private Long id;
    private int reps;
    private int weight;
}
