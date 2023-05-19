package com.calebcodes.fitness.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "exercise")
@Data
public class Exercise {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name="name", nullable = false)
    private String name;

    @Column(name="exercise_id")
    private String exerciseId;

    @Column(name="description")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name="target")
    private TargetMuscle target;

    @Enumerated(EnumType.STRING)
    @Column(name="bodyPart")
    private BodyPart bodyPart;

    @Enumerated(EnumType.STRING)
    @Column(name="equipment")
    private Equipment equipment;

    @Column(name="sets")
    private int sets;

    @Column(name="reps")
    private int reps;

    @Column(name="weight")
    private int weight;

    @ManyToOne
    @JoinColumn(name = "workout_id")
    private Workout workout;




}
