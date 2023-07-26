package com.calebcodes.fitness.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.Set;

@Entity
@Table(name = "workout")
@Data
public class Workout {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name="name", nullable = false)
    private String name;

    @Column(name="description")
    private String description;

    @OneToMany(mappedBy = "workout",
               cascade = CascadeType.ALL,
               fetch = FetchType.LAZY)
    private Set<Exercise> exercises;

    public Workout() {
        exercises = Set.of();
    }

    // bi-directional relationship
    public void addExercise(Exercise exercise) {
        this.exercises.add(exercise);
        exercise.setWorkout(this);
    }














}
