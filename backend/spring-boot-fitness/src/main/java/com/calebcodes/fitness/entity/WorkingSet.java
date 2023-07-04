package com.calebcodes.fitness.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "working_set")
public class WorkingSet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;

    @Column(name = "reps")
    private int reps;

    @Column(name = "weight")
    private int weight;

    @ManyToOne()
    @JoinColumn(name = "exercise_id")
    private Exercise exercise;

}
