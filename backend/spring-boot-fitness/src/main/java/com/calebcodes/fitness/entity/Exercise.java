package com.calebcodes.fitness.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

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

    @Column(name="target")
    private String target;

    @Column(name="bodyPart")
    private String bodyPart;

    @Column(name="equipment")
    private String equipment;

    @OneToMany(mappedBy = "exercise")
    private List<WorkingSet> workingSets;

    @ManyToOne
    @JoinColumn(name = "workout_id")
    private Workout workout;




}
