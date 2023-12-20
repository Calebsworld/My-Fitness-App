package com.calebcodes.fitness.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WorkoutResponse {

    private Long id;
    private String name;
    private String description;
    private String message;
    private int status;
}
